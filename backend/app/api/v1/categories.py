
from typing import Any

from fastapi import APIRouter, Depends
from pymongo.database import Database

from app.core.database import get_database

router = APIRouter(
    prefix="/api/v1/categories",
    tags=["Categories"],
)


@router.get("")
def get_categories(
    db: Database[dict[str, Any]] = Depends(get_database),
):
    categories = db["products"].distinct("categorySlug")

    return {
        "items": [
            {"slug": category}
            for category in sorted(categories)
            if category
        ],
        "total": len([category for category in categories if category]),
    }
