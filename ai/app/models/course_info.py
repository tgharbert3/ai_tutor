import uuid
from .base import Base
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, BigInteger, ForeignKey, TIMESTAMP, Uuid, func
from .courses import Courses

class CourseInfo(Base):
    __tablename__ = "course_info"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    course_code: Mapped[str] = mapped_column(String, nullable=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    canvas_course_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    course_id: Mapped[int] = mapped_column(BigInteger, ForeignKey(Courses.id), unique=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_onupdate=func.now(), nullable=False)

    # syllabus: Mapped["CourseSyllabus"] = relationship(back_populates="course_info")
    # course: Mapped["courses"] = relationship(back_populates="courses")


