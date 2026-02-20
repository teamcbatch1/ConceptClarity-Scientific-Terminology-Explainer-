from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os
from inference import predict as ai_predict

app = FastAPI(title="Concept Clarity AI Service")

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    answer: str
    confidence: float = 0.0
    source: str = "local"

@app.get("/health")
def health():
    return {"status": "AI Service is running"}

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        result = ai_predict(request.text)
        return PredictResponse(
            answer=result["answer"],
            confidence=result.get("confidence", 0.8),
            source="local"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "Concept Clarity AI Service API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
