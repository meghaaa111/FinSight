import os
import uuid
import requests
from bs4 import BeautifulSoup
from typing import Dict, Tuple, List
import logging
from utils.pdf_parser import PDFParser
from utils.chunker import DocumentChunker
from services.retrieval_service import RetrievalService
from config import settings
from models.schemas import DocumentType

logger = logging.getLogger(__name__)


class IngestionService:
    """Service for ingesting documents from files and URLs."""
    
    def __init__(self):
        self.pdf_parser = PDFParser()
        self.chunker = DocumentChunker(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap
        )
        self.retrieval_service = RetrievalService()
    
    def ingest_pdf(
        self,
        pdf_path: str,
        filename: str,
        document_type: str = DocumentType.OTHER
    ) -> Tuple[str, int]:
        """
        Ingest a PDF file into the vector store.
        
        Args:
            pdf_path: Path to the PDF file
            filename: Original filename
            document_type: Type of document
            
        Returns:
            Tuple of (document_id, chunks_created)
        """
        try:
            # Generate unique document ID
            document_id = str(uuid.uuid4())
            
            # Extract text with page numbers
            pages_data = self.pdf_parser.extract_text_with_pages(pdf_path)
            
            if not pages_data:
                raise ValueError("No text could be extracted from the PDF")
            
            # Chunk the pages
            chunks = self.chunker.chunk_pages(pages_data)
            
            # Add to vector store
            chunks_created = self.retrieval_service.add_chunks(
                chunks=chunks,
                document_id=document_id,
                filename=filename,
                document_type=document_type
            )
            
            logger.info(f"Successfully ingested PDF {filename} with {chunks_created} chunks")
            return document_id, chunks_created
            
        except Exception as e:
            logger.error(f"Error ingesting PDF {filename}: {str(e)}")
            raise
    
    def ingest_url(
        self,
        url: str,
        document_type: str = DocumentType.OTHER
    ) -> Tuple[str, int, str]:
        """
        Ingest content from a URL into the vector store.
        
        Args:
            url: URL to scrape
            document_type: Type of document
            
        Returns:
            Tuple of (document_id, chunks_created, title)
        """
        try:
            # Generate unique document ID
            document_id = str(uuid.uuid4())
            
            # Fetch the content
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'lxml')
            
            # Extract title
            title = soup.title.string if soup.title else url.split('/')[-1]
            title = title.strip()
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            
            # Get text content
            text = soup.get_text(separator='\n', strip=True)
            
            # Clean up text
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            text = '\n'.join(lines)
            
            if not text or len(text) < 100:
                raise ValueError("Insufficient text content extracted from URL")
            
            # Chunk the text
            chunks = self.chunker.chunk_text(text)
            
            # Add to vector store
            chunks_created = self.retrieval_service.add_chunks(
                chunks=chunks,
                document_id=document_id,
                filename=title,
                document_type=document_type
            )
            
            logger.info(f"Successfully ingested URL {url} with {chunks_created} chunks")
            return document_id, chunks_created, title
            
        except requests.RequestException as e:
            logger.error(f"Error fetching URL {url}: {str(e)}")
            raise ValueError(f"Failed to fetch URL: {str(e)}")
        except Exception as e:
            logger.error(f"Error ingesting URL {url}: {str(e)}")
            raise
    
    def detect_document_type(self, filename: str, text: str = "") -> DocumentType:
        """
        Attempt to detect document type from filename or content.
        
        Args:
            filename: The filename
            text: Optional text content to analyze
            
        Returns:
            Detected DocumentType
        """
        filename_lower = filename.lower()
        text_lower = text.lower()
        
        if '10-k' in filename_lower or '10k' in filename_lower:
            return DocumentType.TEN_K
        elif '10-q' in filename_lower or '10q' in filename_lower:
            return DocumentType.TEN_Q
        elif 'earnings' in filename_lower and ('call' in filename_lower or 'transcript' in filename_lower):
            return DocumentType.EARNINGS_CALL
        elif any(term in filename_lower for term in ['news', 'article', 'press']):
            return DocumentType.NEWS
        
        # Check content for hints
        if text:
            if 'form 10-k' in text_lower[:1000]:
                return DocumentType.TEN_K
            elif 'form 10-q' in text_lower[:1000]:
                return DocumentType.TEN_Q
            elif 'earnings call' in text_lower[:1000]:
                return DocumentType.EARNINGS_CALL
        
        return DocumentType.OTHER
