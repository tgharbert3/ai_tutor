import uuid
from .base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, Uuid
from .course_info import CourseInfo


class CourseSyllabus(Base):
    __tablename__ = "course_syllabus"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True)
    sanitized_syllabus: Mapped[str] = mapped_column(String)
    raw_syllabus: Mapped[str] = mapped_column(String, nullable=False)
    plain_text: Mapped[str] = mapped_column(String)
    hash: Mapped[str] = mapped_column(String)
    vectorized_hash: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    course_info_id: Mapped[uuid.UUID] = mapped_column(Uuid, ForeignKey(CourseInfo.id), nullable=False)

    # course_info: Mapped[CourseInfo] = relationship(back_populates="syllabus")

    def __repr__(self):
        return f"SyllabusId = {self.id}, plainText = {self.plain_text}"