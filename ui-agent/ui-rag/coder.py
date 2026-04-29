import os
import json
import uuid
import time
import threading
import requests

# ─── Configuration ───────────────────────────────────────────────────────────

OPENCODE_URL = os.environ.get("OPENCODE_URL", "http://localhost:4096")
TIMEOUT      = 1200  # 20 minutes par prompt
DEBUG        = False # Mettre à True pour voir les JSON bruts de chaque événement
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
    """Écoute les événements globaux via /global/event."""
    try:
        # Utilisation de /global/event comme découvert dans doc.json
        with requests.get(
            f"{OPENCODE_URL}/global/event",
            stream=True,
            timeout=TIMEOUT + 10
        ) as resp:
            for line in resp.iter_lines():
                if stop_event.is_set(): break
                if not line: continue
                
                line = line.decode("utf-8") if isinstance(line, bytes) else line
                if not line.startswith("data: "): continue
                
                try:
                    # GlobalEvent = { "directory": "...", "payload": { "type": "...", "properties": {...} } }
                    global_event = json.loads(line[6:])
                    
                    if DEBUG:
                        print(f"\n🔍 [DEBUG] {json.dumps(global_event)}")

                    event = global_event.get("payload", {})
                    etype = event.get("type")
                    props = event.get("properties", {})
                    
                    # Filtrage par sessionID
                    if props.get("sessionID") and props.get("sessionID") != session_id:
                        continue
                        
                    if etype == "message.part.updated":
                        part = props.get("part", {})
                        if part.get("type") == "tool-invocation":
                            tool = part.get("toolInvocation", {})
                            print(f"\n   🔧 OpenCode: {tool.get('toolName')} ({tool.get('args', {}).get('path', '')})")
                    elif etype == "message.part.delta":
                        # Structure doc.json: { "properties": { "delta": "string" } }
                        delta_text = props.get("delta")
                        if delta_text:
                            print(delta_text, end="", flush=True)
                    elif etype == "file.edited":
                        print(f"\n   📝 Fichier modifié : {props.get('file','?')}")
                    elif etype == "session.idle":
                        print(f"\n   🏁 Fin de génération (session.idle)")
                        stop_event.set()
                    elif etype == "session.status":
                        st = props.get("status", {})
                        if isinstance(st, dict) and st.get("type") == "idle":
                            print(f"\n   🏁 Fin de génération (status: idle)")
                            stop_event.set()
                        elif isinstance(st, dict) and st.get("type") == "busy":
                            print(f" ⚙️ ", end="", flush=True)
                    elif etype == "question.asked":
                        # L'IA nous pose une question !
                        q = props.get("question", {})
                        print(f"\n   ❓ QUESTION DE L'IA : {q.get('text', '...')}")
                        print(f"   (Le script est en attente car l'IA a besoin d'une réponse)")
                    elif etype == "permission.asked":
                        # Demande de permission (ex: lancer une commande)
                        p = props.get("permission", {})
                        print(f"\n   🛡️  PERMISSION REQUISE : {p.get('title', '...')}")
                    elif etype == "todo.updated":
                        # Liste complète des tâches
                        todos = props.get("todos", [])
                        done = len([t for t in todos if t.get("status") == "done"])
                        total = len(todos)
                        if total > 0:
                            print(f"\n   📋 AVANCEMENT : {done}/{total} tâches terminées")
                            # Optionnel : afficher la tâche en cours
                            current = [t for t in todos if t.get("status") == "in-progress"]
                            if current:
                                print(f"      👉 En cours : {current[0].get('title')}")
                    elif etype == "command.executed":
                        # Commande shell exécutée par l'IA
                        print(f"\n   💻 COMMANDE : {props.get('command', '...')}")
                    elif etype == "session.error":
                        print(f"\n   ❌ Erreur session: {props.get('error')}")
                        stop_event.set()
                    elif etype not in ("", "file.watcher.updated", "lsp.client.diagnostics", "sync"):
                        # On affiche les autres types d'événements pour montrer l'activité
                        print(f"   📡 {etype}")
                except Exception:
                    pass
    except Exception:
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

def generate_html(spec_path: str, product_query: str, model: str, content_data: dict = None, cwd: str = None, opencode_session_id: str = None) -> dict:
    """Génère un nouveau projet HTML via OpenCode."""
    
    if cwd and os.path.exists(cwd):
        working_dir = cwd
        project_id = os.path.basename(working_dir)
    else:
        project_id = str(uuid.uuid4())[:8]
        working_dir = os.path.join(SESSIONS_DIR, f"project_{project_id}")
        os.makedirs(working_dir, exist_ok=True)

    try:
        with open(spec_path, "r", encoding="utf-8") as f:
            spec_content = f.read()
    except Exception as e:
        return {"success": False, "error": f"Erreur lecture spec : {e}"}

    content_instruction = f"\nCONTENU RÉDACTIONNEL :\n{json.dumps(content_data, indent=2, ensure_ascii=False)}" if content_data else ""
    
    output_file = os.path.join(working_dir, "final_page.html")

    full_prompt = f"""RÈGLES DE DESIGN :
{spec_content}

REQUÊTE PRODUIT :
{product_query}
{content_instruction}

MISSION :
Génère une page HTML unique, complète et professionnelle.
- Utilise Tailwind CSS.
- Sauvegarde le code OBLIGATOIREMENT dans ce chemin absolu exact : {output_file}
- N'écris ce fichier nulle part ailleurs.
- Respecte scrupuleusement la spec.
"""

    # Normalisation du modèle
    if model and isinstance(model, str) and "qwen" in model.lower() and "ollama" not in model.lower():
        model = "ollama-cloud/qwen3-coder-next"

    print(f"🚀 [Projet {project_id}] Génération initiale via OpenCode API...")
    
    try:
        session_id = opencode_session_id or create_session(working_dir, title=f"Projet {project_id}")
        success = send_and_wait(session_id, working_dir, full_prompt, model=model)
    except Exception as e:
        print(f"   ⚠️  Erreur pendant l'attente : {e}")
        success = False

    # Le vrai juge de paix est maintenant : est-ce que OpenCode a fini (idle) ?
    # Et est-ce qu'on a des fichiers ?
    files = os.listdir(working_dir)
    if success or len(files) > 0:
        html = ""
        # 1. On cherche le fichier attendu
        if os.path.exists(output_file):
            with open(output_file, "r", encoding="utf-8") as f:
                html = f.read()
        # 2. Sinon on cherche n'importe quel HTML
        elif any(f.endswith(".html") for f in files):
            html_files = [f for f in files if f.endswith(".html")]
            found_file = os.path.join(working_dir, html_files[0])
            print(f"   ℹ️  Fichier {output_file} non trouvé, utilisation de {found_file}")
            with open(found_file, "r", encoding="utf-8") as f:
                html = f.read()
        
        if html:
            return {
                "success": True, 
                "html": html, 
                "session_id": session_id if 'session_id' in locals() else None, 
                "working_dir": working_dir,
                "project_id": project_id
            }

    return {"success": False, "error": "La génération a échoué (aucun contenu HTML trouvé)."}

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
