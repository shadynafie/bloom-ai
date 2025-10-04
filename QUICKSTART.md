# Bloom AI - Quick Start Guide

Get Bloom AI up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- OpenAI API key

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
# Minimum required variables
DATABASE_URL="postgresql://user:password@localhost:5432/bloom_ai?schema=public"
NEXTAUTH_SECRET="your-secret-key"
OPENAI_API_KEY="sk-your-openai-key"
```

### 3. Set Up Database

Create the database:
```bash
# If using PostgreSQL locally
createdb bloom_ai
```

Push the schema:
```bash
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Create an Account**
   - Click "Get Started" on the homepage
   - Sign up with email

2. **Create Your First Board**
   - Click "New Board" in the dashboard
   - Give it a name like "My First Project"

3. **Add Content**
   - Try adding a YouTube video URL
   - Upload a PDF document
   - Add a web article URL

4. **Use AI**
   - Select a node on the canvas
   - Click "Summarize Selected" in the AI panel
   - See the AI-generated summary

## Example Usage

### Analyze a YouTube Video

1. Click "Video URL" in the sidebar
2. Paste: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
3. Wait for transcription (30-60 seconds)
4. Select the video node
5. Ask AI: "What are the key points from this video?"

### Create Content from Research

1. Add 2-3 reference articles or videos
2. Create a tone profile with your writing samples
3. Select all reference nodes
4. Click "Generate Content"
5. Provide instructions like: "Write a blog post about this topic in my style"

## Keyboard Shortcuts

- `Cmd/Ctrl + N` - New board
- `Cmd/Ctrl + S` - Save board
- `Cmd/Ctrl + K` - Open AI command
- `Space + Drag` - Pan canvas
- `Cmd/Ctrl + Scroll` - Zoom canvas

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# If not running, start it
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql
```

### API Key Error
- Verify your OpenAI API key is correct
- Check you have credits in your OpenAI account
- Ensure no extra spaces in `.env` file

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

## Next Steps

- 📖 Read the [Full Documentation](README.md)
- 🔧 Check [Setup Guide](SETUP.md) for detailed configuration
- 🚀 See [Deployment Guide](DEPLOYMENT.md) for production deployment
- 💻 Explore [API Documentation](API.md) for integrations

## Community & Support

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email:** support@bloom-ai.com

---

**Happy Creating! 🌸✨**
