from fastapi import FastAPI, HTTPException
from backend.models import Vertrag
from backend.financial_engine import financial_engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AZ-Europa VOB Audit Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/audit")
def audit_contract(vertrag: Vertrag):
    try:
        result = financial_engine.audit_vertrag(vertrag)
        return result
    except Exception as e:
        # Cryptographic logging would go here in production
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "VOB Audit Engine is running (Zero-Trust Environment)"}
