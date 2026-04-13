from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager
from fastapi import FastAPI
from .core.worker_container.worker_container import WorkerContainer
from .features.querying.routes import router as query_router
from .core.http_container.http_container import HTTPContainer
from .core.db.config import session_factory
from .infrastructure.bullMQ.queues.check_run_completion import createCheckRunCompletetionQueue


@asynccontextmanager
async def lifespan(app: FastAPI):
    check_run_completion_queue = createCheckRunCompletetionQueue()
    app.state.http_container = HTTPContainer(session_factory, check_run_completion_queue)
    worker_container = WorkerContainer(session_factory, check_run_completion_queue)
    print("starting")
    yield

app = FastAPI(lifespan=lifespan)


@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(query_router)

