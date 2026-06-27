import chromadb
from chromadb.config import Settings as ChromaSettings
from typing import List, Dict, Optional
import logging
from config import settings
from services.embedding_service import EmbeddingService
import uuid

logger = logging.getLogger(__name__)


class RetrievalService:
    """Service for storing and retrieving document chunks using ChromaDB."""
    
    def __init__(self):
        self.embedding_service = EmbeddingService()
        
        # Initialize ChromaDB with persistence
        self.client = chromadb.PersistentClient(
            path=settings.chroma_db_path,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="financial_documents",
            metadata={"description": "Financial document chunks with embeddings"}
        )
        
        logger.info(f"ChromaDB initialized at {settings.chroma_db_path}")
    
    def add_chunks(
        self,
        chunks: List[Dict[str, any]],
        document_id: str,
        filename: str,
        document_type: str
    ) -> int:
        """
        Add document chunks to the vector store.
        
        Args:
            chunks: List of chunk dicts with 'text', 'page_number', 'chunk_index'
            document_id: Unique document identifier
            filename: Name of the document
            document_type: Type of document (10-K, 10-Q, etc.)
            
        Returns:
            Number of chunks added
        """
        try:
            # Prepare data for ChromaDB
            texts = [chunk['text'] for chunk in chunks]
            ids = [f"{document_id}_chunk_{chunk['chunk_index']}" for chunk in chunks]
            
            # Generate embeddings
            embeddings = self.embedding_service.generate_embeddings(texts)
            
            # Prepare metadata
            metadatas = [
                {
                    'document_id': document_id,
                    'filename': filename,
                    'document_type': document_type,
                    'page_number': chunk['page_number'] if chunk['page_number'] else -1,
                    'chunk_index': chunk['chunk_index']
                }
                for chunk in chunks
            ]
            
            # Add to collection
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=texts,
                metadatas=metadatas
            )
            
            logger.info(f"Added {len(chunks)} chunks for document {document_id}")
            return len(chunks)
            
        except Exception as e:
            logger.error(f"Error adding chunks to ChromaDB: {str(e)}")
            raise
    
    def query_similar_chunks(
        self,
        question: str,
        n_results: int = 5,
        filters: Optional[Dict] = None
    ) -> Dict[str, any]:
        """
        Query for similar chunks based on a question.
        
        Args:
            question: The question to search for
            n_results: Number of results to return
            filters: Optional metadata filters
            
        Returns:
            Dict with 'documents', 'metadatas', 'distances', 'ids'
        """
        try:
            # Generate embedding for the question
            question_embedding = self.embedding_service.generate_embedding(question)
            
            # Query the collection
            where_clause = None
            if filters:
                where_clause = filters
            
            results = self.collection.query(
                query_embeddings=[question_embedding],
                n_results=n_results,
                where=where_clause
            )
            
            logger.info(f"Retrieved {len(results['documents'][0])} chunks for query")
            return results
            
        except Exception as e:
            logger.error(f"Error querying ChromaDB: {str(e)}")
            raise
    
    def get_all_documents(self) -> List[Dict[str, any]]:
        """
        Get metadata for all unique documents in the collection.
        
        Returns:
            List of document metadata dicts
        """
        try:
            # Get all items
            results = self.collection.get()
            
            if not results['metadatas']:
                return []
            
            # Group by document_id
            doc_map = {}
            for metadata in results['metadatas']:
                doc_id = metadata['document_id']
                if doc_id not in doc_map:
                    doc_map[doc_id] = {
                        'document_id': doc_id,
                        'filename': metadata['filename'],
                        'document_type': metadata['document_type'],
                        'chunk_count': 0,
                        'page_count': 0
                    }
                doc_map[doc_id]['chunk_count'] += 1
                
                # Track max page number
                page_num = metadata.get('page_number', -1)
                if page_num > doc_map[doc_id]['page_count']:
                    doc_map[doc_id]['page_count'] = page_num
            
            documents = list(doc_map.values())
            logger.info(f"Found {len(documents)} unique documents")
            return documents
            
        except Exception as e:
            logger.error(f"Error getting documents: {str(e)}")
            raise
    
    def delete_document(self, document_id: str) -> int:
        """
        Delete all chunks for a document.
        
        Args:
            document_id: The document ID to delete
            
        Returns:
            Number of chunks deleted
        """
        try:
            # Get all chunks for this document
            results = self.collection.get(
                where={"document_id": document_id}
            )
            
            if not results['ids']:
                logger.warning(f"No chunks found for document {document_id}")
                return 0
            
            # Delete the chunks
            self.collection.delete(ids=results['ids'])
            
            chunks_deleted = len(results['ids'])
            logger.info(f"Deleted {chunks_deleted} chunks for document {document_id}")
            return chunks_deleted
            
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            raise
    
    def get_document_chunks(self, document_id: str) -> List[Dict[str, any]]:
        """
        Get all chunks for a specific document.
        
        Args:
            document_id: The document ID
            
        Returns:
            List of chunk data
        """
        try:
            results = self.collection.get(
                where={"document_id": document_id}
            )
            
            chunks = []
            for i, doc_id in enumerate(results['ids']):
                chunks.append({
                    'chunk_index': results['metadatas'][i]['chunk_index'],
                    'text': results['documents'][i],
                    'page_number': results['metadatas'][i].get('page_number'),
                    'metadata': results['metadatas'][i]
                })
            
            # Sort by chunk index
            chunks.sort(key=lambda x: x['chunk_index'])
            
            return chunks
            
        except Exception as e:
            logger.error(f"Error getting document chunks: {str(e)}")
            raise
    
    def health_check(self) -> bool:
        """Check if ChromaDB is accessible."""
        try:
            self.collection.count()
            return True
        except:
            return False
