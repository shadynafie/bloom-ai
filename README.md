# Bloom AI - Visual AI Workspace

A comprehensive web application that replicates Poppy AI's functionality - a visual AI workspace for content creation and research. Bloom AI combines mind-mapping, AI-powered content analysis, and collaborative features to help creators organize information and generate content efficiently.

## 🌟 Features

### Core Capabilities

#### 1. **Multi-Modal Content Analysis**
- **Video Processing**: Import YouTube, TikTok, Vimeo videos with automatic transcription
- **PDF Analysis**: Upload and extract text from PDF documents
- **Audio Transcription**: Process voice notes and audio files with Whisper AI
- **Web Scraping**: Extract content from web pages and articles
- **Image Analysis**: OCR and visual understanding with GPT-4 Vision and Claude

#### 2. **Visual Canvas Workspace**
- **Mind-Mapping Interface**: Drag-and-drop nodes on an infinite canvas
- **Node Types**: Text, Video, Audio, PDF, Image, Web Page, AI Chat
- **Visual Connections**: Link related content and create concept maps
- **Group Organization**: Categorize content as Tone, Reference, or Content
- **React Flow Integration**: Smooth, performant canvas interactions

#### 3. **AI Integration**
- **Multiple Models**: GPT-4, GPT-3.5 Turbo, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **AI Actions**:
  - Summarization
  - Q&A (Chat with your documents)
  - Content Generation
  - Key Point Extraction
  - Cross-Source Comparison
  - Tone Analysis
- **Smart Model Selection**: Automatic routing to best model for each task
- **Credits System**: Track and manage AI usage

#### 4. **Content Creation Workflow**
- **Three-Group System**:
  - **Tone Group**: Your writing samples for style matching
  - **Reference Group**: Competitor content and inspiration
  - **Content Group**: Your created output
- **Rich Text Editor**: Notion-like editor with formatting options
- **Template Support**: Pre-built workflows for common use cases
- **Tone Matching**: AI maintains your authentic voice in generated content

#### 5. **Real-Time Collaboration**
- Multi-user editing on the same board
- Live cursor and selection tracking
- Shared AI assistant
- Comment and annotation support

