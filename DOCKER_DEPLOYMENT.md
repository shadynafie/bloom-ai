# Bloom AI - Docker Deployment Guide

Complete guide for running Bloom AI in Docker containers and deploying on any machine.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture](#architecture)
3. [Local Development with Docker](#local-development)
4. [GitHub Container Registry](#github-container-registry)
5. [Deployment on Any Machine](#deployment)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites

- Docker installed (Docker Desktop for Mac/Windows, Docker Engine for Linux)
- Docker Compose installed (included with Docker Desktop)
- Git installed

### Run Bloom AI with Docker (30 seconds)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/bloom-ai-codex.git
cd bloom-ai-codex

# Copy environment file
cp .env.docker .env

# Edit .env and add your OpenAI API key (already done if you have .env.docker)

# Start all containers
docker-compose up -d

# View logs
docker-compose logs -f app

# Visit http://localhost:3000
```

That's it! 🎉

---

## 🏗️ Architecture

### Container Structure

```
┌─────────────────────────────────────────┐
│          Docker Network (bloom-network) │
│                                         │
│  ┌──────────────┐  ┌─────────────┐    │
│  │  Bloom AI    │  │ PostgreSQL  │    │
│  │  App         │──│ Database    │    │
│  │  (Node.js)   │  │             │    │
│  └──────────────┘  └─────────────┘    │
│         │                               │
│         │          ┌─────────────┐    │
│         └──────────│   Redis     │    │
│                    │   Cache     │    │
│                    └─────────────┘    │
└─────────────────────────────────────────┘
```

### Three Containers

1. **bloom-ai-app** (Port 3000)
   - Next.js application
   - Runs your Bloom AI code
   - Connects to PostgreSQL and Redis

2. **bloom-ai-postgres** (Port 5432)
   - PostgreSQL 15 database
   - Stores all application data
   - Data persisted in Docker volume

3. **bloom-ai-redis** (Port 6379)
   - Redis cache
   - Real-time collaboration state
   - Session storage

### Data Persistence

All data is stored in Docker volumes:
- `postgres_data` - Database files (survives container restarts)
- `redis_data` - Redis persistence
- `uploads_data` - User uploaded files

---

## 💻 Local Development with Docker

### Option 1: Use Docker for Everything

```bash
# Build and start all containers
docker-compose up --build

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Stop and remove volumes (WARNING: Deletes all data)
docker-compose down -v
```

### Option 2: Mix Local Dev + Docker Database

```bash
# Run only database and Redis
docker-compose up postgres redis

# In another terminal, run Next.js locally
npm run dev
```

### Useful Commands

```bash
# Rebuild app container after code changes
docker-compose up --build app

# Access app container shell
docker exec -it bloom-ai-app sh

# Access PostgreSQL
docker exec -it bloom-ai-postgres psql -U bloom -d bloom_ai

# View container logs
docker-compose logs -f app
docker-compose logs -f postgres

# Check container status
docker-compose ps

# Restart specific service
docker-compose restart app
```

---

## 📦 GitHub Container Registry

### Automatic Publishing

The repository is configured to automatically build and push Docker images to GitHub Container Registry (ghcr.io) when you push code.

### Workflow

1. **Push to GitHub** → Triggers GitHub Actions
2. **GitHub Actions** → Builds Docker image
3. **Image Published** → `ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest`

### Manual Build and Push

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Build image
docker build -t ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest .

# Push to registry
docker push ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest
```

### Pull Pre-built Image

```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest

# Run with docker-compose using pre-built image
# Edit docker-compose.yml:
# Replace:
#   build:
#     context: .
# With:
#   image: ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest
```

---

## 🌍 Deployment on Any Machine

### Deploy on a New Server (AWS, DigitalOcean, etc.)

#### Step 1: Install Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/bloom-ai-codex.git
cd bloom-ai-codex
```

#### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.docker .env

# Edit with your API keys
nano .env
```

**Required in .env:**
```env
OPENAI_API_KEY=your-actual-key
NEXTAUTH_SECRET=a-long-random-string-min-32-chars
DB_PASSWORD=strong-database-password
NEXTAUTH_URL=https://your-domain.com  # or http://server-ip:3000
```

#### Step 4: Pull and Run

```bash
# Pull latest image from GitHub Container Registry
docker pull ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest

# Start all containers
docker-compose up -d

# Check logs
docker-compose logs -f
```

#### Step 5: Access Application

- Local: `http://localhost:3000`
- Server: `http://YOUR_SERVER_IP:3000`
- Domain: Configure nginx reverse proxy (see below)

### Using Pre-built Image from ghcr.io

Create a simplified `docker-compose.yml` for production:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: bloom
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: bloom_ai
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - bloom-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - bloom-network

  app:
    image: ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest
    restart: unless-stopped
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://bloom:${DB_PASSWORD}@postgres:5432/bloom_ai
      REDIS_URL: redis://redis:6379
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      DB_HOST: postgres
    volumes:
      - uploads_data:/app/public/uploads
    ports:
      - "3000:3000"
    networks:
      - bloom-network

volumes:
  postgres_data:
  redis_data:
  uploads_data:

networks:
  bloom-network:
```

---

## ⚙️ Configuration

### Environment Variables

All configuration is done via `.env` file:

```env
# Database
DB_PASSWORD=your-secure-password

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=min-32-character-random-string

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...  # Optional
```

### Production Security

For production deployment:

1. **Change default passwords**
   ```env
   DB_PASSWORD=very-strong-random-password
   NEXTAUTH_SECRET=$(openssl rand -base64 32)
   ```

2. **Use HTTPS**
   - Set up nginx reverse proxy with SSL
   - Use Let's Encrypt for free SSL certificates

3. **Restrict ports**
   - Only expose port 3000 (or 80/443 if using nginx)
   - Keep PostgreSQL and Redis internal

### Nginx Reverse Proxy (Production)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Containers won't start

```bash
# Check logs
docker-compose logs

# Check container status
docker-compose ps

# Restart everything
docker-compose down
docker-compose up -d
```

#### 2. Database connection failed

```bash
# Check if PostgreSQL is ready
docker exec -it bloom-ai-postgres pg_isready -U bloom

# Check database exists
docker exec -it bloom-ai-postgres psql -U bloom -l

# Recreate database
docker-compose down
docker volume rm bloom-ai-codex_postgres_data
docker-compose up -d
```

#### 3. Port already in use

```bash
# Change port in docker-compose.yml
# Replace:
#   ports:
#     - "3000:3000"
# With:
#   ports:
#     - "3001:3000"
```

#### 4. Can't pull image from ghcr.io

```bash
# Make sure image is public in GitHub
# Or login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

#### 5. Image not building

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Maintenance

```bash
# Update to latest version
docker-compose pull
docker-compose up -d

# Backup database
docker exec bloom-ai-postgres pg_dump -U bloom bloom_ai > backup.sql

# Restore database
docker exec -i bloom-ai-postgres psql -U bloom bloom_ai < backup.sql

# View disk usage
docker system df

# Clean up unused images/volumes
docker system prune -a
```

---

## 📊 Monitoring

### Check Application Health

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# All logs
docker-compose logs -f

# Container resource usage
docker stats
```

### Access Application Metrics

```bash
# App container shell
docker exec -it bloom-ai-app sh

# Database console
docker exec -it bloom-ai-postgres psql -U bloom -d bloom_ai

# Redis console
docker exec -it bloom-ai-redis redis-cli
```

---

## 🎯 Deployment Checklist

- [ ] Docker and Docker Compose installed
- [ ] `.env` file configured with API keys
- [ ] Ports 3000, 5432, 6379 available (or changed in config)
- [ ] (Production) Domain name pointed to server
- [ ] (Production) SSL certificate configured
- [ ] (Production) Strong passwords set
- [ ] GitHub Actions workflow enabled
- [ ] Image published to ghcr.io
- [ ] Firewall configured to allow necessary ports

---

## 🚢 Quick Deployment Commands

```bash
# One-command deployment
git clone https://github.com/YOUR_USERNAME/bloom-ai-codex.git && \
cd bloom-ai-codex && \
cp .env.docker .env && \
docker-compose up -d

# Check if running
curl http://localhost:3000

# View logs
docker-compose logs -f app
```

---

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: [README.md](README.md)
- **Questions**: GitHub Discussions

---

**Happy Deploying! 🐳✨**
