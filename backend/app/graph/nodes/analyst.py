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
to this question in clear, plain, everyday language — as if explaining it to a 
smart friend who isn't an expert in this topic. Write 2-3 full paragraphs (6-10 
sentences total), covering multiple angles or details found in the evidence rather 
than just one surface-level point. Avoid unnecessary jargon, but don't oversimplify 
to the point of losing real information. Cite sources inline using [id] markers 
matching the evidence, placed naturally at the end of the relevant sentence. Draw 
connections between different sources where relevant. Only mention insufficient 
evidence if the evidence is truly empty or completely irrelevant to the question.

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