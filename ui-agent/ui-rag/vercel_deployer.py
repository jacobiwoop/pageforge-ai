import os
import shutil
import subprocess
import logging
import re

def deploy_to_vercel(session_dir: str, vercel_token: str) -> str:
    """Deploy the given directory to Vercel and return the live URL."""
    try:
        source_html = os.path.join(session_dir, "final_page.html")
        dest_html = os.path.join(session_dir, "index.html")
        
        if os.path.exists(source_html):
            shutil.copy(source_html, dest_html)
        else:
            return None

        project_name = f"pageforge-{os.path.basename(session_dir)}"
        project_name = project_name.lower().replace("_", "-")

        cmd = [
            "npx", "vercel", "--prod", "--yes",
            "--token", vercel_token,
            "--name", project_name
        ]

        result = subprocess.run(cmd, cwd=session_dir, capture_output=True, text=True)

        output = result.stdout + "\n" + result.stderr
        
        url_aliased = None
        url_prod = None
        for line in output.split('\n'):
            line = line.strip()
            # Chercher explicitement un pattern URL Vercel
            match = re.search(r'(https://[a-zA-Z0-9-]+\.vercel\.app)', line)
            if match:
                if "Aliased:" in line:
                    url_aliased = match.group(1)
                elif "Production:" in line:
                    url_prod = match.group(1)
                elif not url_prod: # Fallback pour les vieilles versions du CLI
                    url_prod = match.group(1)
                    
        # On valide toujours l'URL finale (publique) en priorité, pour contourner Vercel Authentication
        if url_aliased:
            return url_aliased
        if url_prod:
            return url_prod
        
        logging.error(f"Erreur Vercel. L'URL n'a pas pu être trouvée. Output: {output}")
        return None

    except Exception as e:
        logging.error(f"Exception Vercel Deployer: {e}")
        return None
