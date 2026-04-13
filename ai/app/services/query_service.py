from sqlalchemy.orm import sessionmaker
from ..repos.course_syllabus import CourseSyllabusRepo

class QueryService:

        def __init__(self, session_factory: sessionmaker, course_syllabus_repo: CourseSyllabusRepo):
                self.session_factory = session_factory
                self.course_syllabus_repo = course_syllabus_repo