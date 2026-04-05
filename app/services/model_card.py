"""Model özeti (özellik önemleri, sıralı)."""

from app.config import CLASS_LABELS
from app.state import MLResources


def build_model_info_dict(ml: MLResources) -> dict:
    clf = ml.classifier
    importances = clf.feature_importances_
    pairs = sorted(
        zip(ml.feature_names, importances.tolist()),
        key=lambda item: item[1],
        reverse=True,
    )
    return {
        "algorithm": "RandomForestClassifier",
        "n_estimators": int(clf.n_estimators),
        "max_depth": clf.max_depth,
        "n_features_in": int(clf.n_features_in_),
        "classes": list(CLASS_LABELS),
        "feature_importance": [
            {"name": n, "importance": float(i)} for n, i in pairs
        ],
    }
