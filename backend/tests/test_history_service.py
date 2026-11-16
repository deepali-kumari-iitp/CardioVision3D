import pytest
from unittest.mock import MagicMock

from app.services.history_service import save_prediction
from app.db.prediction_history import PredictionHistory


def test_save_prediction_successfully():
    db = MagicMock()

    patient_data = {"Age": 53, "Sex": "Male"}

    prediction_result = {
        "prediction": "CAD",
        "probabilities": {
            "CAD": 0.75,
            "Normal": 0.25,
        },
    }

    result = save_prediction(
        db=db,
        patient_data=patient_data,
        prediction_result=prediction_result,
    )

    saved_record = db.add.call_args.args[0]

    assert isinstance(saved_record, PredictionHistory)
    assert saved_record.patient_data == patient_data
    assert saved_record.prediction == "CAD"
    assert saved_record.cad_probability == 0.75
    assert saved_record.normal_probability == 0.25

    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(saved_record)
    db.rollback.assert_not_called()

    assert result is saved_record


def test_save_prediction_rolls_back_on_database_error():
    db = MagicMock()
    db.commit.side_effect = RuntimeError("Database commit failed")

    patient_data = {"Age": 53, "Sex": "Male"}

    prediction_result = {
        "prediction": "CAD",
        "probabilities": {
            "CAD": 0.75,
            "Normal": 0.25,
        },
    }

    with pytest.raises(RuntimeError, match="Database commit failed"):
        save_prediction(
            db=db,
            patient_data=patient_data,
            prediction_result=prediction_result,
        )

    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.rollback.assert_called_once()
    db.refresh.assert_not_called()
