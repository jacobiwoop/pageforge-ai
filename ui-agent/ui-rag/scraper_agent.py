import requests
import json
import os
import re

def scrape_product(url: str, output_file: str, log_callback=None):
    """
    Agent de scraping universel qui choisit le script approprié (Alibaba ou Amazon)
    et l'envoie au service headless local sur le port 3005.
    """
    def log(msg):
        if log_callback:
            log_callback(msg)
        print(msg)

    log(f"🔍 Analyse de l'URL : {url}")
    
    # Détermination du script à utiliser
    is_amazon = "amazon." in url.lower()
    script_name = "amazon_code.js" if is_amazon else "code.js" # code.js est le script Alibaba par convention
    
    # Chemins des scripts
    base_path = os.path.dirname(os.path.abspath(__file__))
    script_path = os.path.join(base_path, "../../headless-service", script_name)
    
    if not os.path.exists(script_path):
        log(f"❌ Script introuvable : {script_path}")
        return {"success": False, "error": f"Script {script_name} non trouvé"}

    try:
        with open(script_path, "r", encoding="utf-8") as f:
            script_content = f.read()

        # Injection de l'URL (le script Amazon utilise {{ target_url }}, le script Alibaba utilise const URL = "...")
        if is_amazon:
            script_body = script_content.replace("{{ target_url }}", url)
        else:
            # Pour Alibaba, on remplace la ligne const URL = "..."
            script_body = re.sub(r'const URL = ".*?";', f'const URL = "{url}";', script_content, count=1)

        log(f"📡 Envoi au service headless local (Port 3005) via {script_name}...")
        
        endpoint = "http://localhost:3005/run"
        payload = {
            "script": script_body,
            "timeout": 90000
        }

        response = requests.post(endpoint, json=payload, timeout=120)
        response.raise_for_status()
        result = response.json()

        # Sauvegarde du résultat brut pour le Copywriter
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)

        data = result.get('data', {})
        if result.get('status') == 'success' and data.get('success'):
            log(f"✅ Extraction réussie ! [{data.get('title', 'Titre inconnu')}]")
            return result
        else:
            error_msg = result.get('error', {}).get('message') or data.get('error') or "Erreur inconnue"
            log(f"⚠️ Problème lors de l'extraction : {error_msg}")
            return result

    except Exception as e:
        log(f"❌ Erreur critique de scraping : {str(e)}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    # Test local
    scrape_product("https://www.amazon.fr/chaussures/s?k=chaussures", "test_result.json")
