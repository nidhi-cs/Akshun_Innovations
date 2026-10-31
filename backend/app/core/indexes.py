from __future__ import annotations

import logging
from typing import Any

from pymongo.database import Database

logger = logging.getLogger("akshunn.indexes")


def _safe_create_index(collection: Any, field: str | list[tuple[str, int]], *, unique: bool = False) -> None:
    if not hasattr(collection, "create_index"):
        return

    try:
        collection.create_index(field, unique=unique)
    except Exception:
        logger.warning(
            "Could not create index for %s on %s (unique=%s)",
            getattr(collection, "name", "unknown"),
            field,
            unique,
        )


def ensure_mongodb_indexes(database: Database[dict[str, Any]]) -> None:
    specs = [
        ("products", [("slug", 1)], True),
        ("products", [("modelNo", 1)], False),
        ("products", [("categorySlug", 1)], False),
        ("products", [("subCategorySlug", 1)], False),
        ("products", [("categorySlug", 1), ("subCategorySlug", 1)], False),
        ("categories", [("slug", 1)], True),
        ("subcategories", [("slug", 1)], True),
        ("subcategories", [("categorySlug", 1)], False),
        ("kits", [("slug", 1)], True),
        ("lab_solutions", [("slug", 1)], True),
        ("product_detail_content", [("modelNo", 1)], True),
        ("quote_requests", [("email", 1)], False),
        ("quote_requests", [("created_at", -1)], False),
        ("contact_messages", [("email", 1)], False),
        ("contact_messages", [("created_at", -1)], False),
    ]

    for collection_name, index_fields, unique in specs:
        collection = database[collection_name]
        try:
            if unique and hasattr(collection, "aggregate"):
                duplicates = collection.aggregate([
                    {"$group": {"_id": "$" + index_fields[0][0], "count": {"$sum": 1}}},
                    {"$match": {"count": {"$gt": 1}}},
                ])
                if any(True for _ in duplicates):
                    logger.warning(
                        "Skipping unique index on %s.%s because duplicate values were found.",
                        collection_name,
                        index_fields[0][0],
                    )
                    continue
            _safe_create_index(collection, index_fields, unique=unique)
        except Exception:
            logger.warning(
                "Index initialization skipped for %s.%s",
                collection_name,
                index_fields,
            )
