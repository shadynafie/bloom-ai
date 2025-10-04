# Bloom AI - Deployment Guide

This guide covers deploying Bloom AI to production environments.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel Deployment](#vercel-deployment)
3. [AWS Deployment](#aws-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Database Setup](#database-setup)
6. [Environment Configuration](#environment-configuration)
7. [Post-Deployment](#post-deployment)

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Production database created and migrated
- [ ] Redis instance configured
- [ ] File storage (S3/Cloudinary) set up
- [ ] API keys valid and have sufficient credits
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate ready (automatic with Vercel)
- [ ] Backup strategy implemented

## Vercel Deployment (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/bloom-ai.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import from GitHub repository
4. Select your `bloom-ai` repository

### 3. Configure Environment Variables

In Vercel dashboard, add all environment variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Redis
REDIS_URL=rediss://...

# File Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=bloom-ai-uploads

NODE_ENV=production
```

### 4. Deploy

Click "Deploy" - Vercel will:
- Install dependencies
- Build the application
- Deploy to production

### 5. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS as instructed
4. SSL certificate is automatic

## AWS Deployment

### Using AWS Amplify

1. **Create Amplify App**
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
```

2. **Configure Build Settings**

Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

3. **Deploy**
```bash
amplify publish
```

### Using EC2 + PM2

1. **Launch EC2 Instance**
   - Amazon Linux 2 or Ubuntu
   - t3.medium or larger
   - Configure security groups (ports 80, 443, 22)

2. **Connect and Setup**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-username/bloom-ai.git
cd bloom-ai

# Install dependencies
npm install

# Build
npm run build
```

3. **Configure Environment**
```bash
nano .env
# Add all environment variables
```

4. **Start with PM2**
```bash
pm2 start npm --name "bloom-ai" -- start
pm2 save
pm2 startup
```

5. **Configure Nginx**
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
    }
}
```

6. **SSL with Certbot**
```bash
sudo yum install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=bloom_user
      - POSTGRES_PASSWORD=your_password
      - POSTGRES_DB=bloom_ai
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 3. Build and Run

```bash
# Build
docker-compose build

# Run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### 4. Deploy to Production

**AWS ECS:**
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker build -t bloom-ai .
docker tag bloom-ai:latest your-account.dkr.ecr.us-east-1.amazonaws.com/bloom-ai:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/bloom-ai:latest
```

**Google Cloud Run:**
```bash
gcloud builds submit --tag gcr.io/your-project/bloom-ai
gcloud run deploy bloom-ai --image gcr.io/your-project/bloom-ai --platform managed
```

## Database Setup

### Managed PostgreSQL

**Vercel Postgres:**
```bash
# Install Vercel CLI
npm i -g vercel

# Create database
vercel postgres create bloom-ai-db

# Get connection string
vercel env pull
```

**AWS RDS:**
1. Create RDS PostgreSQL instance
2. Configure security groups
3. Note connection string
4. Add to environment variables

**Supabase:**
1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from settings
3. Add to environment variables

### Run Migrations

```bash
# In production environment
npx prisma migrate deploy

# Or use Prisma db push for schema sync
npx prisma db push
```

## Environment Configuration

### Production Environment Variables

```env
# Application
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret

# Database (managed service)
DATABASE_URL=postgresql://user:pass@host.region.rds.amazonaws.com:5432/bloom_ai

# Redis (managed service)
REDIS_URL=rediss://default:pass@redis.upstash.io:6379

# AI APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# File Storage (S3)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=bloom-ai-production

# Optional: Error Tracking
SENTRY_DSN=https://...
```

### Security Best Practices

1. **Use environment-specific secrets**
   - Never commit `.env` to git
   - Use secret management (AWS Secrets Manager, Vercel Env)

2. **Enable HTTPS only**
   ```javascript
   // next.config.js
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           {
             key: 'Strict-Transport-Security',
             value: 'max-age=63072000; includeSubDomains; preload'
           }
         ]
       }
     ]
   }
   ```

3. **Configure CORS**
   ```javascript
   // Only allow your domain
   const allowedOrigins = ['https://your-domain.com'];
   ```

4. **Rate Limiting**
   - Implement rate limiting for API routes
   - Use Vercel Edge Config or Redis

## Post-Deployment

### 1. Verify Deployment

```bash
# Health check
curl https://your-domain.com/api/health

# Test AI endpoint
curl -X POST https://your-domain.com/api/ai \
  -H "Content-Type: application/json" \
  -d '{"action":"summarize","model":"gpt-4","prompt":"test"}'
```

### 2. Monitor Performance

**Vercel Analytics:**
- Enabled automatically
- View in Vercel dashboard

**Custom Monitoring:**
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 3. Set Up Backups

**Database Backups:**
```bash
# Automated daily backups
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://bloom-ai-backups/
```

**Scheduled with cron:**
```bash
0 2 * * * /path/to/backup-script.sh
```

### 4. Configure CDN

**Vercel:** CDN included automatically

**CloudFlare:**
1. Add site to CloudFlare
2. Update DNS
3. Enable caching rules
4. Configure SSL/TLS

### 5. Implement Logging

```typescript
// lib/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}
```

### 6. Performance Optimization

**Enable Caching:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

**Image Optimization:**
```javascript
// Already handled by Next.js Image component
import Image from 'next/image';
```

## Scaling

### Horizontal Scaling

**Vercel:**
- Automatic scaling
- Serverless functions scale automatically

**AWS:**
```bash
# Auto Scaling Group
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name bloom-ai-asg \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2
```

### Database Scaling

**Read Replicas:**
```env
DATABASE_URL=postgresql://primary/bloom_ai
DATABASE_REPLICA_URL=postgresql://replica/bloom_ai
```

**Connection Pooling:**
```typescript
// Use PgBouncer or Prisma connection pooling
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
```

## Troubleshooting

### Build Failures

**Issue:** Prisma Client not generated
```bash
# Add to package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Runtime Errors

**Issue:** Database connection timeout
- Check security groups/firewall
- Verify connection string
- Increase timeout in Prisma config

**Issue:** Out of memory
- Increase function memory (Vercel: 1024MB default)
- Optimize queries and data fetching

## Rollback Strategy

1. **Keep Previous Version:**
```bash
# Vercel
vercel rollback
```

2. **Database Rollback:**
```bash
# Restore from backup
psql $DATABASE_URL < backup-20240101.sql
```

3. **DNS Rollback:**
- Update DNS to previous deployment
- Wait for propagation (5-15 minutes)

## Support

- **Deployment Issues:** [GitHub Discussions](https://github.com/your-repo/discussions)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **AWS Support:** [aws.amazon.com/support](https://aws.amazon.com/support)

---

**Deployment Checklist:** ✅ Complete all steps before going live
