import os
import uuid
import json
import logging
import asyncio
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db, init_db
import models
import auth
import subprocess
from orchestrator import run_full_pipeline

OPENCODE_AUTH_DIR = os.path.expanduser("~/.local/share/opencode")
OPENCODE_AUTH_PATH = os.path.join(OPENCODE_AUTH_DIR, "auth.json")

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

# Initialize database
init_db()

# Mount static files
app.mount("/exports", StaticFiles(directory=EXPORT_DIR), name="exports")
app.mount("/sessions", StaticFiles(directory=SESSION_DIR), name="sessions")

class GenerationRequest(BaseModel):
    url: str
    user_id: str = "default_user"

class GenerationStatus(BaseModel):
    session_id: str
    status: str
    progress: int
    logs: List[str]
    result_url: Optional[str] = None
    product_name: Optional[str] = None

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class OrderCreate(BaseModel):
    product_name: str
    amount: float

# ── AUTH ROUTES ──────────────────────────────────────────────────────────────

@app.post("/api/auth/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = auth.get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "success", "message": "User created"}

@app.post("/api/auth/login")
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    
    from fastapi.responses import JSONResponse
    response = JSONResponse(content={"status": "success", "user": {"email": user.email, "name": user.full_name}})
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        max_age=auth.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False # Set to True in production
    )
    return response

@app.get("/api/auth/me")
async def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return {"email": current_user.email, "name": current_user.full_name}

@app.post("/api/auth/logout")
async def logout():
    from fastapi.responses import JSONResponse
    response = JSONResponse(content={"status": "success"})
    response.delete_cookie("access_token")
    return response

# ── CREDENTIALS ROUTES ───────────────────────────────────────────────────────

class OpenCodeLoginRequest(BaseModel):
    key: str

@app.get("/api/auth/status")
async def get_auth_status():
    status = {
        "ollama": {"signed_in": False, "user": None},
        "opencode": {"signed_in": False, "provider": None}
    }
    
    # Check OpenCode
    if os.path.exists(OPENCODE_AUTH_PATH):
        try:
            with open(OPENCODE_AUTH_PATH, 'r') as f:
                data = json.load(f)
                if "ollama-cloud" in data:
                    status["opencode"] = {"signed_in": True, "provider": "Ollama Cloud"}
        except: pass
        
    # Check Ollama (Mockish logic or simple check)
    try:
        # If signed in, 'ollama list' or similar might work without error, 
        # but let's try a simple heuristic or just provide the signin flow.
        # For now, we'll rely on the user triggering the signin.
        status["ollama"]["signed_in"] = False # Default until we find a better check
    except: pass
    
    return status

