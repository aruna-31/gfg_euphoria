import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

configured_url = os.getenv('DATABASE_URL') or settings.DATABASE_URL
fallback_url = f'postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}'
db_url = configured_url or fallback_url

try:
    engine = create_engine(db_url, pool_pre_ping=True)
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f'[DB Warning] PostgreSQL connection failed ({e}). Falling back to SQLite local database.')
    db_url = 'sqlite:///./gfg_euphoria.db'
    engine = create_engine(db_url, connect_args={'check_same_thread': False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
