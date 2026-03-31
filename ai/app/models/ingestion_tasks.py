from .base import Base
import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, func, BigInteger, ForeignKey, TIMESTAMP, Uuid
from .schools import Schools
from app.models.ingestion_run import IngestionRuns
import enum
from sqlalchemy import Enum

class IngestionTaskStatus(enum.Enum):
    queued = "queued"
    running = "running"
    success = "success"
    failed = "failed"
    processing = "processing"
    processed = "processed"

class IngestionTasks(Base):
    __tablename__ = "ingestion_tasks"

    task_id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    kind: Mapped[str] = mapped_column(String, nullable=False)
    entity_type: Mapped[str] = mapped_column(String, nullable=False)
    entity_id: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[IngestionTaskStatus] = mapped_column(Enum(
        IngestionTaskStatus,), nullable=False)
    canvas_course_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    school_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Schools.id), nullable=False)
    ingestion_run_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey(IngestionRuns.id))
    error: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"taskId:{self.task_id} kind:{self.kind} entity_type: {self.entity_type}, entity_id: {self.entity_id}, status: {self.status} canvas_course_id: {self.canvas_course_id}"
    
