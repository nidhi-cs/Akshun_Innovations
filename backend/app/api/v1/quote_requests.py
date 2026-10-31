from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import AliasChoices, BaseModel, ConfigDict, Field
from pymongo.database import Database

from app.core.database import get_database
from app.core.rate_limit import rate_limit_public_endpoint

router = APIRouter(prefix="/api/v1", tags=["Quote Requests"])


class QuoteRequestCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    full_name: str = Field(
        ...,
        min_length=1,
        validation_alias=AliasChoices("full_name", "fullName"),
    )
    email: str
    company: str | None = Field(
        default=None,
        validation_alias=AliasChoices("company", "company"),
    )
    phone: str | None = Field(
        default=None,
        validation_alias=AliasChoices("phone", "phone"),
    )
    job_title: str | None = Field(
        default=None,
        validation_alias=AliasChoices("job_title", "jobTitle"),
    )
    country: str = Field(
        ...,
        min_length=1,
        validation_alias=AliasChoices("country", "country"),
    )
    product_category: str = Field(
        ...,
        min_length=1,
        validation_alias=AliasChoices("product_category", "productCategory"),
    )
    product_name: str | None = Field(
        default=None,
        validation_alias=AliasChoices("product_name", "productName"),
    )
    quantity: str | None = Field(
        default=None,
        validation_alias=AliasChoices("quantity", "quantity"),
    )
    product_model: str | None = Field(
        default=None,
        validation_alias=AliasChoices("product_model", "productModel"),
    )
    purchase_type: str | None = Field(
        default=None,
        validation_alias=AliasChoices("purchase_type", "purchaseType"),
    )
    currency: str | None = Field(
        default=None,
        validation_alias=AliasChoices("currency", "currency"),
    )
    budget: str | None = Field(
        default=None,
        validation_alias=AliasChoices("budget", "budget"),
    )
    timeline: str | None = Field(
        default=None,
        validation_alias=AliasChoices("timeline", "timeline"),
    )
    industry: str | None = Field(
        default=None,
        validation_alias=AliasChoices("industry", "industry"),
    )
    application: str | None = Field(
        default=None,
        validation_alias=AliasChoices("application", "application"),
    )
    technical_requirements: str | None = Field(
        default=None,
        validation_alias=AliasChoices("technical_requirements", "technicalRequirements"),
    )
    connectivity: str | None = Field(
        default=None,
        validation_alias=AliasChoices("connectivity", "connectivity"),
    )
    comments: str | None = Field(
        default=None,
        validation_alias=AliasChoices("comments", "comments"),
    )
    consent: bool = Field(default=False)


@router.post("/quote-requests")
def create_quote_request(
    payload: QuoteRequestCreate,
    _rate_limited: None = Depends(rate_limit_public_endpoint),
    db: Database[dict[str, Any]] = Depends(get_database),
) -> dict[str, str]:
    if not payload.consent:
        raise HTTPException(
            status_code=400,
            detail="Consent is required before submitting a quote request.",
        )

    document = payload.model_dump(exclude_none=True)
    document["created_at"] = datetime.now(timezone.utc).isoformat()
    result = db["quote_requests"].insert_one(document)

    return {
        "status": "success",
        "message": "Quote request submitted successfully.",
        "id": str(result.inserted_id),
    }
