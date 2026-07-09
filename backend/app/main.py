from dotenv import load_dotenv
load_dotenv()
import uuid
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.graph.pipeline import build_pipeline

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = build_pipeline()
sessions = {}

class ResearchRequest(BaseModel):
    query: str

@app.post("/api/research")
def start_research(req: ResearchRequest):
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