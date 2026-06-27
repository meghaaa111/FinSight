# 🚀 START HERE - FinSight Quick Reference

Welcome to **FinSight**, your RAG-powered financial intelligence platform!

## ⚡ Quick Start (5 Minutes)

### 1. Set Your API Key
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

### 2. Launch the Application

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Or manually:**
```bash
docker-compose up --build
```

### 3. Access the Platform
- 🌐 **Frontend**: http://localhost:3000
- ⚙️ **Backend**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs

### 4. Upload & Query
1. Click "Documents" → Upload a financial PDF
2. Go to "Chat" → Ask questions
3. View source citations for every answer

## 📖 Documentation Guide

| Document | Purpose | Read When |
|----------|---------|-----------|
| **README.md** | Full project overview | Want to understand architecture |
| **QUICKSTART.md** | Step-by-step setup | First time setup |
| **TESTING.md** | Test cases & validation | Testing the system |
| **DEPLOYMENT.md** | Production deployment | Deploying to servers |
| **PROJECT_SUMMARY.md** | Technical specifications | Deep dive into implementation |
| **FILES_CREATED.md** | Complete file listing | Understanding project structure |

## 🏗️ Project Structure

```
finsight/
├── 📄 Documentation (6 .md files)
├── ⚙️ Configuration (docker-compose.yml, .env, etc.)
├── 🐍 backend/ - FastAPI + ChromaDB + OpenAI
│   ├── routers/ - API endpoints
│   ├── services/ - Business logic
│   ├── models/ - Data schemas
│   └── utils/ - PDF parser, chunker
└── ⚛️ frontend/ - React + Tailwind
    ├── components/ - UI components
    ├── pages/ - Main screens
    └── services/ - API client
```

## 🎯 What FinSight Does

1. **Upload** financial documents (PDFs or URLs)
2. **Process** with text extraction and chunking
3. **Embed** using OpenAI text-embedding-3-small
4. **Store** in ChromaDB vector database
5. **Retrieve** relevant chunks via semantic search
6. **Generate** answers with GPT-4o
7. **Cite** sources with page numbers

## 🔑 Key Features

✅ **Grounded Answers** - Never hallucinates, always cites sources  
✅ **Source Citations** - Every answer shows document & page number  
✅ **Multiple Formats** - PDF upload or URL scraping  
✅ **Smart Chunking** - 512 tokens with 50 overlap  
✅ **Semantic Search** - Finds relevant content, not just keywords  
✅ **Professional UI** - Dark theme, Bloomberg Terminal inspired  
✅ **Production Ready** - Docker, error handling, logging  

## 🛠️ Technology Stack

**Backend:**
- FastAPI (Python web framework)
- ChromaDB (vector database)
- OpenAI GPT-4o (generation)
- OpenAI text-embedding-3-small (embeddings)
- PyMuPDF (PDF parsing)
- LangChain (text splitting)

**Frontend:**
- React 18 (UI framework)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Axios (API client)

**Infrastructure:**
- Docker & Docker Compose
- Nginx (production serving)

## 📊 Example Use Cases

### 1. SEC Filings Analysis
Upload 10-K/10-Q reports and ask:
- "What are the main risk factors?"
- "How did revenue change year-over-year?"
- "What is the company's debt-to-equity ratio?"

### 2. Earnings Call Review
Upload transcripts and ask:
- "What did the CEO say about future plans?"
- "How did the company explain the revenue miss?"
- "What guidance was provided?"

### 3. Financial News Analysis
Ingest articles and ask:
- "Summarize the key points"
- "What companies are mentioned?"
- "What are the market implications?"

## 🎨 UI Overview

### Chat Page (/)
- Left sidebar: Document list with type badges
- Center: Conversation with Q&A
- Message bubbles show sources and confidence
- Example questions to get started

### Documents Page (/documents)
- Drag-and-drop PDF upload
- URL ingestion form
- Document table with metadata
- View chunks drawer
- Delete documents

### Navigation
- Logo and branding
- Page links (Chat, Documents)
- API status indicator (green/red dot)

## 🔧 Common Commands

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild after changes
docker-compose up --build

