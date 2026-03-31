from bullmq import Worker
from app.infrastructure.bullMQ.workers.vectorize import vectorize_processor

workers = []

def start_workers():
    vectorize_worker = Worker("vectorization", vectorize_processor)
    workers.append(vectorize_processor)


