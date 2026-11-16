from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.db.database import get_db


class FakeResult:
    def one(self):
        return SimpleNamespace(
            total=0,
            cad=0,
            normal=0,
            average_cad_probability=None,
        )

    def all(self):
        return []


class FakeDB:
    def scalar(self, statement):
        return 0

    def scalars(self, statement):
        return FakeResult()

    def execute(self, statement):
        return FakeResult()

    def get(self, model, record_id):
        if record_id != 1:
            return None

        return SimpleNamespace(
            id=1,
            prediction="CAD",
            cad_probability=0.75,
            normal_probability=0.25,
            patient_data={"Age": 53},
            created_at=datetime(2026, 11, 14, tzinfo=timezone.utc),
        )


@pytest.fixture
def client(monkeypatch):
    fake_db = FakeDB()

    def override_get_db():
        yield fake_db

    app.dependency_overrides[get_db] = override_get_db

    def mock_predict_cad(patient_data):
        return {
            "prediction": "CAD",
            "probabilities": {
                "CAD": 0.75,
                "Normal": 0.25,
            },
        }

    def mock_save_prediction(db, patient_data, prediction_result):
        return None

    monkeypatch.setattr(
        "app.api.prediction.predict_cad",
        mock_predict_cad,
    )

    monkeypatch.setattr(
        "app.api.prediction.save_prediction",
        mock_save_prediction,
    )

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
