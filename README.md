# FinSight - Financial Intelligence Platform

A production-grade RAG (Retrieval-Augmented Generation) powered question-answering system for financial documents. Built with FastAPI backend and React frontend.

## 🎯 What FinSight Does

FinSight allows users to:
- Upload or automatically ingest financial documents (SEC 10-K/10-Q filings, earnings call transcripts, financial news articles)
- Ask natural language questions about those documents
- Get accurate, grounded answers with source citations
- Verify every answer with document references and page numbers

**Key Feature**: The system never makes up financial data — all answers are grounded in uploaded documents only.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  - Chat Interface      - Document Manager                    │
│  - Source Citations    - Real-time Upload                    │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API
┌────────────────────┴────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Ingestion  │  │   Retrieval  │  │  Generation  │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│    ┌────▼─────┐       ┌───▼────┐        ┌───▼────┐         │
│    │   PDF    │       │ Chroma │        │ OpenAI │         │
│    │  Parser  │       │   DB   │        │  GPT-4o│         │
│    └──────────┘       └────────┘        └────────┘         │
│                                                              │
│  Document Processing Pipeline:                              │
│  1. Upload/URL → 2. Extract Text → 3. Chunk (512 tokens)   │
│  4. Embed (text-embedding-3-small) → 5. Store in ChromaDB  │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- OpenAI API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finsight
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📖 Usage

### Uploading Documents

1. Navigate to the **Documents** page
2. Drag and drop a PDF file or click to browse
3. Wait for processing (extraction, chunking, embedding)
4. Document appears in your library

### Ingesting from URL

1. On the **Documents** page, find the "Ingest from URL" section
2. Paste a URL (e.g., SEC EDGAR filing link)
3. Click "Ingest from URL"
4. Content will be scraped, processed, and added to your library

### Asking Questions

1. Go to the **Chat** page
2. Type your question about the documents
3. Receive an answer with source citations
4. Click on sources to see the exact passages used
5. Verify information by checking document name and page number

### Example Questions

- "What are the main risk factors mentioned?"
- "Summarise the revenue performance this quarter"
- "What is the debt-to-equity ratio mentioned?"
- "How did operating expenses change year over year?"

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **ChromaDB**: Vector database for semantic search
- **OpenAI GPT-4o**: Answer generation
- **OpenAI text-embedding-3-small**: Document embeddings
- **PyMuPDF**: PDF text extraction
- **BeautifulSoup**: Web scraping
- **LangChain**: Text splitting and chunking

### Frontend
- **React 18**: UI framework
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **React Router**: Navigation
- **Axios**: API communication
- **React Dropzone**: File uploads
- **React Hot Toast**: Notifications

## 📁 Project Structure

```
finsight/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration settings
│   ├── routers/
│   │   ├── ingest.py          # Document ingestion endpoints
│   │   ├── query.py           # Query/RAG endpoints
│   │   └── documents.py       # Document management endpoints
│   ├── services/
│   │   ├── ingestion_service.py    # PDF & URL ingestion
│   │   ├── embedding_service.py    # OpenAI embeddings
│   │   ├── retrieval_service.py    # ChromaDB operations
│   │   └── generation_service.py   # LLM answer generation
│   ├── models/
│   │   └── schemas.py         # Pydantic models
│   ├── utils/
│   │   ├── pdf_parser.py      # PDF text extraction
│   │   └── chunker.py         # Text chunking logic
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── TypingIndicator.jsx
│   │   │   ├── DocumentSidebar.jsx
│   │   │   └── UploadModal.jsx
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   └── Documents.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useHealth.js
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### Ingestion
- `POST /api/ingest/upload` - Upload PDF document
- `POST /api/ingest/url` - Ingest from URL

### Query
- `POST /api/query` - Ask questions (RAG endpoint)

### Documents
- `GET /api/documents` - List all documents
- `GET /api/documents/{id}/chunks` - View document chunks
- `DELETE /api/documents/{id}` - Delete document

### Health
- `GET /api/health` - System health check

## 🎨 Design Philosophy

FinSight follows a professional financial tool aesthetic:
- **Dark theme**: Bloomberg terminal inspired
- **Color scheme**: Dark backgrounds (#0a0a0f), purple accent (#6c63ff), green success (#00d97e)
- **Typography**: Inter font family
- **UX**: Clean, minimal, focused on content and readability

## 🔒 Security & Data Integrity

- All answers are grounded in uploaded documents only
- Source citations prevent hallucination
- No external data sources mixed into answers
- Temperature set to 0 for deterministic responses
- Proper error handling and validation

## 🚧 Development

### Running Locally (Without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your OpenAI API key
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Environment Variables

See `.env.example` for all available configuration options.

## 📝 Configuration

Key configuration options in `backend/config.py`:
- `CHUNK_SIZE`: 512 tokens (default)
- `CHUNK_OVERLAP`: 50 tokens (default)
- `MAX_CHUNKS_RETRIEVED`: 5 (default)
- `EMBEDDING_MODEL`: text-embedding-3-small
- `GENERATION_MODEL`: gpt-4o
- `TEMPERATURE`: 0.0 (deterministic)

## 📸 Screenshots

### Chat Interface
```
[Placeholder for chat interface screenshot]
```

### Document Manager
```
[Placeholder for document manager screenshot]
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for GPT-4o and embeddings API
- ChromaDB for vector storage
- LangChain for text processing utilities
- FastAPI and React communities

## 📧 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for financial professionals who need accurate, verifiable insights from their documents.**
