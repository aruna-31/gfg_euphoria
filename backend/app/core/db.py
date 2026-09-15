import os
from urllib.parse import urlparse
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# 1. Resolve DATABASE_URL exclusively from environment or settings
configured_url = os.getenv('DATABASE_URL') or settings.DATABASE_URL
fallback_url = f'postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}'
db_url = (configured_url or fallback_url).strip()

# 2. Normalize dialect prefix (SQLAlchemy requires postgresql://)
if db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql://', 1)

# 3. Ensure SSL mode for remote PostgreSQL / Supabase
if ('supabase.co' in db_url or 'supabase.com' in db_url or 'render.com' in db_url or 'aws' in db_url) and 'sslmode' not in db_url:
    delimiter = '&' if '?' in db_url else '?'
    db_url = f"{db_url}{delimiter}sslmode=require"

def get_redacted_url(url: str) -> str:
    try:
        parsed = urlparse(url)
        netloc = parsed.netloc
        if '@' in netloc:
            auth, host = netloc.split('@', 1)
            user = auth.split(':', 1)[0]
            netloc = f"{user}:***@{host}"
        return f"{parsed.scheme}://{netloc}{parsed.path}"
    except Exception:
        return "postgresql://***@host/db"

print(f"[Database Init] Initializing PostgreSQL connection: {get_redacted_url(db_url)}")

# 4. Strict PostgreSQL Engine Initialization — NO SQLite Fallback
try:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=10,
        max_overflow=20
    )
    # Test connection immediately
    with engine.connect() as conn:
        print("[Database Init] Successfully connected to PostgreSQL database!")
except Exception as e:
    redacted = get_redacted_url(db_url)
    err_msg = (
        f"\n================================================================================\n"
        f"CRITICAL DATABASE CONNECTION FAILURE\n"
        f"Failed to connect to PostgreSQL database: {redacted}\n"
        f"Error: {e}\n"
        f"SQLite fallback is disabled per strict production persistence policy.\n"
        f"Please verify that DATABASE_URL is set to a valid PostgreSQL / Supabase URI.\n"
        f"================================================================================\n"
    )
    print(err_msg)
    raise RuntimeError(err_msg) from e

# 5. Schema compatibility check
def ensure_schema_compatibility(db_engine):
    try:
        with db_engine.connect() as conn:
            conn.execute(text("ALTER TABLE teams ADD COLUMN IF NOT EXISTS selected_at TIMESTAMP;"))
            conn.commit()
    except Exception as ex:
        print(f"[Schema Notice] Schema compatibility check: {ex}")

try:
    ensure_schema_compatibility(engine)
except Exception as e:
    print(f"[Schema Warning] {e}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_info():
    """Extract current database connection info for /health/db endpoint"""
    try:
        parsed = urlparse(db_url)
        host = parsed.hostname or "unknown"
        port = parsed.port or 5432
        db_name = parsed.path.lstrip('/') or "postgres"
        
        with engine.connect() as conn:
            db_res = conn.execute(text("SELECT current_database(), current_schema(), version();")).fetchone()
            current_db = db_res[0] if db_res else db_name
            current_schema = db_res[1] if db_res else "public"
            pg_version = db_res[2] if db_res else "PostgreSQL"

            # Fetch table count in public schema
            tables_res = conn.execute(
                text("SELECT table_name FROM information_schema.tables WHERE table_schema = :schema ORDER BY table_name;"),
                {"schema": current_schema}
            ).fetchall()
            table_names = [r[0] for r in tables_res]

            return {
                "status": "connected",
                "engine": "PostgreSQL",
                "dialect": engine.dialect.name,
                "host": host,
                "port": port,
                "database": current_db,
                "schema": current_schema,
                "version": pg_version,
                "tableCount": len(table_names),
                "tables": table_names
            }
    except Exception as ex:
        return {
            "status": "error",
            "engine": "PostgreSQL",
            "error": str(ex)
        }