# Remove everything including database
docker-compose down -v
```

## 🐛 Troubleshooting

### Backend won't start
- Check if OpenAI API key is set in `.env`
- Check logs: `docker-compose logs backend`
- Verify port 8000 is not in use

### Frontend can't connect
- Wait 30 seconds for backend initialization
- Check API status dot in navbar
- Visit http://localhost:8000/api/health

### Upload fails
- Ensure file is a PDF
- Check file size (<100MB recommended)
- Check backend logs for errors

### Out of memory
- Reduce `MAX_CHUNKS_RETRIEVED` in `.env`
- Increase Docker memory allocation
- Process smaller documents

## 💰 Cost Estimates

**Per 100-page document:**
- Ingestion: ~$0.001 (embedding)
- Per query: ~$0.05 (retrieval + generation)

**Monthly for moderate use:**
- 50 documents: ~$0.05
- 1000 queries: ~$50
- Total: ~$50/month

## 🔐 Security Notes

⚠️ **Important for Production:**
1. Never commit `.env` file
2. Enable HTTPS/SSL
3. Add authentication
4. Configure CORS properly
5. Add rate limiting
6. Use secrets manager

See `DEPLOYMENT.md` for production setup.

## 📝 Development Workflow

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Making Changes
1. Edit code
2. Test locally
3. Rebuild: `docker-compose up --build`
4. Verify changes

## 🎓 Learning Path

**Day 1: Get it running**
- Read this file
- Follow QUICKSTART.md
- Upload a test document
- Ask some questions

**Day 2: Understand the system**
- Read README.md
- Explore the API at /docs
- Review PROJECT_SUMMARY.md

**Day 3: Test thoroughly**
- Follow TESTING.md
- Try different document types
- Test error scenarios

**Day 4+: Deploy or customize**
- Read DEPLOYMENT.md for production
- Modify UI colors in tailwind.config.js
- Adjust chunk size in config.py
- Add new features

## 🤝 Getting Help

1. **Check the logs** - Most issues show up here
   ```bash
   docker-compose logs -f
   ```

2. **Review the docs** - Comprehensive guides included
   - README.md for overview
   - TESTING.md for validation
   - DEPLOYMENT.md for production

3. **Test the API** - Interactive docs at /docs
   http://localhost:8000/docs

4. **Check health endpoint**
   ```bash
   curl http://localhost:8000/api/health
   ```

## ✅ Verification Checklist

Before asking questions:
- [ ] `.env` file created with valid API key
- [ ] Docker containers running (`docker ps`)
- [ ] Backend health check passes
- [ ] Frontend loads at localhost:3000
- [ ] At least one document uploaded
- [ ] Green dot showing "API Connected"

## 🎉 Success Indicators

You'll know it's working when:
✅ Upload completes with success notification  
✅ Document appears in sidebar  
✅ Questions return answers within 5-10 seconds  
✅ Sources section shows document references  
✅ Page numbers are displayed for citations  
✅ No console errors in browser (F12)  

## 🚦 Next Steps

1. **Start with examples**
   - Use the suggested questions in the chat
   - Upload a sample SEC filing
   - Verify source citations are accurate

2. **Explore features**
   - Try URL ingestion
   - View document chunks
   - Test different question types

3. **Customize**
   - Adjust colors in tailwind.config.js
   - Modify chunk size in config.py
   - Change system prompt in generation_service.py

4. **Deploy**
   - Follow DEPLOYMENT.md
   - Set up proper domain
   - Enable HTTPS
   - Add authentication

## 📞 Support Resources

- **Documentation**: All .md files in project root
- **API Docs**: http://localhost:8000/docs
- **Logs**: `docker-compose logs -f`
- **Health Check**: http://localhost:8000/api/health

---

## 🎯 Quick Reference

```bash
# Essential commands
cp .env.example .env           # Setup environment
docker-compose up --build      # Start everything
docker-compose logs -f         # View logs
docker-compose down            # Stop everything

# Access points
http://localhost:3000          # Frontend
http://localhost:8000          # Backend
http://localhost:8000/docs     # API Documentation
```

---

**Ready to dive in? Start with `QUICKSTART.md`** 🚀

Built with ❤️ for financial professionals who need accurate, verifiable insights.
