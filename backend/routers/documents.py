from fastapi import APIRouter, HTTPException, status
from models.schemas import (
    DocumentListResponse,
    DocumentMetadata,
    DeleteDocumentResponse,
    DocumentChunksResponse,
    ChunkData
)
from services.retrieval_service import RetrievalService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/documents", tags=["documents"])

retrieval_service = RetrievalService()


@router.get("", response_model=DocumentListResponse)
async def list_documents():
    """
    Get a list of all ingested documents.
    
    Returns metadata for each document including filename, type,
    ingestion date, and chunk count.
    """
    try:
        documents_data = retrieval_service.get_all_documents()
        
        documents = []
        for doc_data in documents_data:
            documents.append(DocumentMetadata(
                document_id=doc_data['document_id'],
                filename=doc_data['filename'],
                document_type=doc_data['document_type'],
                date_ingested=datetime.now(),  # ChromaDB doesn't store timestamps, use current time
                chunk_count=doc_data['chunk_count'],
                page_count=doc_data['page_count'] if doc_data['page_count'] > 0 else None
            ))
        
        return DocumentListResponse(
            documents=documents,
            total_count=len(documents)
        )
    
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to list documents: {str(e)}"
        )


@router.delete("/{document_id}", response_model=DeleteDocumentResponse)
async def delete_document(document_id: str):
    """
    Delete a document and all its chunks from the vector store.
    
    Args:
        document_id: The unique identifier of the document to delete
    """
    try:
        chunks_deleted = retrieval_service.delete_document(document_id)
        
        if chunks_deleted == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document {document_id} not found"
            )
        
        return DeleteDocumentResponse(
            success=True,
            message=f"Successfully deleted document",
            document_id=document_id,
            chunks_deleted=chunks_deleted
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting document: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document: {str(e)}"
        )


@router.get("/{document_id}/chunks", response_model=DocumentChunksResponse)
async def get_document_chunks(document_id: str):
    """
    Get all chunks for a specific document.
    
    Args:
        document_id: The unique identifier of the document
    """
    try:
        chunks = retrieval_service.get_document_chunks(document_id)
        
        if not chunks:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Document {document_id} not found"
            )
        
        # Get filename from first chunk
        filename = chunks[0]['metadata']['filename']
        
        chunk_data_list = [
            ChunkData(
                chunk_index=chunk['chunk_index'],
                text=chunk['text'],
                page_number=chunk['page_number'] if chunk['page_number'] and chunk['page_number'] > 0 else None,
                metadata=chunk['metadata']
            )
            for chunk in chunks
        ]
        
        return DocumentChunksResponse(
            document_id=document_id,
            filename=filename,
            chunks=chunk_data_list
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting document chunks: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get document chunks: {str(e)}"
        )
