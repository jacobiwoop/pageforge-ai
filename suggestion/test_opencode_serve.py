"""
MINI-TEST : OpenCode Serve (v3 — détection de fin robuste)
==========================================================
Stratégie :
  - Envoie via POST /session/{id}/message (synchrone — attend la fin)
  - Si timeout, polling sur GET /session/{id} pour checker le status
  - SSE /event en bonus pour voir l'activité live

PRÉREQUIS :
  cd sessions/mini_test && opencode serve --port 4096
"""

import requests, json, time, os, sys, threading

OPENCODE_URL = "http://localhost:4096"
TIMEOUT      = 180

# ─── Core ────────────────────────────────────────────────────────────────────

def check_server():
    r = requests.get(f"{OPENCODE_URL}/global/health", timeout=5)
    data = r.json()
    print(f"✅ Serveur OK — version: {data.get('version','?')}")
    return True

def create_session(title="pageforge-test"):
    r = requests.post(f"{OPENCODE_URL}/session", json={"title": title}, timeout=10)
    r.raise_for_status()
    sid = r.json()["id"]
    print(f"✅ Session : {sid}")
    return sid

def get_session(session_id: str) -> dict:
    """GET /session/{id} — retourne les infos de la session."""
    r = requests.get(f"{OPENCODE_URL}/session/{session_id}", timeout=5)
    return r.json() if r.status_code == 200 else {}

def is_session_idle(session_id: str) -> bool:
    """Polling sur GET /session/{id} pour voir si la session est idle."""
    data = get_session(session_id)
    # La session n'a pas de champ "status" direct, on regarde via /session/status
    try:
        r = requests.get(f"{OPENCODE_URL}/session/status", timeout=5)
        if r.status_code == 200:
            statuses = r.json()
            # Peut être un dict {sessionID: {type: "idle"}} ou un tableau
            if isinstance(statuses, dict):
                st = statuses.get(session_id, {})
                return st.get("type") == "idle"
            elif isinstance(statuses, list):
                for item in statuses:
                    if item.get("sessionID") == session_id:
                        return item.get("status", {}).get("type") == "idle"
    except:
        pass
    return False

def watch_events_async(session_id: str, stop_event: threading.Event):
    """Thread qui écoute le SSE et affiche l'activité."""
    try:
        with requests.get(f"{OPENCODE_URL}/event", stream=True, timeout=TIMEOUT+10) as resp:
            for line in resp.iter_lines():
                if stop_event.is_set():
                    break
                if not line:
                    continue
                line = line.decode("utf-8") if isinstance(line, bytes) else line
                if not line.startswith("data: "):
                    continue
                try:
                    ev = json.loads(line[6:])
                    etype = ev.get("type", "")
                    props = ev.get("properties", {})
                    sid = props.get("sessionID", "")

                    # Ignore les events d'autres sessions et les heartbeats
                    if sid and sid != session_id:
                        continue
                    if etype in ("server.heartbeat", "server.connected"):
                        continue

                    if etype == "file.edited":
                        print(f"   📝 {props.get('file','?')}")
                    elif etype == "session.idle":
                        print(f"   🏁 session.idle reçu")
                        stop_event.set()
                    elif etype == "session.status":
                        st = props.get("status", {})
                        if isinstance(st, dict) and st.get("type") == "idle":
                            print(f"   🏁 session.status(idle) reçu")
                            stop_event.set()
                        elif isinstance(st, dict) and st.get("type") == "busy":
                            print(f"   ⚙️  busy...")
                    elif etype == "session.error":
                        print(f"   ❌ session.error: {props}")
                        stop_event.set()
                    elif etype not in ("", "file.watcher.updated"):
                        print(f"   📡 {etype}")
                except:
                    pass
    except:
        pass

def send_and_wait(session_id: str, text: str, label: str) -> bool:
    """
    Stratégie robuste :
    1. POST /session/{id}/message  (SYNCHRONE — bloque jusqu'à la fin)
    2. Si ça bloque trop, on a le thread SSE en parallèle pour voir l'activité
    3. Fallback polling si timeout
    """
    print(f"\n📤 [{label}]")
    print(f"   {text[:100].replace(chr(10),' ')}...")

    # Lance le thread SSE en background pour le feedback live
    stop_ev = threading.Event()
    t = threading.Thread(target=watch_events_async, args=(session_id, stop_ev), daemon=True)
    t.start()

    print(f"⏳ Envoi (synchrone — attend la fin)...")
    start = time.time()

    try:
        # POST /session/{id}/message est SYNCHRONE dans cette version
        # Il bloque jusqu'à ce que l'agent ait fini
        r = requests.post(
            f"{OPENCODE_URL}/session/{session_id}/message",
            json={"parts": [{"type": "text", "text": text}]},
            timeout=TIMEOUT
        )
        stop_ev.set()
        elapsed = round(time.time() - start, 1)

        if r.status_code == 200:
            print(f"✅ Terminé en {elapsed}s (réponse HTTP 200)")
            return True
        else:
            print(f"❌ HTTP {r.status_code} : {r.text[:200]}")
            return False

    except requests.exceptions.Timeout:
        stop_ev.set()
        # Dernier recours : polling
        print(f"⚠️  Timeout HTTP ({TIMEOUT}s), vérification via polling...")
        for _ in range(10):
            time.sleep(3)
            if is_session_idle(session_id):
                print("✅ Session idle confirmée par polling")
                return True
        print("❌ Session toujours occupée après polling")
        return False

    except Exception as e:
        stop_ev.set()
        print(f"❌ Erreur : {e}")
        return False

