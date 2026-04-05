from sqlalchemy import String, update
from sqlalchemy.orm import Session
from ..models.course_syllabus import CourseSyllabus

def get_course_sanitized_syllabus(syllabus_id: String, session: Session) -> String:
    row = session.get_one(CourseSyllabus, syllabus_id)
    session.commit()
    return row.sanitized_syllabus

def get_plain_text(syllabus_id: String, session: Session) -> String:
    row = session.get_one(CourseSyllabus, syllabus_id)
    session.commit()
    return row.plain_text

def get_vectorized_hash(syllabus_id: String, session: Session) -> String:
    row = session.get_one(CourseSyllabus, syllabus_id)
    session.commit()
    return row.vectorized_hash

def insert_vectorized_hash(syllabus_id: str, session: Session, vectorized_hash: str):
    stmt = (
        update(CourseSyllabus)
        .where(CourseSyllabus.id == syllabus_id)
        .values(vectorized_hash = vectorized_hash)
        .returning(CourseSyllabus)
    )
    rows = session.execute(stmt).scalar_one()
    session.commit()
    return rows.id
    