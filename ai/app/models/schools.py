from datetime import datetime
from .base import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import TIMESTAMP, String, func, BigInteger

class Schools(Base):
    __tablename__ = "schools"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    canvas_base_url: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    school_color: Mapped[str] = mapped_column(String, nullable=False, default="#6B7280")
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_onupdate=func.now(), nullable=False)

