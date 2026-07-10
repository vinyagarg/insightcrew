import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyst_node(state):
    draft_sections = []
    for q, sources in state["evidence"].items():
        evidence_text = "\n".join(
            f"[{s['id']}] {s['title']}: {s['snippet']}" for s in sources
        )
        prompt = f"""Using the evidence below, write a thorough, well-developed answer 
to this question in clear, plain, everyday language. Write 2-3 full paragraphs 
(6-10 sentences total) if there is genuinely relevant evidence.

CRITICAL: Before writing, check whether the evidence actually refers to the exact 
subject/entity named in the question (matching name, spelling, and context) — not 
a similarly-named but different person, place, or thing. If the evidence is about 
a different or ambiguous entity (e.g., a different person who happens to share a 
similar name), do NOT present it as if it answers the question. Instead, clearly 
state that no reliable evidence was found about the specific subject asked about, 
and briefly note that search results returned information about differently-named 
or unrelated entities instead.

Only proceed with a full answer if the evidence clearly and specifically matches 
the subject of the question. Cite sources inline using [id] markers matching the 
evidence, placed naturally at the end of the relevant sentence.

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