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
            
            # 1. Parse temperature ranges (between X and Y)
            range_match = re.search(r'between\s+(\d+(?:\.\d+)?)(?:°C)?\s+and\s+(\d+(?:\.\d+)?)\s*°[Cc]', text)
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
                val_max_stress = float(swp_match.group(2)) # e.g. -1.4
                val_min_stress = float(swp_match.group(1)) # e.g. -1.0
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

            # 3. Parse exceedance limits (exceeding X C)
            exceed_match = re.search(r'(?:exceeding|above|exceeds|exceed)\s+(\d+(?:\.\d+)?)\s*°[Cc]', text, re.IGNORECASE)
            if exceed_match:
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
                
            # 4. Parse minimum limit (minimum X C / reaches at least X C)
            min_match = re.search(r'(?:minimum|at least)\s+(\d+(?:\.\d+)?)\s*°[Cc]', text, re.IGNORECASE)
            if min_match:
                val = float(min_match.group(1))
                thresholds.append({
                    "metric": "temperature",
                    "value": val,
                    "operator": "lt", # Safe lower boundary
                    "crop": crop,
                    "crop_stage": stage,
                    "text": min_match.group(0),
                    "source_id": chunk_id,
                    "document": doc,
                    "source": source
                })
                
            # 5. Parse soil moisture limits (GWETROOT above X)
            gwet_match = re.search(r'GWETROOT\s+(?:above|below)\s+(\d+(?:\.\d+)?)', text, re.IGNORECASE)
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
    
    def evaluate(
        self,
        evidence: List[Dict[str, Any]],
        observed_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Match observed metrics against agronomic thresholds to evaluate risk.
        
        Args:
            evidence: List of retrieved RAG evidence dicts.
            observed_data: Dict of normalized measurements (from FortyGuard/NASA POWER).
            
        Returns:
            Dict containing findings, risk_assessment level/reasoning, and recommendations list.
        """
        if not evidence:
            return {
                "findings": [],
                "risk_assessment": {
                    "level": "INSUFFICIENT_EVIDENCE",
                    "reasoning": "Insufficient agronomic evidence available in the RAG store to perform risk assessment."
                },
                "recommendations": []
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
                "recommendations": []
            }

        findings = []
        recommendations = []
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
                # Check observed temperatures in observed_data
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
                        # Bound recommendation to source
                        recommendations.append({
                            "text": f"Adjust management strategy to address {th['crop_stage']} temperature stress: {reason}",
                            "source_type": "derived_conclusion",
                            "reference_id": th["source_id"]
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
                # Check for observed SWP in observed_data
                swp_val = observed_data.get("stem_water_potential") or observed_data.get("observed_swp")
                if swp_val is not None:
                    comparisons_made += 1
                    is_violated = False
                    reason = ""
                    
                    if op == "between":
                        val_max_stress, val_min_stress = th_val # e.g. -1.4 to -1.0
                        if swp_val < val_max_stress: # More negative means more stress!
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
                        recommendations.append({
                            "text": f"Increase irrigation cycles to alleviate tree water stress: {reason}",
                            "source_type": "derived_conclusion",
                            "reference_id": th["source_id"]
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
                        reason = f"Observed soil wetness ({soil_val}) is below optimal moisture threshold ({th_val}) for {th['crop_stage']}."
                        
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
                        recommendations.append({
                            "text": f"Supplement crop water requirements: {reason}",
                            "source_type": "derived_conclusion",
                            "reference_id": th["source_id"]
                        })
                    else:
                        findings.append({
                            "description": f"Observed soil wetness ({soil_val}) is sufficient.",
                            "metric": metric,
                            "observed": soil_val,
                            "threshold": th_val,
                            "status": "safe",
                            "chunk_id": th["source_id"]
                        })

        # ── Evidence Sufficiency Gate ─────────────────────────────────────────
        # Thresholds were extracted from the RAG knowledge base, but no observed
        # metric from observed_data matched any of those thresholds. This occurs
        # when:
        #   • The crop is unknown and cross-crop RAG results leaked in.
        #   • The runtime tools (FortyGuard / NASA POWER) were not called.
        #   • The evidence belongs to a different crop or stage.
        # Policy: a risk level REQUIRES at least one successful comparison.
        # Without one, we must NOT emit a speculative LOW/MEDIUM/HIGH verdict.
        if comparisons_made == 0:
            return {
                "findings": [],
                "risk_assessment": {
                    "level": "INSUFFICIENT_EVIDENCE",
                    "reasoning": (
                        "Agronomic thresholds were found in the knowledge base, but no matching "
                        "runtime observation was available to compare them against. "
                        "Risk cannot be determined without observed environmental data for this crop."
                    )
                },
                "recommendations": []
            }

        # Append static RAG recommendations if explicitly listed in text
        for r in evidence:
            text = r["evidence_text"]
            chunk_id = r["chunk_id"]
            if "recommendation:" in text.lower() or "should be" in text.lower():
                recommendations.append({
                    "text": text,
                    "source_type": "agronomic_evidence",
                    "reference_id": chunk_id
                })

        # Deduplicate recommendations
        unique_recs = []
        seen_texts = set()
        for rec in recommendations:
            if rec["text"] not in seen_texts:
                seen_texts.add(rec["text"])
                unique_recs.append(rec)

        # Build final risk reasoning
        if risk_level == "HIGH":
            reasoning = "High risk detected. " + " ".join(risk_reasons)
        else:
            reasoning = "Low risk detected. All observed environmental conditions satisfy agronomic thresholds."

        return {
            "findings": findings,
            "risk_assessment": {
                "level": risk_level,
                "reasoning": reasoning
            },
            "recommendations": unique_recs
        }
