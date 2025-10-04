# 🌸 Bloom AI - Visual AI Workspace

Transform messy research into brilliant content. Bloom AI is a visual workspace that combines mind-mapping, AI-powered content analysis, and collaborative features to help creators organize information and generate content efficiently.

![Bloom AI](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker) ![License](https://img.shields.io/badge/license-Proprietary-red)

## ✨ Key Features

- 🎥 **Multi-Modal Content**: Process videos, PDFs, images, web pages, and audio
- 🧠 **AI-Powered**: GPT-4 and Claude 3 for summarization, Q&A, and content generation
- 🎨 **Visual Canvas**: Mind-mapping interface with drag-and-drop nodes
- ✍️ **Rich Editor**: Notion-like text editor with formatting
- 👥 **Real-Time Collaboration**: Work together with live cursors
- 🎯 **Tone Matching**: Generate content in your unique voice
- 📊 **Usage Tracking**: Credit system for AI operations

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Copy environment file
cp .env.docker .env

# 2. Add your OpenAI API key to .env
nano .env

# 3. Start all containers
docker-compose up -d

# Visit http://localhost:3000
```

**What's running?** Three containers: Next.js app (port 3000), PostgreSQL 15, Redis 7

📖 **Full Docker guide**: See [DOCKER.md](DOCKER.md) for production deployment, Portainer, and GitHub Container Registry

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your API keys and database URL

# 3. Set up database
npm run db:push

# 4. Run dev server
npm run dev

# Visit http://localhost:3000
```

📖 **Detailed setup**: See [QUICKSTART.md](QUICKSTART.md)

## 🏗️ Technology Stack

**Frontend**: Next.js 14, TypeScript, TailwindCSS, React Flow, Tiptap
**Backend**: Next.js API Routes, PostgreSQL, Prisma, Redis
**AI**: OpenAI (GPT-4, Whisper), Anthropic (Claude 3)
**Infrastructure**: Docker, GitHub Actions, Portainer

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[DOCKER.md](DOCKER.md)** - Complete Docker deployment guide
- **[API.md](API.md)** - API reference and endpoints

## 🎯 How It Works

1. **Import Content**: Drop videos, PDFs, images, or articles onto your canvas
2. **AI Analyzes**: Automatic transcription, summarization, and insights
3. **Create & Collaborate**: Generate content based on your research with AI assistance

### Three-Group Workflow

- **🟣 Tone Group**: Your writing samples for style matching
- **🟢 Reference Group**: Competitor content and inspiration
- **🟠 Content Group**: Your created output

## 🔑 Environment Variables

```env
# Required
OPENAI_API_KEY=your-openai-api-key
NEXTAUTH_SECRET=your-secret-32-chars
DATABASE_URL=postgresql://user:pass@localhost:5432/bloom_ai

# Optional
ANTHROPIC_API_KEY=your-anthropic-key
REDIS_URL=redis://localhost:6379
```

Generate secrets:
```bash
openssl rand -base64 32  # For NEXTAUTH_SECRET
```

## 🐳 Deployment

### With Portainer

1. Create stack in Portainer
2. Paste [portainer-stack.yml](portainer-stack.yml)
3. Add environment variables
4. Deploy

### With Docker

```bash
docker pull ghcr.io/shadynafie/bloom-ai:latest
docker-compose up -d
```

See [DOCKER.md](DOCKER.md) for complete deployment guide including:
- Production setup with SSL
- Automated backups
- Scaling
- Troubleshooting

## 🔧 Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🗺️ Project Structure

```
bloom-ai-codex/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (AI, boards, upload)
│   ├── board/[boardId]/   # Board workspace
│   └── page.tsx           # Landing page
├── components/
│   ├── canvas/            # Canvas & node components
│   ├── editor/            # Rich text editor
│   └── ui/                # UI components (shadcn/ui)
├── lib/
│   ├── ai/                # AI integrations (OpenAI, Anthropic)
│   ├── processors/        # Content processors
│   └── db.ts              # Prisma client
├── prisma/
│   └── schema.prisma      # Database schema
├── Dockerfile             # Multi-stage Docker build
└── docker-compose.yml     # 3-container setup
```

## 🔐 Security

- Authentication on all API routes
- File upload validation
- SQL injection protection (Prisma)
- Environment variables never exposed to client
- Docker secrets support for production

## 📊 Credits System

Each AI action consumes credits:
- Summarize: 1 credit
- Q&A: 1 credit
- Generate: 2 credits
- Compare: 2 credits
- Analyze Tone: 2 credits

Default: 1000 credits (resets monthly)

## 🤝 Contributing

This is a proprietary project. For collaboration inquiries, please contact the repository owner.

## 📝 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

Inspired by Poppy AI | Built with Next.js, React Flow, and Tiptap | AI powered by OpenAI and Anthropic

---

**Need help?** Check [QUICKSTART.md](QUICKSTART.md) | Want to deploy? See [DOCKER.md](DOCKER.md) | API docs in [API.md](API.md)
