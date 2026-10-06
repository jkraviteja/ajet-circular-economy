"""GET /api/predictions/model returns Random Forest metadata."""


def test_model_metadata(client):
    resp = client.get("/predictions/model")
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["algorithm"] == "RandomForestRegressor"
    assert data["is_demo"] is True
    assert data["training_samples"] == 1600
    assert 0 <= data["r2_score"] <= 1
    fi = data["feature_importance"]
    assert len(fi) == 5
    total = sum(item["importance"] for item in fi)
    assert 0.95 <= total <= 1.05
