import os
import sys

# Ensure repository root is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from knowledge.evidence_tool import retrieve_agronomic_evidence

def run_benchmark_queries():
    queries = [
        {
            "q": "What is the optimal soil temperature range for tomato seed germination?",
            "crop": "Tomato",
            "stage": "planting",
            "topic": "planting thresholds"
        },
        {
            "q": "What happens if air temperature exceeds 32C during tomato flowering?",
            "crop": "Tomato",
            "stage": "flowering",
            "topic": "heat stress"
        },
        {
            "q": "What is the stem water potential threshold for mild stress in almond trees?",
            "crop": "Almond",
            "stage": "irrigation",
            "topic": "irrigation"
        },
        {
            "q": "What is the optimal temperature for growing pineapples?",
            "crop": "Pineapple",
            "stage": None,
            "topic": None
        }
    ]

    print("=" * 60)
    print("AGRONOMIC RAG MANUAL VERIFICATION & AUDIT TRACE")
    print("=" * 60)

    for idx, item in enumerate(queries, 1):
        print(f"\nQUERY {idx}")
        print(f"Goal: {item['q']}")
        print(f"Filters: Crop={item['crop']}, Stage={item['stage']}, Topic={item['topic']}")
        print("-" * 40)
        
        results = retrieve_agronomic_evidence(
            query=item['q'],
            crop=item['crop'],
            crop_stage=item['stage'],
            topic=item['topic'],
            top_k=2
        )

        if not results:
            print("QUESTION: " + item['q'])
            print("↓")
            print("TOP RETRIEVED EVIDENCE: [INSUFFICIENT EVIDENCE / NO MATCH FOUND]")
            print("↓")
            print("SOURCE: N/A")
            print("↓")
            print("PAGE / CHUNK: N/A")
            print("↓")
            print("RELEVANCE INFORMATION: No matching evidence available in the RAG store.")
        else:
            for r_idx, r in enumerate(results, 1):
                if r_idx > 1:
                    print("\n--- Next matching evidence ---")
                print("QUESTION: " + item['q'])
                print("↓")
                print("TOP RETRIEVED EVIDENCE: " + r["evidence_text"])
                print("↓")
                print("SOURCE: " + r["source"] + f" ({r['document']})")
                print("↓")
                print("PAGE / CHUNK: " + r["page_or_section"] + " / " + r["chunk_id"])
                print("↓")
                print("RELEVANCE INFORMATION: Similarity Score = " + str(r["score"]) + f", Crop = {r['crop']}, Stage = {r['crop_stage']}, Topic = {r['topic']}")
        print("=" * 60)

if __name__ == "__main__":
    run_benchmark_queries()
