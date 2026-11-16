
import math
from typing import Any

from sqlalchemy.orm import Session

from app.db.prediction_history import PredictionHistory


def save_prediction(
    db: Session,
    patient_data: dict[str, Any],
    prediction_result: dict[str, Any],
) -> PredictionHistory:

    if not isinstance(patient_data, dict) or not patient_data:
        raise ValueError("Patient data must be a non-empty dictionary.")

    if not isinstance(prediction_result, dict):
        raise ValueError("Invalid prediction result.")

    prediction = prediction_result.get("prediction")
    probabilities = prediction_result.get("probabilities")

    if prediction not in ("CAD", "Normal"):
        raise ValueError("Prediction must be CAD or Normal.")

    if not isinstance(probabilities, dict):
        raise ValueError("Prediction probabilities are missing.")

    try:
        cad_probability = float(probabilities["CAD"])
        normal_probability = float(probabilities["Normal"])
    except (KeyError, TypeError, ValueError):
        raise ValueError("Invalid prediction probabilities.")

    if not math.isfinite(cad_probability) or not math.isfinite(normal_probability):
        raise ValueError("Probabilities must be finite numbers.")

    if not (0 <= cad_probability <= 1):
        raise ValueError("CAD probability must be between 0 and 1.")

    if not (0 <= normal_probability <= 1):
        raise ValueError("Normal probability must be between 0 and 1.")

    record = PredictionHistory(
        patient_data=patient_data,
        prediction=prediction,
        cad_probability=cad_probability,
        normal_probability=normal_probability,
    )

    try:
        db.add(record)
        db.commit()
        db.refresh(record)

        return record

    except Exception:
        db.rollback()
        raise
