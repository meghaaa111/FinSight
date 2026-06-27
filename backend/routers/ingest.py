from fastapi import APIRouter, UploadFile, File, HTTPException, status
from models.schemas import (
    UploadResponse,
    IngestURLRequest,
    IngestURLResponse,
    DocumentType
)
from services.ingestion_service import IngestionService
import tempfile
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ingest", tags=["ingestion"])

ingestion_service = IngestionService()


@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and ingest a PDF document.
    
    Accepts a PDF file, extracts text, chunks it, generates embeddings,
    and stores in the vector database.
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only PDF files are supported"
            )
        
        # Create a temporary file to store the upload
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            # Write uploaded file to temp file
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Detect document type
            document_type = ingestion_service.detect_document_type(file.filename)
            
            # Ingest the PDF
            document_id, chunks_created = ingestion_service.ingest_pdf(
                pdf_path=tmp_file_path,
                filename=file.filename,
                document_type=document_type
            )
            
            return UploadResponse(
                success=True,
                message=f"Successfully ingested {file.filename}",
                document_id=document_id,
                chunks_created=chunks_created,
                filename=file.filename
            )
            
        finally:
            # Clean up temp file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
    
    except ValueError as e:
        logger.error(f"Validation error during upload: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error uploading document: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ingest document: {str(e)}"
        )


@router.post("/url", response_model=IngestURLResponse)
async def ingest_from_url(request: IngestURLRequest):
    """
    Ingest a document from a URL.
    
    Accepts a URL to a SEC EDGAR filing or web article, scrapes the content,
    chunks it, generates embeddings, and stores in the vector database.
    """
    try:
        # Ingest from URL
        document_id, chunks_created, title = ingestion_service.ingest_url(
            url=request.url,
            document_type=request.document_type
        )
        
        return IngestURLResponse(
            success=True,
            message=f"Successfully ingested content from URL",
            document_id=document_id,
            chunks_created=chunks_created,
            url=request.url
        )
    
    except ValueError as e:
        logger.error(f"Validation error during URL ingestion: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error ingesting from URL: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ingest from URL: {str(e)}"
        )
