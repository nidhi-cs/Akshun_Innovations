
import json
from pathlib import Path

from pymongo import MongoClient, UpdateOne

from app.core.config import get_settings
settings = get_settings()


# Locate the project root and JSON data file
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATA_FILE = PROJECT_ROOT / "frontend" / "data" / "lab-solutions.json"


def main():
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Data file not found: {DATA_FILE}")

    with DATA_FILE.open("r", encoding="utf-8") as file:
        labs = json.load(file)

    if not isinstance(labs, list):
        raise ValueError("Expected lab-solutions.json to contain a JSON list.")

    if any(not isinstance(lab, dict) or not lab.get("id") for lab in labs):
        raise ValueError("Every lab must be an object with an 'id' field.")

    client = MongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=settings.mongodb_server_selection_timeout_ms,
    )

    try:
        db = client[settings.mongodb_database]
        collection = db["lab_solutions"]

        operations = [
            UpdateOne(
                {"id": lab["id"]},
                {"$set": lab},
                upsert=True,
            )
            for lab in labs
        ]

        if operations:
            result = collection.bulk_write(operations)

            print(f"Lab solutions processed: {len(labs)}")
            print(f"Inserted: {result.upserted_count}")
            print(f"Modified: {result.modified_count}")
            print(f"Matched: {result.matched_count}")
        else:
            print("No lab solutions found in the JSON file.")

    finally:
        client.close()


if __name__ == "__main__":
    main()
