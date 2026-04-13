from sqlalchemy.orm import sessionmaker
from ..repos.course_syllabus import CourseSyllabusRepo
from ..repos.ingestion_tasks_repo import IngestionTasksRepo

class RepositoryContainer:
    def __init__(self):
        self._course_syllabus_repo = CourseSyllabusRepo()
        self._ingestion_tasks_repo = IngestionTasksRepo()

    
    def get_course_syllabus_repo(self):
        return self._course_syllabus_repo
    
    def get_ingestion_tasks_repo(self):
        return self._ingestion_tasks_repo