def read_file(work_dir, fname):
    p = os.path.join(work_dir, fname)
    if os.path.exists(p):
        return open(p).read()
    return ""

# ─── Tests ───────────────────────────────────────────────────────────────────

def test_multi_fichiers(session_id, work_dir):
    print("\n" + "═"*55)
    print("TEST 2 : Génération multi-fichiers")
    print("═"*55)

    prompt = """Crée exactement 3 fichiers dans le répertoire courant :

index.html :
<!DOCTYPE html>
<html><head><title>PageForge Test</title></head>
<body><div id="root"></div>
<script type="module" src="./main.jsx"></script>
</body></html>

main.jsx :
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
createRoot(document.getElementById('root')).render(<App />)

App.jsx :
export default function App() {
  return (
    <div style={{padding:'2rem',fontFamily:'sans-serif'}}>
      <h1>PageForge - Test</h1>
      <p>Version: 1.0.0</p>
      <button style={{padding:'0.5rem 1rem'}}>Générer</button>
    </div>
  )
}

Crée ces 3 fichiers séparés. Rien d'autre.
"""
    ok = send_and_wait(session_id, prompt, "génération initiale")
    if not ok:
        return False

    print("\n📂 Fichiers :")
    score = 0
    for f in ["index.html", "main.jsx", "App.jsx"]:
        c = read_file(work_dir, f)
        if c:
            print(f"   ✅ {f} ({len(c)} chars)")
            score += 1
        else:
            print(f"   ❌ {f} manquant")
    return score == 3


def test_chirurgical(session_id, work_dir):
    print("\n" + "═"*55)
    print("TEST 3 : Modification chirurgicale")
    print("═"*55)

    idx_before = read_file(work_dir, "index.html")
    app_before = read_file(work_dir, "App.jsx")
    print(f"   App.jsx avant : {len(app_before)} chars")

    prompt = """Modifie UNIQUEMENT le fichier App.jsx :
- H1 : "PageForge - Test" → "PageForge - MODIFIÉ ✓"
- Paragraphe : "Version: 1.0.0" → "Version: 2.0.0"
- Bouton : ajoute background:'#0066cc', color:'white', border:'none' au style existant

NE TOUCHE PAS index.html ni main.jsx.
"""
    ok = send_and_wait(session_id, prompt, "modification chirurgicale")
    if not ok:
        return False

    app_after = read_file(work_dir, "App.jsx")
    idx_after = read_file(work_dir, "index.html")

    print("\n📂 Résultats :")
    modif = "MODIFIÉ" in app_after and "2.0.0" in app_after
    print(f"   {'✅' if modif else '❌'} App.jsx : MODIFIÉ={('MODIFIÉ' in app_after)}, 2.0.0={('2.0.0' in app_after)}")
    intact = idx_after == idx_before
    print(f"   {'✅' if intact else '⚠️'} index.html intact : {intact}")
    return modif and intact

# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    print("""
╔═══════════════════════════════════════════════════════╗
║   MINI-TEST OpenCode Serve × PageForge  (v3)          ║
║   Détection fin : HTTP sync + SSE live + polling      ║
╚═══════════════════════════════════════════════════════╝
""")
    script_dir = os.path.dirname(os.path.abspath(__file__))
    work_dir   = os.path.join(script_dir, "sessions", "mini_test")
    os.makedirs(work_dir, exist_ok=True)

    print(f"📂 Work dir : {work_dir}")
    print(f"\n⚠️  opencode serve doit tourner depuis :")
    print(f"   cd {work_dir} && opencode serve --port 4096\n")
    input("Entrée quand c'est prêt... ")

    try:
        check_server()
    except Exception as e:
        print(f"❌ {e}"); sys.exit(1)

    print("\n" + "═"*55)
    print("SETUP : Création de session")
    print("═"*55)
    session_id = create_session("pageforge-mini-test")

    # Affiche les infos de la session
    info = get_session(session_id)
    print(f"   directory : {info.get('directory','?')}")
    print(f"   project   : {info.get('projectID','?')}")

    t2 = test_multi_fichiers(session_id, work_dir)
    t3 = test_chirurgical(session_id, work_dir) if t2 else False

    print("\n\n" + "═"*55)
    print("BILAN")
    print("═"*55)
    print(f"  Génération multi-fichiers  : {'✅' if t2 else '❌'}")
    print(f"  Modification chirurgicale  : {'✅' if t3 else '❌'}")
    print(f"\n  Session ID : {session_id}")

    if t2 and t3:
        print("\n🎉 SUCCÈS — On peut attaquer le refactor de coder.py !")
    else:
        print("\n⚠️  Voir les logs ci-dessus pour diagnostiquer.")

if __name__ == "__main__":
    main()