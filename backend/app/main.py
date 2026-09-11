from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import engine, Base
from app.api.v1 import auth, teams, problems, evaluations, rounds

# Initialize DB tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(teams.router, prefix=f"{settings.API_V1_STR}/teams", tags=["Teams"])
app.include_router(problems.router, prefix=f"{settings.API_V1_STR}/problems", tags=["Problems"])
app.include_router(evaluations.router, prefix=f"{settings.API_V1_STR}/evaluations", tags=["Evaluations"])
app.include_router(rounds.router, prefix=f"{settings.API_V1_STR}/rounds", tags=["Rounds"])

@app.get("/")
def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }
