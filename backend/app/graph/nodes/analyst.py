import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyst_node(state):
    draft_sections = []
    for q, sources in state["evidence"].items():
        evidence_text = "\n".join(
            f"[{s['id']}] {s['title']}: {s['snippet']}" for s in sources
        )
        prompt = f"""Using ONLY the evidence below, write a short paragraph 
answering this question. Cite sources inline using [id] markers matching the 
evidence. If evidence is insufficient, say so explicitly.

Question: {q}

Evidence:
{evidence_text}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        content = response.choices[0].message.content.strip()

        draft_sections.append({
            "heading": q,
            "content": content,
            "confidence": "medium",
            "sources": sources,
        })

    return {**state, "draft_sections": draft_sections}