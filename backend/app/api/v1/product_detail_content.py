
from fastapi import APIRouter, HTTPException, Request

from app.core.config import get_settings

router = APIRouter(
    prefix="/product-detail-content",
    tags=["Product Detail Content"]
)

settings = get_settings()

@router.get("")
def get_all_product_detail_content(request: Request):
    db = request.app.state.mongo_client[
        settings.mongodb_database
    ]

    collection = db["product_detail_content"]

    items = list(
        collection.find({}, {"_id": 0})
    )

    return {
        "items": items,
        "total": len(items)
    }
@router.get("/{model_no}")
def get_product_detail_content(model_no: str, request: Request):

    db = request.app.state.mongo_client[
        settings.mongodb_database
    ]

    collection = db["product_detail_content"]

    content = collection.find_one(
        {"modelNo": model_no},
        {"_id": 0}
    )

    if not content:
        raise HTTPException(
            status_code=404,
            detail="Product detail content not found"
        )

    return content
