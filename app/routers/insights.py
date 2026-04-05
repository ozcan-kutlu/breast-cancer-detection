"""Model kartı ve eğitimde üretilen ağaç görseli."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse

from app.config import TREE_IMAGE_PATH
from app.deps import get_ml
from app.services.model_card import build_model_info_dict
from app.state import MLResources

router = APIRouter(tags=["model"])


@router.get("/model/info")
def model_info(ml: MLResources = Depends(get_ml)) -> dict:
    if ml.classifier is None:
        raise HTTPException(status_code=503, detail="Model yüklenemedi")
    return build_model_info_dict(ml)


@router.get("/model/tree.png")
def model_tree_png() -> FileResponse:
    if not TREE_IMAGE_PATH.is_file():
        raise HTTPException(
            status_code=404,
            detail="Ağaç görseli yok. Önce python train.py çalıştırın (matplotlib gerekir).",
        )
    return FileResponse(TREE_IMAGE_PATH, media_type="image/png")
