from .base import Base
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, func, BigInteger, ForeignKey, TIMESTAMP, UniqueConstraint
from .schools import Schools

class Courses(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    course_id: Mapped[int] = mapped_column(BigInteger, nullable=True)
    workflow_state: Mapped[str] = mapped_column(String)
    last_synced_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True))
    school_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Schools.id), nullable=False)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_onupdate=func.now(), nullable=False)

    # courses_info: Mapped["course_info"]= relationship(back_populates="courses_info")

    __table_args__ = (
        UniqueConstraint("course_id", "school_id"),
    )

    def __repr__(self):
        return f"id: {self.id} courseId: {self.course_id}, schoolId: {self.school_id}"

