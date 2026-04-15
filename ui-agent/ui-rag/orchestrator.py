import json
import os
import argparse
from datetime import datetime

# Import des agents
from scraper_agent import scrape_product
from copywriter import synthesize_product_data
from strategy_agent import generate_marketing_strategies
from planner import plan_page_content
from module_agent import generate_module_content
from coder import generate_html

# Import des fonctions de main.py pour l'automatisation du design
from main import run_pipeline, expand_to_system_prompt

def run_full_pipeline(url: str, model: str = "qwen3.5:cloud", session_id: str = None, log_callback=None, progress_callback=None):
    def log(msg):
        if log_callback:
            log_callback(msg)
        print(msg)

    def set_progress(pct: int):
        if progress_callback:
            progress_callback(pct)

    # Setup session directory
    if session_id:
        base_dir = os.path.join("sessions", session_id)
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_dir = os.path.join("exports", f"run_{timestamp}")
    
    os.makedirs(base_dir, exist_ok=True)
    os.makedirs(os.path.join(base_dir, "exports"), exist_ok=True)
    
    log(f"\n🚀 DÉMARRAGE DE L'ORCHESTRATION POUR : {url}")
    log(f"📂 DOSSIER DE SESSION : {base_dir}")
    set_progress(5)
    
    # Paths for session files
    product_data_path = os.path.join(base_dir, "product_data.json")
    synthesis_path = os.path.join(base_dir, "product_synthesis.json")
    spec_path = os.path.join(base_dir, "style_spec.md")
    strategies_path = os.path.join(base_dir, "marketing_strategies.json")
    plans_path = os.path.join(base_dir, "content_plans.json")

    # 1. SCRAPE
    log(f"\n--- 1. RÉCUPÉRATION DES DONNÉES ---")
    set_progress(10)
    scrape_product(url, output_file=product_data_path, log_callback=log)
    
    if not os.path.exists(product_data_path):
        log("❌ Données produit non trouvées. Arrêt.")
        return

    with open(product_data_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f).get('data', {})
    
    if not raw_data.get('success'):
        log(f"❌ Échec du scraping : {raw_data.get('error')}. Arrêt.")
        return

    # 2. SYNTHÈSE
    log("\n--- 2. SYNTHÈSE PRODUIT ---")
    set_progress(25)
    synthesis = synthesize_product_data(raw_data, model=model)
    with open(synthesis_path, "w", encoding="utf-8") as f:
        json.dump(synthesis, f, indent=2, ensure_ascii=False)

    # 3. GÉNÉRATION AUTOMATIQUE DU DESIGN (Style)
    log("\n--- 3. GÉNÉRATION DU DESIGN SYSTEM (STYLE) ---")
    set_progress(40)
    product_query = synthesis.get('title', 'produit e-commerce')
    design_brief = synthesis.get('design_brief', '')
    log(f"   🎨 Analyse du style pour : {product_query}")
    if design_brief:
        log(f"   📝 Brief Visuel : {design_brief}")
    
    direction, analysis = run_pipeline(product_query, model, as_json=True, verbose=False, design_brief=design_brief)
    
    log("   🏗️  Expansion vers Master Specification...")
    system_prompt = expand_to_system_prompt(direction, analysis, model=model)
    
    with open(spec_path, "w", encoding="utf-8") as f:
        f.write(system_prompt)
    log(f"   ✅ Spec générée : {spec_path}")

    # 4. STRATÉGIES
    log("\n--- 4. DÉFINITION DES STRATÉGIES ---")
    set_progress(55)
    strategies = generate_marketing_strategies(synthesis, model=model)
    with open(strategies_path, "w", encoding="utf-8") as f:
        json.dump(strategies, f, indent=2, ensure_ascii=False)

    # 5. PLANIFICATION
    log("\n--- 5. PLANIFICATION DES MODULES ---")
    set_progress(65)
    plans_data = plan_page_content(synthesis, strategies, model=model)
    with open(plans_path, "w", encoding="utf-8") as f:
        json.dump(plans_data, f, indent=2, ensure_ascii=False)

    # 6. RÉDACTION DES MODULES
    log("\n--- 6. RÉDACTION DES MODULES (DIRECTION 1) ---")
    set_progress(78)
    plans = plans_data.get('plans', [])
    if not plans:
        log("❌ Aucun plan généré. Arrêt.")
        return
        
    first_plan = plans[0]
    final_content = generate_module_content(first_plan, synthesis, model=model)

    # 7. GÉNÉRATION HTML FINAL
    log("\n--- 7. GÉNÉRATION HTML FINAL (FUSION STYLE + CONTENU) ---")
    set_progress(90)
    html_code = generate_html(spec_path, product_query, model, content_data=final_content, cwd=base_dir)
    
    output_filename = f"final_page.html"
    output_path = os.path.join(base_dir, output_filename)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html_code)
    
    global_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    global_output = f"exports/final_page_{session_id or global_timestamp}.html"
    os.makedirs("exports", exist_ok=True)
    with open(global_output, "w", encoding="utf-8") as f:
        f.write(html_code)

    log(f"\n✨ PAGE TERMINÉE !")
    log(f"📍 Session : {output_path}")
    log(f"📍 Global  : {global_output}")
    
    return global_output

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Orchestrateur UI-RAG")
    parser.add_argument("url", help="URL Alibaba du produit")
    parser.add_argument("--model", default="qwen3.5:cloud", help="Modèle à utiliser")
    args = parser.parse_args()

    run_full_pipeline(args.url, args.model)
