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

##  Why FinSight?

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

| Category | Feature | Description |
|---|---|---|
| 📄 **Document** | PDF Upload | Upload any financial PDF directly from the browser |
| 📄 **Document** | Smart Chunking | Overlapping chunks preserve cross-paragraph context |
| 📄 **Document** | Source Citations | Every answer references the exact page it came from |
| 🤖 **AI** | Gemini 2.5 Flash | Google's reasoning-optimized model as the answer engine |
| 🤖 **AI** | Hallucination Reduction | Model responds *only* using retrieved document context |
| 🔎 **Search** | Sentence Transformers | `all-MiniLM-L6-v2` for dense semantic embeddings |
| 🔎 **Search** | Top-K Retrieval | Returns the most semantically relevant chunks per query |
| 🖥️ **UI** | Chat Interface | Conversational Q&A with source panel alongside answers |
| ⚙️ **Backend** | FastAPI | High-performance async Python API with OpenAPI docs |

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

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this project for personal, academic, or commercial purposes with attribution.

---

## 👤 Author

<div align="center">

<br />

**Built with precision by Megha S B (https://github.com/meghaaa111)**

*AI Engineer · Full Stack Developer · Open Source Contributor*

<br />

[![GitHub](https://img.shields.io/badge/GitHub-yourusername-181717?style=for-the-badge&logo=github)](https://github.com/meghaaa111)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/megha-s-b-aiml/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-8B5CF6?style=for-the-badge&logo=globe&logoColor=white)](https://meghaaa111.github.io/)

<br />

*If FinSight was useful or interesting to you, consider giving it a ⭐ - it helps others find the project.*

<br />

---

<sub>Built with 🧠 Gemini · 🗃️ ChromaDB · ⚛️ React · 🚀 FastAPI</sub>

<sub>© 2025 Megha S B — MIT Licensed</sub>

</div>
