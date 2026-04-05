from app.models.course_info import CourseInfo
from app.models.course_syllabus import CourseSyllabus
from app.models.courses import Courses
from sqlalchemy.orm import Session
from sqlalchemy import select

def get_course_from_syllabus_id(syllabus_id: str, session: Session) -> CourseInfo:
    stmt = select(Courses).select_from(CourseSyllabus).join(CourseInfo, CourseSyllabus.course_info_id == CourseInfo.id).join(Courses, CourseInfo.course_id == Courses.id).where(CourseSyllabus.id == syllabus_id)
    result = session.execute(stmt).scalars().one()
    session.commit()
    return result