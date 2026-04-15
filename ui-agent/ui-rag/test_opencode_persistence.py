import subprocess
import json
import re
import os

def run_poc():
    model = "ollama-cloud/qwen3-coder-next"
    test_dir = "sessions/poc_test_session"
    os.makedirs(test_dir, exist_ok=True)
    
    print(f"🚀 ÉTAPE 1 : Génération initiale (Mode JSON)")
    prompt1 = "Cree un fichier app.py qui affiche Hello World"
    
    cmd1 = [
        "opencode", "run",
        "--model", model,
        "--format", "json",
        "--dangerously-skip-permissions",
        prompt1
    ]
    
    result1 = subprocess.run(cmd1, capture_output=True, text=True, cwd=test_dir)
    
    session_id = None
    # On cherche le sessionID dans les lignes JSON
    for line in result1.stdout.split('\n'):
        try:
            data = json.loads(line)
            if "sessionID" in data:
                session_id = data["sessionID"]
                break
        except:
            continue
            
    if not session_id:
        print("❌ Échec : Impossible de récupérer le sessionID.")
        print("Stdout:", result1.stdout)
        print("Stderr:", result1.stderr)
        return

    print(f"✅ Session ID récupéré : {session_id}")
    print("-" * 30)

    print(f"🚀 ÉTAPE 2 : Modification via Session ID")
    prompt2 = f"Lis le fichier app.py et change Hello World par HELLO PAGEFORGE"
    
    cmd2 = [
        "opencode", "run",
        "--model", model,
        "--session", session_id,
        "--dangerously-skip-permissions",
        prompt2
    ]
    
    result2 = subprocess.run(cmd2, capture_output=True, text=True, cwd=test_dir)
    print(result2.stdout)
    
    # Vérification finale
    file_path = os.path.join(test_dir, "app.py")
    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            content = f.read()
            print("-" * 30)
            print("📄 CONTENU FINAL DU FICHIER :")
            print(content)
            if "HELLO PAGEFORGE" in content:
                print("\n✨ POC RÉUSSI : L'IA a modifié le fichier en utilisant la session !")
            else:
                print("\n❌ POC ÉCHOUÉ : Le contenu n'a pas été mis à jour.")
    else:
        print("❌ Échec : Le fichier app.py n'existe pas.")

if __name__ == "__main__":
    run_poc()
