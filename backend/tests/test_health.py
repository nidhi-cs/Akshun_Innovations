from typing import Any

from fastapi.testclient import TestClient
from pymongo.errors import ServerSelectionTimeoutError

from app.core.config import Settings
from app.main import create_app


class FakeAdmin:
    def __init__(self, error: Exception | None = None) -> None:
        self.error = error
        self.commands: list[str] = []

    def command(self, name: str) -> dict[str, int]:
        self.commands.append(name)
        if self.error is not None:
            raise self.error
        return {"ok": 1}


class FakeMongoClient:
    def __init__(self, error: Exception | None = None) -> None:
        self.admin = FakeAdmin(error)
        self.closed = False

    def close(self) -> None:
        self.closed = True


def make_settings() -> Settings:
    return Settings(
        _env_file=None,
        MONGODB_URI="mongodb://localhost:27017",
        MONGODB_DATABASE="test_database",
        CORS_ALLOWED_ORIGINS=["http://localhost:3000"],
    )


def test_health_endpoint_reports_connected_database(monkeypatch: Any) -> None:
    client = FakeMongoClient()
    monkeypatch.setattr("app.main.MongoClient", lambda *args, **kwargs: client)

    with TestClient(create_app(make_settings())) as test_client:
        response = test_client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "connected"}
    assert client.admin.commands == ["ping"]
    assert client.closed


def test_health_endpoint_reports_database_failure(monkeypatch: Any) -> None:
    client = FakeMongoClient(ServerSelectionTimeoutError("database unavailable"))
    monkeypatch.setattr("app.main.MongoClient", lambda *args, **kwargs: client)

    with TestClient(create_app(make_settings())) as test_client:
        response = test_client.get("/api/v1/health")

    assert response.status_code == 503
    assert response.json() == {"detail": "Database connection unavailable"}
    assert client.closed
