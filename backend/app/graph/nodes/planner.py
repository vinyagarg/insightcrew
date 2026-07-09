import os, json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def planner_node(state):
    prompt = f"""Break this research query into 3-4 focused sub-questions.
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