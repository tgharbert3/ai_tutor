from sqlalchemy import String, update
from sqlalchemy.orm import Session
from ..models.course_syllabus import CourseSyllabus


class CourseSyllabusRepo():

    def get_course_sanitized_syllabus(self, syllabus_id: String, session: Session) -> String:
        row = session.get_one(CourseSyllabus, syllabus_id)
        return row.sanitized_syllabus

    def get_plain_text(self, syllabus_id: String, session: Session) -> String:
        row = session.get_one(CourseSyllabus, syllabus_id)
        return row.plain_text

    def get_vectorized_hash(self, syllabus_id: String, session: Session) -> String:
        row = session.get_one(CourseSyllabus, syllabus_id)
        return row.vectorized_hash

    def insert_vectorized_hash(self, syllabus_id: str, vectorized_hash: str, session: Session):
        stmt = (
            update(CourseSyllabus)
            .where(CourseSyllabus.id == syllabus_id)
            .values(vectorized_hash = vectorized_hash)
            .returning(CourseSyllabus)
        )
        rows = session.execute(stmt).scalar_one()
        return rows.id
    