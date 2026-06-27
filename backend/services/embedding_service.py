import google.generativeai as genai
from typing import List
import logging
import time
from config import settings

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Service for generating embeddings using Google Gemini."""
    
    def __init__(self):
        genai.configure(api_key=settings.openai_api_key)
        self.model = settings.embedding_model
        
    def _call_with_retry(self, func, *args, **kwargs):
        max_retries = 5
        delay = 10
        for attempt in range(max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                err_msg = str(e).lower()
                if "429" in err_msg or "quota" in err_msg or "rate limit" in err_msg or "resource_exhausted" in err_msg:
                    logger.warning(f"Rate limit hit (429/ResourceExhausted). Sleeping for {delay}s before retrying (attempt {attempt + 1}/{max_retries})...")
                    time.sleep(delay)
                    delay *= 2
                else:
                    raise
        return func(*args, **kwargs)
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of texts.
        
        Args:
            texts: List of text strings to embed
            
        Returns:
            List of embedding vectors
        """
        try:
            embeddings = []
            batch_size = 10
            total_batches = (len(texts) + batch_size - 1) // batch_size
            
            for idx, i in enumerate(range(0, len(texts), batch_size)):
                batch_texts = texts[i:i + batch_size]
                
                # Call embedding API with retry helper
                result = self._call_with_retry(
                    genai.embed_content,
                    model=self.model,
                    content=batch_texts,
                    task_type="retrieval_document"
                )
                embeddings.extend(result['embedding'])
                
                logger.info(f"Processed batch {idx + 1}/{total_batches}")
                
                # Sleep briefly between batches to prevent hitting Tokens Per Minute (TPM) limit
                if idx < total_batches - 1:
                    time.sleep(8)
            
            logger.info(f"Generated {len(embeddings)} embeddings using {self.model}")
            return embeddings
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.
        
        Args:
            text: Text string to embed
            
        Returns:
            Embedding vector
        """
        try:
            result = self._call_with_retry(
                genai.embed_content,
                model=self.model,
                content=text,
                task_type="retrieval_query"
            )
            return result['embedding']
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise
