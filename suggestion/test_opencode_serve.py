"""
MINI-TEST : OpenCode Serve
==========================

Ce script teste les 3 capacités clés dont PageForge a besoin :
  1. Connexion au serveur
  2. Génération multi-fichiers via une session
  3. Modification chirurgicale via la MÊME session

PRÉREQUIS :
  - opencode installé  : npm install -g opencode-ai
  - opencode serve lancé dans un terminal séparé :
      cd sessions/mini_test && opencode serve --port 4096 --hostname 0.0.0.0
  - Un modèle configuré (ex: anthropic, ollama...)

USAGE :
  python3 test_opencode_serve.py
"""

import requests
import json
import time
import os
import sys

# ─── Config ──────────────────────────────────────────────────────────────────

OPENCODE_URL = "http://localhost:4096"
TIMEOUT      = 120  # secondes max d'attente par prompt

# ─── Helpers ─────────────────────────────────────────────────────────────────

def check_server():
    """Vérifie que le serveur est up."""
    try:
        r = requests.get(f"{OPENCODE_URL}/global/health", timeout=5)
        data = r.json()
        print(f"✅ Serveur OK — version: {data.get('version', '?')}")
        return True
    except Exception as e:
        print(f"❌ Serveur inaccessible sur {OPENCODE_URL}")
        print(f"   → Lance d'abord : opencode serve --port 4096")
        print(f"   Erreur : {e}")
        return False


def get_session_status(session_id: str, work_dir: str):
    """Récupère le statut actuel de la session via l'endpoint global."""
    try:
        r = requests.get(
            f"{OPENCODE_URL}/session/status", 
            params={"directory": work_dir},
            timeout=5
        )
        if r.status_code == 200:
            # L'endpoint renvoie un dictionnaire { session_id: status_object }
            data = r.json()
            status_obj = data.get(session_id, {})
            return status_obj.get("type")
        return None
    except:
        return None


def create_session(title="mini-test-pageforge"):
    """Crée une nouvelle session."""
    r = requests.post(
        f"{OPENCODE_URL}/session",
        json={"title": title},
        timeout=10
    )
    r.raise_for_status()
    session = r.json()
    session_id = session["id"]
    print(f"✅ Session créée : {session_id}")
    return session_id


def send_message_and_wait(session_id: str, content: str, work_dir: str, label: str = "prompt") -> bool:
    """
    Envoie un message et attend la fin via SSE.
    Retourne True si succès.
    """
    print(f"\n📤 [{label}] Envoi du prompt...")
    print(f"   {content[:100]}{'...' if len(content) > 100 else ''}")

    # Envoie le message
    r = requests.post(
        f"{OPENCODE_URL}/session/{session_id}/message",
        json={"parts": [{"type": "text", "text": content}]},
        timeout=60
    )
    if r.status_code != 200:
        print(f"❌ Erreur envoi message : {r.status_code} — {r.text}")
        return False

    # Check si c'est déjà fini (cas ultra-rapide)
    if get_session_status(session_id, work_dir) == "idle":
        print("   ✅ Terminé instantanément (déjà fini)")
        return True

    # Écoute les events SSE jusqu'à completion
    print(f"⏳ En attente de la réponse OpenCode (max {TIMEOUT}s)...")
    start = time.time()

    try:
        with requests.get(
            f"{OPENCODE_URL}/event",
            params={"directory": work_dir},
            stream=True,
            timeout=TIMEOUT
        ) as resp:
            for line in resp.iter_lines():
                if time.time() - start > TIMEOUT:
                    print("❌ Timeout dépassé")
                    return False

                if not line:
                    continue

                line = line.decode("utf-8") if isinstance(line, bytes) else line

                # Parse les events SSE
                if line.startswith("data: "):
                    try:
                        event = json.loads(line[6:])
                        event_type = event.get("type", "")
                        print(f"   📡 Event: {event_type}")

                        # Event intéressant : afficher l'activité
                        if event_type == "message.part.updated":
                            part = event.get("properties", {}).get("part", {})
                            if part.get("type") == "tool-invocation":
                                tool = part.get("toolInvocation", {})
                                tool_name = tool.get("toolName", "")
                                if tool_name in ("write_file", "edit", "bash", "read"):
                                    args = tool.get("args", {})
                                    path = args.get("path", args.get("file_path", ""))
                                    print(f"   🔧 {tool_name}: {path}")

                        # Fin de la session (l'agent est devenu inactif)
                        elif event_type == "session.idle":
                            session_id_event = event.get("properties", {}).get("sessionID")
                            if session_id_event == session_id:
                                elapsed = round(time.time() - start, 1)
                                print(f"✅ Terminé en {elapsed}s")
                                return True
                        
                        # Gestion des erreurs
                        elif event_type == "session.error":
                            print(f"❌ OpenCode a retourné une erreur : {event.get('properties', {}).get('error')}")
                            return False

                    except json.JSONDecodeError:
                        pass

                # Si on n'a rien reçu d'autre que des heartbeats pendant 10s, 
                # on vérifie le statut réel du serveur
                if time.time() - start > 10:
                    status = get_session_status(session_id, work_dir)
                    if status == "idle":
                        print("   ✅ (Détecté idle via polling)")
                        return True

    except requests.exceptions.Timeout:
        # En cas de timeout SSE, on vérifie une dernière fois le statut
        if get_session_status(session_id, work_dir) == "idle":
            return True
        print("❌ Timeout sur la connexion SSE")
        return False
    except Exception as e:
        print(f"❌ Erreur SSE : {e}")
        return False

    return False


