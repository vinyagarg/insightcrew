from duckduckgo_search import DDGS

def retriever_node(state):
    evidence = {}
    with DDGS() as ddgs:
        for i, q in enumerate(state["sub_questions"]):
            results = list(ddgs.text(q, max_results=3))
            sources = [
                {
                    "id": i * 10 + j + 1,
                    "title": r.get("title", "Untitled"),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", "")[:300],
                }
                for j, r in enumerate(results)
            ]
            evidence[q] = sources
    return {**state, "evidence": evidence}