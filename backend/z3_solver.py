from z3 import *
from backend.models import VerificationResult, Position
from backend.ontology import knowledge_graph
from backend.nlp_engine import nlp_engine

class Z3VerificationEngine:
    def __init__(self):
        pass

    def verify_position(self, position: Position) -> VerificationResult:
        entities = nlp_engine.extract_entities(position.beschreibung)
        s = Solver()
        EP = Real('EP')
        s.add(EP == position.ep.gesamt)

        if entities.action == "Abbruch" and entities.object == "Wand":
            is_hazardous = Bool('is_hazardous')
            # The rule: if it's hazardous, EP must be >= 150
            s.add(Implies(is_hazardous, EP >= 150.0))

            s.push()
            # Assert: It IS hazardous
            s.add(is_hazardous)

            # Now we ask the solver: Is the current state valid?
            # We already added `EP == 15` (for example)
            # If `EP == 15` and `is_hazardous == True`, then `EP >= 150` is FALSE.
            # So the constraints will be unsat!
            # If it's unsat, it means the price is not high enough to cover the hazardous case safely.

            if s.check() == unsat:
                s.pop()
                return VerificationResult(
                    is_safe=False,
                    requires_conditional_clause=True,
                    conditional_clause="Der angebotene Einheitspreis (EP) setzt Schadstofffreiheit voraus. Sollten beim Abbruch Gefahrstoffe (z.B. Asbest gem. TRGS 519) festgestellt werden, greift automatisch § 2 Abs. 6 VOB/B (Besondere Leistungen). Die Entsorgung wird in diesem Fall separat mit einem Basispreis von 150€/m² zzgl. Rüstkosten in Rechnung gestellt.",
                    reason="AMBIGUOUS_HIGH_RISK: 'Wand' könnte Asbest enthalten. EP deckt Gefahrstoffentsorgung nicht ab."
                )
            s.pop()

        return VerificationResult(
            is_safe=True,
            requires_conditional_clause=False,
            reason="Keine Widersprüche oder Risiken gefunden."
        )

verification_engine = Z3VerificationEngine()
