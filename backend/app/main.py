from dotenv import load_dotenv
load_dotenv()

import os
import uuid
import sqlite3
import json as json_module
from fastapi import FastAPI, Request, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.graph.pipeline import build_pipeline

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://insightcrew-woad.vercel.app",
        "http://localhost:3000",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

API_SECRET_KEY = os.getenv("API_SECRET_KEY")

def verify_api_key(x_api_key: str = Header(None)):
    if not API_SECRET_KEY or x_api_key != API_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

pipeline = build_pipeline()

DB_PATH = "sessions.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY,
            status TEXT,
            result TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

def save_session(session_id, status, result=None):
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT OR REPLACE INTO sessions (session_id, status, result) VALUES (?, ?, ?)",
        (session_id, status, json_module.dumps(result) if result else None)
    )
    conn.commit()
    conn.close()

def get_session(session_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.execute(
        "SELECT status, result FROM sessions WHERE session_id = ?", (session_id,)
    )
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    status, result = row
    return {"status": status, "result": json_module.loads(result) if result else None}

class ResearchRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500)

@app.post("/api/research")
@limiter.limit("5/minute")
def start_research(request: Request, req: ResearchRequest, _: None = Depends(verify_api_key)):
    session_id = str(uuid.uuid4())
    save_session(session_id, "running")

    final_state = pipeline.invoke({
        "query": req.query,
        "sub_questions": [],
        "evidence": {},
        "draft_sections": [],
        "revision_count": 0,
        "final_sections": [],
    })

    save_session(session_id, "done", final_state)
    return {"session_id": session_id}

@app.get("/api/research/{session_id}/status")
def get_status(session_id: str, _: None = Depends(verify_api_key)):
    session = get_session(session_id)
    if not session:
        return {"status": "error", "stages": []}

    stages = [
        {"name": "planner", "status": "done", "output": session["result"].get("sub_questions")},
        {"name": "retriever", "status": "done", "output": session["result"].get("evidence")},
        {"name": "analyst", "status": "done", "output": session["result"].get("draft_sections")},
        {"name": "critic", "status": "done", "output": session["result"].get("final_sections")},
    ]
    return {"status": session["status"], "stages": stages}

@app.get("/api/research/{session_id}/report")
def get_report(session_id: str, _: None = Depends(verify_api_key)):
    session = get_session(session_id)
    if not session or session["status"] != "done":
        return {"sections": []}
    return {"sections": session["result"]["final_sections"]}