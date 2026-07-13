import sys
import os
import argparse

sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.graph.pipeline import build_pipeline


def run_research(query):
    print(f"\nResearching: {query}\n")
    print("This may take 20-60 seconds depending on query complexity...\n")

    pipeline = build_pipeline()

    result = pipeline.invoke({
        "query": query,
        "sub_questions": [],
        "evidence": {},
        "draft_sections": [],
        "revision_count": 0,
        "final_sections": [],
    })

    sections = result.get("final_sections", [])

    print("=" * 70)
    print(f"RESEARCH REPORT: {query}")
    print("=" * 70)

    for i, section in enumerate(sections, 1):
        confidence = section.get("confidence", "unknown").upper()
        print(f"\n[{i}] {section['heading']}")
        print(f"    Confidence: {confidence}")
        print(f"    {'-' * 60}")
        print(f"    {section['content']}")

    print("\n" + "=" * 70)
    print(f"Total sections: {len(sections)}")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(
        description="InsightCrew CLI — run a research query directly from the terminal"
    )
    parser.add_argument("query", type=str, help="The research question to investigate")
    args = parser.parse_args()

    run_research(args.query)


if __name__ == "__main__":
    main()