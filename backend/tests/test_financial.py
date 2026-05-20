from backend.models import Vertrag, Position, Einheitspreis
from backend.financial_engine import financial_engine

def test_financial_audit():
    v = Vertrag(
        projekt_name="Hausrenovierung Schmidt",
        positionen=[
            Position(
                id="01.01",
                beschreibung="Die alte Wand im Keller abreißen",
                menge=10.0,
                einheit="m2",
                ep=Einheitspreis(lohn=10.0, stoffe=0.0, geraete=5.0, sonstiges=0.0, gesamt=15.0)
            )
        ]
    )
    result = financial_engine.audit_vertrag(v)
    assert result["status"] == "APPROVED_WITH_CONDITIONS"
    assert result["gesamt_wert"] == 150.0
    assert result["positionen_details"][0]["z3_verification"]["requires_conditional_clause"] == True

def test_financial_math_error():
    v = Vertrag(
        projekt_name="Fehlerhaft",
        positionen=[
            Position(
                id="01.01",
                beschreibung="Sichere Arbeit",
                menge=10.0,
                einheit="m2",
                ep=Einheitspreis(lohn=10.0, stoffe=10.0, geraete=0.0, sonstiges=0.0, gesamt=50.0) # 10+10 != 50
            )
        ]
    )
    result = financial_engine.audit_vertrag(v)
    assert result["status"] == "REJECTED"
    assert "Mathematischer Fehler" in result["reason"]

if __name__ == "__main__":
    test_financial_audit()
    test_financial_math_error()
    print("Financial tests passed successfully.")
