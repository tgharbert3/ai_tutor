from ..services.query_service import QueryService
from ..services.vectorize_service import VectorizeService
from .build_repos import RepositoryContainer
from sqlalchemy.orm import sessionmaker
from bullmq import Queue

class ServiceContainer:
    def __init__(self, repos: RepositoryContainer, session_factory: sessionmaker, check_run_completion_queue: Queue ):
        self.query_service = QueryService(session_factory, repos.get_course_syllabus_repo())
        self.vectorize_service = VectorizeService(session_factory, repos.get_course_syllabus_repo(), repos.get_ingestion_tasks_repo(), check_run_completion_queue,  )

    def get_query_service(self):
        return self.query_service
    
    def get_vectorize_service(self):
        return self.vectorize_service