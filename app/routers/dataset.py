"""Veri seti meta verisi ve örnek vektör."""

from fastapi import APIRouter, Depends, HTTPException

from app.config import CLASS_LABELS
from app.deps import get_ml
from app.state import MLResources

router = APIRouter(tags=["dataset"])


@router.get("/meta")
def feature_meta(ml: MLResources = Depends(get_ml)) -> dict:
    return {
        "feature_names": ml.feature_names,
        "n_features": len(ml.feature_names),
        "target_names": list(CLASS_LABELS),
        "description": "0 = malignant (kötü huylu), 1 = benign (iyi huylu)",
    }


@router.get("/sample-benign-means")
def sample_benign_means(ml: MLResources = Depends(get_ml)) -> dict:
    if len(ml.benign_feature_means) != len(ml.feature_names):
        raise HTTPException(status_code=503, detail="Örnek vektör hazır değil")
    return {"features": ml.benign_feature_means}
