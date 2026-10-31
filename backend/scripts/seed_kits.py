
import json
from pathlib import Path

from pymongo import MongoClient, UpdateOne

from app.core.config import get_settings


def seed_kits():
    project_root = Path(__file__).resolve().parents[2]
    data_file = project_root / "frontend" / "data" / "kits.json"

    with data_file.open("r", encoding="utf-8") as file:
        kits = json.load(file)

    settings = get_settings()
    client = MongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=settings.mongodb_server_selection_timeout_ms,
    )

    try:
        db = client[settings.mongodb_database]

        operations = [
            UpdateOne(
                {"id": kit["id"]},
                {"$set": kit},
                upsert=True,
            )
            for kit in kits
        ]

        if operations:
            result = db["kits"].bulk_write(operations, ordered=False)
            print(f"Kits processed: {len(kits)}")
            print(f"Inserted: {result.upserted_count}")
            print(f"Modified: {result.modified_count}")
            print(f"Matched: {result.matched_count}")
        else:
            print("No kits found in the JSON file.")
    finally:
        client.close()


if __name__ == "__main__":
    seed_kits()
