from unittest.mock import MagicMock

from app.services import prediction_service


def test_get_model_loads_and_caches_model(monkeypatch):
    fake_model = MagicMock()
    load_mock = MagicMock(return_value=fake_model)

    monkeypatch.setattr(prediction_service, "_model", None)
    monkeypatch.setattr(prediction_service, "load_model", load_mock)

    first_model = prediction_service.get_model()
    second_model = prediction_service.get_model()

    assert first_model is fake_model
    assert second_model is fake_model
    load_mock.assert_called_once()


def test_predict_cad_returns_correct_probabilities(monkeypatch):
    fake_model = MagicMock()

    fake_model.predict.return_value = ["CAD"]
    fake_model.predict_proba.return_value = [[0.75, 0.25]]
    fake_model.classes_ = ["CAD", "Normal"]

    monkeypatch.setattr(
        prediction_service,
        "_model",
        fake_model,
    )

    patient_data = {
        "Age": 53,
        "Sex": "Male",
    }

    result = prediction_service.predict_cad(patient_data)

    assert result["prediction"] == "CAD"
    assert result["probabilities"]["CAD"] == 0.75
    assert result["probabilities"]["Normal"] == 0.25

    assert isinstance(result["probabilities"]["CAD"], float)
    assert isinstance(result["probabilities"]["Normal"], float)

    fake_model.predict.assert_called_once()
    fake_model.predict_proba.assert_called_once()

    input_dataframe = fake_model.predict.call_args.args[0]

    assert list(input_dataframe.columns) == ["Age", "Sex"]
    assert input_dataframe.iloc[0]["Age"] == 53
    assert input_dataframe.iloc[0]["Sex"] == "Male"
