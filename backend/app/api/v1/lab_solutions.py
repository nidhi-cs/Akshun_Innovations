
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from app.core.database import get_database


router = APIRouter(
    prefix="/api/v1/lab-solutions",
    tags=["Lab Solutions"],
)


@router.get("")
def get_lab_solutions(
    db: Database[dict[str, Any]] = Depends(get_database),
):
    labs = list(
        db["lab_solutions"]
        .find({}, {"_id": 0})
        .sort("name", 1)
    )

    return {
        "items": labs,
        "total": len(labs),
    }


@router.get("/{slug}")
def get_lab_solution(
    slug: str,
    db: Database[dict[str, Any]] = Depends(get_database),
):
    lab = db["lab_solutions"].find_one(
        {"slug": slug},
        {"_id": 0},
    )

    if lab is None:
        raise HTTPException(
            status_code=404,
            detail="Lab solution not found",
        )

    return lab
