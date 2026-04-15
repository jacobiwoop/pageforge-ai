import requests
import json
import os

def run_alibaba_extraction(target_url, output_file="alibaba_result.json"):
    """
    Envoie le script Alibaba au service headless local.
    """
    
    ENDPOINT = "http://localhost:3000/run"
    
    # Charger le script de production
    script_path = os.path.join(os.path.dirname(__file__), "../../headless-service/code.js")
    if not os.path.exists(script_path):
        # Fallback si le chemin relatif ne fonctionne pas
        script_path = "/home/aiko/Documents/agent-cli/headless-service/code.js"
        
    try:
        with open(script_path, "r", encoding="utf-8") as f:
            full_script = f.read()
        
        # Rendre l'URL dynamique dans le script
        # On cherche la ligne const URL = "...";
        import re
        script_body = re.sub(r'const URL = ".*?";', f'const URL = "{target_url}";', full_script, count=1)
        
        # Note: server.js utilise new AsyncFunction('page', 'context', script)
        # Donc le script peut utiliser 'page' directement.
        
        print(f"📡 Envoi du script au service local pour l'URL : {target_url}")
        
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
            print(f"✅ Extraction réussie ! Titre : {data.get('title')}")
            return result
        else:
            error_msg = result.get('error', {}).get('message') or data.get('error') or "Erreur inconnue"
            print(f"❌ Erreur : {error_msg}")
            if data.get('screenshot'):
                print("📸 Un screenshot du captcha/erreur a été capturé.")
            return result
            
    except Exception as e:
        print(f"❌ Erreur lors de l'exécution : {str(e)}")
        return None

if __name__ == "__main__":
    TEST_URL = "https://www.alibaba.com/product-detail/Top-Quality-Luxury-Sneakers-Latest-Sport_1601737161453.html?spm=a2700.details.popular_products.9.1251681ezvqPmH"
    run_alibaba_extraction(TEST_URL)
