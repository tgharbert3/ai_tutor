from pydantic import BaseModel

class Query(BaseModel):
    canvas_course_id: int
    query: str