@app.post("/api/auth/ollama/signin")
async def ollama_signin():
    try:
        # Run ollama signin and capture URL
        process = subprocess.Popen(["ollama", "signin"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        # We need to wait a bit to see if it prints the URL
        await asyncio.sleep(2)
        # Note: ollama signin might stay open. We just want the URL.
        # But wait, we can't easily capture it if it expects a browser.
        # Let's try to get it from stderr/stdout
        output, error = process.communicate(timeout=5)
        text = output + error
        import re
        url_match = re.search(r'https://ollama\.com/connect\?name=.*', text)
        if url_match:
            return {"url": url_match.group(0).strip()}
        return {"message": "Already signed in or URL not found", "output": text}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/auth/ollama/signout")
async def ollama_signout():
    try:
        subprocess.run(["ollama", "signout"], check=True)
        return {"status": "success"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/auth/opencode/login")
async def opencode_login(req: OpenCodeLoginRequest):
    try:
        os.makedirs(OPENCODE_AUTH_DIR, exist_ok=True)
        auth_data = {
            "ollama-cloud": {
                "type": "api",
                "key": req.key
            }
        }
        with open(OPENCODE_AUTH_PATH, 'w') as f:
            json.dump(auth_data, f, indent=2)
        return {"status": "success", "message": "Credentials updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── STATS ROUTES ─────────────────────────────────────────────────────────────

@app.get("/api/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    total_generations = db.query(models.GenerationSession).count()
    total_revenue = db.query(func.sum(models.Order.amount)).filter(models.Order.status == "PAID").scalar() or 0.0
    total_orders = db.query(models.Order).count()
    
    return {
        "total_generations": total_generations,
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "ai_efficiency": 94
    }

# ── ORDER ROUTES ─────────────────────────────────────────────────────────────

@app.post("/api/orders/create")
async def create_order(
    order_data: OrderCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Logic to initialize FedaPay would go here
    # For now, we just save the order in 'pending' state
    new_order = models.Order(
        user_id=current_user.id,
        product_name=order_data.product_name,
        amount=order_data.amount,
        status="pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    # Mock FedaPay URL for demonstration
    checkout_url = f"https://checkout.fedapay.com/direct-pay/{uuid.uuid4()}"
    
    return {
        "status": "success", 
        "order_id": new_order.id, 
        "checkout_url": checkout_url
    }

@app.get("/api/orders/list")
async def list_orders(db: Session = Depends(get_db)):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    result = []
    for o in orders:
        user = db.query(models.User).filter(models.User.id == o.user_id).first()
        client_name = user.full_name if user else "Unknown Entity"
        
        result.append({
            "id": f"#ORD-{o.id}",
            "client": client_name,
            "product": o.product_name,
            "amount": f"${o.amount:,.2f}",
            "date": o.created_at.strftime('%Y-%m-%d'),
            "time": o.created_at.strftime('%H:%M:%S'),
            "status": o.status.upper()
        })
    return result

# ── GENERATION ROUTES ────────────────────────────────────────────────────────

@app.post("/api/generate")
async def start_generation(request: GenerationRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    session_id = str(uuid.uuid4())
    logger.info(f"Starting generation for session {session_id} - URL: {request.url}")
    
    # Initialize session state in DB
    new_session = models.GenerationSession(
        id=session_id,
        url=request.url,
        status="starting",
        progress=0,
        logs=json.dumps(["Initialisation du pipeline multi-agents..."])
    )
    db.add(new_session)
    db.commit()
    
    # Launch in background
    background_tasks.add_task(orchestrate_session, session_id, request.url)
    
    return {"session_id": session_id}

@app.get("/api/status/{session_id}")
async def get_status(session_id: str, db: Session = Depends(get_db)):
    """Return current status of a generation session."""
    session = db.query(models.GenerationSession).filter(models.GenerationSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return GenerationStatus(
        session_id=session.id,
        status=session.status,
        progress=session.progress,
        logs=json.loads(session.logs),
        result_url=session.result_url,
        product_name=session.product_name,
    )

@app.get("/api/session/{session_id}/files")
async def list_session_files(session_id: str):
    """List all files in a specific session directory."""
    path = os.path.join(SESSION_DIR, session_id)
    if not os.path.exists(path):
        return [] # Return empty list if folder not yet created
    
    files = []
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        if os.path.isfile(file_path):
            stats = os.stat(file_path)
            files.append({
                "name": filename,
                "size": stats.st_size,
                "url": f"/sessions/{session_id}/{filename}",
                "ext": filename.split('.')[-1] if '.' in filename else ''
            })
    return sorted(files, key=lambda x: x["name"])

@app.get("/api/products")
async def list_products(db: Session = Depends(get_db)):
    """List all successfully generated products from the DB."""
    sessions = db.query(models.GenerationSession).filter(
        models.GenerationSession.status == "completed"
    ).order_by(models.GenerationSession.created_at.desc()).all()
    
    products = []
    for s in sessions:
        products.append({
            "id": s.id,
            "name": s.product_name or "Project Sans Nom",
            "url": s.result_url,
            "date": s.created_at.strftime('%Y.%m.%d'),
            "time": s.created_at.strftime('%H:%M:%S'),
            "status": "LIVE"
        })
    return products

from database import SessionLocal

async def orchestrate_session(session_id: str, url: str):
    """Bridge between FastAPI and the existing orchestrator logic."""
    product_name = None  # Initialisation pour la closure de update_db
    try:
        def update_db(status=None, progress=None, add_log=None, result_url=None, opencode_session_id=None, product_name=None):
            db = SessionLocal()
            try:
                sess = db.query(models.GenerationSession).filter(models.GenerationSession.id == session_id).first()
                if sess:
                    if status is not None:
                        sess.status = status
                    if progress is not None:
                        sess.progress = progress
                    if result_url is not None:
                        sess.result_url = result_url
                    if product_name is not None:
                        sess.product_name = product_name
                    if opencode_session_id is not None:
                        sess.opencode_session_id = opencode_session_id
                    if add_log is not None:
                        current_logs = json.loads(sess.logs)
                        current_logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] {add_log}")
                        sess.logs = json.dumps(current_logs)
                    db.commit()
            finally:
                db.close()

        def log_to_session(msg):
            update_db(add_log=msg)
            logger.info(f"Session {session_id}: {msg}")

        # Start the pipeline
        log_to_session("Lancement du pipeline multi-agents...")
        update_db(status="processing", progress=5)
        
        # Build a progress callback that also updates the session
        def progress_callback(pct: int):
            update_db(progress=pct)

        # Run the pipeline (blocking call in thread to avoid blocking event loop)
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None, 
            run_full_pipeline, 
            url, 
            "qwen3.5:cloud", 
            session_id,
            log_to_session,  # log callback
            progress_callback  # progress callback
        )

        opencode_session_id = None
        product_name = None
        if isinstance(result, tuple) and len(result) == 3:
            result_path, opencode_session_id, product_name = result
        else:
            result_path = result

        if result_path:
            if result_path.startswith("http"):
                update_db(status="completed", progress=100, result_url=result_path, opencode_session_id=opencode_session_id, product_name=product_name)
                log_to_session("Génération et déploiement Vercel réussis !")
            elif os.path.exists(result_path):
                update_db(status="completed", progress=100, result_url=f"/{result_path}", opencode_session_id=opencode_session_id, product_name=product_name)
                log_to_session("Génération réussie !")
            else:
                raise Exception("L'orchestrateur n'a pas produit de fichier final valide.")
        else:
            raise Exception("L'orchestrateur n'a pas produit de fichier final.")
            
    except Exception as e:
        logger.error(f"Error in session {session_id}: {str(e)}")
        update_db(status="failed", add_log=f"ERREUR : {str(e)}")

class RefactorRequest(BaseModel):
    session_id: str
    prompt: str

@app.post("/api/refactor")
async def refactor_session(request: RefactorRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    sess = db.query(models.GenerationSession).filter(models.GenerationSession.id == request.session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
    if not sess.opencode_session_id:
        raise HTTPException(status_code=400, detail="Cette session ne supporte pas le refactoring continu (Pas d'ID OpenCode).")

    background_tasks.add_task(orchestrate_refactor, request.session_id, request.prompt, sess.opencode_session_id)
    return {"status": "started"}

async def orchestrate_refactor(session_id: str, prompt: str, opencode_session_id: str):
    import subprocess
    try:
        def update_db(status=None, add_log=None):
            db = SessionLocal()
            try:
                sess = db.query(models.GenerationSession).filter(models.GenerationSession.id == session_id).first()
                if sess:
                    if status is not None:
                        sess.status = status
                    if add_log is not None:
                        current_logs = json.loads(sess.logs) if sess.logs else []
                        current_logs.append(f"[{datetime.now().strftime('%H:%M:%S')}] {add_log}")
                        sess.logs = json.dumps(current_logs)
                    db.commit()
            finally:
                db.close()

        update_db(status="processing", add_log=f"🧠 Début du refactoring AI: '{prompt}'")
        
        base_dir = os.path.join(SESSION_DIR, session_id)
        
        # 1. Call OpenCode
        cmd = [
            "opencode", "run",
            "--model", "ollama-cloud/qwen3-coder-next",
            "--session", opencode_session_id,
            "--dangerously-skip-permissions",
            prompt
        ]
        
        env = os.environ.copy()
        home = os.path.expanduser("~")
        env["PATH"] = f"{home}/.opencode/bin:{home}/.bun/bin:{env.get('PATH', '')}"

        update_db(add_log="   ⚙️ Exécution de la modification par l'IA...")
        result = subprocess.run(cmd, env=env, capture_output=True, text=True, cwd=base_dir, timeout=600)
        
        if result.returncode != 0:
            update_db(status="completed", add_log=f"❌ Erreur IA: {result.stderr or result.stdout}")
            return
            
        # Update local completion
        update_db(status="completed", add_log="   ✅ Modification locale réussie.")
            
    except Exception as e:
        logger.error(f"Error in refactor {session_id}: {str(e)}")
        update_db(status="completed", add_log=f"❌ ERREUR Refactor : {str(e)}")

class PublishRequest(BaseModel):
    session_id: str

@app.post("/api/publish")
async def publish_session(request: PublishRequest, db: Session = Depends(get_db)):
    sess = db.query(models.GenerationSession).filter(models.GenerationSession.id == request.session_id).first()
    if not sess:
        raise HTTPException(status_code=404, detail="Session not found")
        
    vercel_token = os.getenv("VERCEL_TOKEN")
    if not vercel_token:
        raise HTTPException(status_code=500, detail="VERCEL_TOKEN not configured")
        
    base_dir = os.path.join(SESSION_DIR, request.session_id)
    if not os.path.exists(base_dir):
        raise HTTPException(status_code=404, detail="Session files not found")
        
    try:
        from vercel_deployer import deploy_to_vercel
        live_url = deploy_to_vercel(base_dir, vercel_token)
        
        if live_url:
            sess.result_url = live_url
            db.commit()
            return {"status": "success", "url": live_url}
        else:
            raise HTTPException(status_code=500, detail="Vercel deployment failed")
    except Exception as e:
        logger.error(f"Error deploying to Vercel: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ── FRONTEND DEPLOYMENT (RENDER) ──────────────────────────────────────────────
from fastapi.responses import FileResponse, JSONResponse

dist_path = os.path.join(os.path.dirname(__file__), "dist")

@app.exception_handler(404)
async def custom_404_handler(request, exc):
    index_file = os.path.join(dist_path, "index.html")
    # Serve index.html for SPA routes, but keep 404s for API
    if not request.url.path.startswith("/api/") and os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse(status_code=404, content={"detail": "Not Found"})

# Mount static files ONLY if the dist folder exists (e.g. built via Docker)
if os.path.exists(dist_path):
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="spa")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
