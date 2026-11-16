import pytest
from sklearn.pipeline import Pipeline
from unittest.mock import MagicMock

from app.services import model_loader


def test_load_model_file_not_found(monkeypatch):
    monkeypatch.setattr(
        model_loader,
        "MODEL_PATH",
        MagicMock(exists=lambda: False),
    )

    with pytest.raises(FileNotFoundError, match="Trained model not found"):
        model_loader.load_model()


def test_load_model_returns_valid_pipeline(monkeypatch):
    fake_pipeline = Pipeline([])

    monkeypatch.setattr(
        model_loader,
        "MODEL_PATH",
        MagicMock(exists=lambda: True),
    )

    monkeypatch.setattr(
        model_loader.joblib,
        "load",
        lambda path: fake_pipeline,
    )

    result = model_loader.load_model()

    assert result is fake_pipeline
    assert isinstance(result, Pipeline)


def test_load_model_rejects_invalid_artifact(monkeypatch):
    monkeypatch.setattr(
        model_loader,
        "MODEL_PATH",
        MagicMock(exists=lambda: True),
    )

    monkeypatch.setattr(
        model_loader.joblib,
        "load",
        lambda path: {"invalid": "model"},
    )

    with pytest.raises(TypeError, match="not an sklearn Pipeline"):
        model_loader.load_model()
