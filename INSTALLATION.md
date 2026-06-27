# FinSight Installation Guide

Complete installation instructions for all platforms.

## Prerequisites

### Required Software

1. **Docker Desktop**
   - Windows: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - Mac: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - Linux: [Install Docker Engine](https://docs.docker.com/engine/install/)

2. **OpenAI API Key**
   - Sign up at [OpenAI Platform](https://platform.openai.com/)
   - Create an API key in your account settings
   - Ensure you have credits or a payment method set up

### System Requirements

**Minimum:**
- 4GB RAM
- 10GB disk space
- Docker with 4GB memory allocation

**Recommended:**
- 8GB RAM
- 20GB disk space
- Docker with 6GB memory allocation
- SSD for better performance

## Installation Steps

### Method 1: Automated Setup (Recommended)

#### Windows

1. **Open PowerShell or Command Prompt as Administrator**

2. **Navigate to project directory**
   ```cmd
   cd path\to\finsight
   ```

3. **Run setup script**
   ```cmd
   setup.bat
   ```

4. **If prompted, edit .env file**
   ```cmd
   notepad .env
   ```
   Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

5. **Run setup again**
   ```cmd
   setup.bat
   ```

#### Linux/Mac

1. **Open Terminal**

2. **Navigate to project directory**
   ```bash
   cd /path/to/finsight
   ```

3. **Make script executable**
   ```bash
   chmod +x setup.sh
   ```

4. **Run setup script**
   ```bash
   ./setup.sh
   ```

5. **If prompted, edit .env file**
   ```bash
   nano .env
   # or
   vim .env
   ```
   Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

6. **Run setup again**
   ```bash
   ./setup.sh
   ```

### Method 2: Manual Setup

#### Step 1: Clone/Download Project

```bash
git clone <repository-url>
cd finsight
```

Or extract the ZIP file and navigate to the directory.

#### Step 2: Configure Environment

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Edit .env file**
   
   **Windows:**
   ```cmd
   notepad .env
   ```
   
   **Linux/Mac:**
   ```bash
   nano .env
   ```

3. **Add your OpenAI API key**
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   CHROMA_DB_PATH=./chroma_db
   MAX_CHUNKS_RETRIEVED=5
   ```

#### Step 3: Start Services

```bash
docker-compose up --build
```

This will:
- Download required Docker images
- Build backend and frontend containers
- Start all services
- Create ChromaDB directory

**First run may take 5-10 minutes** to download images and build.

#### Step 4: Verify Installation

1. **Check containers are running**
   ```bash
   docker-compose ps
   ```
   
   You should see:
   ```
   finsight-backend    running    0.0.0.0:8000->8000/tcp
   finsight-frontend   running    0.0.0.0:3000->3000/tcp
   ```

2. **Check backend health**
   ```bash
   curl http://localhost:8000/api/health
   ```
   
   Expected response:
   ```json
   {
     "status": "healthy",
     "timestamp": "2026-06-17T...",
     "chroma_db_status": "healthy"
   }
   ```

3. **Open frontend**
   - Navigate to http://localhost:3000
   - You should see the FinSight interface
   - Green dot should show "API Connected"

## Platform-Specific Instructions

### Windows 10/11

**Prerequisites:**
- Windows 10 version 2004 or higher, or Windows 11
- WSL 2 enabled (Docker Desktop will guide you)
- Virtualization enabled in BIOS

**Installation:**

1. **Install Docker Desktop**
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Run installer
   - Restart computer if prompted
   - Start Docker Desktop

2. **Verify Docker**
   ```powershell
   docker --version
   docker-compose --version
   ```

3. **Run FinSight**
   ```cmd
   cd path\to\finsight
   setup.bat
   ```

**Common Issues:**

- **WSL 2 not installed**: Follow Docker Desktop's prompts to install WSL 2
- **Virtualization disabled**: Enable in BIOS (VT-x for Intel, AMD-V for AMD)
- **Port conflicts**: Ensure ports 3000 and 8000 are not in use

### macOS

**Prerequisites:**
- macOS 10.15 or higher
- Apple Silicon or Intel processor

**Installation:**

1. **Install Docker Desktop**
   - Download for your chip (Apple Silicon or Intel)
   - Drag to Applications folder
   - Open and complete setup
   - Grant permissions when prompted

2. **Verify Docker**
   ```bash
   docker --version
   docker-compose --version
   ```

3. **Run FinSight**
   ```bash
   cd /path/to/finsight
   chmod +x setup.sh
   ./setup.sh
   ```

**Common Issues:**

- **Permission denied**: Use `chmod +x setup.sh`
- **Docker not starting**: Check System Preferences → Security & Privacy
- **Port conflicts**: Check if ports 3000 or 8000 are in use

### Linux (Ubuntu/Debian)

**Installation:**

1. **Install Docker**
   ```bash
   # Update package index
   sudo apt-get update
   
   # Install dependencies
   sudo apt-get install ca-certificates curl gnupg
   
   # Add Docker's official GPG key
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg
   
   # Set up repository
   echo \
     "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   
   # Install Docker Engine
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

2. **Add user to docker group**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Verify Docker**
   ```bash
   docker --version
   docker compose version
   ```

4. **Run FinSight**
   ```bash
   cd /path/to/finsight
   chmod +x setup.sh
   ./setup.sh
   ```

### Linux (Fedora/RHEL)

```bash
# Install Docker
sudo dnf install docker docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Run FinSight
cd /path/to/finsight
chmod +x setup.sh
./setup.sh
```

## Troubleshooting Installation

### Docker Issues

**Problem: "Cannot connect to Docker daemon"**

Solution:
```bash
# Start Docker service (Linux)
sudo systemctl start docker

# Or restart Docker Desktop (Windows/Mac)
```

**Problem: "Port already in use"**

Solution:
```bash
# Find what's using the port
# Windows:
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Linux/Mac:
lsof -i :8000
lsof -i :3000

# Kill the process or change ports in docker-compose.yml
```

**Problem: "Not enough memory"**

Solution:
- Docker Desktop: Settings → Resources → Increase memory to 4GB+
- Linux: Check available RAM with `free -h`

### OpenAI API Issues

**Problem: "Invalid API key"**

Solution:
1. Verify key starts with `sk-`
2. Check for extra spaces in .env
3. Ensure key is active in OpenAI dashboard
4. Verify credits/payment method

**Problem: "Rate limit exceeded"**

Solution:
- Check your OpenAI usage limits
- Upgrade your OpenAI plan if needed
- Wait and retry

### Build Issues

**Problem: "Build failed"**

Solution:
```bash
# Clean rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

**Problem: "Permission denied"**

Solution:
```bash
# Linux: Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Or run with sudo (not recommended for production)
sudo docker-compose up
```

### Application Issues

**Problem: "Frontend shows API Disconnected"**

Solution:
1. Wait 30 seconds for backend initialization
2. Check backend logs: `docker-compose logs backend`
3. Verify OpenAI API key in .env
4. Check backend health: `curl http://localhost:8000/api/health`

**Problem: "Upload fails"**

Solution:
1. Ensure file is a PDF
2. Check file size (<100MB)
3. Check backend logs for errors
4. Verify ChromaDB directory exists and is writable

## Verification Steps

After installation, verify everything works:

### 1. Check Services
```bash
docker-compose ps
```
Both services should show "running".

### 2. Check Backend
```bash
curl http://localhost:8000/api/health
```
Should return JSON with `"status": "healthy"`.

### 3. Check Frontend
- Open http://localhost:3000
- Should see FinSight interface
- Green dot should show "API Connected"

### 4. Test Upload
1. Go to Documents page
2. Upload a small test PDF
3. Should see success notification
4. Document should appear in table

### 5. Test Query
1. Go to Chat page
2. Ask a question
3. Should get an answer with sources

## Uninstallation

### Remove FinSight

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (deletes database)
docker-compose down -v

# Remove images
docker rmi finsight-backend finsight-frontend

# Remove project directory
cd ..
rm -rf finsight
```

### Keep Data for Reinstall

```bash
# Stop containers but keep database
docker-compose down

# Data is preserved in ./chroma_db directory
```

## Updating FinSight

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

## Docker Resource Configuration

### Windows/Mac (Docker Desktop)

1. Open Docker Desktop
2. Settings → Resources
3. Adjust:
   - **CPUs**: 2-4
   - **Memory**: 4-8 GB
   - **Disk**: 20+ GB

### Linux

Docker uses system resources directly. Ensure adequate:
- RAM: 4+ GB available
- Disk: 20+ GB free
- CPU: 2+ cores

## Next Steps

After successful installation:

1. **Read the Quick Start** - [QUICKSTART.md](QUICKSTART.md)
2. **Upload a test document** - Try a sample SEC filing
3. **Ask questions** - Use the example questions
4. **Review documentation** - [README.md](README.md)

## Getting Help

If you encounter issues:

1. **Check logs**
   ```bash
   docker-compose logs -f
   ```

2. **Review common issues** above

3. **Check documentation**
   - README.md - Project overview
   - TESTING.md - Test cases
   - DEPLOYMENT.md - Production setup

4. **Verify prerequisites**
   - Docker installed and running
   - OpenAI API key valid
   - Ports 3000 and 8000 available

---

**Installation complete?** → Start with [START_HERE.md](START_HERE.md) 🚀
