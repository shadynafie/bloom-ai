# 🐙 Bloom AI - Portainer Deployment Guide

Deploy Bloom AI using Portainer Stacks with images from GitHub Container Registry.

## 📋 Prerequisites

- ✅ Portainer installed and running
- ✅ Docker on your server
- ✅ Bloom AI image published to ghcr.io (see main README)

## 🚀 Quick Deployment

### Step 1: Access Portainer

Open your Portainer instance: `http://YOUR_SERVER:9000`

### Step 2: Create New Stack

1. Navigate to **Stacks** in the left menu
2. Click **+ Add stack**
3. Name your stack: `bloom-ai`

### Step 3: Add Stack Configuration

**Option A: Use Web Editor**

Copy the contents of `portainer-stack.yml` into the web editor.

**Option B: Use Git Repository**

1. Select **Repository** tab
2. Repository URL: `https://github.com/YOUR_USERNAME/bloom-ai-codex`
3. Compose path: `portainer-stack.yml`
4. Branch: `main`

### Step 4: Set Environment Variables

In the **Environment variables** section, add:

```env
# Database Password (REQUIRED)
DB_PASSWORD=your-strong-database-password-here

# NextAuth Configuration (REQUIRED)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-random-string-min-32-chars

# OpenAI API Key (REQUIRED)
OPENAI_API_KEY=your-openai-api-key-here

# Anthropic API Key (Optional)
ANTHROPIC_API_KEY=

# Application Port (Optional, default: 3000)
APP_PORT=3000
```

**Or use the advanced editor:**

Click **Advanced mode** and paste:

```json
[
  {
    "name": "DB_PASSWORD",
    "value": "your-strong-password"
  },
  {
    "name": "NEXTAUTH_URL",
    "value": "https://your-domain.com"
  },
  {
    "name": "NEXTAUTH_SECRET",
    "value": "your-secret-key-min-32-chars"
  },
  {
    "name": "OPENAI_API_KEY",
    "value": "sk-proj-your-key-here"
  },
  {
    "name": "ANTHROPIC_API_KEY",
    "value": ""
  },
  {
    "name": "APP_PORT",
    "value": "3000"
  }
]
```

### Step 5: Deploy Stack

1. Click **Deploy the stack**
2. Wait for containers to start (2-3 minutes)
3. Check **Containers** tab to see all running

### Step 6: Verify Deployment

```bash
# Check container logs in Portainer
# Or via CLI:
docker logs bloom-ai-app-1

# Test the application
curl http://YOUR_SERVER:3000
```

---

## 🔄 Updating to Latest Version

When you push new code to GitHub:

1. **GitHub Actions** automatically builds new image
2. **In Portainer:**
   - Go to **Stacks** → `bloom-ai`
   - Click **Update the stack**
   - Enable **Re-pull image and redeploy**
   - Click **Update**

Or via CLI:
```bash
docker-compose pull app
docker-compose up -d app
```

---

## 🌐 Using with Reverse Proxy

### Nginx Reverse Proxy

If using nginx in Portainer:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://bloom-ai-app-1:3000;
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

### Traefik Labels

Add to `app` service in stack:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.bloom-ai.rule=Host(`your-domain.com`)"
  - "traefik.http.routers.bloom-ai.entrypoints=websecure"
  - "traefik.http.routers.bloom-ai.tls.certresolver=letsencrypt"
  - "traefik.http.services.bloom-ai.loadbalancer.server.port=3000"
```

---

## 📊 Monitoring in Portainer

### View Logs

1. **Stacks** → `bloom-ai`
2. Click on container name (e.g., `bloom-ai-app-1`)
3. Click **Logs** tab
4. Enable **Auto-refresh**

### Container Stats

1. **Containers** → Select container
2. Click **Stats** tab
3. View CPU, Memory, Network usage

### Execute Commands

1. **Containers** → Select container
2. Click **Console**
3. Select `/bin/sh`
4. Click **Connect**

---

## 🔐 Security Best Practices

### 1. Use Secrets (Recommended)

Instead of environment variables, use Docker secrets:

```yaml
secrets:
  db_password:
    external: true
  openai_key:
    external: true
  nextauth_secret:
    external: true

