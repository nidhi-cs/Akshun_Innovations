
from pathlib import Path
import sys
import json

from pymongo import MongoClient, UpdateOne

# Locate backend directory and add it to Python's import path
BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import get_settings

settings = get_settings()

# Project root
PROJECT_ROOT = BACKEND_DIR.parent

# JSON source
DATA_FILE = (
    PROJECT_ROOT
    / "frontend"
    / "data"
    / "product-detail-content.json"
)


def seed_product_detail_content():
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"JSON file not found: {DATA_FILE}")

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        details = json.load(file)

    client = MongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=3000
    )

    try:
        db = client[settings.mongodb_database]
        collection = db["product_detail_content"]

        operations = []

        for model_no, content in details.items():
            document = {
                "modelNo": model_no,
                **content
            }

            operations.append(
                UpdateOne(
                    {"modelNo": model_no},
                    {"$set": document},
                    upsert=True
                )
            )

        if operations:
            result = collection.bulk_write(operations)

            print("Product detail content seeded successfully!")
            print("Total records:", len(details))
            print("Inserted:", result.upserted_count)
            print("Updated:", result.modified_count)

    finally:
        client.close()


if __name__ == "__main__":
    seed_product_detail_content()
