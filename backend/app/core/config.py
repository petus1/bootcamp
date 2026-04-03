from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Bootcamp API"
    api_prefix: str = "/api/v1"
    secret_key: str = "change-me-secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7

    database_url: str = "sqlite+pysqlite:///./bootcamp.db"
    redis_url: str = "redis://redis:6379/0"
    # Список через запятую. Для GitHub Pages: https://USER.github.io
    # Пример: CORS_ORIGINS=https://myuser.github.io,http://127.0.0.1:8080
    cors_origins: str = "*"


settings = Settings()
