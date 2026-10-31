
import json
from pathlib import Path

from pymongo import MongoClient, UpdateOne

from app.core.config import get_settings


def load_subcategories():
    project_root = Path(__file__).resolve().parents[2]
    data_file = project_root / "frontend" / "data" / "subcategories.json"

    with data_file.open("r", encoding="utf-8") as file:
        return json.load(file)


def seed_subcategories():
    settings = get_settings()
    client = MongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=settings.mongodb_server_selection_timeout_ms,
    )

    try:
        db = client[settings.mongodb_database]
        subcategories = load_subcategories()

        operations = [
            UpdateOne(
                {"id": item["id"]},
                {"$set": item},
                upsert=True,
            )
            for item in subcategories
        ]

        if operations:
            result = db["subcategories"].bulk_write(
                operations,
                ordered=False,
            )
            print(f"Subcategories processed: {len(subcategories)}")
            print(f"Inserted: {result.upserted_count}")
            print(f"Modified: {result.modified_count}")
            print(
                "Already unchanged:",
                result.matched_count - result.modified_count,
            )
    finally:
        client.close()


if __name__ == "__main__":
    seed_subcategories()
