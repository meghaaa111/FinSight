from fastapi import APIRouter, HTTPException, status
from models.schemas import QueryRequest, QueryResponse, SourceCitation
from services.retrieval_service import RetrievalService
from services.generation_service import GenerationService
from config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/query", tags=["query"])

retrieval_service = RetrievalService()
generation_service = GenerationService()


@router.post("", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """
    Query the RAG system with a question.
    
    Performs semantic search to retrieve relevant document chunks,
    generates an answer using GPT-4o, and returns the answer with
    source citations.
    """
    try:
        if not request.question or not request.question.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Question cannot be empty"
            )
        
        # Determine number of chunks to retrieve
        max_chunks = request.max_chunks or settings.max_chunks_retrieved
        
        # Retrieve similar chunks
        results = retrieval_service.query_similar_chunks(
            question=request.question,
            n_results=max_chunks,
            filters=request.filters
        )
        
        # Check if we got any results
        if not results['documents'][0]:
            return QueryResponse(
                answer="I could not find any relevant information in the provided documents to answer this question.",
                sources=[],
                confidence="low",
                question=request.question
            )
        
        # Prepare context chunks for generation
        context_chunks = []
        for i in range(len(results['documents'][0])):
            context_chunks.append({
                'text': results['documents'][0][i],
                'filename': results['metadatas'][0][i]['filename'],
                'page_number': results['metadatas'][0][i].get('page_number', -1),
                'chunk_index': results['metadatas'][0][i]['chunk_index'],
                'distance': results['distances'][0][i]
            })
        
        # Generate answer
        answer = generation_service.generate_answer(
            question=request.question,
            context_chunks=context_chunks
        )
        
        # Calculate confidence
        confidence = generation_service.calculate_confidence(answer, context_chunks)
        
        # Prepare source citations
        sources = []
        for chunk in context_chunks:
            # Convert distance to relevance score (lower distance = higher relevance)
            # Normalize to 0-1 scale
            relevance_score = max(0, 1 - (chunk['distance'] / 2))
            
            sources.append(SourceCitation(
                document_name=chunk['filename'],
                page_number=chunk['page_number'] if chunk['page_number'] > 0 else None,
                chunk_index=chunk['chunk_index'],
                excerpt=chunk['text'][:300] + "..." if len(chunk['text']) > 300 else chunk['text'],
                relevance_score=round(relevance_score, 3)
            ))
        
        return QueryResponse(
            answer=answer,
            sources=sources,
            confidence=confidence,
            question=request.question
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process query: {str(e)}"
        )
