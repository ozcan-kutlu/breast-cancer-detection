from fastapi import APIRouter, Depends

from app.deps import get_ml
from app.state import MLResources

router = APIRouter(tags=["health"])


@router.get("/health")
def health(ml: MLResources = Depends(get_ml)) -> dict[str, str | bool]:
    return {"status": "ok", "model_loaded": ml.classifier is not None}
