import hashlib
from sqlalchemy.orm import Session
from app.repos.course_syllabus import get_plain_text, get_vectorized_hash


def compute_text_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def should_vectorize(syllabus_id: str, session: Session) -> bool:
    plain_text = get_plain_text(syllabus_id, session)
    vectorized_hash = get_vectorized_hash(syllabus_id, session)

    current_hash = compute_text_hash(plain_text)

    return vectorized_hash is None or current_hash != vectorized_hash