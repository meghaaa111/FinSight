# FinSight Deployment Guide

This guide covers deploying FinSight to production environments.

## Prerequisites

- Docker and Docker Compose
- OpenAI API key
- Server with at least 2GB RAM
- Domain name (optional, for production)

## Local Development Deployment

See [QUICKSTART.md](QUICKSTART.md) for local setup instructions.

## Production Deployment Options

### Option 1: Docker Compose (Simple)

**Best for:** Small teams, internal tools, proof of concepts

1. **Prepare the server**
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo apt-get update
   sudo apt-get install docker-compose-plugin
   ```

2. **Clone and configure**
   ```bash
   git clone <your-repo>
   cd finsight
   cp .env.example .env
   nano .env  # Add your OPENAI_API_KEY
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

4. **Access**
   - Frontend: http://your-server-ip:3000
   - Backend: http://your-server-ip:8000

### Option 2: Docker Compose with Nginx Reverse Proxy

**Best for:** Production deployments with SSL

1. **Install Nginx**
   ```bash
   sudo apt-get install nginx
   ```

2. **Configure Nginx** (`/etc/nginx/sites-available/finsight`)
   ```nginx
   server {
       listen 80;
       server_name finsight.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /api {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Enable site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/finsight /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Add SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d finsight.yourdomain.com
   ```

### Option 3: Kubernetes (Advanced)

**Best for:** Large-scale deployments, high availability

1. **Create Kubernetes manifests**

`k8s/backend-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: finsight-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: finsight-backend
  template:
    metadata:
      labels:
        app: finsight-backend
    spec:
      containers:
      - name: backend
        image: your-registry/finsight-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: finsight-secrets
              key: openai-api-key
        volumeMounts:
        - name: chroma-db
          mountPath: /app/chroma_db
      volumes:
      - name: chroma-db
        persistentVolumeClaim:
          claimName: chroma-db-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: finsight-backend
spec:
  selector:
    app: finsight-backend
  ports:
  - port: 8000
    targetPort: 8000
```

`k8s/frontend-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: finsight-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: finsight-frontend
  template:
    metadata:
      labels:
        app: finsight-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/finsight-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: REACT_APP_API_URL
          value: "https://api.finsight.yourdomain.com"
---
apiVersion: v1
kind: Service
metadata:
  name: finsight-frontend
spec:
  selector:
    app: finsight-frontend
  ports:
  - port: 3000
    targetPort: 3000
```

2. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f k8s/
   ```

## Environment Variables for Production

Create a production `.env` file:

```bash
# Required
OPENAI_API_KEY=sk-prod-your-key-here

# Storage
CHROMA_DB_PATH=/data/chroma_db

# RAG Configuration
MAX_CHUNKS_RETRIEVED=5
CHUNK_SIZE=512
CHUNK_OVERLAP=50
TEMPERATURE=0.0

# Models
EMBEDDING_MODEL=text-embedding-3-small
GENERATION_MODEL=gpt-4o

# CORS (update for production domain)
CORS_ORIGINS=["https://finsight.yourdomain.com"]
```

## Security Considerations

### 1. API Key Protection

**Never commit API keys!**

Use environment variables or secrets management:
- Docker: Use `.env` file (not in git)
- Kubernetes: Use Secrets
- Cloud: Use AWS Secrets Manager, Azure Key Vault, etc.

### 2. CORS Configuration

Update `backend/config.py` for production:

```python
cors_origins = [
    "https://finsight.yourdomain.com",
    "https://www.finsight.yourdomain.com"
]
```

### 3. HTTPS/SSL

**Always use HTTPS in production!**

- Use Let's Encrypt for free SSL certificates
- Or use a load balancer with SSL termination
- Never send API keys over HTTP

### 4. Rate Limiting

Add rate limiting to prevent abuse:

```python
# backend/main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/query")
@limiter.limit("10/minute")
async def query_documents(request: Request, query: QueryRequest):
    # ... existing code
```

### 5. Authentication

Add authentication for production (not included in base implementation):

Options:
- JWT tokens
- OAuth2 (Google, Microsoft)
- API keys per user
- Session-based auth

### 6. Input Validation

- Already implemented with Pydantic
- Add additional checks for file sizes
- Validate URLs before scraping
- Sanitize user inputs

## Monitoring and Logging

### 1. Application Logs

Collect logs from Docker containers:

```bash
# View logs
docker-compose logs -f

