from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict
import tiktoken
import logging

logger = logging.getLogger(__name__)


class DocumentChunker:
    """Splits documents into chunks with token-based sizing."""
    
    def __init__(self, chunk_size: int = 512, chunk_overlap: int = 50, encoding_name: str = "cl100k_base"):
        """
        Initialize the chunker.
        
        Args:
            chunk_size: Target size of each chunk in tokens
            chunk_overlap: Number of overlapping tokens between chunks
            encoding_name: Tokenizer encoding to use
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.encoding = tiktoken.get_encoding(encoding_name)
        
        # Initialize text splitter
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=self._token_length,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    def _token_length(self, text: str) -> int:
        """Calculate the token length of text."""
        return len(self.encoding.encode(text))
    
    def chunk_pages(self, pages_data: List[Dict[str, any]]) -> List[Dict[str, any]]:
        """
        Split pages into chunks while preserving page number metadata.
        
        Args:
            pages_data: List of dicts with 'page_number' and 'text' keys
            
        Returns:
            List of dicts with 'text', 'page_number', and 'chunk_index' keys
        """
        all_chunks = []
        chunk_index = 0
        
        for page_data in pages_data:
            page_number = page_data['page_number']
            text = page_data['text']
            
            # Split the page text into chunks
            chunks = self.text_splitter.split_text(text)
            
            for chunk_text in chunks:
                all_chunks.append({
                    'text': chunk_text,
                    'page_number': page_number,
                    'chunk_index': chunk_index
                })
                chunk_index += 1
        
        logger.info(f"Created {len(all_chunks)} chunks from {len(pages_data)} pages")
        return all_chunks
    
    def chunk_text(self, text: str) -> List[Dict[str, any]]:
        """
        Split plain text into chunks (for web content without page numbers).
        
        Args:
            text: The text to chunk
            
        Returns:
            List of dicts with 'text' and 'chunk_index' keys
        """
        chunks = self.text_splitter.split_text(text)
        
        chunked_data = [
            {
                'text': chunk_text,
                'chunk_index': idx,
                'page_number': None
            }
            for idx, chunk_text in enumerate(chunks)
        ]
        
        logger.info(f"Created {len(chunked_data)} chunks from text")
        return chunked_data
