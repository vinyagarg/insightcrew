import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyst_node(state):
    draft_sections = []
    for q, sources in state["evidence"].items():
        evidence_text = "\n".join(
            f"[{s['id']}] {s['title']}: {s['snippet']}" for s in sources
        )
        prompt = f"""Using the evidence below, write a thorough, accurate, and 
well-structured answer to this question in clear, plain, everyday language.

- Open with a direct, clear answer to the question in the first 1-2 sentences
- Follow with supporting detail across 1-2 more paragraphs
- Only state what the evidence actually supports
- Cite sources inline using [id] markers matching the evidence

Question: {q}

Evidence:
{evidence_text}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        content = response.choices[0].message.content.strip()

        draft_sections.append({
            "heading": q,
            "content": content,
            "confidence": "medium",
            "sources": sources,
        })

    return {**state, "draft_sections": draft_sections}