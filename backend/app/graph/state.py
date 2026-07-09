from typing import TypedDict, List, Optional

class Source(TypedDict):
    id: int
    title: str
    url: str
    snippet: str

class Section(TypedDict):
    heading: str
    content: str
    confidence: str
    sources: List[Source]

class GraphState(TypedDict):
    query: str
    sub_questions: List[str]
    evidence: dict
    draft_sections: List[Section]
    revision_count: int
    final_sections: List[Section]