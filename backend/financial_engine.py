from backend.models import Vertrag, VerificationResult, Position
from backend.z3_solver import verification_engine
from typing import List, Dict, Any

class FinancialSandbox:
    def __init__(self):
        pass

    def audit_vertrag(self, vertrag: Vertrag) -> Dict[str, Any]:
        results = []
        all_safe = True
        total_value = 0.0

        for pos in vertrag.positionen:
            # 1. Math audit: check if Lohn+Stoffe+Geräte+Sonstiges == Gesamt
            calculated_gesamt = pos.ep.lohn + pos.ep.stoffe + pos.ep.geraete + pos.ep.sonstiges
            # Allowing tiny floating point differences
            if abs(calculated_gesamt - pos.ep.gesamt) > 0.01:
                # Math mismatch
                return {
                    "status": "REJECTED",
                    "reason": f"Mathematischer Fehler in Position {pos.id}. Lohn+Stoffe+Geräte+Sonstiges ({calculated_gesamt}) != Gesamt ({pos.ep.gesamt})"
                }

            # 2. Volume Fluctuation Matrix (-10%, exact, +10%)
            base_total = pos.menge * pos.ep.gesamt
            total_value += base_total

            # 3. Z3 Logic Verification
            z3_result = verification_engine.verify_position(pos)

            pos_result = {
                "position_id": pos.id,
                "z3_verification": z3_result.dict()
            }
            results.append(pos_result)

            if not z3_result.is_safe:
                all_safe = False

        status = "APPROVED_WITH_CONDITIONS" if not all_safe else "APPROVED_CLEAN"

        return {
            "status": status,
            "projekt": vertrag.projekt_name,
            "gesamt_wert": total_value,
            "positionen_details": results
        }

financial_engine = FinancialSandbox()