def read_file(path: str) -> str | None:
    """Lit un fichier via l'API OpenCode."""
    try:
        r = requests.get(
            f"{OPENCODE_URL}/file",
            params={"path": path},
            timeout=10
        )
        if r.status_code == 200:
            return r.text
        return None
    except:
        return None


def check_file_on_disk(path: str) -> str | None:
    """Lit un fichier directement sur le disque."""
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return None


# ─── Tests ───────────────────────────────────────────────────────────────────

def test_1_connexion():
    print("\n" + "═" * 55)
    print("TEST 1 : Connexion au serveur")
    print("═" * 55)
    return check_server()


def test_2_generation_multi_fichiers(session_id: str, work_dir: str):
    print("\n" + "═" * 55)
    print("TEST 2 : Génération multi-fichiers")
    print("═" * 55)

    prompt = """Crée une mini app React avec exactement ces 3 fichiers dans le répertoire courant :

1. `index.html` — HTML minimal qui charge main.jsx via un script module
2. `main.jsx` — Point d'entrée React qui importe App.jsx et rend <App />
3. `App.jsx` — Composant React simple avec :
   - Un titre H1 "PageForge - Test"
   - Un paragraphe "Version: 1.0.0"
   - Un bouton "Générer" (pas de fonctionnalité, juste le style)
   - Style inline simple, fond blanc, texte noir

IMPORTANT : Crée vraiment les 3 fichiers séparés, pas un seul fichier monolithique.
"""

    success = send_message_and_wait(session_id, prompt, work_dir, "génération initiale")

    if not success:
        return False

    # Vérifie les fichiers sur disque
    print("\n📂 Vérification des fichiers générés :")
    files_ok = 0
    for fname in ["index.html", "main.jsx", "App.jsx"]:
        fpath = os.path.join(work_dir, fname)
        content = check_file_on_disk(fpath)
        if content:
            print(f"   ✅ {fname} ({len(content)} chars)")
            files_ok += 1
        else:
            print(f"   ❌ {fname} — MANQUANT")

    print(f"\n   → {files_ok}/3 fichiers générés")
    return files_ok == 3


