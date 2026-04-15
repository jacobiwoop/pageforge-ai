import subprocess
import os
import json
import tempfile

def generate_html(spec_path: str, product_query: str, model: str, content_data: dict = None, cwd: str = None) -> str:
    """Appelle OpenCode pour générer le code HTML final."""
    
    # 1. Lire la spécification du design system (chemin relatif au CWD ou absolu)
    try:
        with open(spec_path, "r", encoding="utf-8") as f:
            spec_content = f.read()
    except Exception as e:
        return f"Erreur lors de la lecture de la spec : {str(e)}"

    # 2. Préparer le bloc de contenu rédactionnel
    content_instruction = ""
    if content_data:
        content_instruction = f"""
CONTENU RÉDACTIONNEL (MARKETING) :
{json.dumps(content_data, indent=2, ensure_ascii=False)}
"""

    # 3. Préparer le prompt final
    full_prompt = f"""RÈGLES DE DESIGN (MASTER SPECIFICATION) :
{spec_content}

REQUÊTE PRODUIT :
{product_query}
{content_instruction}

MISSION :
Génère une page HTML unique, complète et professionnelle pour ce produit.
- Utilise Tailwind CSS (via CDN) pour le style.
- Intègre les polices Google Fonts mentionnées dans la spec.
- Respecte scrupuleusement les couleurs, les arrondis (radius) et les animations de la spec.
- SÉCURITÉ : Ne jamais appliquer `pointer-events: none` sur la balise `body` ou tout conteneur englobant. Tous les éléments interactifs (boutons, inputs) DOIVENT être cliquables.
- CONVERSION : Ne génère JAMAIS de bouton "Ajouter au panier". Utilise uniquement des boutons "Commander" ou "Acheter maintenant".
- PAIEMENT : Intègre un formulaire ou un script FedaPay pour le paiement direct. Utilise le endpoint local `/api/orders/create` pour enregistrer la commande avant le paiement.
- Implémente tous les modules listés dans le contenu rédactionnel (Hero, Benefits, etc.).
- Le code doit OBLIGATOIREMENT être sauvegardé dans un fichier nommé exactement `final_page.html` dans l'espace de travail.
"""

    print(f"\n🚀 Génération du HTML via OpenCode (Modèle: {model})...")
    
    # Préparation de l'environnement (PATH dynamique)
    env = os.environ.copy()
    home = os.path.expanduser("~")
    env["PATH"] = f"{home}/.opencode/bin:{home}/.bun/bin:{env.get('PATH', '')}"

    # 4. Ajuster le nom du modèle pour OpenCode (format provider/model demandé)
    if "/" not in model:
        if "qwen3.5" in model:
            opencode_model = "ollama-cloud/qwen3-coder-next"
        else:
            opencode_model = f"ollama-cloud/{model}"
    else:
        opencode_model = model

    # Utiliser le CWD fourni ou par défaut la racine du projet
    working_dir = cwd if cwd else os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))

    try:
        cmd = [
            "opencode", "run", 
            "--model", opencode_model, 
            "--format", "json",
            "--dangerously-skip-permissions", 
            full_prompt
        ]
        
        result = subprocess.run(
            cmd, 
            env=env, 
            capture_output=True, 
            text=True, 
            timeout=1200, # 20 minutes
            cwd=working_dir
        )
        
        if result.returncode != 0:
            return f"Erreur OpenCode (code {result.returncode}) : {result.stderr or result.stdout}"
        
        raw_output = result.stdout.strip()
        raw_output = result.stdout + "\n" + result.stderr
        
        session_id = None
        for line in raw_output.split('\n'):
            line = line.strip()
            if not line: continue
            try:
                data = json.loads(line)
                if "sessionID" in data:
                    session_id = data["sessionID"]
                    break
            except:
                pass

        # Au lieu de parser l'output pour le HTML, on compte sur la commande de sauvegarde d'OpenCode
        output_file = os.path.join(working_dir, "final_page.html")
        if os.path.exists(output_file):
             with open(output_file, "r", encoding="utf-8") as f:
                 html_content = f.read()
             return {"success": True, "html": html_content, "session_id": session_id}
        
        return f"Erreur : 'final_page.html' non généré. SessionID: {session_id}"
    except subprocess.TimeoutExpired:
        return "Erreur : Timeout de 20 minutes dépassé pour la génération du code."
    except Exception as e:
        return f"Erreur lors de l'appel de OpenCode : {str(e)}"

if __name__ == "__main__":
    # Petit test standalone si lancé directement
    import sys
    if len(sys.argv) > 1:
        # Usage: python3 coder.py <spec_path> <query> [model]
        path = sys.argv[1]
        query = sys.argv[2]
        mdl = sys.argv[3] if len(sys.argv) > 3 else "qwen3.5:cloud"
        print(generate_html(path, query, mdl))
    else:
        print("Usage test: python3 coder.py <spec_path> <query> [model]")
