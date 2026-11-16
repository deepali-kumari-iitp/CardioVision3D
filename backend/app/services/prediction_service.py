import pandas as pd

from app.services.model_loader import load_model


_model = None


def get_model():
    global _model

    if _model is None:
        _model = load_model()

    return _model


def predict_cad(patient_data: dict) -> dict:
    model = get_model()

    input_data = pd.DataFrame([patient_data])

    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

    class_probabilities = {
        str(class_name): float(probability)
        for class_name, probability in zip(
            model.classes_,
            probabilities
        )
    }

    return {
        "prediction": str(prediction),
        "probabilities": class_probabilities
    }
