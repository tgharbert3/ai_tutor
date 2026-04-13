from bullmq import Worker
from app.core.build_repos import RepositoryContainer
from app.core.build_services import ServiceContainer
from sqlalchemy.orm import sessionmaker
from bullmq import Job, Queue

class WorkerContainer:
    def __init__(self, session_factory: sessionmaker, check_run_completeion_queue: Queue):
        self.workers = []
        self._repos = RepositoryContainer()
        self._services = ServiceContainer(session_factory=session_factory, repos=self._repos, check_run_completion_queue=check_run_completeion_queue)
        self._start_workers()

    def build_vectorize_processor(self):
        vectorize_service = self._services.get_vectorize_service()
        async def processer(job: Job, token):
            await vectorize_service.execute(job.data["taskId"], job.data["ingestionRunId"])
            await job.updateProgress(100)
        return processer
    
    def _start_workers(self):
        vectorize_worker = Worker("vectorization", self.build_vectorize_processor())
        self.workers.append(vectorize_worker)

    def get_workers(self):
        return self.workers