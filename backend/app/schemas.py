"""HTTP istek / cevap şemaları."""

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Wisconsin veri seti sırasıyla 30 özellik (float)."""

    features: list[float] = Field(..., min_length=30, max_length=30)


class PredictionResponse(BaseModel):
    label: str
    label_code: int
    probability_malignant: float
    probability_benign: float
