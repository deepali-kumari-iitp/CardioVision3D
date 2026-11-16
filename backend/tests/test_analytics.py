def test_analytics_returns_empty_database_summary(client):
    response = client.get("/api/v1/analytics?days=30")

    assert response.status_code == 200

    data = response.json()

    assert data["period_days"] == 30
    assert data["summary"]["total_predictions"] == 0
    assert data["summary"]["cad_predictions"] == 0
    assert data["summary"]["normal_predictions"] == 0
    assert data["summary"]["cad_percentage"] == 0.0
    assert data["summary"]["normal_percentage"] == 0.0
    assert data["summary"]["average_cad_probability"] is None
    assert data["daily_trend"] == []


def test_analytics_rejects_days_below_minimum(client):
    response = client.get("/api/v1/analytics?days=6")

    assert response.status_code == 422


def test_analytics_rejects_days_above_maximum(client):
    response = client.get("/api/v1/analytics?days=366")

    assert response.status_code == 422
