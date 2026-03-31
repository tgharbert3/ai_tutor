from .base import Base
import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, func, BigInteger, ForeignKey, TIMESTAMP, Uuid
from .schools import Schools
from .users import Users

class IngestionRuns(Base):
    __tablename__ = "ingestion_runs"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    status: Mapped[str] = mapped_column(String, nullable=False)
    started_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    finshed_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))
    checkpoint_start: Mapped[int] = mapped_column(BigInteger)
    checkpoint_end: Mapped[int] = mapped_column(BigInteger)
    error: Mapped[str] = mapped_column(String)
    user_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey(Users.id))
    school_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Schools.id), nullable=False)