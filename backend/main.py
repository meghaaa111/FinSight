from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import ingest, query, documents
from models.schemas import HealthResponse
from services.retrieval_service import RetrievalService
from config import settings
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="FinSight API",
    description="RAG-powered financial intelligence platform API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ingest.router)
app.include_router(query.router)
app.include_router(documents.router)

# Initialize retrieval service for health check
retrieval_service = None


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    global retrieval_service
    logger.info("Starting FinSight API...")
    try:
        retrieval_service = RetrievalService()
        logger.info("ChromaDB initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize ChromaDB: {str(e)}")


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    
    Returns the status of the API and ChromaDB connection.
    """
    chroma_status = "healthy"
    
    try:
        if retrieval_service and retrieval_service.health_check():
            chroma_status = "healthy"
        else:
            chroma_status = "unhealthy"
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        chroma_status = "unhealthy"
    
    return HealthResponse(
        status="healthy" if chroma_status == "healthy" else "degraded",
        timestamp=datetime.now(),
        chroma_db_status=chroma_status
    )


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "FinSight API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal error occurred"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
