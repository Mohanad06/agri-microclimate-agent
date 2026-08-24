import datetime
from typing import Dict, Any, List

class AuditLogger:
    """Records the execution steps, tool inputs, and results for transparency and auditing."""
    
    def __init__(self):
        self.trace: List[Dict[str, Any]] = []

    def log_step(self, step_name: str, status: str, details: Any) -> None:
        """Add a general workflow step to the trace."""
        self.trace.append({
            "timestamp": datetime.datetime.now().isoformat(),
            "type": "step",
            "name": step_name,
            "status": status,
            "details": details
        })

    def log_tool_start(self, tool_name: str, inputs: Dict[str, Any]) -> None:
        """Record the start of a tool invocation."""
        self.trace.append({
            "timestamp": datetime.datetime.now().isoformat(),
            "type": "tool_start",
            "tool": tool_name,
            "inputs": inputs
        })

    def log_tool_end(self, tool_name: str, status: str, result_summary: str, source: str, reference: str) -> None:
        """Record the completion of a tool invocation."""
        self.trace.append({
            "timestamp": datetime.datetime.now().isoformat(),
            "type": "tool_end",
            "tool": tool_name,
            "status": status,
            "summary": result_summary,
            "source": source,
            "reference": reference
        })

    def get_trace(self) -> List[Dict[str, Any]]:
        """Return the completed trace log."""
        return self.trace

    def format_trace_for_display(self) -> str:
        """Return a formatted string representing the audit trace for display in manual verification."""
        lines = []
        for event in self.trace:
            ev_type = event["type"]
            if ev_type == "step":
                lines.append(f"✓ Step: {event['name']} | Status: {event['status']}")
                if event['details']:
                    lines.append(f"  Details: {event['details']}")
            elif ev_type == "tool_start":
                lines.append(f"→ Tool Call: {event['tool']} | Inputs: {event['inputs']}")
            elif ev_type == "tool_end":
                lines.append(f"  Result: {event['status']} | Source: {event['source']} | Ref: {event['reference']}")
                lines.append(f"  Summary: {event['summary']}")
        return "\n".join(lines)
