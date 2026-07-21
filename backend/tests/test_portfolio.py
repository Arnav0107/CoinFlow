import pytest

@pytest.fixture
def auth_headers(client):
    # Create a user
    client.post(
        "/auth/register",
        json={"username": "portfolio_user", "email": "portfolio@example.com", "password": "password123"}
    )
    # Log in
    response = client.post(
        "/auth/login",
        data={"username": "portfolio_user", "password": "password123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_create_portfolio_entry_authenticated(client, auth_headers):
    payload = {
        "coin_id": "bitcoin",
        "symbol": "BTC",
        "amount": 1.5,
        "wallet_address": "0x123abc"
    }
    response = client.post("/portfolio/", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["coin_id"] == "bitcoin"
    assert data["symbol"] == "BTC"
    assert data["amount"] == 1.5
    assert data["wallet_address"] == "0x123abc"
    assert "id" in data

def test_fetch_portfolio_authenticated(client, auth_headers):
    # Create an entry first
    payload = {
        "coin_id": "ethereum",
        "symbol": "ETH",
        "amount": 10.0,
        "wallet_address": None
    }
    client.post("/portfolio/", json=payload, headers=auth_headers)

    # Fetch portfolio
    response = client.get("/portfolio/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["coin_id"] == "ethereum"
    assert data[0]["symbol"] == "ETH"
    assert data[0]["amount"] == 10.0
    assert data[0]["wallet_address"] is None

def test_update_portfolio_entry(client, auth_headers):
    # Create entry
    payload = {
        "coin_id": "bitcoin",
        "symbol": "BTC",
        "amount": 1.5
    }
    create_response = client.post("/portfolio/", json=payload, headers=auth_headers)
    holding_id = create_response.json()["id"]

    # Update amount
    update_response = client.put(f"/portfolio/{holding_id}", json={"amount": 2.5}, headers=auth_headers)
    assert update_response.status_code == 200
    assert update_response.json()["amount"] == 2.5

def test_delete_portfolio_entry(client, auth_headers):
    # Create entry
    payload = {
        "coin_id": "bitcoin",
        "symbol": "BTC",
        "amount": 1.5
    }
    create_response = client.post("/portfolio/", json=payload, headers=auth_headers)
    holding_id = create_response.json()["id"]

    # Delete entry
    delete_response = client.delete(f"/portfolio/{holding_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    # Try to fetch list and confirm empty
    list_response = client.get("/portfolio/", headers=auth_headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 0

def test_unauthenticated_requests_rejected(client):
    # Try creating holding without auth headers
    payload = {
        "coin_id": "bitcoin",
        "symbol": "BTC",
        "amount": 1.5
    }
    response = client.post("/portfolio/", json=payload)
    assert response.status_code == 401

    # Try listing holdings
    response = client.get("/portfolio/")
    assert response.status_code == 401

    # Try updating holding
    response = client.put("/portfolio/1", json={"amount": 2.5})
    assert response.status_code == 401

    # Try deleting holding
    response = client.delete("/portfolio/1")
    assert response.status_code == 401
