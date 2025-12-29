from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_create_activity():
    response = client.post("/activities", json={"name": "Yoga", "description": "A relaxing yoga session.", "max_participants": 10})
    assert response.status_code == 201
    assert response.json()["name"] == "Yoga"

def test_get_activities():
    response = client.get("/activities")
    assert response.status_code == 200
    assert isinstance(response.json(), list)