import requests
import json
import os

url = "https://21st.dev/api/mcp"
headers = {
    "x-api-key": "21st_sk_59b1d794e74e8c81a5662739a2f197f6eba564f35f620feb6fdcd4007c589eb8",
    "Content-Type": "application/json"
}

def mcp_call(method, params, call_id=1):
    payload = {
        "jsonrpc": "2.0",
        "id": call_id,
        "method": "tools/call",
        "params": {
            "name": method,
            "arguments": params
        }
    }
    response = requests.post(url, headers=headers, json=payload, timeout=15)
    return response.json()

results = {}

# 1. Retrieve component code for Neomorphism Metric Card (id: 24337)
print("Calling 21st.dev get_component for id 24337...")
results["get_component_24337"] = mcp_call("get_component", {"id": 24337}, 1)

# 2. Search logos for agricultural & weather UI markups
print("Calling 21st.dev search_logo for logos...")
results["search_logo_weather"] = mcp_call("search_logo", {"query": "weather"}, 2)

out_path = os.path.join(os.path.dirname(__file__), "21st_mcp_components.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print(f"Saved 21st.dev component retrieval to {out_path}")
