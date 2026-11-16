def test_history_returns_success(client):
    response = client.get("/api/v1/history")

    assert response.status_code == 200

    data = response.json()

    assert "total" in data
    assert "page" in data
    assert "limit" in data
    assert "records" in data
    assert isinstance(data["records"], list)


def test_history_rejects_invalid_page(client):
    response = client.get("/api/v1/history?page=0")

    assert response.status_code == 422


def test_history_rejects_invalid_limit(client):
    response = client.get("/api/v1/history?limit=101")

    assert response.status_code == 422
