"""POST /api/predictions with a valid body returns a full prediction."""


VALID_BODY = {
    "waste_type": "Spent Brewery Mash & Grains",
    "quantity_tons": 50,
    "source_location": "Urban Hospitality Hub",
    "season": "Summer / Peak High Sugar",
    "moisture_level": 78,
}


def test_prediction_valid_body(client):
    resp = client.post("/predictions", json=VALID_BODY)
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert "Random Forest" in data["model_label"]
    low = data["output_range_low_tons"]
    high = data["output_range_high_tons"]
    out = data["processing_output_tons"]
    assert isinstance(out, (int, float))
    # approximate bound check with small tolerance
    assert low - 0.5 <= out <= high + 0.5
    assert len(data["breakdown"]) == 3
    traj = data["trajectory"]
    assert len(traj) == 4
    outputs = [w["output"] for w in traj]
    assert outputs == sorted(outputs)
    assert len(data["feature_importance"]) == 5
    assert isinstance(data["insights"], list)
    assert len(data["insights"]) > 0
    assert all(isinstance(s, str) for s in data["insights"])
