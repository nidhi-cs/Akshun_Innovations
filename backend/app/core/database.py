from typing import Any

from fastapi import Depends, HTTPException, Request
from pymongo import MongoClient
from pymongo.database import Database

from app.core.config import Settings, get_settings


def get_mongo_client(request: Request) -> MongoClient[dict[str, Any]]:
    client = getattr(request.app.state, "mongo_client", None)
    if client is None:
        raise HTTPException(status_code=503, detail="Database connection unavailable")
    return client


def get_database(
    request: Request,
    settings: Settings = Depends(get_settings),
) -> Database[dict[str, Any]]:
    return get_mongo_client(request)[settings.mongodb_database]
