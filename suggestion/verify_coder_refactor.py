import sys
import os
import time

# Ajouter le chemin pour importer coder
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../ui-agent/ui-rag")))
import coder

def verify():
    # Chemins
    spec_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../ui-agent/ui-rag/exports/current_style_spec.md"))
    
    print("\n" + "═"*55)
    print("TEST PageForge : coder.py (Architecture REST)")
    print("═"*55)
    
    # Test 1 : Génération
    print("\n🚀 TEST 1 : Génération multi-fichiers")
    query = "Crée 3 fichiers : index.html, main.jsx, App.jsx. Une app de cuisine simple."
    
    res = coder.generate_html(spec_path, query, model=None) # On laisse OpenCode choisir le modèle
    
    if res["success"]:
        print(f"✅ Succès ! Session: {res['session_id']}")
        print(f"📂 Dossier: {res['working_dir']}")
        
        # Test 2 : Modification
        print("\n🚀 TEST 2 : Modification chirurgicale")
        mod_res = coder.modify_html(res['session_id'], res['working_dir'], "Change le titre en 'PASTA FACTORY'.")
        if mod_res["success"]:
            print("✅ Succès !")
        else:
            print(f"❌ Échec modif : {mod_res.get('error')}")
    else:
        print(f"❌ Échec génération : {res.get('error')}")

if __name__ == "__main__":
    verify()
