from sqlalchemy import String
from sqlalchemy.orm import Session
from app.models.ingestion_tasks import IngestionTasks

class IngestionTasksRepo:

    def claim_ingeston_task(self, task_id: String, session: Session) -> IngestionTasks:
        row = session.get_one(IngestionTasks, task_id)
        row.status = "running"
        return row

    def markTaskAsSuccess(self, task_id: String, session: Session):
        row = session.get_one(IngestionTasks, task_id)
        row.status = "success"
        return

    def markTaskAsFailure(self, task_id, session: Session):
        row = session.get_one(IngestionTasks, task_id)
        row.status = "failed"
        return

    def markTaskAsNoop(self, task_id, session: Session):
        row = session.get_one(IngestionTasks, task_id)
        row.status = "noop"
        return