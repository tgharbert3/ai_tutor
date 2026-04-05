from app.repos.ingestion_tasks_repo import claim_ingeston_task, markTaskAsSuccess, markTaskAsFailure, markTaskAsNoop
from app.repos.course_syllabus import get_course_sanitized_syllabus, insert_vectorized_hash, get_plain_text, get_vectorized_hash
from app.repos.courses_repo import get_course_from_syllabus_id
from ..utils.hash import should_vectorize, compute_text_hash
from sqlalchemy.orm import Session
from app.core.db.config import engine
from bullmq import Queue, Job
from .chunk_words import chunk_syllabus
from .generate_nodes import generate_text_nodes
from app.core.db.config import index

#TODO: this needs to be injected
def createCheckRunCompletionQueue():
   return Queue("checkRunCompletion")

checkRunCompletionQueue = createCheckRunCompletionQueue()

async def vectorize_processor(job: Job, token):
   task_id = job.data["taskId"]
   #TODO: this needs to be injected into the worker
   session = Session(engine)
   task = claim_ingeston_task(task_id, session)
   course = get_course_from_syllabus_id(task.entity_id, session)
   sanitized_syllabus = get_course_sanitized_syllabus(task.entity_id, session)
   chunks = chunk_syllabus(sanitized_syllabus)
   nodes = generate_text_nodes(chunks, task.entity_id, task.canvas_course_id, task.school_id, course.id, "syllabus")
   try:
      task = claim_ingeston_task(task_id, session)
      if (should_vectorize(task.entity_id, session)):
         course = get_course_from_syllabus_id(task.entity_id, session)
         sanitized_syllabus = get_course_sanitized_syllabus(task.entity_id, session)
         plain_text = get_plain_text(task.entity_id, session)
         chunks = chunk_syllabus(sanitized_syllabus)
         nodes = generate_text_nodes(chunks, task.entity_id, task.canvas_course_id, task.school_id, course.id, "syllabus")
         ref_doc_id = f"syllabus:{task.entity_id}"
         if (get_vectorized_hash(task.entity_id, session) is not None):
            index.delete_ref_doc(ref_doc_id, delete_from_docstore=True)
         index.insert_nodes(nodes)
         insert_vectorized_hash(task.entity_id, session, compute_text_hash(plain_text))
         print("completed")
         await completeJob(job, session)
      else:
         markTaskAsNoop(task_id, session)
         await checkRunCompletionQueue.add("check", {"ingestionRunId": job.data["ingestionRunId"]})
         await job.updateProgress(100)
   except Exception as e:
      markTaskAsFailure(task_id, session)
      await checkRunCompletionQueue.add("check", {"ingestionRunId": job.data["ingestionRunId"]})
      await job.updateProgress(100)
      raise RuntimeError("failed to insert syllabus embeddings") from e
   finally:
      session.close()
      
   

async def completeJob(job: Job, session: Session):
   markTaskAsSuccess(job.data["taskId"], session)
   await checkRunCompletionQueue.add("check", {"ingestionRunId": job.data["ingestionRunId"]})
   await job.updateProgress(100)