services:
  app:
    secrets:
      - db_password
      - openai_key
      - nextauth_secret
    environment:
      DATABASE_URL: postgresql://bloom:${DB_PASSWORD}@postgres:5432/bloom_ai
      OPENAI_API_KEY_FILE: /run/secrets/openai_key
      NEXTAUTH_SECRET_FILE: /run/secrets/nextauth_secret
```

Create secrets in Portainer:
1. **Secrets** → **+ Add secret**
2. Name: `openai_key`
3. Value: Your API key
4. Save

### 2. Network Isolation

The stack uses a dedicated network (`bloom-network`) - PostgreSQL and Redis are not exposed to the internet.

### 3. Regular Updates

Set up a schedule to pull latest images:

1. **Stacks** → `bloom-ai` → **Editor**
2. Add webhook URL
3. Use a cron job to trigger updates

---

## 💾 Backup & Restore

### Backup Database

```bash
# Via Portainer Console on postgres container
pg_dump -U bloom bloom_ai > /tmp/backup.sql

# Copy from container to host
docker cp bloom-ai-postgres-1:/tmp/backup.sql ./backup-$(date +%Y%m%d).sql
```

### Automated Backups

Create a backup container in your stack:

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

### Restore Database

```bash
# Copy backup to postgres container
docker cp backup.sql bloom-ai-postgres-1:/tmp/

# Restore
docker exec -i bloom-ai-postgres-1 psql -U bloom bloom_ai < /tmp/backup.sql
```

---

## 🔧 Troubleshooting

### Stack Won't Deploy

**Check logs:**
```bash
docker-compose -f portainer-stack.yml logs
```

**Common issues:**
- Environment variables not set
- Image not public on ghcr.io
- Port 3000 already in use

### App Container Crashes

**View logs in Portainer:**
1. Containers → `bloom-ai-app-1` → Logs

**Common causes:**
- Database not ready (wait for health check)
- Missing environment variables
- Invalid API keys

### Database Connection Failed

**Check PostgreSQL is running:**
```bash
docker exec bloom-ai-postgres-1 pg_isready -U bloom
```

**Reset database:**
```bash
# In Portainer: Stacks → bloom-ai → Stop
# Delete postgres_data volume
# Start stack again
```

### Can't Pull Image from ghcr.io

**Make package public:**
1. GitHub repo → Packages
2. bloom-ai-codex → Settings
3. Change visibility to Public

**Or authenticate:**
```bash
docker login ghcr.io -u YOUR_USERNAME
# Use GitHub Personal Access Token as password
```

---

## 📈 Scaling

### Scale App Containers

In Portainer:
1. **Containers** → Select `bloom-ai-app-1`
2. **Duplicate/Edit** → Set replicas
3. Add load balancer (nginx/traefik)

Or in stack file:
```yaml
app:
  image: ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest
  deploy:
    replicas: 3
```

### External Database

For production, consider managed PostgreSQL:

```yaml
app:
  environment:
    DATABASE_URL: postgresql://user:pass@external-db.example.com:5432/bloom_ai
```

Remove postgres service from stack.

---

## 🎯 Production Checklist

- [ ] Environment variables set in Portainer
- [ ] NEXTAUTH_SECRET is random 32+ characters
- [ ] DB_PASSWORD is strong
- [ ] NEXTAUTH_URL points to your domain (HTTPS)
- [ ] SSL certificate configured (via nginx/traefik)
- [ ] Firewall allows only necessary ports
- [ ] Automated backups configured
- [ ] Monitoring/alerts set up
- [ ] Volume backups scheduled

---

## 📚 Additional Resources

- [Portainer Documentation](https://docs.portainer.io/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Main Bloom AI Docs](README.md)
- [Docker Deployment Guide](DOCKER_DEPLOYMENT.md)

---

**Deploy with Portainer - Simple and Powerful! 🐙✨**
