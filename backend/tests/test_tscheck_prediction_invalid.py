"""POST /api/predictions rejects invalid input with 422."""

BASE = {
    "waste_type": "Spent Brewery Mash & Grains",
    "quantity_tons": 50,
    "source_location": "Urban Hospitality Hub",
    "season": "Summer / Peak High Sugar",
    "moisture_level": 78,
}


def test_quantity_zero_rejected(client):
    body = {**BASE, "quantity_tons": 0}
    resp = client.post("/predictions", json=body)
    assert resp.status_code == 422, resp.text


def test_quantity_too_high_rejected(client):
    body = {**BASE, "quantity_tons": 501}
    resp = client.post("/predictions", json=body)
    assert resp.status_code == 422, resp.text


def test_moisture_out_of_range_rejected(client):
    body = {**BASE, "moisture_level": 10}
    resp = client.post("/predictions", json=body)
    assert resp.status_code == 422, resp.text

    body2 = {**BASE, "moisture_level": 90}
    resp2 = client.post("/predictions", json=body2)
    assert resp2.status_code == 422, resp2.text


def test_missing_fields_rejected(client):
    body = {"waste_type": "Spent Brewery Mash & Grains"}
    resp = client.post("/predictions", json=body)
    assert resp.status_code == 422, resp.text
