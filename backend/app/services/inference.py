"""Ham özellik vektöründen tahmin üretimi."""

import numpy as np
from fastapi import HTTPException

from app.config import CLASS_LABELS
from app.schemas import PredictionResponse


def predict_from_features(classifier: object, features: list[float]) -> PredictionResponse:
    x = np.asarray(features, dtype=np.float64).reshape(1, -1)
    if np.isnan(x).any() or np.isinf(x).any():
        raise HTTPException(status_code=400, detail="Geçersiz sayı değeri")

    proba = classifier.predict_proba(x)[0]
    code = int(classifier.predict(x)[0])
    label = CLASS_LABELS[code]

    return PredictionResponse(
        label=label,
        label_code=code,
        probability_malignant=float(proba[0]),
        probability_benign=float(proba[1]),
    )
