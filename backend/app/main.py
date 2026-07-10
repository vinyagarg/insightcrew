from dotenv import load_dotenv
load_dotenv()
import uuid
from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from app.graph.pipeline import build_pipeline
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://insightcrew-woad.vercel.app",
        "http://localhost:3000",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

pipeline = build_pipeline()
sessions = {}

class ResearchRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500)

@app.post("/api/research")
@limiter.limit("5/minute")
def start_research(request: Request, req: ResearchRequest):
    session_id = str(uuid.uuid4())
    sessions[session_id] = {"status": "running", "result": None}

    final_state = pipeline.invoke({
        "query": req.query,
        "sub_questions": [],
        "evidence": {},
        "draft_sections": [],
        "revision_count": 0,
        "final_sections": [],
    })

    sessions[session_id] = {"status": "done", "result": final_state}
    return {"session_id": session_id}

@app.get("/api/research/{session_id}/status")
def get_status(session_id: str):
    session = sessions.get(session_id)
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
def get_report(session_id: str):
    session = sessions.get(session_id)
    if not session or session["status"] != "done":
        return {"sections": []}
    return {"sections": session["result"]["final_sections"]}