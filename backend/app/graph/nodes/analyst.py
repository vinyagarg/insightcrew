import os
import concurrent.futures
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_one(q, sources):
    evidence_text = "\n".join(
        f"[{s['id']}] {s['title']}: {s['snippet']}" for s in sources
    )
    prompt = f"""Using the evidence below, write a thorough, accurate, and 
well-structured answer to this question in clear, plain, everyday language.

STRUCTURE (follow this internally, but write as natural flowing prose, not as a 
literal list):
- Open with a direct, clear answer to the question in the first 1-2 sentences
- Follow with supporting detail, context, or explanation across 1-2 more paragraphs
- If the evidence contains multiple distinct facts or perspectives, organize them 
  logically (e.g., group related points together) rather than listing them in 
  random order
- If sources disagree or provide different angles, note that clearly rather than 
  blending them into one contradictory statement

ACCURACY RULES:
- Only state what the evidence actually supports — do not infer, guess, or fill 
  gaps with general knowledge not present in the evidence
- Before writing, check whether the evidence actually refers to the exact 
  subject/entity named in the question (matching name, spelling, and context) — 
  not a similarly-named but different person, place, or thing. If the evidence is 
  about a different or ambiguous entity, clearly state that no reliable evidence 
  was found about the specific subject asked about, rather than presenting 
  unrelated information as if it answers the question
- Cite sources inline using [id] markers matching the evidence, placed at the end 
  of the specific sentence they support — do not cite a source for a claim it 
  doesn't actually contain
- Write 2-3 full paragraphs (6-10 sentences total) only if the evidence genuinely 
  supports that much detail; if evidence is thin, write a shorter, honest answer 
  rather than padding with repetition

Question: {q}

Evidence:
{evidence_text}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        content = response.choices[0].message.content.strip()
    except Exception:
        content = "Unable to generate an answer for this question due to a processing error."

    return {
        "heading": q,
        "content": content,
        "confidence": "medium",
        "sources": sources,
    }

def analyst_node(state):
    evidence_items = list(state["evidence"].items())
    draft_sections = [None] * len(evidence_items)

    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_index = {
            executor.submit(analyze_one, q, sources): i
            for i, (q, sources) in enumerate(evidence_items)
        }
        for future in concurrent.futures.as_completed(future_to_index):
            idx = future_to_index[future]
            draft_sections[idx] = future.result()

    return {**state, "draft_sections": draft_sections}