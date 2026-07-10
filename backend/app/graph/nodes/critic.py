import os, json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def critic_node(state):
    verified_sections = []
    for section in state["draft_sections"]:
        evidence_text = "\n".join(
            f"[{s['id']}] {s['snippet']}" for s in section["sources"]
        )
        prompt = f"""Evaluate how well this text is supported by the evidence below, 
AND whether the evidence actually refers to the specific subject/entity named in 
the original question (not a different or merely similarly-named person, place, 
or thing).

Rate confidence as "high" only if: (1) the main claims are backed by evidence, AND 
(2) that evidence is clearly about the exact subject asked about.

Rate "low" if the evidence is about a different or ambiguous entity than what was 
asked, even if the text is well-written and well-cited to real sources — citing 
real sources about the wrong subject is still an unreliable answer.

Rate "medium" if some evidence matches but is incomplete or partially uncertain 
about the entity match.

Respond ONLY with JSON: {{"confidence": "high"|"medium"|"low", "needs_revision": true|false}}

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