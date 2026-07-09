import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyst_node(state):
    draft_sections = []
    for q, sources in state["evidence"].items():
        evidence_text = "\n".join(
            f"[{s['id']}] {s['title']}: {s['snippet']}" for s in sources
        )
        prompt = f"""Using ONLY the evidence below, write a clear, simple answer to this 
question in plain everyday language — as if explaining it to a smart friend who 
isn't an expert in this topic. Avoid jargon where possible, use short sentences, 
and keep it to 3-4 sentences maximum. Cite sources inline using [id] markers 
matching the evidence, placed naturally at the end of the relevant sentence. If 
evidence is insufficient, say so in one plain sentence.

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