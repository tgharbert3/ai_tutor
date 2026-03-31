import uuid
from .base import Base
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, BigInteger, ForeignKey, TIMESTAMP, Uuid, func
from .courses import Courses


class CourseInfo(Base):
    __tablename__ = "course_info"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    course_code: Mapped[str] = mapped_column(String, nullable=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    canvas_course_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    course_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Courses.id), unique=True)
    reated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_onupdate=func.now(), nullable=False)