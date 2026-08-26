import requests
import json
import os

url = "https://21st.dev/api/mcp"
headers = {
    "x-api-key": "21st_sk_59b1d794e74e8c81a5662739a2f197f6eba564f35f620feb6fdcd4007c589eb8",
    "Content-Type": "application/json",
    "Accept": "application/json, text/event-stream"
}

payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
}

out_file = os.path.join(os.path.dirname(__file__), "mcp_response.json")

try:
    response = requests.post(url, headers=headers, json=payload, timeout=10)
    result_data = {
        "status_code": response.status_code,
        "headers": dict(response.headers),
        "text": response.text
    }
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(result_data, f, indent=2)
    print(f"Saved MCP response to {out_file}")
except Exception as e:
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"error": str(e)}, f, indent=2)
