def test_signup_success(client):
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "email": "testuser@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"
    assert "id" in data
    assert "password" not in data

def test_signup_duplicate_username_fails(client):
    # First signup
    response1 = client.post(
        "/auth/register",
        json={"username": "testuser", "email": "testuser@example.com", "password": "password123"}
    )
    assert response1.status_code == 201

    # Duplicate username signup
    response2 = client.post(
        "/auth/register",
        json={"username": "testuser", "email": "other@example.com", "password": "password123"}
    )
    assert response2.status_code == 409
    assert response2.json()["detail"] == "Username already taken"

def test_signup_duplicate_email_fails(client):
    # First signup
    response1 = client.post(
        "/auth/register",
        json={"username": "testuser1", "email": "testuser@example.com", "password": "password123"}
    )
    assert response1.status_code == 201

    # Duplicate email signup
    response2 = client.post(
        "/auth/register",
        json={"username": "testuser2", "email": "testuser@example.com", "password": "password123"}
    )
    assert response2.status_code == 409
    assert response2.json()["detail"] == "Email already registered"

def test_login_success(client):
    # Signup user
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "email": "testuser@example.com", "password": "password123"}
    )
    assert response.status_code == 201

    # Login
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password_fails(client):
    # Signup user
    response = client.post(
        "/auth/register",
        json={"username": "testuser", "email": "testuser@example.com", "password": "password123"}
    )
    assert response.status_code == 201

    # Login with wrong password
    response = client.post(
        "/auth/login",
        data={"username": "testuser", "password": "wrongpassword"}
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid username or password"
