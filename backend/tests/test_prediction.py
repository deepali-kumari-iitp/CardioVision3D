import json
from pathlib import Path


SAMPLE_PATH = (
    Path(__file__).resolve().parents[2]
    / "frontend"
    / "public"
    / "sample-patient.json"
)


def load_sample_patient():
    with SAMPLE_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def test_valid_patient_prediction(client):
    patient_data = load_sample_patient()

    response = client.post(
        "/api/v1/predict",
        json={"patient_data": patient_data}
    )

    assert response.status_code == 200

    data = response.json()

    assert data["prediction"] == "CAD"
    assert "CAD" in data["probabilities"]
    assert "Normal" in data["probabilities"]
    assert data["probabilities"]["CAD"] == 0.75
    assert data["probabilities"]["Normal"] == 0.25


def test_prediction_rejects_missing_fields(client):
    response = client.post(
        "/api/v1/predict",
        json={"patient_data": {"Age": 53}}
    )

    assert response.status_code == 422
