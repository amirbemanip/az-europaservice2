from pydantic import BaseModel, Field
from typing import List, Optional

class Einheitspreis(BaseModel):
    lohn: float = Field(0.0, description="Lohnkosten")
    stoffe: float = Field(0.0, description="Materialkosten")
    geraete: float = Field(0.0, description="Gerätekosten")
    sonstiges: float = Field(0.0, description="Sonstige Kosten")
    gesamt: float = Field(..., description="Gesamter Einheitspreis (EP)")

class Position(BaseModel):
    id: str = Field(..., description="Positionsnummer (z.B. 01.02.03)")
    beschreibung: str = Field(..., description="Leistungsbeschreibung (Freitext)")
    menge: float = Field(..., description="Menge der Leistung")
    einheit: str = Field(..., description="Einheit (z.B. m2, Stk)")
    ep: Einheitspreis = Field(..., description="Angebotener Einheitspreis")

class Vertrag(BaseModel):
    projekt_name: str
    positionen: List[Position]

class ExtractedEntity(BaseModel):
    action: str
    object: str
    location: str

class VerificationResult(BaseModel):
    is_safe: bool
    requires_conditional_clause: bool
    conditional_clause: Optional[str] = None
    reason: str
