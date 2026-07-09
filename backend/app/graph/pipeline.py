from langgraph.graph import StateGraph, END
from app.graph.state import GraphState
from app.graph.nodes.planner import planner_node
from app.graph.nodes.retriever import retriever_node
from app.graph.nodes.analyst import analyst_node
from app.graph.nodes.critic import critic_node

def should_revise(state):
    low_conf = [s for s in state["final_sections"] if s["confidence"] == "low"]
    if low_conf and state.get("revision_count", 0) < 2:
        return "analyst"
    return END

def build_pipeline():
    graph = StateGraph(GraphState)
    graph.add_node("planner", planner_node)
    graph.add_node("retriever", retriever_node)
    graph.add_node("analyst", analyst_node)
    graph.add_node("critic", critic_node)

    graph.set_entry_point("planner")
    graph.add_edge("planner", "retriever")
    graph.add_edge("retriever", "analyst")
    graph.add_edge("analyst", "critic")
    graph.add_conditional_edges("critic", should_revise, {
        "analyst": "analyst",
        END: END,
    })

    return graph.compile()