def test_3_modification_chirurgicale(session_id: str, work_dir: str):
    print("\n" + "═" * 55)
    print("TEST 3 : Modification chirurgicale (même session)")
    print("═" * 55)

    # Lis l'état avant
    app_before = check_file_on_disk(os.path.join(work_dir, "App.jsx"))
    if not app_before:
        print("❌ App.jsx introuvable, impossible de tester la modif")
        return False

    print(f"   App.jsx avant : {len(app_before)} chars")

    prompt = """Dans App.jsx uniquement :
- Change le titre H1 de "PageForge - Test" à "PageForge - MODIFIÉ ✓"
- Change "Version: 1.0.0" à "Version: 2.0.0"
- Change la couleur du bouton en bleu (#0066cc) avec texte blanc

Ne touche PAS à index.html ni main.jsx.
"""

    success = send_message_and_wait(session_id, prompt, work_dir, "modification chirurgicale")

    if not success:
        return False

    # Vérifie le résultat
    app_after = check_file_on_disk(os.path.join(work_dir, "App.jsx"))
    index_after = check_file_on_disk(os.path.join(work_dir, "index.html"))

    print("\n📂 Résultats :")

    # Check App.jsx modifié
    if app_after and "MODIFIÉ" in app_after and "2.0.0" in app_after:
        print(f"   ✅ App.jsx modifié correctement")
        print(f"      - Contient 'MODIFIÉ ✓' : {'MODIFIÉ' in app_after}")
        print(f"      - Contient 'Version: 2.0.0' : {'2.0.0' in app_after}")
    else:
        print(f"   ❌ App.jsx — modifications non détectées")
        if app_after:
            print(f"      Contenu : {app_after[:200]}")

    # Vérifie que index.html n'a PAS été touché
    if index_after == check_file_on_disk(os.path.join(work_dir, "index.html")):
        print(f"   ✅ index.html non touché (modification chirurgicale confirmée)")
    
    chirurgical_ok = app_after and "MODIFIÉ" in app_after and "2.0.0" in app_after
    return chirurgical_ok


# ─── Main ────────────────────────────────────────────────────────────────────

def main():
    print("""
╔═══════════════════════════════════════════════════════╗
║       MINI-TEST OpenCode Serve × PageForge            ║
╚═══════════════════════════════════════════════════════╝

Ce test vérifie 3 choses :
  1. Le serveur répond
  2. OpenCode peut générer plusieurs fichiers séparés
  3. OpenCode peut modifier UN fichier sans toucher aux autres

""")

    # Répertoire de travail du test
    # IMPORTANT : c'est le CWD depuis lequel opencode serve est lancé
    work_dir = os.path.join(os.path.dirname(__file__), "sessions", "mini_test")
    os.makedirs(work_dir, exist_ok=True)

    print(f"📂 Répertoire de travail : {work_dir}")
    # Nettoyage pour repartir à zéro
    if os.path.exists(work_dir):
        import shutil
        for item in os.listdir(work_dir):
            item_path = os.path.join(work_dir, item)
            if os.path.isfile(item_path): os.remove(item_path)
            elif os.path.isdir(item_path): shutil.rmtree(item_path)
    
    print(f"⚠️  Lance opencode serve depuis ce répertoire !")
    print(f"   cd {work_dir} && opencode serve --port 4096\n")

    # Test 1
    if not test_1_connexion():
        sys.exit(1)

    # Création de session
    print("\n" + "═" * 55)
    print("SETUP : Création de la session de test")
    print("═" * 55)
    try:
        session_id = create_session("mini-test-pageforge")
    except Exception as e:
        print(f"❌ Impossible de créer une session : {e}")
        sys.exit(1)

    # Test 2
    t2 = test_2_generation_multi_fichiers(session_id, work_dir)

    # Test 3 (seulement si Test 2 OK)
    t3 = False
    if t2:
        t3 = test_3_modification_chirurgicale(session_id, work_dir)
    else:
        print("\n⏭️  Test 3 skippé (Test 2 échoué)")

    # Bilan
    print("\n" + "═" * 55)
    print("BILAN")
    print("═" * 55)
    print(f"  Test 1 — Connexion serveur     : ✅")
    print(f"  Test 2 — Génération multi-files : {'✅' if t2 else '❌'}")
    print(f"  Test 3 — Modification chirurgic : {'✅' if t3 else '❌'}")
    print(f"\n  Session ID (pour inspection)   : {session_id}")
    print(f"  Fichiers dans : {work_dir}")

    if t2 and t3:
        print("""
🎉 TOUS LES TESTS PASSENT !
   → OpenCode serve est prêt pour PageForge
   → Tu peux maintenant refactoriser coder.py
""")
    else:
        print("""
⚠️  Certains tests ont échoué.
   Causes possibles :
   - opencode serve lancé depuis le mauvais répertoire
   - Modèle non configuré (opencode auth login)
   - Timeout trop court (augmente TIMEOUT en haut du script)
""")


if __name__ == "__main__":
    main()