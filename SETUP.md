# Bloom AI - Complete Setup Guide

This guide will walk you through setting up Bloom AI from scratch.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [API Keys Configuration](#api-keys-configuration)
5. [File Storage Setup](#file-storage-setup)
6. [Redis Setup](#redis-setup)
7. [Running the Application](#running-the-application)
8. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements
- Node.js 18.0 or higher
- npm 9.0 or higher
- PostgreSQL 14 or higher
- Redis 6.0 or higher (optional for development)
- 4GB RAM minimum
- 10GB free disk space

### Recommended Requirements
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- 8GB RAM
- 20GB free disk space

## Local Development Setup

### 1. Install Node.js

**macOS (using Homebrew):**
```bash
brew install node@20
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Download from [nodejs.org](https://nodejs.org/)

**Verify installation:**
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

### 2. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

**Verify installation:**
```bash
psql --version
```

### 3. Install Redis (Optional for development)

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**
Download from [redis.io](https://redis.io/download) or use WSL

**Verify installation:**
```bash
redis-cli ping  # Should return PONG
```

## Database Setup

### 1. Create PostgreSQL Database

**Connect to PostgreSQL:**
```bash
psql postgres
```

**Create database and user:**
```sql
CREATE DATABASE bloom_ai;
CREATE USER bloom_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE bloom_ai TO bloom_user;
\q
```

### 2. Configure Database URL

Add to your `.env` file:
```env
DATABASE_URL="postgresql://bloom_user:your_secure_password@localhost:5432/bloom_ai?schema=public"
```

### 3. Run Prisma Migrations

```bash
# Install dependencies first
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

## API Keys Configuration

### 1. OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Add to `.env`:
```env
OPENAI_API_KEY="sk-..."
```

**Important:** Ensure you have credits in your OpenAI account and the following models are enabled:
- GPT-4 (for advanced analysis)
- GPT-3.5-turbo (for general use)
- Whisper (for transcription)
- GPT-4 Vision (for image analysis)

### 2. Anthropic API Key (Optional but Recommended)

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Add to `.env`:
```env
ANTHROPIC_API_KEY="sk-ant-..."
```

**Models used:**
- Claude 3 Opus (creative content generation)
- Claude 3 Sonnet (balanced tasks)
- Claude 3 Haiku (quick responses)

### 3. NextAuth Secret

Generate a secure secret:
```bash
openssl rand -base64 32
```

Add to `.env`:
```env
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## File Storage Setup

Choose one of the following options:

### Option 1: Local Storage (Development Only)

No additional setup needed. Files will be stored in `public/uploads/`.

**Pros:** Simple, no external dependencies
**Cons:** Not suitable for production, files lost on deployment

### Option 2: AWS S3 (Recommended for Production)

1. **Create AWS Account** at [aws.amazon.com](https://aws.amazon.com/)

2. **Create S3 Bucket:**
   - Go to S3 Console
   - Click "Create bucket"
   - Name: `bloom-ai-uploads` (or your preference)
   - Region: Choose closest to your users
   - Block public access: Configure as needed
   - Create bucket

3. **Create IAM User:**
   - Go to IAM Console
   - Create new user with programmatic access
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
   - Save Access Key ID and Secret Access Key

4. **Configure environment variables:**
```env
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="bloom-ai-uploads"
```

### Option 3: Cloudinary (Alternative)

1. **Create account** at [cloudinary.com](https://cloudinary.com/)

2. **Get credentials** from dashboard

3. **Configure environment variables:**
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Redis Setup

### Local Redis (Development)

If you installed Redis locally, it should be running on `localhost:6379`.

Add to `.env`:
```env
REDIS_URL="redis://localhost:6379"
```

### Upstash Redis (Production/Cloud)

1. **Create account** at [upstash.com](https://upstash.com/)

2. **Create Redis database:**
   - Choose region close to your app
   - Copy the Redis URL

3. **Configure environment variables:**
```env
REDIS_URL="rediss://default:your-password@your-endpoint.upstash.io:6379"
```

## Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` with your configuration values.

### 3. Run Database Migrations

```bash
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Verify Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. Create an account
3. Create a new board
4. Try adding a YouTube video
5. Test AI summarization

## Environment Variables Checklist

Ensure all required variables are set:

```env
# ✓ Database
DATABASE_URL="postgresql://..."

# ✓ NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# ✓ AI APIs (at least OpenAI required)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..." # Optional

# ✓ Redis (optional for development)
REDIS_URL="redis://localhost:6379"

# ✓ File Storage (choose one)
# AWS S3
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="..."
# OR Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# ✓ Environment
NODE_ENV="development"
```

## Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql
   ```

2. Test connection:
   ```bash
   psql -h localhost -U bloom_user -d bloom_ai
   ```

3. Check database URL in `.env`

### API Key Issues

**Error:** `Invalid API key`

**Solution:**
1. Verify API key is correct (no extra spaces)
2. Check API key has sufficient credits
3. Ensure models are enabled in your account

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Prisma Client Issues

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
npx prisma generate
npm run dev
```

### File Upload Issues

**Error:** `Failed to upload file`

**Solution:**
1. Check upload directory permissions:
   ```bash
   mkdir -p public/uploads
   chmod 755 public/uploads
   ```

2. Verify file size limits in `next.config.js`

3. Check S3/Cloudinary credentials

### Redis Connection Issues

**Error:** `Redis connection failed`

**Solution:**
1. For development, Redis is optional - comment out Redis usage
2. Verify Redis is running:
   ```bash
   redis-cli ping
   ```
3. Check REDIS_URL in `.env`

## Next Steps

After successful setup:

1. **Read the main [README.md](README.md)** for usage instructions
2. **Explore the [API Documentation](API.md)** for integration details
3. **Check [CONTRIBUTING.md](CONTRIBUTING.md)** if you want to contribute
4. **Join our Discord** for community support (link in README)

## Production Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## Getting Help

- **Documentation:** [Full docs](README.md)
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discord:** [Join our community](https://discord.gg/...)
- **Email:** support@bloom-ai.com

---

**Happy Building! 🚀**
