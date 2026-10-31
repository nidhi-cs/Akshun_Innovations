from __future__ import annotations

from functools import lru_cache
import json

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    mongodb_uri: str = Field(
        default="mongodb://localhost:27017",
        validation_alias="MONGODB_URI",
    )
    mongodb_database: str = Field(
        default="akshunn_innovations",
        validation_alias="MONGODB_DATABASE",
    )
    cors_allowed_origins: list[str] = Field(
        default=["http://localhost:3000"],
        validation_alias="CORS_ALLOWED_ORIGINS",
    )
    mongodb_server_selection_timeout_ms: int = Field(
        default=3000,
        gt=0,
        validation_alias="MONGODB_SERVER_SELECTION_TIMEOUT_MS",
    )
    app_env: str = Field(default="development", validation_alias="APP_ENV")
    log_level: str = Field(default="INFO", validation_alias="LOG_LEVEL")

    @field_validator("mongodb_uri")
    @classmethod
    def validate_mongodb_uri(cls, value: str) -> str:
        if not value or not value.startswith("mongodb"):
            raise ValueError("MONGODB_URI must be a valid MongoDB connection string.")
        return value

    @field_validator("mongodb_database")
    @classmethod
    def validate_mongodb_database(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("MONGODB_DATABASE must be set.")
        return value.strip()

    @field_validator("cors_allowed_origins", mode="before")
    @classmethod
    def parse_cors_allowed_origins(cls, value: object) -> list[str]:
        if value is None:
            return ["http://localhost:3000"]
        if isinstance(value, str):
            parsed = json.loads(value)
            if not isinstance(parsed, list):
                raise ValueError("CORS_ALLOWED_ORIGINS must be a JSON array of origins.")
            return [str(origin).strip() for origin in parsed if str(origin).strip()]
        if isinstance(value, list):
            return [str(origin).strip() for origin in value if str(origin).strip()]
        raise ValueError("CORS_ALLOWED_ORIGINS must be a JSON array of origins.")

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()
