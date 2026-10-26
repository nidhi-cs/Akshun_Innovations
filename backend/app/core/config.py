from functools import lru_cache

from pydantic import Field
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


@lru_cache
def get_settings() -> Settings:
    return Settings()
