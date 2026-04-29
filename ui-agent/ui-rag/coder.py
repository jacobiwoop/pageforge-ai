import os
import json
import uuid
import time
import threading
import requests

# ─── Configuration ───────────────────────────────────────────────────────────

OPENCODE_URL = os.environ.get("OPENCODE_URL", "http://localhost:4096")
TIMEOUT      = 600  # 10 minutes par prompt
SESSIONS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../sessions"))

# S'assurer que le dossier des sessions existe
os.makedirs(SESSIONS_DIR, exist_ok=True)

# ─── Helpers API ──────────────────────────────────────────────────────────────

def create_session(directory: str, title: str = "PageForge Project"):
    """Crée une session OpenCode isolée dans un dossier spécifique."""
    try:
        r = requests.post(
            f"{OPENCODE_URL}/session",
            params={"directory": directory},
            json={"title": title},
            timeout=10
        )
        r.raise_for_status()
        return r.json()["id"]
    except Exception as e:
        raise Exception(f"Impossible de créer la session OpenCode : {e}")

def get_session_status(session_id: str):
    """Vérifie le statut de la session globalement via l'API."""
    try:
        r = requests.get(
            f"{OPENCODE_URL}/session/status",
            timeout=5
        )
        if r.status_code == 200:
            data = r.json()
            # L'API renvoie un dict { session_id: { type: "idle"|"busy" } }
            # OU parfois une liste d'objets selon les versions
            if isinstance(data, dict):
                return data.get(session_id, {}).get("type")
            elif isinstance(data, list):
                for item in data:
                    if item.get("sessionID") == session_id:
                        return item.get("status", {}).get("type")
    except:
        pass
    return None

def sse_listener_thread(session_id: str, directory: str, stop_event: threading.Event):
    """Écoute les événements en background pour logger l'activité."""
    try:
        with requests.get(
            f"{OPENCODE_URL}/event",
            params={"directory": directory},
            stream=True,
            timeout=TIMEOUT + 10
        ) as resp:
            for line in resp.iter_lines():
                if stop_event.is_set(): break
                if not line: continue
                
                line = line.decode("utf-8") if isinstance(line, bytes) else line
                if not line.startswith("data: "): continue
                
                try:
                    event = json.loads(line[6:])
                    etype = event.get("type")
                    props = event.get("properties", {})
                    
                    if props.get("sessionID") and props.get("sessionID") != session_id:
                        continue
                        
                    if etype == "message.part.updated":
                        part = props.get("part", {})
                        if part.get("type") == "tool-invocation":
                            tool = part.get("toolInvocation", {})
                            print(f"   🔧 OpenCode: {tool.get('toolName')} ({tool.get('args', {}).get('path', '')})")
                    elif etype == "session.idle":
                        stop_event.set() # Signale la fin au thread principal
                except:
                    pass
    except:
        pass

def send_and_wait(session_id: str, directory: str, prompt: str, model: str = None):
    """Envoie un message et attend la fin (via polling + SSE)."""
    
    # 1. Préparer le payload
    payload = {"parts": [{"type": "text", "text": prompt}]}
    if model:
        if "/" in model:
            provider, model_id = model.split("/", 1)
            payload["model"] = {"providerID": provider, "modelID": model_id}
        else:
            payload["model"] = {"providerID": "ollama-cloud", "modelID": model}

    # 2. Lancer le listener SSE (feedback live + détection idle)
    stop_event = threading.Event()
    listener = threading.Thread(target=sse_listener_thread, args=(session_id, directory, stop_event), daemon=True)
    listener.start()
    
    print(f"   📤 Envoi du message à OpenCode (Modèle: {model})...")
    try:
        # 3. Envoyer le message
        r = requests.post(
            f"{OPENCODE_URL}/session/{session_id}/message",
            json=payload,
            timeout=TIMEOUT # On attend que l'IA finisse son travail
        )
        print(f"   📥 Réponse reçue (HTTP {r.status_code})")
        
        if r.status_code != 200:
            print(f"❌ Erreur API OpenCode ({r.status_code}): {r.text}")
            stop_event.set()
            return False
            
        # 4. Attendre que l'agent devienne 'idle'
        print("   ⏳ Attente de la fin de génération (idle)...")
        start_wait = time.time()
        while time.time() - start_wait < TIMEOUT:
            if stop_event.is_set():
                return True
                
            # Polling de secours toutes les 2 secondes
            status = get_session_status(session_id)
            if status == "idle":
                stop_event.set()
                return True
                
            time.sleep(2)
            
        print("❌ Timeout d'attente de la réponse OpenCode")
        stop_event.set()
        return False
        
    except Exception as e:
        stop_event.set()
        print(f"❌ Erreur : {e}")
        return False

