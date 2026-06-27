import fitz  # PyMuPDF
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class PDFParser:
    """Extracts text from PDF files while preserving page numbers."""
    
    @staticmethod
    def extract_text_with_pages(pdf_path: str) -> List[Dict[str, any]]:
        """
        Extract text from PDF with page number information.
        
        Args:
            pdf_path: Path to the PDF file
            
        Returns:
            List of dicts with 'page_number' and 'text' keys
        """
        try:
            doc = fitz.open(pdf_path)
            pages_data = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()
                
                if text.strip():  # Only include pages with content
                    pages_data.append({
                        'page_number': page_num + 1,  # 1-indexed
                        'text': text
                    })
            
            doc.close()
            logger.info(f"Extracted text from {len(pages_data)} pages in {pdf_path}")
            return pages_data
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF {pdf_path}: {str(e)}")
            raise
    
    @staticmethod
    def get_page_count(pdf_path: str) -> int:
        """Get the total number of pages in a PDF."""
        try:
            doc = fitz.open(pdf_path)
            count = len(doc)
            doc.close()
            return count
        except Exception as e:
            logger.error(f"Error getting page count from {pdf_path}: {str(e)}")
            return 0
