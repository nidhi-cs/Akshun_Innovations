from __future__ import annotations

import time
from collections import defaultdict, deque
from typing import DefaultDict, Deque

from fastapi import Depends, HTTPException, Request

WINDOW_SECONDS = 60
MAX_REQUESTS = 5

_request_buckets: DefaultDict[str, Deque[float]] = defaultdict(deque)


def _get_client_key(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip() or "unknown"

    if request.client is not None:
        return request.client.host

    return "unknown"


def _get_request_buckets(request: Request) -> DefaultDict[str, Deque[float]]:
    buckets = getattr(request.app.state, "rate_limit_buckets", None)
    if buckets is None:
        request.app.state.rate_limit_buckets = _request_buckets
        return _request_buckets
    return buckets


def rate_limit_public_endpoint(request: Request) -> None:
    buckets = _get_request_buckets(request)
    key = _get_client_key(request)
    now = time.monotonic()
    bucket = buckets[key]
    window_start = now - WINDOW_SECONDS

    while bucket and bucket[0] <= window_start:
        bucket.popleft()

    if len(bucket) >= MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later.",
        )

    bucket.append(now)


RateLimited = Depends(rate_limit_public_endpoint)
