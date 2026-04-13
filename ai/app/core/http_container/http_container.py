from sqlalchemy.orm import sessionmaker
from ..build_repos import RepositoryContainer
from ..build_services import ServiceContainer
from bullmq import Queue

class HTTPContainer():
    def __init__(self, session_factory: sessionmaker, check_run_completion_queue: Queue):
        self._repos = RepositoryContainer()
        self._services = ServiceContainer(repos=self._repos, session_factory=session_factory, check_run_completion_queue=check_run_completion_queue)

    def get_query_service(self):
        return self._services.get_query_service()