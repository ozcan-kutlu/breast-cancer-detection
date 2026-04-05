from fastapi import APIRouter, Depends, HTTPException

from app.deps import get_ml
from app.schemas import PredictionRequest, PredictionResponse
from app.services.inference import predict_from_features
from app.state import MLResources

router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict(
    body: PredictionRequest,
    ml: MLResources = Depends(get_ml),
) -> PredictionResponse:
    if ml.classifier is None:
        raise HTTPException(status_code=503, detail="Model yüklenemedi")
    return predict_from_features(ml.classifier, body.features)
