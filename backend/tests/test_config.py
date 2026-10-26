from app.core.config import Settings


def test_settings_load_mongodb_and_cors_environment(monkeypatch) -> None:
    monkeypatch.setenv("MONGODB_URI", "mongodb://db.example.test:27017")
    monkeypatch.setenv("MONGODB_DATABASE", "akshunn_test")
    monkeypatch.setenv("CORS_ALLOWED_ORIGINS", '["http://localhost:3000","https://site.example"]')
    monkeypatch.setenv("MONGODB_SERVER_SELECTION_TIMEOUT_MS", "1500")

    settings = Settings(_env_file=None)

    assert settings.mongodb_uri == "mongodb://db.example.test:27017"
    assert settings.mongodb_database == "akshunn_test"
    assert settings.cors_allowed_origins == ["http://localhost:3000", "https://site.example"]
    assert settings.mongodb_server_selection_timeout_ms == 1500


def test_settings_have_safe_local_development_defaults() -> None:
    settings = Settings(_env_file=None)

    assert settings.mongodb_uri == "mongodb://localhost:27017"
    assert settings.cors_allowed_origins == ["http://localhost:3000"]
