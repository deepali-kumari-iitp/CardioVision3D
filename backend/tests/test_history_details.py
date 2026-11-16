def test_history_details_returns_existing_record(client):
    response = client.get("/api/v1/history/1")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == 1
    assert data["prediction"] == "CAD"
    assert data["probabilities"]["CAD"] == 0.75
    assert data["probabilities"]["Normal"] == 0.25
    assert data["patient_data"]["Age"] == 53
    assert "created_at" in data


def test_history_details_returns_404_for_missing_record(client):
    response = client.get("/api/v1/history/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Prediction record not found"


def test_history_details_rejects_non_integer_id(client):
    response = client.get("/api/v1/history/invalid")

    assert response.status_code == 422
