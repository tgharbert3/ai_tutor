from app.repos.ingestion_tasks_repo import claim_ingeston_task, markTaskAsSuccess
from app.repos.course_syllabus import get_course_syllabus
from sqlalchemy.orm import Session
from app.core.db.config import engine
from bullmq import Queue, Job

#TODO: this needs to be injected
def createCheckRunCompletionQueue():
   return Queue("checkRunCompletion")

checkRunCompletionQueue = createCheckRunCompletionQueue()

async def vectorize_processor(job: Job, token):
   
   task_id = job.data["taskId"]
   #TODO: this needs to be injected into the worker
   session = Session(engine)
   syllabus_id = claim_ingeston_task(task_id, session)
   plain_text = get_course_syllabus(syllabus_id, session)
   await completeJob(job, session)
   

async def completeJob(job: Job, session: Session):
   markTaskAsSuccess(job.data["taskId"], session)
   await checkRunCompletionQueue.add("check", {"ingestionRunId": job.data["ingestionRunId"]})
   await job.updateProgress(100)

