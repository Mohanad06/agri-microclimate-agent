import os
import sys
import json

# Ensure repository root is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent import AgentOrchestrator

def run_scenarios():
    orchestrator = AgentOrchestrator()
    
    scenarios = [
        # Scenario A: Assess tomato heat risk in Phoenix during flowering.
        {
            "id": "Scenario A: Tomato Flowering Heat Risk in Phoenix",
            "goal": "Assess tomato heat risk in Phoenix during flowering."
        },
        # Scenario B: Historical climate context for tomato last July.
        {
            "id": "Scenario B: Historical Climate Context in Phoenix",
            "goal": "What was the historical climate context for tomato heat risk in Phoenix last July?"
        },
        # Scenario C: Find the agronomic heat threshold for tomatoes during flowering.
        {
            "id": "Scenario C: Tomato Flowering Heat Threshold (RAG-only)",
            "goal": "Find the agronomic heat threshold for tomatoes during flowering."
        },
        # Scenario D: Unknown Crop (Pineapple)
        {
            "id": "Scenario D: Unknown Crop (Pineapple)",
            "goal": "What is the optimal temperature for growing pineapples?"
        }
    ]

    print("=" * 70)
    print("PHASE 3: GOAL-DRIVEN AGENT E2E MANUAL RUNS")
    print("=" * 70)

    # Check if API key is set. If not, inject mock data to allow successful local execution
    has_keys = bool(os.getenv("FORTYGUARD_API_KEY"))
    mock_data = None
    if not has_keys:
        print("[Notice] FORTYGUARD_API_KEY not configured in .env. Running in offline mock-fallback mode.")
        mock_data = {
            "GeocodingTool": {
                "latitude": 33.4484,
                "longitude": -112.0740,
                "matched_address": "Phoenix, AZ"
            },
            "FortyGuardTool": {
                "heatmap": {
                    "stats_data": {
                        "min": 25.0,
                        "max": 34.5, # Exceeds 32.0 threshold
                        "mean": 30.1,
                        "units": "C"
                    }
                },
                "env_params": {
                    "heat_index_celsius": {"20240710": 34.5}
                }
            },
            "NasaPowerTool": {
                "parameters": {
                    "PRECTOTCORR": {"20240710": 0.0},
                    "GWETROOT": {"20240710": 0.22} # Below 0.25 threshold
                }
            }
        }

    for scenario in scenarios:
        print(f"\nRUNNING: {scenario['id']}")
        print(f"User Goal: {scenario['goal']}")
        print("-" * 50)
        
        result = orchestrator.execute_goal(scenario["goal"], mock_data=mock_data)
        
        print(f"Workflow Status: {result['status'].upper()}")
        print(f"Tool Plan: {result['plan']}")
        print("\nTool Invocations:")
        for call in result["tool_calls"]:
            print(f"  - {call['tool']}: {call['status'].upper()}")
            if call['error']:
                print(f"    Error: {call['error']}")
                
        print("\nFindings:")
        for f in result["findings"]:
            print(f"  * {f['description']} (Status: {f['status'].upper()})")
            
        print(f"\nRisk Level: {result['risk_assessment']['level']}")
        print(f"Reasoning: {result['risk_assessment']['reasoning']}")
        
        print("\nRecommendations:")
        for idx, rec in enumerate(result["recommendations"], 1):
            print(f"  {idx}. {rec['text']} (Ref: {rec['reference_id']})")
            
        print("\nCited Sources:")
        for src in result["sources"]:
            if src["type"] == "agronomic":
                print(f"  - [Agronomic] {src['name']} | Doc: {src['document']} | Section: {src['section']} (Chunk: {src['chunk_id']})")
            else:
                print(f"  - [Environmental] {src['name']} | Source: {src['source']} | Ref: {src['reference']}")
                
        print("\nSafe Activity Audit Trace:")
        print(result["audit_trace"])
        print("=" * 70)

if __name__ == "__main__":
    run_scenarios()
