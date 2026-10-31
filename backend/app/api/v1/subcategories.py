
from typing import Any

from fastapi import APIRouter, Depends, Query
from pymongo.database import Database

from app.core.database import get_database

router = APIRouter(
    prefix="/api/v1/subcategories",
    tags=["Subcategories"],
)


@router.get("")
def get_subcategories(
    category: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    db: Database[dict[str, Any]] = Depends(get_database),
):
    filters: dict[str, Any] = {}

    if category and category.strip():
        filters["categorySlug"] = category.strip().lower()

    subcategories = list(
        db["subcategories"]
        .find(filters, {"_id": 0})
        .sort("order", 1)
    )

    return {
        "items": subcategories,
        "total": len(subcategories),
    }
