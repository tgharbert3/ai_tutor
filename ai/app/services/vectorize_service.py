from sqlalchemy.orm import sessionmaker
from app.repos.course_syllabus import CourseSyllabusRepo
from app.repos.ingestion_tasks_repo import IngestionTasksRepo
from app.infrastructure.bullMQ.workers.chunk_words import chunk_syllabus
from app.infrastructure.bullMQ.workers.generate_nodes import generate_text_nodes
from app.core.db.config import index
from app.infrastructure.bullMQ.utils.hash import should_vectorize, compute_text_hash
from bullmq import Queue

class VectorizeService:
    
    def __init__(
            self, 
            session_factory: sessionmaker, 
            course_syllabus_repo: CourseSyllabusRepo,
            ingestion_tasks_repo: IngestionTasksRepo,
            check_run_completeion_queue: Queue,
        ):
        self.session_factory = session_factory
        self.course_syllabus_repo = course_syllabus_repo
        self.ingestion_tasks_repo = ingestion_tasks_repo
        self.check_run_completion_queue = check_run_completeion_queue

    async def execute(self, task_id: str, ingestion_run_id: str) -> None:
        try:
            with self.session_factory.begin() as session:
                task = self.ingestion_tasks_repo.claim_ingeston_task(task_id, session)
                syllabus_id = task.entity_id
                sanitized_syllabus = self.course_syllabus_repo.get_course_sanitized_syllabus(syllabus_id, session)
                plain_text = self.course_syllabus_repo.get_plain_text(syllabus_id, session)
                vectorized_hash = self.course_syllabus_repo.get_vectorized_hash(syllabus_id, session)
                
                if (should_vectorize(syllabus_id, plain_text, vectorized_hash)):
                    chunks = chunk_syllabus(sanitized_syllabus)
                    nodes = generate_text_nodes(chunks)
                    ref_doc_id = f"syllabus:{task.entity_id}"
                    if (self.course_syllabus_repo.get_vectorized_hash(syllabus_id, session) is not None):
                        index.delete_ref_doc(ref_doc_id, delete_from_docstore=True)
                    index.insert_nodes(nodes)
                    self.course_syllabus_repo.insert_vectorized_hash(syllabus_id, compute_text_hash(plain_text), session)
                    await self.ingestion_tasks_repo.markTaskAsSuccess(task_id, session)
                    self.check_run_completion_queue.add("check", {"ingestionRunId", ingestion_run_id})
                else:
                    self.ingestion_tasks_repo.markTaskAsNoop(task_id, session)
                    await self.check_run_completion_queue.add("check", {"ingestionRunId", ingestion_run_id})
        except Exception as e:
            with self.session_factory.begin() as session:
                self.ingestion_tasks_repo.markTaskAsFailure(task_id, session)
                await self.check_run_completion_queue.add("check", {"ingestionRunId", ingestion_run_id})
                raise RuntimeError("Failed to insert syllabus embeddings") from e