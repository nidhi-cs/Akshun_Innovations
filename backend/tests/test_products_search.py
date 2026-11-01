import json
from pathlib import Path

from app.api.v1.products import get_products


PRODUCTS_PATH = Path(__file__).resolve().parents[2] / "frontend" / "data" / "products.json"


def _load_products() -> list[dict]:
    with PRODUCTS_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


class FakeCursor:
    def __init__(self, items):
        self._items = list(items)

    def skip(self, count):
        self._items = self._items[count:]
        return self

    def limit(self, count):
        self._items = self._items[:count]
        return self

    def __iter__(self):
        return iter(self._items)


class FakeProductsCollection:
    def __init__(self, products):
        self.products = list(products)

    def count_documents(self, filters):
        return len(self._filtered_documents(filters))

    def find(self, filters, projection):
        return FakeCursor(
            [
                {key: value for key, value in product.items() if key != "_id"}
                for product in self._filtered_documents(filters)
            ]
        )

    def _filtered_documents(self, filters):
        if not filters:
            return list(self.products)

        matches = []
        for product in self.products:
            if self._matches(product, filters):
                matches.append(product)
        return matches

    def _matches(self, product, filters):
        if "$or" in filters:
            or_match = any(self._matches(product, clause) for clause in filters["$or"])
        else:
            or_match = True

        for field_name, condition in filters.items():
            if field_name == "$or":
                continue
            if field_name == "categorySlug":
                if not isinstance(condition, str):
                    return False
                if product.get("categorySlug", "").lower() != condition.lower():
                    return False
                continue

            if not self._field_matches(product, field_name, condition):
                return False

        return or_match

    def _field_matches(self, product, field_name, condition):
        if isinstance(condition, dict):
            if "$regex" not in condition:
                return product.get(field_name) == condition
            pattern = condition["$regex"]
            regex_options = condition.get("$options", "")
            flags = 0
            if "i" in regex_options:
                flags |= __import__("re").IGNORECASE

            field_value = product.get(field_name)
            if field_name == "tags":
                field_values = field_value or []
                return any(__import__("re").search(pattern, str(value), flags) for value in field_values)

            if field_name in {"specs.label", "specs.value"}:
                spec_values = []
                for spec in product.get("specs") or []:
                    if isinstance(spec, dict):
                        if "label" in spec:
                            spec_values.append(spec.get("label", ""))
                        if "value" in spec:
                            spec_values.append(spec.get("value", ""))
                return any(__import__("re").search(pattern, str(value), flags) for value in spec_values)

            if isinstance(field_value, str):
                return __import__("re").search(pattern, field_value, flags) is not None
            if isinstance(field_value, list):
                return any(__import__("re").search(pattern, str(value), flags) for value in field_value)
            return False

        if isinstance(condition, str):
            return str(product.get(field_name, "")).lower() == condition.lower()

        return product.get(field_name) == condition


class FakeDatabase:
    def __init__(self, products):
        self.products = FakeProductsCollection(products)

    def __getitem__(self, collection_name):
        if collection_name == "products":
            return self.products
        raise KeyError(collection_name)


def test_q_mechanical_search_matches_all_mechanical_products_case_insensitively():
    products = _load_products()
    db = FakeDatabase(products)

    mechanical_results = get_products(page=1, page_size=50, q="Mechanical", db=db)
    lowercase_results = get_products(page=1, page_size=50, q="mechanical", db=db)
    uppercase_results = get_products(page=1, page_size=50, q="MECHANICAL", db=db)

    assert mechanical_results["total"] == 15
    assert lowercase_results["total"] == 15
    assert uppercase_results["total"] == 15
    assert {item["modelNo"] for item in mechanical_results["items"]} == {
        item["modelNo"] for item in lowercase_results["items"]
    } == {item["modelNo"] for item in uppercase_results["items"]}


def test_q_search_matches_product_name_and_model_number_and_subcategory():
    products = _load_products()
    db = FakeDatabase(products)

    name_results = get_products(page=1, page_size=10, q="PID Process Control Trainer", db=db)
    assert name_results["total"] >= 1
    assert any(item["name"] == "PID Process Control Trainer" for item in name_results["items"])

    model_results = get_products(page=1, page_size=10, q="AKI-E176", db=db)
    assert model_results["total"] == 1
    assert model_results["items"][0]["modelNo"] == "AKI-E176"

    subcategory_results = get_products(page=1, page_size=10, q="process-control-trainers", db=db)
    assert subcategory_results["total"] >= 1
    assert all(item["subCategorySlug"] == "process-control-trainers" for item in subcategory_results["items"])


def test_q_search_returns_zero_for_unknown_terms_and_keeps_pagination_correct():
    products = _load_products()
    db = FakeDatabase(products)

    zero_results = get_products(page=1, page_size=10, q="ThisProductDoesNotExist", db=db)
    assert zero_results["total"] == 0
    assert zero_results["items"] == []
    assert zero_results["page"] == 1
    assert zero_results["page_size"] == 10
    assert zero_results["total_pages"] == 0

    pagination_results = get_products(page=2, page_size=5, q="Mechanical", db=db)
    assert pagination_results["total"] == 15
    assert pagination_results["page"] == 2
    assert pagination_results["page_size"] == 5
    assert pagination_results["total_pages"] == 3
    assert len(pagination_results["items"]) == 5
    assert {item["modelNo"] for item in pagination_results["items"]} == {
        "AKI-E181",
        "AKI-E182",
        "AKI-E183",
        "AKI-E184",
        "AKI-E185",
    }


def test_q_search_keeps_category_filtering_and_has_no_duplicate_results():
    products = _load_products()
    db = FakeDatabase(products)

    category_results = get_products(page=1, page_size=20, q="mechanical", category="mechanical", db=db)
    assert category_results["total"] == 15
    assert len(category_results["items"]) == 15
    assert len({item["id"] for item in category_results["items"]}) == len(category_results["items"])

    filtered_results = get_products(page=1, page_size=20, q="Mechanical", category="electrical", db=db)
    assert filtered_results["total"] == 0
    assert filtered_results["items"] == []
