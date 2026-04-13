from fastapi import Request
from app.services.query_service import QueryService
from app.core .http_container.http_container import HTTPContainer

def get_query_service(request: Request) -> QueryService:
    container: HTTPContainer = request.app.state.http_container
    return container.get_query_service()
