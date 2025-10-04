# 🐳 Bloom AI - Docker Guide

Complete guide for running Bloom AI with Docker - locally, in production, and with Portainer.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [GitHub Container Registry](#github-container-registry)
- [Portainer Deployment](#portainer-deployment)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed (for Mac/Windows) or Docker Engine (Linux)
- Your OpenAI API key

### Run with Docker Compose (3 commands)

```bash
# 1. Copy environment file
cp .env.docker .env

# 2. Edit .env and add your OpenAI API key
nano .env

# 3. Start all containers
docker-compose up -d
```

**Visit:** http://localhost:3000 🎉

### What's Running?

Three containers working together:
- **bloom-ai-app** (Next.js) - Port 3000
- **PostgreSQL 15** - Database (internal)
- **Redis 7** - Cache (internal)

All data persists in Docker volumes.

---

## 💻 Local Development

### Start Containers

```bash
# Build and start in foreground (see logs)
docker-compose up --build

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Stop Containers

```bash
# Stop containers (keeps data)
docker-compose down

# Stop and remove all data (⚠️ deletes everything)
docker-compose down -v
```

### Useful Commands

```bash
# Rebuild after code changes
docker-compose up --build app

# Access app container shell
docker exec -it bloom-ai-app sh

# Access PostgreSQL
docker exec -it bloom-ai-postgres psql -U bloom -d bloom_ai

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart app
```

---

## 📦 GitHub Container Registry

Your repository is configured to automatically build and publish Docker images to GitHub Container Registry (ghcr.io).

### Automatic Publishing

**When you push to GitHub:**
1. GitHub Actions triggers automatically
2. Builds Docker image (for amd64 & arm64)
3. Publishes to `ghcr.io/shadynafie/bloom-ai:latest`

**Monitor builds:** https://github.com/shadynafie/bloom-ai/actions

### Setup (One-Time)

**1. Enable GitHub Actions Permissions:**
- Go to: https://github.com/shadynafie/bloom-ai/settings/actions
- Under "Workflow permissions"
- Select: **"Read and write permissions"**
- Click **Save**

**2. Make Package Public:**
- After first build completes
- Go to: https://github.com/shadynafie/bloom-ai
- Right sidebar → **Packages** → **bloom-ai**
- Settings → **Change visibility** → **Public**

### Pull Pre-built Image

```bash
# Pull latest image
docker pull ghcr.io/shadynafie/bloom-ai:latest

# Run it
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your-key \
  -e DATABASE_URL=postgresql://... \
  ghcr.io/shadynafie/bloom-ai:latest
```

---

## 🐙 Portainer Deployment

Deploy Bloom AI using Portainer Stacks for easy management.

### Step 1: Access Portainer

Open: `http://YOUR_SERVER:9000`

### Step 2: Create Stack

1. **Stacks** → **+ Add stack**
2. **Name:** `bloom-ai`
3. **Web editor** → Paste `portainer-stack.yml` contents

### Step 3: Environment Variables

Add in Portainer's environment variables section:

```env
DB_PASSWORD=your-strong-database-password
NEXTAUTH_SECRET=your-random-32-char-string
NEXTAUTH_URL=https://your-domain.com
OPENAI_API_KEY=your-openai-api-key
```

**Generate secrets:**
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# DB_PASSWORD
openssl rand -base64 24
```

### Step 4: Deploy

Click **"Deploy the stack"** → Wait 2-3 minutes → Done! ✅

### Step 5: Verify

```bash
# Check logs in Portainer
# Or via CLI:
docker logs bloom-ai-app-1

# Test the app
curl http://YOUR_SERVER:3000
```

### Updating Stack

When new images are published:
1. **Stacks** → `bloom-ai`
2. **Update the stack**
3. Enable **"Re-pull image and redeploy"**
4. Click **Update**

---

## 🌍 Production Deployment

Deploy on any server with Docker.

### Option 1: Using Pre-built Image

**On your server:**

```bash
# 1. Clone repository
git clone https://github.com/shadynafie/bloom-ai.git
cd bloom-ai

# 2. Setup environment
cp .env.docker .env
nano .env  # Add your API keys

# 3. Pull and run
docker-compose pull
docker-compose up -d

# 4. Check logs
docker-compose logs -f
```

### Option 2: Build on Server

```bash
# Clone and build locally
git clone https://github.com/shadynafie/bloom-ai.git
cd bloom-ai
cp .env.docker .env
nano .env

# Build and run
docker-compose up --build -d
```

### Environment Variables (Production)

**Required:**
```env
OPENAI_API_KEY=sk-proj-your-actual-key
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.com
DB_PASSWORD=$(openssl rand -base64 24)
```

**Optional:**
```env
ANTHROPIC_API_KEY=sk-ant-...  # For Claude models
APP_PORT=3000                   # Change if needed
```

### Nginx Reverse Proxy (SSL)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

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

**Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 💾 Backup & Restore

### Backup Database

```bash
# Create backup
docker exec bloom-ai-postgres pg_dump -U bloom bloom_ai > backup-$(date +%Y%m%d).sql

# Compress
gzip backup-*.sql
```

### Restore Database

```bash
# Decompress
gunzip backup-20251004.sql.gz

# Restore
docker exec -i bloom-ai-postgres psql -U bloom bloom_ai < backup-20251004.sql
```

### Automated Backups

Add to `docker-compose.yml`:

```yaml
backup:
  image: prodrigestivill/postgres-backup-local
  restart: unless-stopped
  depends_on:
    - postgres
  environment:
    POSTGRES_HOST: postgres
    POSTGRES_DB: bloom_ai
    POSTGRES_USER: bloom
    POSTGRES_PASSWORD: ${DB_PASSWORD}
    SCHEDULE: "@daily"
    BACKUP_KEEP_DAYS: 7
  volumes:
    - ./backups:/backups
  networks:
    - bloom-network
```

---

## 🔧 Troubleshooting

### Containers Won't Start

```bash
# Check logs
docker-compose logs

# Check status
docker-compose ps

# Restart everything
docker-compose down
docker-compose up -d
```

### Database Connection Failed

```bash
# Check PostgreSQL health
docker exec bloom-ai-postgres pg_isready -U bloom

# Reset database (⚠️ deletes data)
docker-compose down -v
docker-compose up -d
```

### Port Already in Use

Edit `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Use different external port
```

### Can't Pull Image from ghcr.io

**Make package public:**
1. GitHub → Packages → bloom-ai
2. Settings → Change visibility → Public

**Or authenticate:**
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u shadynafie --password-stdin
```

### App Container Crashes

```bash
# View detailed logs
docker logs bloom-ai-app-1 --tail 100

# Common causes:
# - Database not ready (wait for health check)
# - Missing environment variables
# - Invalid API keys
```

---

## 📊 Monitoring

### View Logs

```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f app
docker-compose logs -f postgres

# Last 100 lines
docker logs bloom-ai-app-1 --tail 100
```

### Container Stats

```bash
# Resource usage
docker stats

# Or in Portainer:
# Containers → Select container → Stats tab
```

### Health Checks

```bash
# App health
curl http://localhost:3000

# PostgreSQL
docker exec bloom-ai-postgres pg_isready -U bloom

# Redis
docker exec bloom-ai-redis redis-cli ping
```

---

## 🔐 Security Best Practices

### 1. Use Strong Secrets

```bash
# Generate strong passwords
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -base64 24  # For DB_PASSWORD
```

### 2. Never Commit Secrets

`.env` is in `.gitignore` - never commit it!

### 3. Use Docker Secrets (Production)

```yaml
secrets:
  db_password:
    external: true
  openai_key:
    external: true
```

### 4. Restrict Network Access

Containers use internal network - PostgreSQL and Redis are not exposed to the internet.

### 5. Regular Updates

```bash
# Update images
docker-compose pull

# Restart with new images
docker-compose up -d
```

---

## 📈 Scaling

### Multiple App Instances

```yaml
app:
  deploy:
    replicas: 3
```

Add load balancer (nginx/traefik) in front.

### External Database

For high availability, use managed PostgreSQL:

```yaml
# Remove postgres service
# Update app environment:
DATABASE_URL=postgresql://user:pass@external-db.com:5432/bloom_ai
```

---

## ✅ Production Checklist

- [ ] Strong DB_PASSWORD set
- [ ] Random NEXTAUTH_SECRET (32+ chars)
- [ ] NEXTAUTH_URL points to your domain (HTTPS)
- [ ] SSL certificate configured
- [ ] Firewall configured (only 80/443 open)
- [ ] Automated backups enabled
- [ ] Monitoring/alerts set up
- [ ] Volume backups scheduled
- [ ] Documentation reviewed

---

**Everything containerized. Deploy anywhere. 🐳✨**
