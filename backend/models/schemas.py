from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DocumentType(str, Enum):
    """Supported document types."""
    TEN_K = "10-K"
    TEN_Q = "10-Q"
    EARNINGS_CALL = "Earnings Call"
    NEWS = "News"
    OTHER = "Other"


class UploadResponse(BaseModel):
    """Response after uploading a document."""
    success: bool
    message: str
    document_id: str
    chunks_created: int
    filename: str


class IngestURLRequest(BaseModel):
    """Request to ingest a document from URL."""
    url: str
    document_type: Optional[DocumentType] = DocumentType.OTHER


class IngestURLResponse(BaseModel):
    """Response after ingesting from URL."""
    success: bool
    message: str
    document_id: str
    chunks_created: int
    url: str


class SourceCitation(BaseModel):
    """A single source citation with document reference and excerpt."""
    document_name: str
    page_number: Optional[int] = None
    chunk_index: int
    excerpt: str
    relevance_score: float


class QueryRequest(BaseModel):
    """Request to query the RAG system."""
    question: str
    filters: Optional[dict] = None
    max_chunks: Optional[int] = None


class QueryResponse(BaseModel):
    """Response from the RAG query."""
    answer: str
    sources: List[SourceCitation]
    confidence: str
    question: str


class DocumentMetadata(BaseModel):
    """Metadata for a document."""
    document_id: str
    filename: str
    document_type: DocumentType
    date_ingested: datetime
    chunk_count: int
    page_count: Optional[int] = None


class DocumentListResponse(BaseModel):
    """List of all documents."""
    documents: List[DocumentMetadata]
    total_count: int


class DeleteDocumentResponse(BaseModel):
    """Response after deleting a document."""
    success: bool
    message: str
    document_id: str
    chunks_deleted: int


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    timestamp: datetime
    chroma_db_status: str


class ChunkData(BaseModel):
    """Individual chunk data."""
    chunk_index: int
    text: str
    page_number: Optional[int] = None
    metadata: dict


class DocumentChunksResponse(BaseModel):
    """Response containing all chunks for a document."""
    document_id: str
    filename: str
    chunks: List[ChunkData]
