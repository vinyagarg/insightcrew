import os, json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def critic_node(state):
    verified_sections = []
    for section in state["draft_sections"]:
        evidence_text = "\n".join(
            f"[{s['id']}] {s['snippet']}" for s in section["sources"]
        )
        prompt = f"""Check if every claim in this text is supported by the 
evidence. Respond ONLY with JSON: {{"confidence": "high"|"medium"|"low", 
"needs_revision": true|false}}

Text: {section['content']}

Evidence:
{evidence_text}"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
        )
        try:
            result = json.loads(response.choices[0].message.content.strip())
        except json.JSONDecodeError:
            result = {"confidence": "medium", "needs_revision": False}

        section["confidence"] = result.get("confidence", "medium")
        verified_sections.append(section)

    return {**state, "final_sections": verified_sections,
            "revision_count": state.get("revision_count", 0) + 1}