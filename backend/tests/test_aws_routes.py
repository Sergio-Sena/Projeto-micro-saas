import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)

# Mock para autenticação
@pytest.fixture
def mock_auth():
    with patch("app.routes.aws.get_current_user") as mock:
        mock.return_value = {"username": "testuser", "email": "test@example.com"}
        yield mock

# Testes para rotas AWS
def test_save_aws_credentials(mock_auth):
    response = client.post(
        "/api/aws/credentials",
        json={"accessKeyId": "AKIAIOSFODNN7EXAMPLE", "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Credenciais AWS salvas com sucesso"}

def test_get_lambda_functions(mock_auth):
    response = client.get("/api/aws/lambda")
    assert response.status_code == 200
    assert len(response.json()) == 3
    assert response.json()[0]["name"] == "api-handler"

def test_get_ec2_instances(mock_auth):
    response = client.get("/api/aws/ec2")
    assert response.status_code == 200
    assert len(response.json()) == 3
    assert response.json()[0]["name"] == "Web Server"

def test_get_s3_buckets(mock_auth):
    response = client.get("/api/aws/s3")
    assert response.status_code == 200
    assert len(response.json()) == 3
    assert response.json()[0]["name"] == "my-website-bucket"

def test_get_dynamodb_tables(mock_auth):
    response = client.get("/api/aws/dynamodb")
    assert response.status_code == 200
    assert len(response.json()) == 3
    assert response.json()[0]["name"] == "Users"