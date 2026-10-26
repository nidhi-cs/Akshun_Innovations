import re
from typing import Any

from fastapi import APIRouter, Depends, Query,HTTPException
from pymongo.database import Database

from app.core.database import get_database

router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"],
)


@router.get("")
def get_products(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    q: str | None = Query(default=None, min_length=1, max_length=100),
    category: str | None = Query(default=None, min_length=1, max_length=100),
    db: Database[dict[str, Any]] = Depends(get_database),
):

    products_collection = db["products"]
    filters: dict[str, Any] = {}

    if q and q.strip():
        search_term = re.escape(q.strip())
        filters["$or"] = [
            {"name": {"$regex": search_term, "$options": "i"}},
            {"modelNo": {"$regex": search_term, "$options": "i"}},
            {"description": {"$regex": search_term, "$options": "i"}},
        ]

    if category and category.strip():
        filters["categorySlug"] = category.strip().lower()

    total = products_collection.count_documents(filters)
    skip = (page - 1) * page_size

    products = list(
        products_collection.find(filters, {"_id": 0})
        .skip(skip)
        .limit(page_size)
    )

    return {
        "items": products,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }

@router.get("/{slug}")
def get_product(
    slug: str,
    db: Database[dict[str, Any]] = Depends(get_database),
):
    product = db["products"].find_one(
        {"slug": slug},
        {"_id": 0},
    )

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product

