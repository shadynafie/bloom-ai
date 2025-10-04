# Getting Started with Bloom AI

Your application is ready! Here's everything you need to know to start using it.

## ✅ Configuration Complete

Your `.env` file has been configured with:
- ✓ OpenAI API Key (configured and ready)
- ✓ Database URL (PostgreSQL)
- ✓ NextAuth configuration
- ✓ Development environment

## 🚀 Starting the Application

### Step 1: Set Up the Database

First, you need to create the PostgreSQL database and apply the schema:

```bash
# If you haven't installed PostgreSQL yet:
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Start PostgreSQL (if not running)
# macOS:
brew services start postgresql

# Linux:
sudo systemctl start postgresql

# Create the database
createdb bloom_ai

# Push the Prisma schema to the database
npm run db:push
```

### Step 2: Start the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

## 📱 Using the Application

### 1. **Landing Page** (http://localhost:3000)
- Welcome page with features overview
- Click "Get Started" or "Sign In" to proceed

### 2. **Create an Account** (http://localhost:3000/register)
- Enter any email (e.g., `test@example.com`)
- Enter any password (e.g., `password123`)
- Click "Create Account"
- You'll be automatically logged in and redirected to the dashboard

### 3. **Dashboard** (http://localhost:3000/dashboard)
- View all your boards
- Create new boards
- Search and organize your projects

### 4. **Settings** (http://localhost:3000/settings)
- **Profile Section**: Edit your name
- **AI Credits**: View your usage (1,000 credits by default)
- **API Keys**: See your configured OpenAI key (shown as ••••••••Cb0A)
  - Your key is safely stored in the `.env` file
  - The settings page displays it securely
  - You can view the full key by clicking the eye icon

### 5. **Create a Board** (http://localhost:3000/board/[id])
- Click "New Board" from the dashboard
- Give it a name like "My First Project"
- You'll be taken to the visual canvas workspace

### 6. **Working on the Canvas**
- **Left Sidebar**: Add different types of content
  - Video URL (YouTube, TikTok, etc.)
  - PDF Upload
  - Image Upload
  - Web Page URL
  - Audio/Voice Notes

- **Center**: Visual canvas
  - Drag and drop nodes
  - Connect related ideas
  - Zoom and pan

- **Right Sidebar**: AI Assistant
  - Select nodes
  - Ask questions
  - Generate content
  - Choose AI model (GPT-4, Claude, etc.)

## 🎯 Quick Tutorial

### Example 1: Analyze a YouTube Video

1. Go to your board
2. Click "Video URL" in the left sidebar
3. Paste a YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
4. Wait for transcription (30-60 seconds)
5. Select the video node
6. In the AI panel, click "Summarize Selected"
7. AI will generate a summary of the video content

### Example 2: Research from Multiple Sources

1. Add several content pieces:
   - A YouTube video about your topic
   - A PDF document
   - A web article
2. Select all three nodes
3. Click "Compare Sources" in the AI panel
4. AI will analyze all sources and find connections

### Example 3: Generate Content

1. Add reference materials (videos, articles)
2. Create a "Tone" node with your writing style
3. Select your references
4. Click "Generate Content"
5. Provide instructions like: "Write a blog post about this topic"
6. AI will generate content in your style

## 🔑 API Key Management in Settings

The settings page (`/settings`) provides a secure way to view your API keys:

### Features:
1. **Masked Display**: Keys shown as `••••••••[last 4 digits]`
2. **Show/Hide**: Click the eye icon to reveal full key
3. **Copy to Clipboard**: Click the copy icon to copy the key
4. **Status Indicators**:
   - Green "Connected" badge if key is configured
   - Red "Not Configured" if missing
   - Yellow "Optional" for Anthropic key

### API Keys Section Shows:
- **OpenAI API Key**: Your primary AI key (configured ✓)
- **Anthropic API Key**: Optional Claude access

### To Update API Keys:
1. Stop the development server
2. Edit `.env` file
3. Update the key value
4. Save the file
5. Restart: `npm run dev`

## 💳 Credits System

Your account includes:
- **Total Credits**: 1,000 per month
- **Current Usage**: Tracked in real-time
- **Reset Date**: Monthly reset

### Credit Costs:
- Summarize: 1 credit
- Q&A: 1 credit
- Extract: 1 credit
- Generate: 2 credits
- Compare: 2 credits
- Analyze Tone: 2 credits

View your credit usage anytime in the Settings page.

## 🎨 Node Groups

Organize your content with the three-group system:

### Purple - Tone Group
- Your writing samples
- Personal style references
- Voice guidelines

### Green - Reference Group
- Competitor content
- Inspiration sources
- Research materials

### Orange - Content Group
- Your generated outputs
- Drafts and final content

To assign a node to a group, right-click on it (or edit its properties).

## 🤖 AI Models Available

You can choose from these models in the AI panel:

1. **GPT-4** (OpenAI)
   - Best for: Analytical tasks, complex reasoning
   - Speed: Moderate
   - Quality: Highest

2. **GPT-3.5 Turbo** (OpenAI)
   - Best for: Quick responses, simple tasks
   - Speed: Fast
   - Quality: Good

3. **Claude 3 Opus** (Anthropic - Optional)
   - Best for: Creative writing, long content
   - Speed: Moderate
   - Quality: Excellent for creativity

4. **Claude 3 Sonnet** (Anthropic - Optional)
   - Best for: Balanced tasks
   - Speed: Fast
   - Quality: Very good

5. **Claude 3 Haiku** (Anthropic - Optional)
   - Best for: Quick tasks
   - Speed: Very fast
   - Quality: Good

*Note: Anthropic models require ANTHROPIC_API_KEY in your .env file*

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready

# If not, start it:
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux

# Create database if needed:
createdb bloom_ai

# Apply schema:
npm run db:push
```

### "Invalid API Key" Error
1. Check `.env` file has correct OpenAI key
2. Verify no extra spaces in the key
3. Restart the dev server

### Changes Not Showing
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

## 📚 Additional Resources

- **Main Documentation**: [README.md](README.md)
- **API Reference**: [API.md](API.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Full Setup**: [SETUP.md](SETUP.md)

## 🎉 You're All Set!

Your Bloom AI instance is fully configured and ready to use with:
- ✅ OpenAI GPT-4 integration
- ✅ Settings page for managing API keys
- ✅ Dashboard for board management
- ✅ Full authentication system
- ✅ 1,000 AI credits per month

Start creating by visiting: **http://localhost:3000**

---

**Need Help?**
- Check the troubleshooting section above
- Review the full documentation in [README.md](README.md)
- All your API keys are safely stored in `.env`

**Happy Creating! 🌸✨**
