import os
from sqlalchemy import create_engine, make_url
from llama_index.core import StorageContext, VectorStoreIndex, Settings
from llama_index.vector_stores.postgres import PGVectorStore
from llama_index.embeddings.openai import OpenAIEmbedding

engine = create_engine(os.environ.get("DATABASE_URL"))


url = make_url(os.environ.get("DATABASE_URL"))
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small")

vector_store = PGVectorStore.from_params(
    database=url.database,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    table_name="course_syllabus_vectors",
    schema_name="ai",
    embed_dim=1536,  # openai embedding dimension
    hnsw_kwargs={
        "hnsw_m": 16,
        "hnsw_ef_construction": 64,
        "hnsw_ef_search": 40,
        "hnsw_dist_method": "vector_cosine_ops",
    },
)

index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

