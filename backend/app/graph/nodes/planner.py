import os, json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def planner_node(state):
    prompt = f"""You are a research planner. Break down this query into 4-5 
well-structured sub-questions that together would form a comprehensive, 
well-organized research report.

Follow this structure when relevant to the topic:
1. A foundational/definitional question (what is it, who/what is involved)
2. A "current state" or "how it works" question
3. A question exploring key factors, causes, or components
4. A question about impact, implications, or real-world application
5. A forward-looking or comparative question (trends, challenges, or comparisons)

Adapt this structure to fit the actual query — skip categories that don't apply, 
and don't force a rigid template onto topics that need a different structure 
(e.g., factual lookups about a specific named person, place, or event need direct, 
specific sub-questions, not generic categories).

Each sub-question should be specific enough to search for effectively, and the set 
of sub-questions together should avoid overlap and avoid gaps.

Return ONLY a JSON array of strings, nothing else.

Query: {state['query']}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    text = response.choices[0].message.content.strip()
    try:
        sub_questions = json.loads(text)
    except json.JSONDecodeError:
        sub_questions = [state['query']]

    return {**state, "sub_questions": sub_questions}