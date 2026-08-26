import os
from typing import Dict, Any, List, Optional
from agent.tool_registry import ToolRegistry, ToolResult
from agent.goal_parser import GoalParser
from agent.planner import Planner
from agent.decision import DecisionLayer, EvidenceParser
from agent.trace import AuditLogger

class AgentOrchestrator:
    """The brain of the system: orchestrates goal execution and tool scheduling."""
    
    def __init__(self, tool_registry: Optional[ToolRegistry] = None):
        self.registry = tool_registry or ToolRegistry()
        self.parser = GoalParser()
        self.planner = Planner()
        self.decision_layer = DecisionLayer()

    def execute_goal(
        self,
        goal: str,
        mock_data: Optional[Dict[str, Any]] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        location_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """Process a natural-language goal, execute planned tools, and return risk verdict + trace."""
        logger = AuditLogger()
        logger.log_step("Start Agent", "success", f"Processing goal: {goal}")

        # 1. Parse Goal
        params = self.parser.parse(goal)
        has_explicit_coords = (latitude is not None and longitude is not None)
        params["has_explicit_coords"] = has_explicit_coords

        if location_name and (has_explicit_coords or params.get("location")):
            params["location"] = location_name

        logger.log_step("Goal Parsing", "success", f"Extracted parameters: {params}")

        # 2. Plan Sequencing
        plan = self.planner.generate_plan(params)
        logger.log_step("Planning", "success", f"Generated execution plan: {plan}")

        # State trackers for data flow between tools
        input_lat = latitude
        input_lon = longitude

        latitude = input_lat
        longitude = input_lon
        matched_address = location_name
        evidence = []
        observed_data = {}
        tool_calls_log = []
        overall_status = "completed"
        failed_tools = []

        # 3. Execute tools
        for tool_name in plan:
            logger.log_tool_start(tool_name, {"goal_params": params})
            tool = self.registry.get_tool(tool_name)
            
            tool_result = None
            
            # If explicit coordinates are provided for GeocodingTool, bypass external geocoding/mock lookups
            if tool_name == "GeocodingTool" and input_lat is not None and input_lon is not None:
                matched_address = location_name or params.get("location")
                tool_result = ToolResult(
                    tool="GeocodingTool",
                    status="success",
                    inputs={"location": matched_address, "latitude": input_lat, "longitude": input_lon},
                    data={"latitude": input_lat, "longitude": input_lon, "matched_address": matched_address},
                    source="Map Pin Input",
                    reference="Explicit latitude/longitude supplied by frontend"
                )
            # Allow mock data injection for deterministic testing of other tools
            elif mock_data and tool_name in mock_data:
                # If mock data is provided, use it to populate ToolResult
                mock_res = mock_data[tool_name]
                if isinstance(mock_res, ToolResult):
                    tool_result = mock_res
                else:
                    tool_result = ToolResult(
                        tool=tool_name,
                        status="success",
                        inputs={},
                        data=mock_res,
                        source="Mock Provider",
                        reference="Unit Test Mock"
                    )

            if not tool_result:
                # Execute real tool with dynamically resolved inputs
                try:
                    if tool_name == "GeocodingTool":
                        tool_result = tool.execute(location=params["location"])
                        
                    elif tool_name == "AgronomicEvidenceTool":
                        tool_result = tool.execute(
                            query=goal,
                            crop=params["crop"],
                            crop_stage=params["crop_stage"],
                            topic=None
                        )
                        
                    elif tool_name == "FortyGuardTool":
                        # Require coordinates (either geocoded or default fallback)
                        lat = latitude or 36.7378  # Fresno fallback
                        lon = longitude or -119.7871

                        # Always use TCM (temperature snapshot heatmap).
                        # The exceedance/persistence analytics require a higher
                        # API tier and return 500 on Hackathon accounts.
                        # The DecisionLayer compares TCM max temperature directly
                        # against agronomic thresholds retrieved from RAG evidence.
                        tool_result = tool.execute(
                            latitude=lat,
                            longitude=lon,
                            start_date=params["start_date"],
                            end_date=params["end_date"],
                            analytic_type="tcm",
                            threshold=None,
                            direction=None,
                            run_env_params=False
                        )
                        
                    elif tool_name == "FortyGuardEnvTool":
                        lat = latitude or 36.7378
                        lon = longitude or -119.7871
                        tool_result = tool.execute(
                            latitude=lat,
                            longitude=lon,
                            start_date=params["start_date"],
                            end_date=params["end_date"]
                        )

                    elif tool_name == "NasaPowerTool":
                        lat = latitude or 36.7378
                        lon = longitude or -119.7871
                        # NASA POWER dates require YYYYMMDD string format
                        start_date_str = params["start_date"].replace("-", "")
                        end_date_str = (params["end_date"] or params["start_date"]).replace("-", "")
                        
                        tool_result = tool.execute(
                            latitude=lat,
                            longitude=lon,
                            start_date=start_date_str,
                            end_date=end_date_str
                        )
                except Exception as e:
                    tool_result = ToolResult(
                        tool=tool_name,
                        status="failed",
                        inputs={},
                        data={},
                        source="Unknown",
                        reference="Error Handler",
                        error=str(e)
                    )

            # Log tool results and populate state variables
            if tool_result.status == "success":
                logger.log_tool_end(
                    tool_name=tool_name,
                    status="success",
                    result_summary=f"Retrieved data successfully.",
                    source=tool_result.source,
                    reference=tool_result.reference
                )
                
                # Flow outputs to next steps
                if tool_name == "GeocodingTool":
                    latitude = tool_result.data.get("latitude")
                    longitude = tool_result.data.get("longitude")
                    matched_address = tool_result.data.get("matched_address")
                    observed_data["matched_address"] = matched_address
                    
                elif tool_name == "AgronomicEvidenceTool":
                    evidence = tool_result.data.get("evidence", [])
                    
                elif tool_name == "FortyGuardTool":
                    # Confirmed FortyGuard TCM response schema (from live API debug):
                    # heatmap_data = {
                    #   "map_data": {...},
                    #   "stats_data": {
                    #     "temperature_stats": {
                    #       "minimum": float,   # Celsius
                    #       "maximum": float,   # Celsius
                    #       "mean":    float,   # Celsius
                    #       "standard_deviation": float
                    #     },
                    #     "overall_temperature_distribution": [...],
                    #     ...
                    #   }
                    # }
                    heatmap_data = tool_result.data.get("heatmap", {})
                    stats_data = heatmap_data.get("stats_data", {})
                    temp_stats = stats_data.get("temperature_stats", {})

                    max_val = temp_stats.get("maximum")
                    min_val = temp_stats.get("minimum")
                    mean_val = temp_stats.get("mean")

                    if max_val is not None:
                        observed_data["max_temperature"] = round(float(max_val), 2)
                    if min_val is not None:
                        observed_data["min_temperature"] = round(float(min_val), 2)
                    if mean_val is not None:
                        observed_data["mean_temperature"] = round(float(mean_val), 2)

                    # Also store overall distribution for richer output
                    dist = stats_data.get("overall_temperature_distribution", [])
                    if dist:
                        observed_data["temperature_distribution"] = dist



                elif tool_name == "FortyGuardEnvTool":
                    env_params = tool_result.data.get("env_params", {})
                    h_idx_c = env_params.get("heat_index_celsius", {})
                    if isinstance(h_idx_c, dict) and h_idx_c:
                        vals = [v for v in h_idx_c.values() if v is not None]
                        if vals:
                            observed_data["heat_index"] = max(vals)
                            if "temperature" not in observed_data and "max_temperature" not in observed_data:
                                observed_data["temperature"] = max(vals)

                    rel_hum = env_params.get("relative_humidity_percent", {})
                    if isinstance(rel_hum, dict) and rel_hum:
                        vals = [v for v in rel_hum.values() if v is not None]
                        if vals:
                            observed_data["relative_humidity"] = sum(vals) / len(vals)

                    wet_bulb = env_params.get("wet_bulb_temperature_celsius", {})
                    if isinstance(wet_bulb, dict) and wet_bulb:
                        vals = [v for v in wet_bulb.values() if v is not None]
                        if vals:
                            observed_data["wet_bulb_temperature"] = max(vals)

                    solar = env_params.get("solar_irradiance", {})
                    if isinstance(solar, dict) and solar:
                        vals = [v for v in solar.values() if v is not None]
                        if vals:
                            observed_data["solar_irradiance"] = max(vals)
                            
                elif tool_name == "NasaPowerTool":
                    nasa_params = tool_result.data.get("parameters", {})
                    # Extract precip and root zone wetness
                    precip = nasa_params.get("PRECTOTCORR", {})
                    wetness = nasa_params.get("GWETROOT", {})
                    
                    # Take average values for date range
                    prec_vals = [v for v in precip.values() if v is not None]
                    wet_vals = [v for v in wetness.values() if v is not None]
                    
                    if prec_vals:
                        observed_data["precipitation"] = sum(prec_vals) / len(prec_vals)
                    if wet_vals:
                        observed_data["soil_moisture"] = sum(wet_vals) / len(wet_vals)
            else:
                # Handle tool failure
                overall_status = "partial"
                failed_tools.append(tool_name)
                logger.log_tool_end(
                    tool_name=tool_name,
                    status="failed",
                    result_summary=f"Error: {tool_result.error}",
                    source=tool_result.source,
                    reference=tool_result.reference
                )

            tool_calls_log.append({
                "tool": tool_result.tool,
                "status": tool_result.status,
                "inputs": tool_result.inputs,
                "source": tool_result.source,
                "reference": tool_result.reference,
                "error": tool_result.error
            })

        # 4. Evaluate agronomic decision
        logger.log_step("Decision Making", "success", "Evaluating risk matching observed data with agronomic thresholds.")
        
        # Inject coordinates/location into observed data for reference
        if latitude is not None and longitude is not None:
            observed_data["latitude"] = latitude
            observed_data["longitude"] = longitude

        decision_res = self.decision_layer.evaluate(
            evidence,
            observed_data,
            crop=params.get("crop", ""),
            stage=params.get("crop_stage", "")
        )
        
        # Explain missing tools in partial workflow
        if overall_status == "partial":
            decision_res["risk_assessment"]["reasoning"] += f" (Note: Missing metrics due to failure in: {failed_tools})"

        # 5. Format final response
        logger.log_step("Output Generation", "success", "Formatting final structured result.")
        
        # Build cited sources list from tools and evidence
        sources_list = []
        for call in tool_calls_log:
            if call["status"] == "success" and call["tool"] != "AgronomicEvidenceTool":
                sources_list.append({
                    "type": "environmental",
                    "name": call["tool"],
                    "source": call["source"],
                    "reference": call["reference"]
                })
        for ev in evidence:
            sources_list.append({
                "type": "agronomic",
                "name": ev["source"],
                "document": ev["document"],
                "section": ev["page_or_section"],
                "chunk_id": ev["chunk_id"]
            })

        return {
            "goal": goal,
            "status": overall_status,
            "location": {
                "latitude": latitude,
                "longitude": longitude,
                "address": matched_address or params["location"]
            },
            "plan": plan,
            "tool_calls": tool_calls_log,
            "findings": decision_res["findings"],
            "risk_assessment": decision_res["risk_assessment"],
            "recommendations": decision_res["recommendations"],
            "narrative": decision_res.get("narrative", ""),
            "sources": sources_list,
            "audit_trace": logger.format_trace_for_display()
        }
