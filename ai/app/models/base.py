from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData

metadata_obj = MetaData(schema="ai")

class Base(DeclarativeBase):
    metadata = metadata_obj