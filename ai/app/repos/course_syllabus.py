from sqlalchemy import String, select
from sqlalchemy.orm import Session
from ..core.db.config import engine
from ..models.course_syllabus import CourseSyllabus

def get_course_syllabus(syllabus_id: String, session: Session) -> String:
    row = session.get_one(CourseSyllabus, syllabus_id)
    session.commit()
    return row.plain_text