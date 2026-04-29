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
        if is_amazon:
            log("📡 Envoi à l'API externe OmkarCloud...")
            
            # 1. On extrait l'ASIN de l'URL Amazon
            asin_match = re.search(r"/(?:dp|gp/product)/([a-zA-Z0-9]{10})", url)
            if not asin_match:
                log("❌ Impossible de trouver l'ASIN dans l'URL Amazon")
                return {"success": False, "error": "ASIN introuvable"}
            asin = asin_match.group(1)
            
            # 2. On interroge l'API
            api_url = f"https://amazon-scraper-api.omkar.cloud/amazon/product-details?asin={asin}&country_code=FR"
            headers = {
                "API-Key": "ok_a673797e0f92c370969bb5033664a509",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
            
            log(f"🔗 Connexion à OmkarCloud API pour l'ASIN {asin}...")
            response = requests.get(api_url, headers=headers, timeout=60)
            log(f"📥 Réponse reçue (Code: {response.status_code})")
            response.raise_for_status()
            omkar_data = response.json()
            
            # 3. Formatage pour simuler l'ancienne structure
            images = []
            if omkar_data.get("main_image_url"):
                images.append(omkar_data.get("main_image_url"))
            if omkar_data.get("additional_image_urls"):
                images.extend(omkar_data.get("additional_image_urls"))
                
            attributes = {}
            if isinstance(omkar_data.get("technical_details"), dict):
                attributes.update(omkar_data.get("technical_details"))
            if isinstance(omkar_data.get("product_details"), dict):
                attributes.update(omkar_data.get("product_details"))
                
            result = {
                "status": "success",
                "data": {
                    "success": True,
                    "title": omkar_data.get("product_name", ""),
                    "price": str(omkar_data.get("current_price", "")),
                    "images": images,
                    "features": omkar_data.get("key_features", []),
                    "attributes": attributes,
                    "url": omkar_data.get("link", url)
                }
            }
        else:
            with open(script_path, "r", encoding="utf-8") as f:
                script_content = f.read()

            # Pour Alibaba, on remplace la ligne const URL = "..."
            script_body = re.sub(r'const URL = ".*?";', f'const URL = "{url}";', script_content, count=1)

            log(f"📡 Envoi au service headless local (Port 3005) via {script_name}...")
            
            endpoint = "http://127.0.0.1:3005/run"
            payload = {
                "script": script_body,
                "timeout": 120000 # Augmenté à 120s
            }

            log(f"🔗 Connexion à {endpoint}...")
            response = requests.post(
                endpoint, 
                json=payload, 
                timeout=150,
                proxies={"http": None, "https": None} # Désactive les proxys système qui pourraient bloquer le local
            )
            log(f"📥 Réponse reçue (Code: {response.status_code})")
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
