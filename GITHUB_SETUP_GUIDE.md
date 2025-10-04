# 🚀 GitHub Setup Guide - Complete Walkthrough

Step-by-step guide to push Bloom AI to GitHub and enable automatic container builds.

## 📋 What Will Happen

1. ✅ You create a GitHub repository (manual)
2. ✅ You push your code to GitHub
3. ✅ GitHub Actions automatically builds Docker image
4. ✅ Image published to GitHub Container Registry (ghcr.io)
5. ✅ You can deploy anywhere using Portainer or docker-compose

---

## 🎯 Step-by-Step Instructions

### **Step 1: Create GitHub Repository**

1. **Open your browser** and go to: https://github.com/new

2. **Fill in repository details:**
   - **Repository name:** `bloom-ai-codex` (or any name you prefer)
   - **Description:** `Bloom AI - Visual AI Workspace for Content Creation`
   - **Visibility:** ✅ **Public** (so container images can be public)
   - **Initialize repository:**
     - ❌ **DO NOT** check "Add a README file"
     - ❌ **DO NOT** add .gitignore
     - ❌ **DO NOT** choose a license
     - (We already have all these files!)

3. **Click:** "Create repository"

4. **Copy the repository URL** (you'll need it):
   ```
   https://github.com/YOUR_USERNAME/bloom-ai-codex.git
   ```

---

### **Step 2: Initialize Git in Your Project**

Open Terminal and navigate to your project:

```bash
cd /Users/shady/Documents/GitHub/shadynafie/bloom-ai-codex
```

**Check if git is already initialized:**
```bash
git status
```

**If you see "not a git repository", initialize it:**
```bash
git init
```

---

### **Step 3: Add and Commit All Files**

```bash
# Add all files to git
git add .

# Check what will be committed (optional)
git status

# Commit with a message
git commit -m "Initial commit - Bloom AI with Docker and Portainer support"
```

---

### **Step 4: Connect to GitHub and Push**

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
# Set main as default branch
git branch -M main

# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/bloom-ai-codex.git

# Push to GitHub
git push -u origin main
```

**If prompted for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your password)
  - Create token: https://github.com/settings/tokens
  - Scopes needed: `repo`, `write:packages`

---

### **Step 5: Enable GitHub Actions Permissions**

This is **CRITICAL** for automatic container builds!

1. **Go to your repository** on GitHub:
   ```
   https://github.com/YOUR_USERNAME/bloom-ai-codex
   ```

2. **Click:** Settings (top menu bar)

3. **Left sidebar:** Actions → General

4. **Scroll down to:** "Workflow permissions"

5. **Select:** ✅ "Read and write permissions"

6. **Check:** ✅ "Allow GitHub Actions to create and approve pull requests"

7. **Click:** Save

---

### **Step 6: Trigger First Container Build**

**Option A: Automatic (Push a Change)**

```bash
# Make a small change to trigger build
echo "" >> README.md

git add .
git commit -m "Trigger initial container build"
git push
```

**Option B: Manual Trigger**

1. Go to: `https://github.com/YOUR_USERNAME/bloom-ai-codex/actions`
2. Click on **"Build and Push Docker Image"** workflow
3. Click **"Run workflow"** dropdown
4. Click **"Run workflow"** button

---

### **Step 7: Monitor the Build**

1. **Go to:** Actions tab in your repository
   ```
   https://github.com/YOUR_USERNAME/bloom-ai-codex/actions
   ```

2. **Click on** the running workflow (yellow dot)

3. **Click on** the job name to see detailed logs

4. **Wait 5-10 minutes** for the build to complete

5. **When complete:** You'll see a green checkmark ✅

---

### **Step 8: Make Container Package Public**

After the first build completes:

1. **Go to your repository** main page

2. **Right sidebar:** Look for "Packages" section

3. **Click on** `bloom-ai-codex` package

4. **Click:** Package settings (gear icon, top right)

5. **Scroll to:** "Danger Zone"

6. **Click:** "Change visibility"

7. **Select:** Public

8. **Type the repository name** to confirm

9. **Click:** "I understand, change package visibility"

---

### **Step 9: Verify Container is Published**

Your container image is now available at:
```
ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest
```

**Test pulling the image:**
```bash
docker pull ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest
```

If successful, you'll see:
```
latest: Pulling from YOUR_USERNAME/bloom-ai-codex
Status: Downloaded newer image for ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest
```

---

## 🎉 Success! What Happens Now?

### **Automatic Builds**

Every time you push code to GitHub:
1. GitHub Actions automatically triggers
2. Builds new Docker image
3. Publishes to ghcr.io
4. Tagged as `:latest` and `:sha-XXXXXX`

### **Deploy Anywhere**

You can now deploy on any machine:

```bash
# Pull pre-built image
docker pull ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest

# Or use docker-compose
git clone https://github.com/YOUR_USERNAME/bloom-ai-codex.git
cd bloom-ai-codex
docker-compose up -d
```

### **Use with Portainer**

See [PORTAINER_GUIDE.md](PORTAINER_GUIDE.md) for Portainer Stack deployment.

---

## 🔧 Common Issues & Solutions

### **Issue: Push Rejected - Authentication Failed**

**Solution:** Use Personal Access Token instead of password

1. Create token: https://github.com/settings/tokens/new
2. Scopes: `repo`, `write:packages`, `workflow`
3. Copy the token
4. Use as password when prompted

**Or use SSH:**
```bash
# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/bloom-ai-codex.git

# Push
git push -u origin main
```

---

### **Issue: GitHub Actions Not Running**

**Check:**
1. Settings → Actions → General → Workflow permissions set to "Read and write"
2. Actions tab shows workflows
3. `.github/workflows/docker-publish.yml` file exists in repo

**Manually trigger:**
- Actions tab → Build and Push Docker Image → Run workflow

---

### **Issue: Build Fails**

**View logs:**
1. Actions tab → Click failed workflow
2. Click job → View error logs

**Common causes:**
- Dockerfile syntax error (unlikely - tested file)
- Out of disk space on GitHub runners (rare)
- Missing dependencies (unlikely)

**Solution:** Check error message and fix, then push again

---

### **Issue: Can't Make Package Public**

**Check:**
1. Repository is public (not private)
2. You're the repository owner
3. Package has been built at least once

---

### **Issue: Can't Pull Image**

**If package is private:**
```bash
# Login to GitHub Container Registry
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# Then pull
docker pull ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest
```

**If package is public but still fails:**
- Wait a few minutes after making it public
- Try: `docker logout ghcr.io` then pull again

---

## 📊 What's in the Workflow?

The file `.github/workflows/docker-publish.yml` does:

1. **Triggers on:**
   - Push to `main` or `develop` branches
   - New version tags (`v*`)
   - Pull requests

2. **Builds for:**
   - linux/amd64 (Intel/AMD processors)
   - linux/arm64 (Apple Silicon, ARM servers)

3. **Publishes to:**
   - `ghcr.io/YOUR_USERNAME/bloom-ai-codex:latest`
   - `ghcr.io/YOUR_USERNAME/bloom-ai-codex:main`
   - `ghcr.io/YOUR_USERNAME/bloom-ai-codex:sha-XXXXXX`

4. **Uses caching** to speed up subsequent builds

---

## 🔄 Updating Your Deployment

After you push new code:

**Docker Compose:**
```bash
cd bloom-ai-codex
git pull
docker-compose pull
docker-compose up -d
```

**Portainer:**
1. Stacks → bloom-ai → Update stack
2. Enable "Re-pull image and redeploy"
3. Click Update

---

## 📚 Next Steps

- ✅ Code on GitHub
- ✅ Container auto-builds
- ✅ Image on ghcr.io
- 🚀 Deploy with Portainer: [PORTAINER_GUIDE.md](PORTAINER_GUIDE.md)
- 📖 Full deployment guide: [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

---

## 🆘 Need Help?

- **GitHub Actions Logs:** Actions tab in your repository
- **Docker Issues:** [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
- **Portainer Issues:** [PORTAINER_GUIDE.md](PORTAINER_GUIDE.md)

---

**Your code is now on GitHub with automatic container builds! 🎉**
