from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=True)

    PROJECT_NAME: str = 'GFG Euphoria 2K26 Backend'
    API_V1_STR: str = '/api/v1'
    SECRET_KEY: str = 'gfg_euphoria_secret_jwt_key_2026_super_secure_token'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    POSTGRES_SERVER: str = 'localhost'
    POSTGRES_PORT: str = '5432'
    POSTGRES_USER: str = 'postgres'
    POSTGRES_PASSWORD: str = 'postgres'
    POSTGRES_DB: str = 'gfg_euphoria_db'
    DATABASE_URL: str | None = None

settings = Settings()
