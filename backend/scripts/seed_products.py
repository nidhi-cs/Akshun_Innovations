
import json
from pathlib import Path

from pymongo import MongoClient, UpdateOne

from app.core.config import get_settings


def load_products():
    project_root = Path(__file__).resolve().parents[2]
    products_file = project_root / "frontend" / "data" / "products.json"

    with products_file.open("r", encoding="utf-8") as file:
        return json.load(file)

def seed_products():
    settings = get_settings()

    client = MongoClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=settings.mongodb_server_selection_timeout_ms,
    )

    try:
        db = client[settings.mongodb_database]
        products = load_products()

        operations = [
            UpdateOne(
                {"id": product["id"]},
                {"$set": product},
                upsert=True,
            )
            for product in products
        ]

        if operations:
            result = db["products"].bulk_write(operations, ordered=False)
            print(f"Products processed: {len(products)}")
            print(f"Inserted: {result.upserted_count}")
            print(f"Modified: {result.modified_count}")
            print(f"Already unchanged: {result.matched_count - result.modified_count}")

    finally:
        client.close()


if __name__ == "__main__":
    seed_products()
