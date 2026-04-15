import os
import uuid
import json
import logging
import asyncio
from typing import List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
from datetime import datetime

# Import orchestrator logic
from orchestrator import run_full_pipeline

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Raw Logic AI - Orchestrator")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow all. Change this for prod.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles

# Constants
EXPORT_DIR = "exports"
SESSION_DIR = "sessions"

# Create directories if they don't exist
os.makedirs(EXPORT_DIR, exist_ok=True)
os.makedirs(SESSION_DIR, exist_ok=True)

# Mount static files
app.mount("/exports", StaticFiles(directory=EXPORT_DIR), name="exports")
app.mount("/sessions", StaticFiles(directory=SESSION_DIR), name="sessions")

# Active sessions memory (for real-time updates)
active_sessions = {}

class GenerationRequest(BaseModel):
    url: str
    user_id: str = "default_user"

class GenerationStatus(BaseModel):
    session_id: str
    status: str
    progress: int
    logs: List[str]
    result_url: Optional[str] = None

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "online", "system": "Raw Logic AI Orchestrator"}

@app.post("/api/generate")
async def start_generation(request: GenerationRequest, background_tasks: BackgroundTasks):
    session_id = str(uuid.uuid4())
    logger.info(f"Starting generation for session {session_id} - URL: {request.url}")
    
    # Initialize session state
    active_sessions[session_id] = {
        "status": "starting",
        "progress": 0,
        "logs": ["Initialisation du pipeline multi-agents..."],
        "url": request.url
    }
    
    # Launch in background
    background_tasks.add_task(orchestrate_session, session_id, request.url)
    
    return {"session_id": session_id}

@app.get("/api/status/{session_id}")
async def get_status(session_id: str):
    """Return current status of a generation session."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    session = active_sessions[session_id]
    return GenerationStatus(
        session_id=session_id,
        status=session.get("status", "unknown"),
        progress=session.get("progress", 0),
        logs=session.get("logs", []),
        result_url=session.get("result_url", None),
    )

@app.get("/api/products")
async def list_products():
    """List all generated products in the exports directory."""
    products = []
    if os.path.exists(EXPORT_DIR):
        for filename in os.listdir(EXPORT_DIR):
            if filename.endswith(".html"):
                path = os.path.join(EXPORT_DIR, filename)
                stats = os.stat(path)
                products.append({
                    "id": filename.split('_')[-1].split('.')[0] if '_' in filename else filename,
                    "name": filename.replace('.html', '').replace('_', ' ').capitalize(),
                    "filename": filename,
                    "url": f"/exports/{filename}",
                    "date": datetime.fromtimestamp(stats.st_mtime).strftime('%Y.%m.%d'),
                    "time": datetime.fromtimestamp(stats.st_mtime).strftime('%H:%M:%S'),
                    "status": "LIVE"
                })
    return sorted(products, key=lambda x: x["date"] + x["time"], reverse=True)

async def orchestrate_session(session_id: str, url: str):
    """Bridge between FastAPI and the existing orchestrator logic."""
    try:
        def log_to_session(msg):
            active_sessions[session_id]["logs"].append(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")
            logger.info(f"Session {session_id}: {msg}")

        # Start the pipeline
        log_to_session("Lancement du pipeline multi-agents...")
        active_sessions[session_id]["status"] = "processing"
        active_sessions[session_id]["progress"] = 5
        
        # Build a progress callback that also updates the session
        def progress_callback(pct: int):
            active_sessions[session_id]["progress"] = pct

        # Run the pipeline (blocking call in thread to avoid blocking event loop)
        loop = asyncio.get_event_loop()
        result_path = await loop.run_in_executor(
            None, 
            run_full_pipeline, 
            url, 
            "qwen3.5:cloud", 
            session_id,
            log_to_session,  # log callback
            progress_callback  # progress callback
        )

        if result_path and os.path.exists(result_path):
            active_sessions[session_id]["status"] = "completed"
            active_sessions[session_id]["progress"] = 100
            active_sessions[session_id]["result_url"] = f"/{result_path}"
            log_to_session("Génération réussie !")
        else:
            raise Exception("L'orchestrateur n'a pas produit de fichier final.")
            
    except Exception as e:
        logger.error(f"Error in session {session_id}: {str(e)}")
        active_sessions[session_id]["status"] = "failed"
        active_sessions[session_id]["logs"].append(f"ERREUR : {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
