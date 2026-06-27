import google.generativeai as genai
from typing import List, Dict
import logging
from config import settings

logger = logging.getLogger(__name__)


class GenerationService:
    """Service for generating answers using Google Gemini."""
    
    def __init__(self):
        genai.configure(api_key=settings.openai_api_key)
        self.model = genai.GenerativeModel(settings.generation_model)
        self.temperature = settings.temperature
        
        self.system_prompt = """You are a financial analyst assistant helping users understand financial documents.

Your role is to answer questions using ONLY the information provided in the context below.

CRITICAL RULES:
1. Answer ONLY based on the provided context passages
2. If the answer cannot be found in the context, respond with: "I could not find this information in the provided documents."
3. ALWAYS cite your sources by mentioning the document name and page number
4. Be precise and factual - never speculate or add information not in the context
5. When citing, use the format: [Document Name, Page X]
6. If multiple sources support your answer, cite all of them
7. Keep answers concise but comprehensive

Context passages are provided with their source information. Use these to answer the user's question."""
    
    def generate_answer(
        self,
        question: str,
        context_chunks: List[Dict[str, any]]
    ) -> str:
        """
        Generate an answer based on retrieved context chunks.
        
        Args:
            question: The user's question
            context_chunks: List of dicts with 'text', 'filename', 'page_number'
            
        Returns:
            Generated answer string
        """
        try:
            # Build the context section
            context_parts = []
            for i, chunk in enumerate(context_chunks, 1):
                page_ref = f"Page {chunk['page_number']}" if chunk['page_number'] and chunk['page_number'] > 0 else "Web Content"
                context_parts.append(
                    f"[Source {i}: {chunk['filename']}, {page_ref}]\n{chunk['text']}\n"
                )
            
            context_text = "\n".join(context_parts)
            
            # Construct the full prompt
            full_prompt = f"""{self.system_prompt}

Context:
{context_text}

Question: {question}

Please provide a detailed answer based on the context above, and cite your sources."""
            
            # Call Gemini API
            response = self.model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=self.temperature,
                )
            )
            
            answer = response.text
            logger.info(f"Generated answer for question: {question[:50]}...")
            return answer
            
        except Exception as e:
            logger.error(f"Error generating answer: {str(e)}")
            raise
    
    def calculate_confidence(self, answer: str, context_chunks: List[Dict]) -> str:
        """
        Calculate confidence level based on answer characteristics.
        
        Args:
            answer: The generated answer
            context_chunks: The context chunks used
            
        Returns:
            Confidence level: "high", "medium", or "low"
        """
        # Simple heuristic-based confidence
        if "could not find" in answer.lower() or "don't have" in answer.lower():
            return "low"
        
        # Check if answer contains citations
        has_citations = "[" in answer or "page" in answer.lower()
        
        # Check answer length (very short answers might be uncertain)
        is_substantial = len(answer.split()) > 20
        
        if has_citations and is_substantial and len(context_chunks) >= 3:
            return "high"
        elif has_citations or is_substantial:
            return "medium"
        else:
            return "low"
