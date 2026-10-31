
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from app.core.database import get_database

router = APIRouter(
    prefix="/api/v1/kits",
    tags=["Kits"],
)


@router.get("")
def get_kits(
    db: Database[dict[str, Any]] = Depends(get_database),
):
    kits = list(
        db["kits"]
        .find({}, {"_id": 0})
        .sort("name", 1)
    )

    return {
        "items": kits,
        "total": len(kits),
    }


@router.get("/{slug}")
def get_kit(
    slug: str,
    db: Database[dict[str, Any]] = Depends(get_database),
):
    kit = db["kits"].find_one(
        {"slug": slug},
        {"_id": 0},
    )

    if kit is None:
        raise HTTPException(
            status_code=404,
            detail="Kit not found",
        )

    return kit
