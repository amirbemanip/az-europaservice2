from backend.models import Position, Einheitspreis
from backend.z3_solver import verification_engine

def test_safe_price():
    pos = Position(
        id="01.01",
        beschreibung="Die alte Wand im Keller abreißen",
        menge=10.0,
        einheit="m2",
        ep=Einheitspreis(gesamt=160.0)
    )
    result = verification_engine.verify_position(pos)
    assert result.is_safe == True

def test_unsafe_price():
    pos = Position(
        id="01.01",
        beschreibung="Die alte Wand im Keller abreißen",
        menge=10.0,
        einheit="m2",
        ep=Einheitspreis(gesamt=15.0)
    )
    result = verification_engine.verify_position(pos)
    assert result.is_safe == False
    assert result.requires_conditional_clause == True
    assert "TRGS 519" in result.conditional_clause

if __name__ == "__main__":
    test_safe_price()
    test_unsafe_price()
    print("Z3 solver tests passed successfully.")
