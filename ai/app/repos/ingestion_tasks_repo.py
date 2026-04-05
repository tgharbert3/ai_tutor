from sqlalchemy import String
from sqlalchemy.orm import Session
from app.models.ingestion_tasks import IngestionTasks

def claim_ingeston_task(task_id: String, session: Session) -> IngestionTasks:
    row = session.get_one(IngestionTasks, task_id)
    row.status = "running"
    session.commit()
    return row

def markTaskAsSuccess(task_id: String, session: Session):
    row = session.get_one(IngestionTasks, task_id)
    row.status = "success"
    session.commit()
    return

def markTaskAsFailure(task_id, session: Session):
    row = session.get_one(IngestionTasks, task_id)
    row.status = "failed"
    session.commit()
    return

def markTaskAsNoop(task_id, session: Session):
    row = session.get_one(IngestionTasks, task_id)
    row.status = "noop"
    session.commit()
    return