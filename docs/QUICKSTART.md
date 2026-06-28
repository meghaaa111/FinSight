# FinSight Quick Start Guide

Get up and running with FinSight in 5 minutes!

## Prerequisites

- Docker Desktop installed and running
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Step-by-Step Setup

### 1. Configure Your API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
CHROMA_DB_PATH=./chroma_db
MAX_CHUNKS_RETRIEVED=5
```

### 2. Start the Application

**On Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```bash
setup.bat
```

**Or manually with Docker Compose:**
```bash
docker-compose up --build
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 4. Upload Your First Document

1. Open http://localhost:3000 in your browser
2. Click on "Documents" in the navigation
3. Drag and drop a PDF financial document
4. Wait for processing (usually 10-30 seconds)

### 5. Ask Questions

1. Go back to the "Chat" page
2. Try one of the suggested questions or type your own
3. Get answers with source citations!

## Example Workflow

1. **Upload a 10-K filing** - Annual report from any public company
2. **Ask**: "What are the company's main revenue streams?"
3. **Review the answer** - Click "Sources" to see exact document references
4. **Verify**: Check the page numbers and excerpts

## Troubleshooting

### Services won't start
- Check Docker is running: `docker ps`
- Check logs: `docker-compose logs -f`
- Restart: `docker-compose restart`

### "API Disconnected" in the UI
- Wait 30 seconds for backend to initialize
- Check backend logs: `docker-compose logs backend`
- Ensure your OpenAI API key is valid

### Upload fails
- Ensure the file is a PDF
- Check file size (very large files may take longer)
- Check backend logs for errors

### No ChromaDB directory
- The directory is created automatically on first run
- Ensure Docker has volume mount permissions

## Stopping the Application

```bash
docker-compose down
```

To also remove the database:
```bash
docker-compose down -v
```

## Development Mode

Want to modify the code? Run without Docker:

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Next Steps

- Read the full [README.md](README.md) for architecture details
- Explore the [API documentation](http://localhost:8000/docs)
- Try different document types (10-K, 10-Q, earnings calls)
- Experiment with different questions

## Getting Help

- Check the logs: `docker-compose logs -f`
- Review the API docs: http://localhost:8000/docs
- Open an issue on GitHub

---

Happy analyzing! 📊
