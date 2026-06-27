# Testing FinSight

This guide helps you test all features of FinSight.

## Test Documents

### Where to Find Test Documents

1. **SEC EDGAR** - Real financial filings
   - Apple 10-K: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320193&type=10-K
   - Microsoft 10-Q: https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000789019&type=10-Q

2. **Sample PDF Creation**
   - Create a simple PDF with financial content for testing
   - Use any SEC filing from EDGAR

## Test Cases

### 1. Document Upload (PDF)

**Steps:**
1. Navigate to Documents page
2. Drag and drop a PDF or click to browse
3. Select a financial PDF file

**Expected Results:**
- Progress bar shows upload progress
- Success notification appears
- Document appears in the table
- Chunk count is displayed
- Page count is shown (if applicable)

**What to Check:**
- File upload completes without errors
- Processing time is reasonable (<1 min for small docs)
- Chunk count matches expected size

### 2. URL Ingestion

**Steps:**
1. Navigate to Documents page
2. Paste a URL (e.g., SEC filing URL)
3. Click "Ingest from URL"

**Expected Results:**
- Loading indicator appears
- Success notification
- Document appears in table
- Chunks are created from web content

**What to Check:**
- URL parsing works correctly
- Content extraction is meaningful
- Document title is extracted properly

### 3. Question Answering

**Test Questions for a 10-K:**

1. **Risk Factors**
   - "What are the main risk factors mentioned?"
   - "What risks does the company face?"

2. **Financial Metrics**
   - "What is the revenue for this period?"
   - "How much debt does the company have?"
   - "What is the profit margin?"

3. **Business Operations**
   - "Describe the company's main business segments"
   - "What products does the company sell?"
   - "Who are the company's competitors?"

4. **Year-over-Year Comparisons**
   - "How did revenue change compared to last year?"
   - "Did operating expenses increase or decrease?"

**Expected Results:**
- Answer appears within 5-10 seconds
- Sources section shows relevant chunks
- Citations include document name and page number
- Confidence level is displayed
- Answer is factual and grounded in documents

**What to Check:**
- Answers are accurate based on the document
- Sources are relevant to the question
- No hallucinations (made-up facts)
- Citations are correct

### 4. Source Verification

**Steps:**
1. Ask a question and get an answer
2. Click to expand "Sources" section
3. Review each source card

**Expected Results:**
- 3-5 source citations
- Each shows document name, page number, excerpt
- Relevance scores (0-100%)
- Excerpts contain relevant information

**What to Check:**
- Excerpts match the answer content
- Page numbers are accurate
- Relevance scores make sense

### 5. Document Management

**Steps:**
1. View list of documents
2. Click "View Chunks" on a document
3. Review chunks in the drawer
4. Close drawer
5. Click delete button
6. Confirm deletion

**Expected Results:**
- Chunks drawer slides in from right
- All chunks are displayed in order
- Page numbers shown for each chunk
- Delete prompts for confirmation
- Document removed from list

### 6. Empty State Handling

**Test Scenarios:**

1. **No Documents Uploaded**
   - Go to Chat page
   - Try to ask a question
   - Expected: Warning about uploading documents first

2. **Question Not Answerable**
   - Ask: "What is the weather like today?"
   - Expected: "I could not find this information in the provided documents."

3. **No Relevant Context**
   - Ask about something not in documents
   - Expected: Low confidence, warning message

### 7. Error Handling

**Test Scenarios:**

1. **Invalid File Type**
   - Try to upload a .txt or .docx file
   - Expected: Error message about PDF only

2. **Invalid URL**
   - Enter an invalid URL
   - Expected: Error message

3. **API Disconnected**
   - Stop the backend
   - Check the status indicator
   - Expected: Red dot, "API Disconnected"

4. **Large File**
   - Upload a very large PDF (>50 pages)
   - Expected: Processing may take longer but completes

## Performance Benchmarks

### Expected Performance

| Operation | Expected Time |
|-----------|---------------|
| Upload 10-page PDF | 10-30 seconds |
| Upload 100-page PDF | 1-3 minutes |
| URL ingestion | 15-45 seconds |
| Query response | 3-8 seconds |
| Chunk extraction | <1 second |
| Document deletion | <1 second |

### What to Monitor

- Upload progress is smooth
- No long freezes
- Queries return within reasonable time
- UI remains responsive

## Integration Testing

### End-to-End Workflow

1. **Fresh Start**
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

2. **Upload Multiple Documents**
   - Upload 2-3 different documents
   - Mix PDFs and URL ingestion

3. **Cross-Document Queries**
   - Ask questions that require multiple documents
   - Check if sources come from different docs

4. **Document Lifecycle**
   - Upload → Query → View Chunks → Delete
   - Verify deletion removes from vector store

## API Testing

### Using the API Docs

1. Navigate to http://localhost:8000/docs
2. Test each endpoint:
   - `POST /api/ingest/upload`
   - `POST /api/ingest/url`
   - `POST /api/query`
   - `GET /api/documents`
   - `DELETE /api/documents/{id}`
   - `GET /api/health`

### Using cURL

**Health Check:**
```bash
curl http://localhost:8000/api/health
```

**List Documents:**
```bash
curl http://localhost:8000/api/documents
```

**Query:**
```bash
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the main risks?"}'
```

## Browser Compatibility

Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)

## Mobile Responsiveness

Test on mobile viewport:
1. Open browser dev tools
2. Switch to mobile view (768px width)
3. Test navigation
4. Test chat interface
5. Test document upload (if possible)

## Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] API health check passes
- [ ] PDF upload works
- [ ] URL ingestion works
- [ ] Questions get accurate answers
- [ ] Sources are displayed correctly
- [ ] Chunks drawer works
- [ ] Document deletion works
- [ ] Empty states display properly
- [ ] Error messages are helpful
- [ ] Performance is acceptable
- [ ] No console errors in browser
- [ ] API documentation is accessible

## Known Limitations

1. **PDF Text Extraction**
   - Scanned PDFs (images) won't work - need OCR
   - Complex tables may not parse perfectly

2. **URL Scraping**
   - JavaScript-heavy sites may not work
   - Some sites may block scraping

3. **Context Window**
   - Very long documents may not fit entirely
   - Chunking helps but loses some context

4. **Answer Quality**
   - Depends on document quality
   - Very technical jargon may confuse the model
   - Multi-hop reasoning is limited

## Reporting Issues

When reporting issues, include:
1. Steps to reproduce
2. Expected vs actual behavior
3. Browser and OS version
4. Backend logs (`docker-compose logs backend`)
5. Frontend console errors (F12 → Console)
6. Example document (if possible)

---

Happy testing! 🧪
