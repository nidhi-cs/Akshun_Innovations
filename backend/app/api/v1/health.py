import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.core.database import get_mongo_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["health"])


class HealthResponse(BaseModel):
    status: str
    database: str


@router.get("/health", response_model=HealthResponse)
def health_check(client: MongoClient[dict[str, Any]] = Depends(get_mongo_client)) -> HealthResponse:
    admin = getattr(client, "admin", None)
    if admin is not None:
        try:
            admin.command("ping")
        except PyMongoError as exc:
            logger.warning("MongoDB health check failed (%s)", type(exc).__name__)
            raise HTTPException(status_code=503, detail="Database connection unavailable") from exc

    return HealthResponse(status="ok", database="connected")
