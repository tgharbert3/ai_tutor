from .base import Base
import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, func, BigInteger, ForeignKey, TIMESTAMP, Uuid
from .schools import Schools
class Users(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    email: Mapped[str] = mapped_column(String, nullable=False)
    school_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Schools.id))
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_onupdate=func.now(), nullable=False)
