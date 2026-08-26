import re
from typing import Dict, Any, List, Optional, Tuple

class EvidenceParser:
    """Parses numeric thresholds and semantic guidelines from retrieved RAG chunks."""
    
    def parse_thresholds(self, evidence_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Scan retrieved chunks to extract structured comparison boundaries.
        
        Returns:
            List of dictionaries containing:
                - metric: e.g. "temperature", "stem water potential", "soil moisture"
                - value: float or Tuple[float, float]
                - operator: "gt" | "lt" | "between" | "gte" | "lte"
                - crop: str
                - crop_stage: str
                - text: raw sentence
                - source_id: chunk_id
                - document: document filename
                - source: institution name
        """
        thresholds = []
        for r in evidence_list:
            text = r["evidence_text"]
            crop = r["crop"]
            stage = r["crop_stage"]
            chunk_id = r["chunk_id"]
            doc = r["document"]
            source = r["source"]
            
            # 1. Parse temperature ranges (between X and Y / X to Y / optimum range X to Y)
            range_match = re.search(r'(?:between|optimum|range|optimal)[^.\n]*?(\d+(?:\.\d+)?)\s*°?[Cc]?\s+(?:and|to|-)\s+(\d+(?:\.\d+)?)\s*°[Cc]', text, re.IGNORECASE)
            if range_match:
                val_min = float(range_match.group(1))
                val_max = float(range_match.group(2))
                thresholds.append({
                    "metric": "temperature",
                    "value": (val_min, val_max),
                    "operator": "between",
                    "crop": crop,
                    "crop_stage": stage,
                    "text": range_match.group(0),
                    "source_id": chunk_id,
                    "document": doc,
                    "source": source
                })

            # 2. Parse stem water potential ranges (between -X and -Y MPa)
            swp_match = re.search(r'between\s+(-\d+(?:\.\d+)?)\s+and\s+(-\d+(?:\.\d+)?)\s*MPa', text, re.IGNORECASE)
            if swp_match:
                val_max_stress = float(swp_match.group(2))
                val_min_stress = float(swp_match.group(1))
                thresholds.append({
                    "metric": "stem water potential",
                    "value": (val_max_stress, val_min_stress),
                    "operator": "between",
                    "crop": crop,
                    "crop_stage": stage,
                    "text": swp_match.group(0),
                    "source_id": chunk_id,
                    "document": doc,
                    "source": source
                })

            # 3. Parse exceedance limits (exceeding X C / above X C / maximum X C)
            exceed_match = re.search(r'(?:exceeding|above|exceeds|exceed|maximum|max)[^.\n]*?(\d+(?:\.\d+)?)\s*°[Cc]', text, re.IGNORECASE)
            if exceed_match and not range_match:
                val = float(exceed_match.group(1))
                thresholds.append({
                    "metric": "temperature",
                    "value": val,
                    "operator": "gt",
                    "crop": crop,
                    "crop_stage": stage,
                    "text": exceed_match.group(0),
                    "source_id": chunk_id,
                    "document": doc,
                    "source": source
                })

            # 4. Parse minimum limit (minimum X C / at least X C / min X C)
            min_match = re.search(r'(?:minimum|at least|min)[^.\n]*?(\d+(?:\.\d+)?)\s*°[Cc]', text, re.IGNORECASE)
            if min_match and not range_match:
                val = float(min_match.group(1))
                thresholds.append({
                    "metric": "temperature",
                    "value": val,
                    "operator": "lt",
                    "crop": crop,
                    "crop_stage": stage,
                    "text": min_match.group(0),
                    "source_id": chunk_id,
                    "document": doc,
                    "source": source
                })

            # 5. Parse soil moisture limits (GWETROOT / wetness / soil moisture above/below X)
            gwet_match = re.search(r'(?:GWETROOT|soil wetness|soil moisture)[^.\n]*?(?:above|below|maintained above|maintained below)\s+(\d+(?:\.\d+)?)', text, re.IGNORECASE)
            if gwet_match:
                val = float(gwet_match.group(1))
                op = "gt" if "above" in gwet_match.group(0).lower() else "lt"
                thresholds.append({
                    "metric": "soil moisture",
                    "value": val,
                    "operator": op,
                    "crop": crop,
                    "crop_stage": stage,
                    "text": gwet_match.group(0),
                    "source_id": chunk_id,
                    "document": doc,
                    "source": source
                })
                
        return thresholds




class DecisionLayer:
    """Combines environmental measurements with parsed RAG thresholds for risk assessment."""

    # ── Crop-specific action plans ────────────────────────────────────────────
    # Keyed by (crop_lower, stage_lower, risk_level).
    # Each entry is a list of actionable bullet points for the farmer.
    _ACTION_PLANS = {
        ("tomato", "flowering", "HIGH"): [
            "Apply drip or overhead irrigation in the early morning (before 8 AM) to cool the root zone before peak heat.",
            "Deploy shade cloth (30–50% shade factor) over flowering rows to reduce canopy temperature by 3–5°C.",
            "Avoid any pruning, cultivation, or chemical applications during heat stress — these amplify physiological shock.",
            "Monitor flower set daily; if blossom drop exceeds 30%, consider blossom-set hormone spray (4-CPA) per label rates.",
            "Ensure adequate calcium and potassium foliar nutrition to support cell integrity under heat load.",
            "Scout for spider mites and thrips, which thrive in hot dry conditions and worsen heat stress.",
        ],
        ("tomato", "flowering", "LOW"): [
            "Conditions are within the safe temperature range for tomato flowering — maintain current irrigation schedule.",
            "Continue regular scouting for pests and diseases.",
            "Monitor forecasts: if temperatures are expected to rise, prepare shade cloth and early morning irrigation.",
        ],
        ("tomato", "vegetative", "HIGH"): [
            "Increase irrigation frequency to maintain adequate soil moisture during high evapotranspiration.",
            "Apply mulch (10–15 cm straw or plastic) to reduce soil temperature and retain moisture.",
            "Avoid nitrogen-heavy fertilization during heat stress — prioritize potassium for stress tolerance.",
        ],
        ("tomato", "fruiting", "HIGH"): [
            "Maintain consistent soil moisture to prevent blossom-end rot and fruit cracking.",
            "Harvest ripe fruit promptly — heat accelerates deterioration and increases disease susceptibility.",
            "Apply potassium fertilizer to improve fruit quality and skin thickness under stress.",
        ],
        ("almond", "flowering", "HIGH"): [
            "Apply evaporative cooling (overhead sprinklers) during peak heat to reduce orchard temperature.",
            "Ensure adequate soil moisture at depth (>60 cm) before heat events to support tree hydraulics.",
            "Avoid any irrigation cuts or stress periods during bloom — pollen viability drops sharply above 35°C.",
        ],
        ("almond", "flowering", "LOW"): [
            "Conditions are within safe range — continue standard bloom-period irrigation and pest monitoring.",
        ],
        ("corn", "flowering", "HIGH"): [
            "Initiate full-rate center pivot or flood irrigation to prevent silk desiccation and maintain pollen viability.",
            "Avoid aerial chemical applications during peak heat hours (11 AM - 4 PM) to protect silk integrity.",
            "Scout for corn earworm and spider mite flare-ups, which intensify under hot dry conditions.",
            "Maintain soil wetness index above 0.35 throughout silking and early pollination window.",
        ],
        ("corn", "flowering", "LOW"): [
            "Thermal conditions are optimal for corn silking and pollination — maintain standard irrigation schedule.",
        ],
        ("grape", "flowering", "HIGH"): [
            "Apply under-canopy micro-sprinklers to reduce ambient vineyard temperature during peak heat.",
            "Avoid leaf pulling or canopy hedging prior to heat events to shield berry clusters from direct sun exposure.",
            "Monitor soil water tension closely; maintain root zone wetness to prevent cluster shriveling (coulure).",
        ],
        ("grape", "flowering", "LOW"): [
            "Vineyard thermal conditions are within optimal range for bloom and fruit set.",
        ],
        ("cotton", "flowering", "HIGH"): [
            "Schedule night or early-morning drip irrigation to lower soil and canopy temperature.",
            "Avoid plant growth regulator (PGR) applications during severe heat stress to prevent square shedding.",
            "Scout for lygus bugs and cotton fleahoppers, which exacerbate heat-induced boll shedding.",
        ],
        ("cotton", "flowering", "LOW"): [
            "Cotton canopy conditions are within safe thermal bounds for squaring and boll filling.",
        ],
    }

    def _get_action_plan(self, crop: str, stage: str, risk_level: str) -> list:
        """Return crop/stage-specific action plan, with fallback generics."""
        key = (crop.lower(), stage.lower(), risk_level)
        if key in self._ACTION_PLANS:
            return self._ACTION_PLANS[key]
        # Generic fallbacks
        if risk_level == "HIGH":
            return [
                f"Implement heat-mitigation strategies for {crop} during the {stage} stage.",
                "Increase irrigation frequency and apply mulch to reduce soil temperature.",
                "Monitor crop daily for heat-stress symptoms (wilting, leaf roll, flower/fruit drop).",
                "Consult your local agricultural extension service for crop-specific heat management protocols.",
            ]
        return [
            f"Current conditions appear within safe range for {crop} ({stage} stage).",
            "Continue standard monitoring and maintain your irrigation schedule.",
        ]

    def _build_narrative(
        self,
        crop: str,
        stage: str,
        risk_level: str,
        observed_data: dict,
        findings: list,
    ) -> str:
        """Generate a concise farmer-facing narrative paragraph."""
        max_t = observed_data.get("max_temperature") or observed_data.get("temperature")
        mean_t = observed_data.get("mean_temperature")
        precip = observed_data.get("precipitation")
        soil = observed_data.get("soil_moisture")
        location = observed_data.get("matched_address", "your field")

        parts = []

        # Opening — what we observed
        if max_t is not None:
            temp_desc = f"a peak temperature of {max_t:.1f}°C"
            if mean_t is not None:
                temp_desc += f" (average {mean_t:.1f}°C)"
            parts.append(
                f"Over the past week, {location} recorded {temp_desc}."
            )

        # Precipitation context
        if precip is not None:
            if precip < 0.5:
                parts.append(
                    f"Rainfall was negligible ({precip:.2f} mm/day average), meaning the crop depends entirely on irrigation."
                )
            elif precip < 2.0:
                parts.append(
                    f"Rainfall was low ({precip:.2f} mm/day average) — supplemental irrigation is likely needed."
                )
            else:
                parts.append(
                    f"Rainfall was moderate ({precip:.2f} mm/day average), which may partially offset irrigation needs."
                )

        # Soil moisture context
        if soil is not None:
            if soil < 0.35:
                parts.append(
                    f"Root-zone soil wetness index is low ({soil:.2f}), indicating dry soil conditions that compound heat stress."
                )
            elif soil >= 0.35:
                parts.append(
                    f"Root-zone soil wetness ({soil:.2f}) is adequate for current conditions."
                )

        # Risk conclusion
        if risk_level == "HIGH":
            parts.append(
                f"These conditions represent a HIGH heat risk for {crop} during the {stage} stage. "
                f"Immediate action is recommended to protect yield and crop health."
            )
        else:
            parts.append(
                f"Overall, conditions present a LOW heat risk for {crop} during the {stage} stage. "
                f"Maintain regular monitoring and standard management practices."
            )

        return " ".join(parts)

    def evaluate(
        self,
        evidence: List[Dict[str, Any]],
        observed_data: Dict[str, Any],
        crop: str = "",
        stage: str = "",
    ) -> Dict[str, Any]:
        """Match observed metrics against agronomic thresholds to evaluate risk.

        Args:
            evidence: List of retrieved RAG evidence dicts.
            observed_data: Dict of normalized measurements (from FortyGuard/NASA POWER).
            crop: Crop name (for narrative and action plan generation).
            stage: Crop growth stage (for narrative and action plan generation).

        Returns:
            Dict containing findings, risk_assessment, recommendations, and narrative.
        """
        if not evidence:
            return {
                "findings": [],
                "risk_assessment": {
                    "level": "INSUFFICIENT_EVIDENCE",
                    "reasoning": "Insufficient agronomic evidence available in the RAG store to perform risk assessment."
                },
                "recommendations": [],
                "narrative": f"No agronomic evidence is available for {crop or 'the specified crop'}. Unable to assess risk."
            }

        parser = EvidenceParser()
        thresholds = parser.parse_thresholds(evidence)

        if not thresholds:
            return {
                "findings": [],
                "risk_assessment": {
                    "level": "INSUFFICIENT_EVIDENCE",
                    "reasoning": "Agronomic evidence is available but is too ambiguous to extract quantitative thresholds."
                },
                "recommendations": [],
                "narrative": "Agronomic thresholds could not be determined from available evidence. Please consult your local extension service."
            }

        findings = []
        risk_level = "LOW"
        risk_reasons = []
        comparisons_made = 0

        # Extracted thresholds mapping
        for th in thresholds:
            metric = th["metric"]
            op = th["operator"]
            th_val = th["value"]

            # 1. Temperature Threshold Checks
            if metric == "temperature":
                temp_val = observed_data.get("temperature") or observed_data.get("max_temperature")
                if temp_val is not None:
                    comparisons_made += 1
                    is_violated = False
                    reason = ""

                    if op == "gt" and temp_val > th_val:
                        is_violated = True
                        reason = f"Observed temperature ({temp_val}°C) exceeds safe threshold ({th_val}°C) during {th['crop_stage']} stage."
                    elif op == "lt" and temp_val < th_val:
                        is_violated = True
                        reason = f"Observed temperature ({temp_val}°C) falls below minimum required ({th_val}°C) for {th['crop_stage']}."
                    elif op == "between":
                        val_min, val_max = th_val
                        if not (val_min <= temp_val <= val_max):
                            is_violated = True
                            reason = f"Observed temperature ({temp_val}°C) is outside optimal range ({val_min}°C to {val_max}°C) for {th['crop_stage']}."

                    if is_violated:
                        risk_level = "HIGH"
                        risk_reasons.append(reason)
                        findings.append({
                            "description": reason,
                            "metric": metric,
                            "observed": temp_val,
                            "threshold": th_val,
                            "status": "violated",
                            "chunk_id": th["source_id"]
                        })
                    else:
                        findings.append({
                            "description": f"Observed temperature ({temp_val}°C) is within safe range for {th['crop_stage']}.",
                            "metric": metric,
                            "observed": temp_val,
                            "threshold": th_val,
                            "status": "safe",
                            "chunk_id": th["source_id"]
                        })

            # 2. Stem Water Potential Checks
            elif metric == "stem water potential":
                swp_val = observed_data.get("stem_water_potential") or observed_data.get("observed_swp")
                if swp_val is not None:
                    comparisons_made += 1
                    is_violated = False
                    reason = ""

                    if op == "between":
                        val_max_stress, val_min_stress = th_val
                        if swp_val < val_max_stress:
                            is_violated = True
                            reason = f"Observed stem water potential ({swp_val} MPa) indicates severe stress below optimal boundary ({val_max_stress} MPa)."

                    if is_violated:
                        risk_level = "HIGH"
                        risk_reasons.append(reason)
                        findings.append({
                            "description": reason,
                            "metric": metric,
                            "observed": swp_val,
                            "threshold": th_val,
                            "status": "violated",
                            "chunk_id": th["source_id"]
                        })
                    else:
                        findings.append({
                            "description": f"Observed stem water potential ({swp_val} MPa) is within acceptable range.",
                            "metric": metric,
                            "observed": swp_val,
                            "threshold": th_val,
                            "status": "safe",
                            "chunk_id": th["source_id"]
                        })

            # 3. Soil Moisture Checks
            elif metric == "soil moisture":
                soil_val = observed_data.get("soil_moisture") or observed_data.get("root_zone_wetness")
                if soil_val is not None:
                    comparisons_made += 1
                    is_violated = False
                    reason = ""

                    if op == "lt" and soil_val < th_val:
                        is_violated = True
                        reason = f"Observed soil wetness ({soil_val:.2f}) is below optimal moisture threshold ({th_val}) for {th['crop_stage']}."

                    if is_violated:
                        risk_level = "HIGH"
                        risk_reasons.append(reason)
                        findings.append({
                            "description": reason,
                            "metric": metric,
                            "observed": soil_val,
                            "threshold": th_val,
                            "status": "violated",
                            "chunk_id": th["source_id"]
                        })
                    else:
                        findings.append({
                            "description": f"Observed soil wetness ({soil_val:.2f}) is sufficient.",
                            "metric": metric,
                            "observed": soil_val,
                            "threshold": th_val,
                            "status": "safe",
                            "chunk_id": th["source_id"]
                        })

        # ── NASA POWER observations — always add to findings if present ────────
        precip = observed_data.get("precipitation")
        soil_m = observed_data.get("soil_moisture")

        if precip is not None and not any(f["metric"] == "precipitation" for f in findings):
            precip_status = "safe" if precip >= 1.0 else "warning"
            findings.append({
                "description": f"Average daily precipitation: {precip:.2f} mm/day"
                               + (" — low rainfall detected, irrigation is essential." if precip < 1.0 else "."),
                "metric": "precipitation",
                "observed": round(precip, 3),
                "threshold": None,
                "status": precip_status,
                "chunk_id": None,
            })

        if soil_m is not None and not any(f["metric"] == "soil moisture" for f in findings):
            soil_status = "safe" if soil_m >= 0.35 else "warning"
            findings.append({
                "description": f"Root-zone soil wetness index: {soil_m:.2f}"
                               + (" — dry soil conditions detected." if soil_m < 0.35 else " — adequate moisture level."),
                "metric": "soil moisture",
                "observed": round(soil_m, 3),
                "threshold": 0.35,
                "status": soil_status,
                "chunk_id": None,
            })

        # ── Evidence Sufficiency Gate ──────────────────────────────────────────
        if comparisons_made == 0:
            return {
                "findings": findings,
                "risk_assessment": {
                    "level": "INSUFFICIENT_EVIDENCE",
                    "reasoning": (
                        "Agronomic thresholds were found in the knowledge base, but no matching "
                        "runtime observation was available to compare them against. "
                        "Risk cannot be determined without observed environmental data for this crop."
                    )
                },
                "recommendations": [],
                "narrative": self._build_narrative(crop, stage, "INSUFFICIENT_EVIDENCE", observed_data, findings)
            }

        # ── Build final risk verdict ───────────────────────────────────────────
        if risk_level == "HIGH":
            reasoning = "High risk detected. " + " ".join(risk_reasons)
        else:
            reasoning = "Low risk detected. All observed environmental conditions satisfy agronomic thresholds."

        # ── Build rich action plan recommendations ─────────────────────────────
        action_steps = self._get_action_plan(crop or "crop", stage or "growth", risk_level)
        recommendations = [
            {
                "text": step,
                "source_type": "derived_conclusion",
                "reference_id": None,
                "priority": "high" if risk_level == "HIGH" and i < 3 else "normal",
            }
            for i, step in enumerate(action_steps)
        ]

        # Append any static RAG recommendations if explicitly in text
        for r in evidence:
            text = r["evidence_text"]
            chunk_id = r["chunk_id"]
            if "recommendation:" in text.lower() or "should be" in text.lower():
                if text not in {rec["text"] for rec in recommendations}:
                    recommendations.append({
                        "text": text,
                        "source_type": "agronomic_evidence",
                        "reference_id": chunk_id,
                        "priority": "normal",
                    })

        narrative = self._build_narrative(crop, stage, risk_level, observed_data, findings)

        return {
            "findings": findings,
            "risk_assessment": {
                "level": risk_level,
                "reasoning": reasoning
            },
            "recommendations": recommendations,
            "narrative": narrative,
        }
