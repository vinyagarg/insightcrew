import time
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from dotenv import load_dotenv
load_dotenv()

from app.graph.pipeline import build_pipeline

TEST_QUERIES = [
    "How does photosynthesis work?",
    "What are the latest breakthroughs in quantum computing?",
    "How is artificial intelligence transforming healthcare?",
    "What are the environmental impacts of plastic production?",
    "What are the key differences between AI researchers and quantitative researchers?",
    "How does climate change affect ocean ecosystems?",
    "What is the current state of renewable energy adoption?",
    "How do vaccines work at a biological level?",
    "What are the main causes of inflation in an economy?",
    "How is blockchain technology used outside of cryptocurrency?",
]


def run_single_eval(pipeline, query):
    start_time = time.time()

    try:
        result = pipeline.invoke({
            "query": query,
            "sub_questions": [],
            "evidence": {},
            "draft_sections": [],
            "revision_count": 0,
            "final_sections": [],
        })
        elapsed = time.time() - start_time

        sections = result.get("final_sections", [])
        confidence_counts = {"high": 0, "medium": 0, "low": 0}
        total_citations = 0
        sections_with_no_citations = 0

        for section in sections:
            conf = section.get("confidence", "medium")
            confidence_counts[conf] = confidence_counts.get(conf, 0) + 1

            content = section.get("content", "")
            citation_count = content.count("[")
            total_citations += citation_count
            if citation_count == 0:
                sections_with_no_citations += 1

        return {
            "query": query,
            "status": "success",
            "latency_seconds": round(elapsed, 2),
            "num_sections": len(sections),
            "confidence_breakdown": confidence_counts,
            "total_citations": total_citations,
            "sections_with_no_citations": sections_with_no_citations,
        }

    except Exception as e:
        elapsed = time.time() - start_time
        return {
            "query": query,
            "status": "error",
            "latency_seconds": round(elapsed, 2),
            "error": str(e),
        }


def main():
    print(f"Running evaluation on {len(TEST_QUERIES)} test queries...\n")
    pipeline = build_pipeline()

    results = []
    for i, query in enumerate(TEST_QUERIES, 1):
        print(f"[{i}/{len(TEST_QUERIES)}] Running: {query}")
        result = run_single_eval(pipeline, query)
        results.append(result)
        status_label = "OK" if result["status"] == "success" else "FAILED"
        print(f"    -> {status_label} | {result['latency_seconds']}s\n")
        if i < len(TEST_QUERIES):
            time.sleep(5)

    successful = [r for r in results if r["status"] == "success"]
    failed = [r for r in results if r["status"] == "error"]

    avg_latency = (
        sum(r["latency_seconds"] for r in successful) / len(successful)
        if successful else 0
    )

    total_sections = sum(r["num_sections"] for r in successful)
    total_high = sum(r["confidence_breakdown"]["high"] for r in successful)
    total_medium = sum(r["confidence_breakdown"]["medium"] for r in successful)
    total_low = sum(r["confidence_breakdown"]["low"] for r in successful)
    total_no_citation_sections = sum(r["sections_with_no_citations"] for r in successful)

    summary = {
        "total_queries": len(TEST_QUERIES),
        "successful": len(successful),
        "failed": len(failed),
        "average_latency_seconds": round(avg_latency, 2),
        "total_sections_generated": total_sections,
        "confidence_distribution": {
            "high": total_high,
            "medium": total_medium,
            "low": total_low,
            "high_confidence_rate": round(total_high / total_sections, 3) if total_sections else 0,
        },
        "sections_missing_citations": total_no_citation_sections,
        "citation_coverage_rate": round(
            1 - (total_no_citation_sections / total_sections), 3
        ) if total_sections else 0,
    }

    print("=" * 50)
    print("EVALUATION SUMMARY")
    print("=" * 50)
    print(json.dumps(summary, indent=2))

    output_path = os.path.join(os.path.dirname(__file__), "eval_results.json")
    with open(output_path, "w") as f:
        json.dump({"summary": summary, "results": results}, f, indent=2)

    print(f"\nFull results saved to {output_path}")


if __name__ == "__main__":
    main()