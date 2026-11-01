
import re
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo.database import Database

from app.core.database import get_database


router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"],
)


def normalize_slug(value: str) -> str:
    """
    Convert category names or search terms into URL-friendly slugs.

    Examples:
    Mechanical       -> mechanical
    IoT & Embedded   -> iot-embedded
    EV & Renewable   -> ev-renewable
    Civil & Chemical -> civil-chemical
    """
    return re.sub(
        r"[^a-z0-9]+",
        "-",
        value.lower(),
    ).strip("-")


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
    conditions: list[dict[str, Any]] = []

    q_value = q.strip() if isinstance(q, str) else None
    category_value = (
        category.strip() if isinstance(category, str) else None
    )

    # -----------------------------------------
    # SEARCH PRODUCTS
    # -----------------------------------------

    if q_value:
        search_term = re.escape(q_value)
        normalized_search = normalize_slug(q_value)

        search_conditions = [
            {"name": {"$regex": search_term, "$options": "i"}},
            {"modelNo": {"$regex": search_term, "$options": "i"}},
            {"description": {"$regex": search_term, "$options": "i"}},
            {"shortDescription": {"$regex": search_term, "$options": "i"}},
            {"categorySlug": {"$regex": search_term, "$options": "i"}},
            {"departmentSlug": {"$regex": search_term, "$options": "i"}},
            {"subCategorySlug": {"$regex": search_term, "$options": "i"}},
            {"tags": {"$regex": search_term, "$options": "i"}},
            {"specs.label": {"$regex": search_term, "$options": "i"}},
            {"specs.value": {"$regex": search_term, "$options": "i"}},
        ]

        # Exact normalized category-slug matching.
        # Supports searches such as:
        # Mechanical, IoT & Embedded, EV & Renewable.
        if normalized_search:
            search_conditions.append(
                {"categorySlug": normalized_search}
            )

        conditions.append({"$or": search_conditions})

    # -----------------------------------------
    # CATEGORY FILTER
    # -----------------------------------------

    if category_value:
        normalized_category = normalize_slug(category_value)

        conditions.append(
            {"categorySlug": normalized_category}
        )

    # -----------------------------------------
    # COMBINE SEARCH AND CATEGORY CONDITIONS
    # -----------------------------------------

    if conditions:
        filters["$and"] = conditions

    # -----------------------------------------
    # PAGINATION AND DATABASE QUERY
    # -----------------------------------------

    total = products_collection.count_documents(filters)

    skip = (page - 1) * page_size

    products = list(
        products_collection.find(
            filters,
            {"_id": 0},
        )
        .skip(skip)
        .limit(page_size)
    )

    total_pages = (total + page_size - 1) // page_size

    return {
        "items": products,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


# -----------------------------------------
# GET SINGLE PRODUCT BY SLUG
# -----------------------------------------

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
