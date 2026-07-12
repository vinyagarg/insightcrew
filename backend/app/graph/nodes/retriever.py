import os
import concurrent.futures
from tavily import TavilyClient

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def search_one(q, index):
    try:
        results = client.search(q, max_results=5, search_depth="advanced")
        raw_results = results.get("results", [])
        filtered = [r for r in raw_results if r.get("score", 0) >= 0.3]
        sources = [
            {
                "id": index * 10 + j + 1,
                "title": r.get("title", "Untitled"),
                "url": r.get("url", ""),
                "snippet": r.get("content", "")[:300],
            }
            for j, r in enumerate(filtered)
        ]
    except Exception:
        sources = []
    return q, sources

def retriever_node(state):
    evidence = {}
    questions = state["sub_questions"]

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(search_one, q, i) for i, q in enumerate(questions)]
        for future in concurrent.futures.as_completed(futures):
            q, sources = future.result()
            evidence[q] = sources

    return {**state, "evidence": evidence}