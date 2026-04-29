import os
import subprocess
import sys
import time
import signal

# Définition dynamique de la racine du projet
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

VENV_PATH = os.path.join(PROJECT_ROOT, "ui-agent", ".venv")
PYTHON_EXEC = os.path.join(VENV_PATH, "bin", "python")

# Fallback si le .venv est ailleurs sur le serveur (ex: racine)
if not os.path.exists(PYTHON_EXEC):
    PYTHON_EXEC = os.path.join(PROJECT_ROOT, ".venv", "bin", "python")
    if not os.path.exists(PYTHON_EXEC):
        PYTHON_EXEC = sys.executable  # Fallback global

def log(msg, color=""):
    colors = {
        "green": "\033[92m",
        "yellow": "\033[93m",
        "red": "\033[91m",
        "blue": "\033[94m",
        "cyan": "\033[96m",
        "reset": "\033[0m"
    }
    c = colors.get(color, "")
    print(f"{c}{msg}{colors['reset']}")

def kill_ports():
    log("🧹 Nettoyage des ports (3000, 3005, 8000)...", "yellow")
    # On ignore les erreurs de fuser s'il n'y a rien à tuer
    subprocess.run("fuser -k 3000/tcp 3005/tcp 8000/tcp", shell=True, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    subprocess.run("pkill -f chrome", shell=True, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)
    time.sleep(1)

def ensure_dependencies(skip=False):
    if skip:
        log("⏭️  Saut de la vérification des dépendances.", "yellow")
        return
    log("⚙️ Vérification des dépendances Backend...", "cyan")
    pip_exec = PYTHON_EXEC.replace("python", "pip")
    req_file = os.path.join(PROJECT_ROOT, "ui-agent", "requirements.txt")
    
    if os.path.exists(req_file):
        try:
            # On affiche le flux pour que l'utilisateur voit ce qu'il se passe
            subprocess.run([pip_exec, "install", "-r", req_file], check=True)
            subprocess.run([pip_exec, "install", "python-jose[cryptography]", "passlib[bcrypt]"], check=True)
            log("✅ Dépendances Python prêtes.", "green")
        except Exception as e:
            log(f"⚠️ Erreur lors de l'installation des dépendances Python : {e}", "red")
    
def start_processes():
    processes = []
    
    # 1. Scraper (Node.js) -> Port Fixe 3005
    log("📡 [1/3] Lancement du Scraper (Port 3005)...", "blue")
    scraper_cwd = os.path.join(PROJECT_ROOT, "headless-service")
    scraper_env = os.environ.copy()
    scraper_env["PORT"] = "3005"
    
    scraper_log = open(os.path.join(PROJECT_ROOT, "scraper.log"), "w")
    p_scraper = subprocess.Popen(
        ["npm", "start"],
        cwd=scraper_cwd,
        env=scraper_env,
        stdout=scraper_log,
        stderr=subprocess.STDOUT
    )
    processes.append(("Scraper", p_scraper, scraper_log))
    
    # 2. Backend (FastAPI) -> Port 8000
    log("⚙️ [2/3] Lancement du Backend (FastAPI)...", "blue")
    backend_cwd = os.path.join(PROJECT_ROOT, "ui-agent", "ui-rag")
    backend_log = open(os.path.join(PROJECT_ROOT, "backend.log"), "w")
    p_backend = subprocess.Popen(
        [PYTHON_EXEC, "app.py"],
        cwd=backend_cwd,
        stdout=backend_log,
        stderr=subprocess.STDOUT
    )
    processes.append(("Backend", p_backend, backend_log))
    
    # 3. Frontend (React/Vite) -> Port 3000
    log("💻 [3/3] Lancement du Frontend (Vite)...", "blue")
    frontend_cwd = os.path.join(PROJECT_ROOT, "frontend")
    frontend_log = open(os.path.join(PROJECT_ROOT, "frontend.log"), "w")
    p_frontend = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_cwd,
        stdout=frontend_log,
        stderr=subprocess.STDOUT
    )
    processes.append(("Frontend", p_frontend, frontend_log))
    
    return processes

def main():
    skip_deps = "--skip-deps" in sys.argv
    log(f"🚀 Démarrage global de l'Orchestrateur PAGEFORGE depuis : {PROJECT_ROOT}\n", "green")
    
    kill_ports()
    ensure_dependencies(skip=skip_deps)
    
    procs = start_processes()
    
    log("\n" + "-"*50)
    log("🌐 Frontend : http://localhost:3000", "cyan")
    log("⚙️  Backend  : http://localhost:8000", "cyan")
    log("📡 Scraper  : http://localhost:3005", "cyan")
    log("-"*50)
    log("💡 Logs : scraper.log, backend.log, frontend.log")
    log("⌨️  Appuyez sur Ctrl+C pour TOUT ARRÊTER proprement.", "yellow")
    
    def signal_handler(sig, frame):
        log("\n🛑 Arrêt en cours de tous les services...", "red")
        for name, p, f in procs:
            p.terminate()
            f.close()
            log(f"  - {name} arrêté.")
        kill_ports()
        sys.exit(0)
        
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    # Maintien du script principal en vie
    for _, p, _ in procs:
        p.wait()

if __name__ == "__main__":
    main()