# ─── Fonctions Publiques ─────────────────────────────────────────────────────

def generate_html(spec_path: str, product_query: str, model: str, content_data: dict = None, cwd: str = None) -> dict:
    """Génère un nouveau projet HTML via OpenCode."""
    
    project_id = str(uuid.uuid4())[:8]
    working_dir = os.path.join(SESSIONS_DIR, f"project_{project_id}")
    os.makedirs(working_dir, exist_ok=True)

    try:
        with open(spec_path, "r", encoding="utf-8") as f:
            spec_content = f.read()
    except Exception as e:
        return {"success": False, "error": f"Erreur lecture spec : {e}"}

    content_instruction = f"\nCONTENU RÉDACTIONNEL :\n{json.dumps(content_data, indent=2, ensure_ascii=False)}" if content_data else ""
    
    full_prompt = f"""RÈGLES DE DESIGN :
{spec_content}

REQUÊTE PRODUIT :
{product_query}
{content_instruction}

MISSION :
Génère une page HTML unique, complète et professionnelle.
- Utilise Tailwind CSS.
- Sauvegarde le code dans 'final_page.html'.
- Respecte scrupuleusement la spec.
"""

    # Normalisation du modèle
    if model and "qwen" in model.lower() and "ollama" not in model.lower():
        model = "ollama-cloud/qwen3-coder-next"

    print(f"🚀 [Projet {project_id}] Génération initiale via OpenCode API...")
    
    try:
        session_id = create_session(working_dir, title=f"Projet {project_id}")
        success = send_and_wait(session_id, working_dir, full_prompt, model=model)
        
        if success:
            output_file = os.path.join(working_dir, "final_page.html")
            if os.path.exists(output_file):
                with open(output_file, "r", encoding="utf-8") as f:
                    html = f.read()
                return {
                    "success": True, 
                    "html": html, 
                    "session_id": session_id, 
                    "working_dir": working_dir,
                    "project_id": project_id
                }
        
        return {"success": False, "error": "La génération a échoué (Timeout ou erreur agent)."}
    except Exception as e:
        return {"success": False, "error": str(e)}

def modify_html(session_id: str, working_dir: str, modification_prompt: str, model: str = "ollama-cloud/qwen3-coder-next") -> dict:
    """Modifie un projet existant de manière chirurgicale."""
    
    print(f"🔧 [Session {session_id}] Modification chirurgicale en cours...")
    
    try:
        success = send_and_wait(session_id, working_dir, modification_prompt, model=model)
        
        if success:
            output_file = os.path.join(working_dir, "final_page.html")
            if os.path.exists(output_file):
                with open(output_file, "r", encoding="utf-8") as f:
                    html = f.read()
                return {"success": True, "html": html}
        
        return {"success": False, "error": "La modification a échoué."}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        res = generate_html(sys.argv[1], sys.argv[2], "ollama-cloud/qwen3-coder-next")
        if res["success"]:
            print(f"✅ Succès ! Session: {res['session_id']}")
            print(f"📄 HTML : {len(res['html'])} chars")
        else:
            print(f"❌ Erreur : {res['error']}")
    else:
        print("Usage: python3 coder.py <spec_path> <query>")
