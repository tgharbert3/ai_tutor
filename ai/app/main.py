from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager
from fastapi import FastAPI
from .infrastructure.bullMQ import init as bull


@asynccontextmanager
async def lifespan(app: FastAPI):
    bull.start_workers()
    print("starting")
    yield

app = FastAPI(lifespan=lifespan)


@app.get("/")
def read_root():
    return {"Hello": "World"}

