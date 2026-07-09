import os
from tavily import TavilyClient

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def retriever_node(state):
    evidence = {}
    for i, q in enumerate(state["sub_questions"]):
        try:
            results = client.search(q, max_results=3)
            sources = [
                {
                    "id": i * 10 + j + 1,
                    "title": r.get("title", "Untitled"),
                    "url": r.get("url", ""),
                    "snippet": r.get("content", "")[:300],
                }
                for j, r in enumerate(results.get("results", []))
            ]
        except Exception as e:
            sources = []
        evidence[q] = sources
    return {**state, "evidence": evidence}