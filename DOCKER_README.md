# 🐳 Bloom AI - Docker Setup

Run Bloom AI anywhere with Docker! Pull pre-built images from GitHub Container Registry and deploy in minutes.

## ⚡ Quick Start (3 Commands)

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/bloom-ai-codex.git
cd bloom-ai-codex

# 2. Set up environment
cp .env.docker .env
# Edit .env with your OpenAI API key (already configured)

# 3. Start everything
docker-compose up -d
```

Visit **http://localhost:3000** 🎉

## 📦 What's Running?

Three containers working together:

1. **Bloom AI App** (Next.js) - Port 3000
2. **PostgreSQL** - Port 5432 (internal)
3. **Redis** - Port 6379 (internal)

All data persists in Docker volumes - safe across restarts!

## 🚀 Using Pre-built Images from GitHub

Images are automatically built and published to GitHub Container Registry:

```bash
# Pull latest image
docker pull ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest

# Run with docker-compose
docker-compose up -d
```

## 🌍 Deploy on Any Machine

### AWS EC2 / DigitalOcean / Your Server

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone and run
git clone https://github.com/YOUR_USERNAME/bloom-ai-codex.git
cd bloom-ai-codex
cp .env.docker .env

# Edit .env with your settings
nano .env

# Start!
docker-compose up -d
```

## 🔑 Required Configuration

Edit `.env` file:

```env
# Your OpenAI API key (REQUIRED)
OPENAI_API_KEY=sk-proj-your-key-here

# Secure random string (REQUIRED for production)
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Your domain or http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# Strong database password
DB_PASSWORD=change-me-to-something-secure
```

## 📊 Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Update to latest version
docker-compose pull && docker-compose up -d

# Backup database
docker exec bloom-ai-postgres pg_dump -U bloom bloom_ai > backup.sql

# Clean rebuild
docker-compose down -v
docker-compose up --build
```

## 🔧 Ports

- **3000** - Bloom AI application
- **5432** - PostgreSQL (only accessible to app container)
- **6379** - Redis (only accessible to app container)

## 📚 Full Documentation

- [Complete Docker Guide](DOCKER_DEPLOYMENT.md)
- [Main Documentation](README.md)
- [API Reference](API.md)

## 🎯 Production Deployment

For production with SSL and domain:

1. Point domain to your server
2. Set up nginx reverse proxy
3. Use Let's Encrypt for SSL
4. Update `NEXTAUTH_URL` in `.env`

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for details.

## ✅ Health Check

```bash
# Check if all containers are running
docker-compose ps

# Test the application
curl http://localhost:3000

# View container resource usage
docker stats
```

## 🆘 Troubleshooting

**Containers won't start?**
```bash
docker-compose logs
```

**Port already in use?**
```bash
# Change in docker-compose.yml:
ports:
  - "3001:3000"  # Use different port
```

**Database issues?**
```bash
docker-compose down -v  # Reset everything
docker-compose up -d
```

---

**Everything containerized. Deploy anywhere. 🐳✨**
