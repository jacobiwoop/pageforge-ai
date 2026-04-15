import requests
import re
import json

def scrape_no_js(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
    }
    print(f"📡 Tentative d'extraction sans JS pour : {url}")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        html = response.text
        
        # Extraction du titre
        title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
        title = title_match.group(1).strip() if title_match else "Titre non trouvé"
        
        # Extraction des images (recherche d'URLs d'images typiques d'Alibaba)
        images = list(set(re.findall(r'https://sc\d+\.alicdn\.com/kf/[^"\'>]+\.jpg', html)))
        
        # Filtrer pour ne garder que les grandes images (souvent pas de _\d+x\d+)
        big_images = [img for img in images if not re.search(r'_\d+x\d+', img)]
        
        return {
            "success": True,
            "data": {
                "title": title,
                "images": big_images[:10] if big_images else images[:10],
                "attributes": {"Méthode": "No-JS Failback"},
                "success": True
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    url = "https://www.alibaba.com/product-detail/Top-Quality-Luxury-Sneakers-Latest-Sport_1601737161453.html"
    result = scrape_no_js(url)
    print(json.dumps(result, indent=2))
