from sqlalchemy import String, select
from sqlalchemy.orm import Session
from app.models.ingestion_tasks import IngestionTasks

def claim_ingeston_task(task_id: String, session: Session):
    row = session.get_one(IngestionTasks, task_id)
    row.status = "running"
    syllabus_id = row.entity_id
    session.commit()
    return syllabus_id

def markTaskAsSuccess(task_id: String, session: Session):
    row = session.get_one(IngestionTasks, task_id)
    row.status = "success"
    session.commit()
    return 