# Export logs to file
docker-compose logs > logs.txt
```

### 2. Health Checks

Monitor the health endpoint:

```bash
# Check health
curl http://localhost:8000/api/health

# Set up monitoring with cron
*/5 * * * * curl -f http://localhost:8000/api/health || echo "FinSight is down!"
```

### 3. Metrics

Add Prometheus metrics (optional):

```python
# pip install prometheus-fastapi-instrumentator
from prometheus_fastapi_instrumentator import Instrumentator

Instrumentator().instrument(app).expose(app)
```

### 4. Error Tracking

Integrate Sentry for error tracking:

```python
# pip install sentry-sdk
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0,
)
```

## Backup and Recovery

### 1. Backup ChromaDB

The vector database is stored in `./chroma_db`:

```bash
# Backup
tar -czf chroma_db_backup_$(date +%Y%m%d).tar.gz chroma_db/

# Restore
tar -xzf chroma_db_backup_20260617.tar.gz
```

### 2. Automated Backups

Set up a cron job:

```bash
0 2 * * * cd /path/to/finsight && tar -czf /backups/chroma_db_$(date +\%Y\%m\%d).tar.gz chroma_db/
```

### 3. Database Migration

To move to a new server:

1. Stop the application
2. Copy `chroma_db/` directory
3. Copy `.env` file
4. Start on new server

## Scaling Considerations

### Vertical Scaling (Single Server)

- Increase server RAM and CPU
- Optimize chunk size and retrieval count
- Use faster storage (SSD)

### Horizontal Scaling (Multiple Servers)

**Challenges:**
- ChromaDB is embedded (not distributed)
- Need shared storage for ChromaDB

**Solutions:**
1. Use a distributed vector database (Pinecone, Weaviate)
2. Use NFS or cloud storage for ChromaDB
3. Implement Redis caching for frequent queries

### Caching Strategy

Add Redis for query caching:

```python
import redis
import hashlib

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_answer(question: str) -> Optional[dict]:
    cache_key = hashlib.md5(question.encode()).hexdigest()
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    return None

def cache_answer(question: str, answer: dict):
    cache_key = hashlib.md5(question.encode()).hexdigest()
    redis_client.setex(cache_key, 3600, json.dumps(answer))  # 1 hour TTL
```

## Performance Optimization

### 1. Frontend Optimization

```bash
# Build optimized production bundle
cd frontend
npm run build

# The build/ directory contains optimized files
```

### 2. Backend Optimization

- Use async/await for I/O operations
- Batch embedding generation
- Connection pooling for ChromaDB
- Compress responses

### 3. Database Optimization

- Regularly compact ChromaDB
- Index optimization
- Query result caching

## Cost Optimization

### OpenAI API Costs

**Estimated costs per operation:**
- Embedding (text-embedding-3-small): $0.00002 per 1K tokens
- Generation (GPT-4o): $0.005 per 1K input tokens, $0.015 per 1K output tokens

**For a 100-page document:**
- ~50,000 tokens
- ~100 chunks
- Embedding cost: ~$0.001
- Query cost: ~$0.05 per query

**Cost reduction strategies:**
1. Cache embeddings (don't re-embed same content)
2. Use GPT-4o-mini for less critical queries
3. Implement query result caching
4. Set usage limits per user

## Troubleshooting Production Issues

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Common issues:
# - Invalid OpenAI API key
# - Port 8000 already in use
# - ChromaDB directory permission issues
```

### Frontend can't connect to backend
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Check CORS settings in backend/config.py
# Check REACT_APP_API_URL in frontend
```

### Out of memory
```bash
# Increase Docker memory limit
# Or reduce chunk size and max chunks retrieved
```

### Slow queries
```bash
# Reduce MAX_CHUNKS_RETRIEVED
# Add Redis caching
# Optimize chunk size
```

## Maintenance

### Regular Tasks

**Weekly:**
- Check logs for errors
- Monitor disk usage (ChromaDB grows over time)
- Review query performance

**Monthly:**
- Update dependencies
- Backup ChromaDB
- Review API costs

**Quarterly:**
- Security updates
- Performance optimization review
- User feedback collection

### Updates

```bash
# Pull latest changes
git pull

# Rebuild containers
docker-compose down
docker-compose up --build -d
```

## Support and Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [ChromaDB Documentation](https://docs.trychroma.com)
- [React Documentation](https://react.dev)

---

**Remember:** Always test in a staging environment before deploying to production!
