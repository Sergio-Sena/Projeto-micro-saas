import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)

# Mock para banco de dados
@pytest.fixture
def mock_db():
    with patch("app.routes.auth.get_db") as mock:
        mock_db = MagicMock()
        mock.return_value = mock_db
        yield mock_db

# Testes para autenticação
def test_register_user(mock_db):
    mock_db.users.find_one.return_value = None
    mock_db.users.insert_one.return_value = MagicMock(inserted_id="123")
    
    response = client.post(
        "/api/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 201
    assert "id" in response.json()

def test_register_existing_user(mock_db):
    mock_db.users.find_one.return_value = {"username": "testuser"}
    
    response = client.post(
        "/api/register",
        json={"username": "testuser", "email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 400
    assert "error" in response.json()

def test_login_user(mock_db):
    # Mock para verificação de senha
    with patch("app.routes.auth.verify_password") as mock_verify:
        mock_verify.return_value = True
        mock_db.users.find_one.return_value = {
            "_id": "123",
            "username": "testuser",
            "email": "test@example.com",
            "hashed_password": "hashedpassword"
        }
        
        response = client.post(
            "/api/login",
            data={"username": "testuser", "password": "password123"}
        )
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert "token_type" in response.json()

def test_login_invalid_credentials(mock_db):
    # Mock para verificação de senha
    with patch("app.routes.auth.verify_password") as mock_verify:
        mock_verify.return_value = False
        mock_db.users.find_one.return_value = {
            "_id": "123",
            "username": "testuser",
            "email": "test@example.com",
            "hashed_password": "hashedpassword"
        }
        
        response = client.post(
            "/api/login",
            data={"username": "testuser", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        assert "detail" in response.json()