#### 6. **Additional Features**
- Export boards and content
- Search through all content
- Tag and organize nodes
- File upload and storage
- Usage analytics and tracking

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- Next.js 14 (React Framework with App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- React Flow (Canvas/Mind Mapping)
- Tiptap (Rich Text Editor)
- Socket.io Client (Real-time)

**Backend:**
- Next.js API Routes
- PostgreSQL (Database)
- Prisma ORM
- Socket.io Server (WebSocket)
- Redis (Caching & Real-time State)

**AI & Processing:**
- OpenAI API (GPT-4, Whisper)
- Anthropic API (Claude 3)
- Sharp (Image Processing)
- pdf-parse (PDF Extraction)
- Cheerio (Web Scraping)

**Infrastructure:**
- Vercel (Hosting)
- AWS S3 / Cloudinary (File Storage)
- BullMQ (Background Jobs)

### Project Structure

```
bloom-ai-codex/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── ai/             # AI operations
│   │   ├── boards/         # Board management
│   │   ├── upload/         # File uploads
│   │   └── process/        # Content processing
│   ├── board/[boardId]/    # Board workspace page
│   └── page.tsx            # Landing page
├── components/
│   ├── canvas/             # Canvas & node components
│   │   ├── Canvas.tsx
│   │   └── nodes/          # Different node types
│   ├── editor/             # Rich text editor
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── ai/                 # AI integrations
│   │   ├── openai.ts
│   │   ├── anthropic.ts
│   │   └── ai-service.ts
│   ├── processors/         # Content processors
│   │   ├── video-processor.ts
│   │   ├── pdf-processor.ts
│   │   ├── web-processor.ts
│   │   └── image-processor.ts
│   ├── db.ts              # Prisma client
│   └── utils.ts           # Utilities
├── prisma/
│   └── schema.prisma      # Database schema
├── types/
│   └── index.ts           # TypeScript types
└── public/
    └── uploads/           # Uploaded files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis server
- OpenAI API key
- Anthropic API key (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bloom-ai-codex
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bloom_ai?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AI APIs
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Redis
REDIS_URL="redis://localhost:6379"

# File Storage (choose one)
# AWS S3
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="bloom-ai-uploads"

# Or Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Environment
NODE_ENV="development"
```

4. **Set up the database**

```bash
# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Board

1. **Sign up/Login** to create an account
2. **Create a new board** from the dashboard
3. **Add content nodes**:
   - Click on content type buttons in the left sidebar
   - Drag and drop files directly onto the canvas
   - Paste URLs for videos or web pages

### Working with Content

#### Import a YouTube Video
1. Click "Video URL" in the sidebar
2. Paste the YouTube link
3. AI will automatically transcribe and analyze the video

#### Upload a PDF
1. Click "Upload PDF"
2. Select your PDF file
3. Text will be extracted automatically

#### Add a Web Article
1. Click "Web Page"
2. Enter the article URL
3. Content will be scraped and summarized

### Using AI Features

#### Summarize Content
1. Select one or more nodes on the canvas
2. Click "Summarize Selected" in the AI panel
3. Review the AI-generated summary

#### Generate Content
1. Organize your reference materials on the canvas
2. Create a tone profile with your writing samples
3. Select references and click "Generate Content"
4. AI will create content in your style based on references

#### Ask Questions
1. Select relevant nodes
2. Type your question in the AI chat
3. Get answers based on the content context

### Organizing with Groups

Use the three-group system for optimal workflow:

- **Tone Group** (Purple): Add your own content to define your voice
- **Reference Group** (Green): Add competitor or inspiration content
- **Content Group** (Orange): Your generated outputs

### Collaboration

1. Click "Share" button on your board
2. Invite team members by email
3. Collaborate in real-time with live cursors

## 🔧 Configuration

### AI Model Selection

You can choose different AI models for different tasks:

- **GPT-4**: Best for analytical tasks, comparisons
- **GPT-3.5 Turbo**: Faster, cheaper for simple tasks
- **Claude 3 Opus**: Best for creative content generation
- **Claude 3 Sonnet**: Balanced performance and cost
- **Claude 3 Haiku**: Fastest for quick responses

### Credits System

Each AI action consumes credits:
- Summarize: 1 credit
- Q&A: 1 credit
- Generate: 2 credits
- Compare: 2 credits
- Analyze Tone: 2 credits

Default: 1000 credits/month (resets monthly)

## 🔌 API Reference

### AI Operations

**POST /api/ai**
```typescript
{
  action: 'summarize' | 'qa' | 'generate' | 'extract' | 'compare',
  model: 'gpt-4' | 'claude-3-opus-20240229',
  prompt: string,
  context?: string,
  nodeIds?: string[],
  toneProfileId?: string
}
```

### Board Management

**GET /api/boards** - Get all boards
**POST /api/boards** - Create a new board
**GET /api/boards/[id]** - Get board by ID
**PATCH /api/boards/[id]** - Update board
**DELETE /api/boards/[id]** - Delete board

### Content Processing

**POST /api/process/video** - Process video URL
**POST /api/process/webpage** - Extract webpage content
**POST /api/upload** - Upload files (PDF, image, audio)

## 🧪 Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy
```

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
```bash
git push origin main
```

2. **Deploy to Vercel**
- Import project in Vercel dashboard
- Add environment variables
- Deploy

3. **Set up Database**
- Use Vercel Postgres or external PostgreSQL
- Run migrations: `npx prisma migrate deploy`

4. **Configure Redis**
- Use Upstash Redis or similar
- Update REDIS_URL environment variable

### Environment Variables

Ensure all production environment variables are set in your deployment platform.

## 🔐 Security

- All API routes are protected with authentication
- File uploads are validated and sanitized
- Database queries use Prisma's built-in SQL injection protection
- Environment variables are never exposed to client
- CORS is configured for production domains

## 🤝 Contributing

This is a proprietary project. For collaboration inquiries, please contact the repository owner.

## 📝 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Inspired by Poppy AI
- Built with Next.js, React Flow, and Tiptap
- AI powered by OpenAI and Anthropic

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core canvas functionality
- ✅ Multi-modal content processing
- ✅ AI integration (GPT-4, Claude)
- ✅ Rich text editor
- ✅ Basic collaboration

### Phase 2 (Upcoming)
- [ ] Advanced real-time collaboration
- [ ] Mobile responsive design
- [ ] Advanced templates library
- [ ] Voice input for AI commands
- [ ] Browser extension

### Phase 3 (Future)
- [ ] API for third-party integrations
- [ ] Plugin system
- [ ] Advanced analytics
- [ ] Team workspaces
- [ ] White-label options

---

**Built with ❤️ by the Bloom AI team**
