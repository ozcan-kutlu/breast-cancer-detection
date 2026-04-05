"""Uygulama başlarken yüklenen model ve yardımcı veriler."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import joblib
from sklearn.datasets import load_breast_cancer

from app.config import FEATURE_NAMES_PATH, MODEL_PATH


@dataclass(frozen=True)
class MLResources:
    """API boyunca kullanılan tek kaynak paketi."""

    classifier: Any
    feature_names: list[str]
    benign_feature_means: list[float]


def _load_classifier_and_names() -> tuple[Any, list[str]]:
    if not MODEL_PATH.is_file() or not FEATURE_NAMES_PATH.is_file():
        raise FileNotFoundError(
            "Model bulunamadı. backend/ içinde çalıştırın: python train.py"
        )
    clf = joblib.load(MODEL_PATH)
    names: list[str] = joblib.load(FEATURE_NAMES_PATH)
    return clf, names


def _benign_column_means() -> list[float]:
    data = load_breast_cancer()
    x, y = data.data, data.target
    benign = x[y == 1].mean(axis=0)
    return benign.astype(float).tolist()


def load_ml_resources() -> MLResources:
    classifier, feature_names = _load_classifier_and_names()
    benign_means = _benign_column_means()
    return MLResources(
        classifier=classifier,
        feature_names=feature_names,
        benign_feature_means=benign_means,
    )
