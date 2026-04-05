"""
Wisconsin Breast Cancer veri seti ile Random Forest eğitir;
artifacts/ altına model ve özellik isimlerini kaydeder.
"""

from __future__ import annotations

import joblib
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from app.config import ARTIFACTS_DIR, FEATURE_NAMES_PATH, MODEL_PATH

# Eğitim hiperparametreleri
RANDOM_STATE = 42
TEST_SIZE = 0.2
RF_N_ESTIMATORS = 200
RF_MAX_DEPTH = 12


def train_classifier(x_train, y_train) -> RandomForestClassifier:
    clf = RandomForestClassifier(
        n_estimators=RF_N_ESTIMATORS,
        max_depth=RF_MAX_DEPTH,
        random_state=RANDOM_STATE,
        class_weight="balanced",
    )
    clf.fit(x_train, y_train)
    return clf


def main() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    data = load_breast_cancer()
    x, y = data.data, data.target
    feature_names = list(data.feature_names)

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y,
    )

    clf = train_classifier(x_train, y_train)

    y_pred = clf.predict(x_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Test doğruluğu: {acc:.4f}")
    print(classification_report(y_test, y_pred, target_names=data.target_names))

    joblib.dump(clf, MODEL_PATH)
    joblib.dump(feature_names, FEATURE_NAMES_PATH)
    print(f"Model kaydedildi: {MODEL_PATH}")


if __name__ == "__main__":
    main()
