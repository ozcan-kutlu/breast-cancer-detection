"""Proje yolları ve sabit etiketler."""

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = PROJECT_ROOT / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "model.joblib"
FEATURE_NAMES_PATH = ARTIFACTS_DIR / "feature_names.joblib"
TREE_IMAGE_PATH = ARTIFACTS_DIR / "tree_first.png"

# sklearn breast cancer: 0 = malignant, 1 = benign
CLASS_LABELS: tuple[str, ...] = ("malignant", "benign")
