from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    openai_api_key: str  # Now used for Gemini API key
    chroma_db_path: str = "./chroma_db"
    max_chunks_retrieved: int = 5
    embedding_model: str = "models/gemini-embedding-001"  # Gemini embedding model
    generation_model: str = "gemini-3.5-flash"  # Gemini generation model
    chunk_size: int = 512
    chunk_overlap: int = 50
    temperature: float = 0.0
    cors_origins: list = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
