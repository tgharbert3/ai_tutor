import hashlib
from sqlalchemy.orm import Session


def compute_text_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def should_vectorize(syllabus_id: str, plain_text: str, vectorized_hash: str) -> bool:
    current_hash = compute_text_hash(plain_text)

    return vectorized_hash is None or current_hash != vectorized_hash