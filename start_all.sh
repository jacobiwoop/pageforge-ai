#!/bin/bash

# Script de démarrage unifié pour le projet UI-RAG
# Utilise des chemins absolus pour plus de robustesse

PROJECT_ROOT="/home/aiko/Documents/agent-cli"
echo "🚀 Démarrage global depuis : $PROJECT_ROOT"

# Fonction de nettoyage
cleanup() {
    echo -e "\n🛑 Arrêt de tous les services..."
    # On tue par port pour être sûr de tout nettoyer
    fuser -k 3000/tcp 3005/tcp 8000/tcp 2>/dev/null || true
    exit
}
trap cleanup SIGINT SIGTERM

# 1. Nettoyage initial
echo "🧹 Nettoyage des ports (3000, 3005, 8000)..."
fuser -k 3000/tcp 3005/tcp 8000/tcp 2>/dev/null || true
sleep 1

# 2. Lancement du Scraper (Port 3005)
echo "📡 [1/3] Lancement du Scraper..."
(
    cd "$PROJECT_ROOT/headless-service"
    npm start > "$PROJECT_ROOT/scraper.log" 2>&1
) &
echo "   ✅ Scraper lancé en arrière-plan."

# 3. Lancement du Backend (Port 8000)
echo "⚙️ [2/3] Lancement du Backend (FastAPI)..."
(
    cd "$PROJECT_ROOT/ui-agent/ui-rag"
    python3 app.py > "$PROJECT_ROOT/backend.log" 2>&1
) &
echo "   ✅ Backend lancé en arrière-plan."

# 4. Lancement du Frontend (Port 3000)
echo "💻 [3/3] Lancement du Frontend (Vite)..."
(
    cd "$PROJECT_ROOT"
    npm run dev > "$PROJECT_ROOT/frontend.log" 2>&1
) &
echo "   ✅ Frontend lancé en arrière-plan."

echo ""
echo "------------------------------------------------"
echo "🌐 Frontend : http://localhost:3000"
echo "⚙️  Backend  : http://localhost:8000"
echo "📡 Scraper  : http://localhost:3005"
echo "------------------------------------------------"
echo "💡 Logs : scraper.log, backend.log, frontend.log"
echo "⌨️  Ctrl+C pour tout arrêter."

# On attend que les processus se terminent (ou le Ctrl+C)
wait
