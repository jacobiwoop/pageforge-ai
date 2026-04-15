import requests
import json
import os
import re

def run_amazon_extraction(target_url, output_file="amazon_result.json"):
    """
    Envoie le script Amazon au service headless local.
    """
    
    ENDPOINT = "http://localhost:3005/run"
    
    # Charger le script Amazon
    script_path = os.path.join(os.path.dirname(__file__), "../../headless-service/amazon_code.js")
    if not os.path.exists(script_path):
        script_path = "/home/aiko/Documents/agent-cli/headless-service/amazon_code.js"
        
    try:
        with open(script_path, "r", encoding="utf-8") as f:
            full_script = f.read()
        
        # Injection de l'URL
        script_body = full_script.replace("{{ target_url }}", target_url)
        
        print(f"📡 Envoi du script Amazon au service local pour : {target_url}")
        
        payload = {
            "script": script_body,
            "timeout": 90000
        }
        
        response = requests.post(ENDPOINT, json=payload, timeout=120)
        response.raise_for_status()
        result = response.json()
        
        # Sauvegarde du résultat
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
            
        data = result.get('data', {})
        if result.get('status') == 'success' and data.get('success'):
            print(f"✅ Extraction Amazon réussie ! Titre : {data.get('title')}")
            return result
        else:
            error_msg = result.get('error', {}).get('message') or data.get('error') or "Erreur inconnue"
            print(f"❌ Erreur Amazon : {error_msg}")
            return result
            
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution : {str(e)}")
        return None

if __name__ == "__main__":
    TEST_URL = "https://www.amazon.fr/chaussures-homme-Mode/s?k=chaussures&rh=n%3A1765241031"
    run_amazon_extraction(TEST_URL)
