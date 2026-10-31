from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import AliasChoices, BaseModel, ConfigDict, Field
from pymongo.database import Database

from app.core.database import get_database
from app.core.rate_limit import rate_limit_public_endpoint

router = APIRouter(prefix="/api/v1", tags=["Contact"])


class ContactMessageCreate(BaseModel):
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
    enquiry_type: str = Field(
        ...,
        min_length=1,
        validation_alias=AliasChoices("enquiry_type", "enquiryType"),
    )
    product_or_industry: str | None = Field(
        default=None,
        validation_alias=AliasChoices("product_or_industry", "productOrIndustry"),
    )
    message: str = Field(
        ...,
        min_length=1,
        validation_alias=AliasChoices("message", "message"),
    )
    consent: bool = Field(default=False)


@router.post("/contact")
def create_contact_message(
    payload: ContactMessageCreate,
    _rate_limited: None = Depends(rate_limit_public_endpoint),
    db: Database[dict[str, Any]] = Depends(get_database),
) -> dict[str, str]:
    if not payload.consent:
        raise HTTPException(
            status_code=400,
            detail="Consent is required before submitting a contact message.",
        )

    document = payload.model_dump(exclude_none=True)
    document["created_at"] = datetime.now(timezone.utc).isoformat()
    result = db["contact_messages"].insert_one(document)

    return {
        "status": "success",
        "message": "Contact message submitted successfully.",
        "id": str(result.inserted_id),
    }
