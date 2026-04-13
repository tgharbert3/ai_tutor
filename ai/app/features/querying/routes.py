from fastapi import APIRouter, Depends
from .queryDto import Query
from app.services.query_service import QueryService
from app.core.http_container.http_container import HTTPContainer

router = APIRouter(prefix="/query", tags=["query"])

@router.post("/")
async def answer_question(
    request: Query,
    query_service: QueryService = Depends(HTTPContainer.get_query_service)
    ):
    
    return {"hello": "from answer"}