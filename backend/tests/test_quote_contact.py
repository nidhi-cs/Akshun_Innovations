from __future__ import annotations

from typing import Any

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


class FakeCollection:
    def __init__(self) -> None:
        self.inserted: list[dict[str, Any]] = []

    def insert_one(self, document: dict[str, Any]) -> Any:
        self.inserted.append(document)

        class InsertResult:
            inserted_id = "mock-id"

        return InsertResult()


class FakeDatabase:
    def __init__(self) -> None:
        self.collections: dict[str, FakeCollection] = {
            "quote_requests": FakeCollection(),
            "contact_messages": FakeCollection(),
        }

    def __getitem__(self, key: str) -> FakeCollection:
        return self.collections[key]


class FakeMongoClient:
    def __init__(self) -> None:
        self.db = FakeDatabase()
        self.closed = False

    def __getitem__(self, key: str) -> FakeDatabase:
        return self.db

    def close(self) -> None:
        self.closed = True


def make_settings() -> Settings:
    return Settings(
        _env_file=None,
        MONGODB_URI="mongodb://localhost:27017",
        MONGODB_DATABASE="test_database",
        CORS_ALLOWED_ORIGINS=["http://localhost:3000"],
    )


def test_quote_request_endpoint_saves_to_quote_requests_collection(monkeypatch: Any) -> None:
    client = FakeMongoClient()
    monkeypatch.setattr("app.main.MongoClient", lambda *args, **kwargs: client)

    with TestClient(create_app(make_settings())) as test_client:
        response = test_client.post(
            "/api/v1/quote-requests",
            json={
                "fullName": "Jane Doe",
                "email": "jane@example.com",
                "company": "Acme Labs",
                "country": "India",
                "productCategory": "IoT Sensors",
                "consent": True,
            },
        )

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert client.db.collections["quote_requests"].inserted[0]["full_name"] == "Jane Doe"
    assert client.db.collections["quote_requests"].inserted[0]["email"] == "jane@example.com"


def test_contact_endpoint_saves_to_contact_messages_collection(monkeypatch: Any) -> None:
    client = FakeMongoClient()
    monkeypatch.setattr("app.main.MongoClient", lambda *args, **kwargs: client)

    with TestClient(create_app(make_settings())) as test_client:
        response = test_client.post(
            "/api/v1/contact",
            json={
                "fullName": "John Smith",
                "email": "john@example.com",
                "enquiryType": "Product Enquiry",
                "message": "Need pricing for a sensor node.",
                "consent": True,
            },
        )

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert client.db.collections["contact_messages"].inserted[0]["full_name"] == "John Smith"
    assert client.db.collections["contact_messages"].inserted[0]["enquiry_type"] == "Product Enquiry"


def test_openapi_includes_quote_and_contact_endpoints(monkeypatch: Any) -> None:
    client = FakeMongoClient()
    monkeypatch.setattr("app.main.MongoClient", lambda *args, **kwargs: client)

    with TestClient(create_app(make_settings())) as test_client:
        schema = test_client.get("/openapi.json").json()

    assert "/api/v1/quote-requests" in schema["paths"]
    assert "/api/v1/contact" in schema["paths"]


def test_contact_request_validation_fails_cleanly(monkeypatch: Any) -> None:
    client = FakeMongoClient()
    monkeypatch.setattr("app.main.MongoClient", lambda *args, **kwargs: client)

    with TestClient(create_app(make_settings())) as test_client:
        response = test_client.post(
            "/api/v1/contact",
            json={
                "fullName": "Example User",
                "email": "example@example.com",
                "enquiryType": "General Enquiry",
            },
        )

    assert response.status_code == 422
    assert response.json()["detail"] == "Request validation failed."


def test_contact_endpoint_rate_limits_excessive_requests(monkeypatch: Any) -> None:
    client = FakeMongoClient()
    monkeypatch.setattr("app.main.MongoClient", lambda *args, **kwargs: client)

    with TestClient(create_app(make_settings())) as test_client:
        for _ in range(5):
            response = test_client.post(
                "/api/v1/contact",
                json={
                    "fullName": "Example User",
                    "email": "example@example.com",
                    "enquiryType": "General Enquiry",
                    "message": "Need information.",
                    "consent": True,
                },
            )
            assert response.status_code == 200

        blocked = test_client.post(
            "/api/v1/contact",
            json={
                "fullName": "Example User",
                "email": "example@example.com",
                "enquiryType": "General Enquiry",
                "message": "Need information.",
                "consent": True,
            },
        )

    assert blocked.status_code == 429
    assert blocked.json()["detail"] == "Too many requests. Please try again later."


def test_cors_headers_are_present_for_allowed_origin(monkeypatch: Any) -> None:
    client = FakeMongoClient()
    monkeypatch.setattr("app.main.MongoClient", lambda *args, **kwargs: client)

    with TestClient(create_app(make_settings())) as test_client:
        response = test_client.get(
            "/api/v1/health",
            headers={"Origin": "http://localhost:3000"},
        )

    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
