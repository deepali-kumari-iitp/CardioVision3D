
import joblib
from pathlib import Path
from sklearn.pipeline import Pipeline


# Path to the trained cardiovascular prediction pipeline
MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "ml"
    / "models"
    / "final_cad_pipeline.pkl"
)


def load_model() -> Pipeline:
    """
    Load the trained cardiovascular prediction pipeline.

    Returns:
        Pipeline: Loaded scikit-learn pipeline.

    Raises:
        FileNotFoundError: If the model artifact does not exist.
        TypeError: If the loaded artifact is not a scikit-learn Pipeline.
    """

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Trained model not found at: {MODEL_PATH}"
        )

    model = joblib.load(MODEL_PATH)

    if not isinstance(model, Pipeline):
        raise TypeError(
            "Loaded artifact is not an sklearn Pipeline."
        )

    return model
