import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from dotenv import load_dotenv
load_dotenv()

from app.graph.nodes.planner import planner_node
from app.graph.nodes.retriever import retriever_node


def test_planner_returns_list_of_questions():
    state = {"query": "How does climate change affect agriculture?"}
    result = planner_node(state)

    assert "sub_questions" in result
    assert isinstance(result["sub_questions"], list)
    assert len(result["sub_questions"]) > 0
    print(f"PASS: planner_node returned {len(result['sub_questions'])} sub-questions")


def test_planner_handles_empty_query_gracefully():
    state = {"query": ""}
    result = planner_node(state)

    assert "sub_questions" in result
    print("PASS: planner_node handled empty query without crashing")


def test_retriever_returns_evidence_dict():
    state = {"sub_questions": ["What is renewable energy?"]}
    result = retriever_node(state)

    assert "evidence" in result
    assert isinstance(result["evidence"], dict)
    assert "What is renewable energy?" in result["evidence"]
    print("PASS: retriever_node returned evidence for the given sub-question")


def test_retriever_sources_have_required_fields():
    state = {"sub_questions": ["What is renewable energy?"]}
    result = retriever_node(state)

    sources = result["evidence"]["What is renewable energy?"]
    if len(sources) > 0:
        source = sources[0]
        assert "id" in source
        assert "title" in source
        assert "url" in source
        assert "snippet" in source
        print("PASS: retriever_node sources contain all required fields")
    else:
        print("SKIP: no sources returned to validate (search may have found nothing)")


def run_all_tests():
    tests = [
        test_planner_returns_list_of_questions,
        test_planner_handles_empty_query_gracefully,
        test_retriever_returns_evidence_dict,
        test_retriever_sources_have_required_fields,
    ]

    passed = 0
    failed = 0

    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"FAIL: {test.__name__} - {e}")
            failed += 1
        except Exception as e:
            print(f"ERROR: {test.__name__} - {e}")
            failed += 1

    print(f"\n{passed} passed, {failed} failed out of {len(tests)} tests")


if __name__ == "__main__":
    run_all_tests()