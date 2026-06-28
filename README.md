<div align="center">

<br />

```
███████╗██╗███╗   ██╗███████╗██╗ ██████╗ ██╗  ██╗████████╗
██╔════╝██║████╗  ██║██╔════╝██║██╔════╝ ██║  ██║╚══██╔══╝
█████╗  ██║██╔██╗ ██║███████╗██║██║  ███╗███████║   ██║   
██╔══╝  ██║██║╚██╗██║╚════██║██║██║   ██║██╔══██║   ██║   
██║     ██║██║ ╚████║███████║██║╚██████╔╝██║  ██║   ██║   
╚═╝     ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝  
```

### **AI-Powered Financial Document Intelligence**

*Ask questions. Get answers. Grounded in your documents — not AI guesswork.*

<br />

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_DB-FF6B35?style=for-the-badge)](https://trychroma.com)
[![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-LLM-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-8B5CF6?style=flat-square)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/yourusername/finsight?style=flat-square&color=F59E0B)](https://github.com/yourusername/finsight/stargazers)
[![Issues](https://img.shields.io/github/issues/yourusername/finsight?style=flat-square&color=EF4444)](https://github.com/yourusername/finsight/issues)
[![Last Commit](https://img.shields.io/github/last-commit/yourusername/finsight?style=flat-square&color=64748B)](https://github.com/yourusername/finsight/commits)

<br />

> **FinSight** is a production-grade Retrieval-Augmented Generation (RAG) platform purpose-built for financial documents.  
> Upload SEC 10-Ks, earnings reports, and annual filings — then query them in natural language with answers **sourced directly from the document**, not hallucinated by the model.

<br />

</div>

---

## 🎬 Demo

<div align="center">

<img src="assets/demo.gif" alt="FinSight Demo" width="85%" style="border-radius: 12px;" />

<br /><br />

> **📁 To add your demo:** Record your screen, export as `demo.gif`, and place it at `assets/demo.gif`.  
> Recommended tools: [Kap](https://getkap.co/) (macOS), [ScreenToGif](https://www.screentogif.com/) (Windows), or [Peek](https://github.com/phw/peek) (Linux).

</div>

---

## 🧠 Why FinSight?

### The Problem with Asking AI About Finance

When financial analysts, compliance officers, or investors ask a general-purpose LLM questions like *"What was Apple's revenue in FY2023?"* or *"What risk factors did management disclose?"*, the model **makes up an answer based on its training data** — which may be outdated, imprecise, or simply wrong.

In finance, a hallucinated figure is not a minor inconvenience. It is a liability.

> *"A confident but fabricated earnings figure can inform a bad trade. A misquoted risk factor can fail a compliance audit. In finance, hallucinations have consequences."*

### How RAG Fixes It

**Retrieval-Augmented Generation (RAG)** changes the architecture entirely.

Instead of asking the model what it *remembers*, FinSight first retrieves the most relevant passages directly from the uploaded document — then provides those passages as grounded context before the model generates any response.

The model can only answer using what is **actually in your document**. Every answer includes source citations and page references, making it auditable, traceable, and trustworthy.

| Approach | Source of Truth | Hallucination Risk | Auditable |
|---|---|---|---|
| Direct LLM prompting | Model's training memory | 🔴 High | ❌ No |
| FinSight RAG Pipeline | Your uploaded document | 🟢 Very Low | ✅ Yes |

FinSight simulates the document intelligence infrastructure used by **investment banks, consulting firms, legal organizations, and financial institutions** — built as an open-source, portfolio-grade system.

---

## ✨ Key Features

### 📄 Document Intelligence

| Feature | Description |
|---|---|
| 📤 **PDF Upload** | Upload any financial PDF directly from the browser |
| 🔍 **Text Extraction** | Precision extraction via PyPDF with cleaning and normalization |
| ✂️ **Smart Chunking** | Overlapping chunk strategy preserves cross-paragraph context |
| 📑 **Source Citations** | Every answer references the exact page it came from |
| 📊 **Multi-Format Support** | SEC 10-Ks, earnings releases, annual reports, investor presentations |

### 🤖 AI & Language Model

| Feature | Description |
|---|---|
| 🧬 **Gemini 2.5 Flash** | Google's latest fast, reasoning-optimized model as the answer engine |
| 📎 **Context-Grounded Answers** | Model responds *only* using retrieved document context |
| 🛡️ **Hallucination Reduction** | RAG architecture prevents the model from fabricating financial data |
| 🎯 **Prompt Engineering** | Custom system prompts enforce citation-first, factual-only responses |

### 🔎 Semantic Search

| Feature | Description |
|---|---|
| 🧲 **Sentence Transformers** | `all-MiniLM-L6-v2` encodes both documents and queries into dense vectors |
| 🗃️ **ChromaDB Vector Store** | Local, persistent vector database for fast similarity retrieval |
| 📐 **Top-K Retrieval** | Returns the K most semantically relevant chunks per query |
| 🔁 **Query Embedding** | User questions are embedded in real-time and matched to stored chunks |

### 🖥️ Frontend & UX

| Feature | Description |
|---|---|
| ⚛️ **React 18** | Component-based SPA with clean state management |
| 🎨 **Tailwind CSS** | Utility-first styling — responsive and polished |
| 💬 **Chat Interface** | Conversational Q&A experience with document context |
| 📋 **Source Panel** | Surfaced source chunks and page numbers alongside every answer |
| ⚡ **Axios HTTP Client** | Non-blocking async requests to the FastAPI backend |

### ⚙️ Backend & Infrastructure

| Feature | Description |
|---|---|
| 🚀 **FastAPI** | High-performance Python API with automatic OpenAPI docs |
| 🐍 **Python 3.11+** | Modern async-compatible backend |
| 🔐 **Environment Variables** | `python-dotenv` for secure API key management |
| 🐳 **Docker Ready** | Containerization support planned (see roadmap) |

---

## 🏛️ Architecture

```mermaid
graph TD
    A[👤 User] -->|Uploads PDF / Asks Question| B[⚛️ React Frontend]
    B -->|HTTP Request via Axios| C[🚀 FastAPI Backend]
    
    subgraph Upload Pipeline
        C -->|PDF bytes| D[📄 PyPDF Text Extractor]
        D -->|Raw text| E[🧹 Text Cleaner & Normalizer]
        E -->|Clean text| F[✂️ Chunker — Overlapping Windows]
        F -->|Text chunks| G[🧬 Sentence Transformer Encoder]
        G -->|Dense vectors| H[(🗃️ ChromaDB Vector Store)]
    end
    
    subgraph Query Pipeline
        C -->|User question| I[🔢 Query Embedding]
        I -->|Query vector| J[🔍 Semantic Search — Top-K]
        H -->|Stored embeddings| J
        J -->|Relevant chunks| K[📎 Context Assembly]
        K -->|Prompt + Context| L[✨ Gemini 2.5 Flash]
        L -->|Grounded answer| M[📋 Citation Formatter]
    end
    
    M -->|Answer + Page Sources| B
    B -->|Displays response| A

    style H fill:#1e293b,stroke:#334155,color:#94a3b8
    style L fill:#1a1f2e,stroke:#3b5bdb,color:#748ffc
    style A fill:#064e3b,stroke:#059669,color:#6ee7b7
```

---

## 🔄 System Workflow — Full RAG Pipeline

```mermaid
flowchart LR
    subgraph INGEST ["📥 Document Ingestion"]
        direction TB
        A1[Upload PDF] --> A2[Extract Text]
        A2 --> A3[Clean & Normalize]
        A3 --> A4[Chunk with Overlap]
        A4 --> A5[Embed Chunks]
        A5 --> A6[Store in ChromaDB]
    end

    subgraph QUERY ["💬 Query Resolution"]
        direction TB
        B1[User Question] --> B2[Embed Question]
        B2 --> B3[Cosine Similarity Search]
        B3 --> B4[Retrieve Top-K Chunks]
        B4 --> B5[Assemble Context Prompt]
        B5 --> B6[Gemini Generates Answer]
        B6 --> B7[Return Answer + Citations]
    end

    A6 -->|Shared vector store| B3

    style INGEST fill:#0f172a,stroke:#1e3a5f,color:#93c5fd
    style QUERY fill:#0f172a,stroke:#1e3a5f,color:#93c5fd
```

---

## 📖 How RAG Works

<details>
<summary><b>Click to expand — Deep Dive into Retrieval-Augmented Generation</b></summary>

<br />

RAG is not a single technique — it is an architectural pattern that fundamentally changes how language models interact with information.

### 1. 🔪 Chunking

Large documents cannot fit inside a model's context window. FinSight breaks documents into overlapping text segments (chunks). Overlap ensures that important sentences that span chunk boundaries are never lost.

```
[...Paragraph A...] [OVERLAP] [...Paragraph B...]
               ↑ chunk 1  ↑ chunk 2
```

### 2. 🧬 Embeddings

Each chunk is passed through `all-MiniLM-L6-v2`, a Sentence Transformer model, which converts natural language into a 384-dimensional dense vector — a numerical fingerprint of the text's *meaning*.

```
"Revenue increased by 12% year-over-year" → [0.21, -0.84, 0.37, ... 384 values]
```

### 3. 🗃️ Vector Storage

All chunk embeddings are stored in ChromaDB alongside their source metadata (document name, page number, chunk index). ChromaDB enables fast approximate nearest-neighbour search.

### 4. 🔍 Semantic Search

When a user asks a question, the query is embedded using the same model. ChromaDB computes cosine similarity between the query vector and all stored chunk vectors, returning the **Top-K most semantically relevant** chunks — even if the query uses different words than the document.

```
Query: "How did operating expenses change?"
↓  Semantic similarity search
Retrieved: "Total operating costs rose 8.3% driven by headcount growth..."
```

### 5. 📎 Context Grounding

The Top-K chunks are assembled into a structured prompt alongside strict instructions: *answer only using the provided context, cite sources explicitly, and state if the answer is not present*. This is the grounding step.

### 6. 🛡️ Hallucination Reduction

Because the model only sees document-sourced context, it cannot invent financial figures. If the answer is not in the retrieved chunks, the model says so — rather than fabricating a plausible-sounding response.

</details>

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square) | **React** | 18 | Frontend SPA framework |
| ![Tailwind](https://img.shields.io/badge/-Tailwind-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square) | **Tailwind CSS** | 3.4 | Utility-first styling |
| ![Axios](https://img.shields.io/badge/-Axios-5A29E4?logo=axios&logoColor=white&style=flat-square) | **Axios** | Latest | Async HTTP client |
| ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white&style=flat-square) | **FastAPI** | 0.110+ | Python REST API server |
| ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white&style=flat-square) | **Python** | 3.11+ | Backend runtime |
| ![Google](https://img.shields.io/badge/-Gemini_2.5_Flash-4285F4?logo=google&logoColor=white&style=flat-square) | **Gemini 2.5 Flash** | Latest | Large language model |
| 🤗 | **Sentence Transformers** | `all-MiniLM-L6-v2` | Text embedding model |
| 🗃️ | **ChromaDB** | Latest | Local vector database |
| 📄 | **PyPDF** | Latest | PDF text extraction |
| 🔐 | **python-dotenv** | Latest | Environment config |
| 🐳 | **Docker** | *(planned)* | Containerization |

---

## 📁 Project Structure

```
finsight/
│
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── routes/
│   │   ├── upload.py           # PDF upload & ingestion endpoint
│   │   └── query.py            # Question answering endpoint
│   ├── services/
│   │   ├── pdf_processor.py    # PyPDF extraction & text cleaning
│   │   ├── chunker.py          # Overlapping chunk strategy
│   │   ├── embedder.py         # Sentence Transformer embeddings
│   │   ├── vector_store.py     # ChromaDB interface
│   │   └── llm.py              # Gemini API integration
│   ├── utils/
│   │   └── helpers.py          # Shared utility functions
│   ├── requirements.txt
│   └── .env                    # API keys (never commit this)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadPanel.jsx     # PDF drag-and-drop upload
│   │   │   ├── ChatInterface.jsx   # Q&A chat window
│   │   │   └── SourceViewer.jsx    # Retrieved chunk display
│   │   ├── api/
│   │   │   └── client.js           # Axios API calls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── assets/
│   └── demo.gif                # Demo recording (add your own)
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 📸 Screenshots

<div align="center">

| Home | Upload |
|:---:|:---:|
| <img src="assets/screenshot-home.png" width="420" alt="Home Screen" /> | <img src="assets/screenshot-upload.png" width="420" alt="Upload Screen" /> |
| *Landing page with document overview* | *PDF drag-and-drop ingestion panel* |

| Chat | Retrieved Sources |
|:---:|:---:|
| <img src="assets/screenshot-chat.png" width="420" alt="Chat Screen" /> | <img src="assets/screenshot-sources.png" width="420" alt="Sources Screen" /> |
| *Natural language Q&A interface* | *Source chunks with page citations* |

> **📸 Add your screenshots:** Place images at `assets/screenshot-home.png`, `assets/screenshot-upload.png`, `assets/screenshot-chat.png`, and `assets/screenshot-sources.png`.

</div>

---

## 🚀 Installation & Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- Google Gemini API Key → [Get one here](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/finsight.git
cd finsight
```

---

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

**Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env`:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
CHROMA_PERSIST_DIR=./chroma_db
CHUNK_SIZE=500
CHUNK_OVERLAP=100
TOP_K=5
```

**Start the FastAPI server:**

```bash
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`.  
Interactive API docs available at `http://localhost:8000/docs`.

---

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The React app will be live at `http://localhost:5173`.

---

### 4. Verify Everything Works

1. Open `http://localhost:5173`
2. Upload an SEC 10-K or any financial PDF
3. Wait for ingestion to complete
4. Ask a question in the chat panel
5. View the grounded answer and source citations

---

## 💬 Example Questions

Once a document is uploaded, try asking:

```
📊 "What was the total revenue for fiscal year 2023?"
📉 "What risk factors did management disclose?"
💰 "How did operating expenses change compared to the prior year?"
🏦 "What is the company's current debt-to-equity ratio?"
📋 "Summarize the key highlights from the CEO's letter to shareholders."
🔍 "What did the auditors flag in their report?"
📈 "What is management's guidance for the next quarter?"
⚖️  "Are there any pending legal proceedings disclosed in this filing?"
```

---

## 🧩 Engineering Challenges

Building FinSight surfaced several non-trivial engineering problems:

**Chunk Size Calibration**  
Too-small chunks lose sentence context and retrieve irrelevant fragments. Too-large chunks exceed context windows and dilute relevance scores. Finding the right chunk size + overlap ratio required empirical testing across multiple document types.

**Retrieval Accuracy vs. Speed**  
Top-K retrieval must balance precision with latency. Retrieving too many chunks adds noise to the prompt; too few risks missing the relevant passage. A configurable `TOP_K` parameter with document-aware tuning was implemented.

**Context Window Management**  
Gemini has a large context window, but stuffing it with irrelevant chunks still degrades response quality. Strict chunk scoring and ordering by relevance score ensures only the highest-signal context reaches the model.

**Semantic Mismatch**  
Queries like "earnings growth" must match chunks containing "revenue increased." Pure keyword search fails here. Sentence Transformers solve this by encoding semantic meaning rather than lexical tokens — but required careful model selection and normalization.

**Prompt Design for Finance**  
Generic prompts produce generic answers. FinSight's system prompt is engineered to enforce: citation-first response structure, refusal to speculate beyond retrieved context, and explicit handling of "not found in document" cases.

---

## 🎓 What I Learned

Building FinSight was a deep dive into production AI engineering. Here's what this project taught me:

- **RAG Architecture** — Designing and implementing a full retrieval-augmented pipeline from scratch, understanding where each component fits and why
- **Vector Databases** — How ChromaDB stores and retrieves embeddings, and the mechanics of approximate nearest-neighbour search at scale
- **Embedding Models** — The difference between general-purpose and domain-specific sentence transformers, and how embedding quality directly determines retrieval quality  
- **FastAPI** — Building a production-style async Python API with proper route separation, error handling, and auto-generated documentation
- **React** — Structuring a clean component hierarchy for a document-intelligence UI with async state management
- **Prompt Engineering** — Writing system prompts that constrain model behaviour in high-stakes, citation-required scenarios
- **Semantic Search** — Why cosine similarity over dense vectors outperforms keyword search for natural language queries
- **Financial AI** — The unique requirements of AI in financial contexts: auditability, source attribution, and zero tolerance for hallucination

---

## 🗺️ Roadmap

```
Phase 1 — Core (Complete)
```
- [x] PDF upload and text extraction
- [x] Overlapping chunking strategy
- [x] Sentence Transformer embeddings
- [x] ChromaDB vector store integration
- [x] Semantic Top-K retrieval
- [x] Gemini-powered answer generation
- [x] Source citation display
- [x] React frontend with chat UI

```
Phase 2 — In Progress
```
- [ ] 🔦 OCR support for scanned PDFs (Tesseract integration)
- [ ] 📚 Multi-document retrieval — query across multiple uploaded filings
- [ ] 💾 Conversation memory — maintain context across follow-up questions
- [ ] 🌊 Streaming responses — token-by-token answer rendering

```
Phase 3 — Planned
```
- [ ] 🌲 Pinecone integration as production vector database alternative
- [ ] 🔐 Authentication — user accounts and private document sessions
- [ ] 🖍️ Citation highlighting — highlight exact source passage in PDF viewer
- [ ] ☁️ AWS deployment — ECS containerized backend + S3 document storage
- [ ] 📊 Analytics dashboard — query logs, retrieval metrics, usage stats
- [ ] 🧪 Evaluation framework — automated RAG quality scoring with ground truth

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project for personal, academic, or commercial purposes with attribution.

---

## 👤 Author

<div align="center">

<br />

**Built with precision by [Your Name](https://github.com/yourusername)**

*AI Engineer · Full Stack Developer · Open Source Contributor*

<br />

[![GitHub](https://img.shields.io/badge/GitHub-yourusername-181717?style=for-the-badge&logo=github)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/yourusername)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-8B5CF6?style=for-the-badge&logo=globe&logoColor=white)](https://yourportfolio.dev)

<br />

*If FinSight was useful or interesting to you, consider giving it a ⭐ — it helps others find the project.*

<br />

---

<sub>Built with 🧠 Gemini · 🗃️ ChromaDB · ⚛️ React · 🚀 FastAPI</sub>

<sub>© 2025 Your Name — MIT Licensed</sub>

</div>
