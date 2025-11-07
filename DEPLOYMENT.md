# BrandGuard OS - Deployment Guide

## 📦 Git Setup Complete

✅ Git repository initialized
✅ All files committed (2 commits)
✅ Ready to push to remote

## 🚀 Step 1: Push to GitHub

### Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - **Name:** `brandguard-os` (or your preferred name)
   - **Description:** "Pharmaceutical marketing compliance platform - P0 prototype"
   - **Visibility:** Private or Public (your choice)
   - **Do NOT initialize** with README, .gitignore, or license (we already have these)

3. Copy the repository URL (e.g., `https://github.com/username/brandguard-os.git`)

### Push to GitHub

Run these commands in your terminal:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/brandguard-os.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy to Render.com

### Option A: Static Site (Recommended for Demo)

1. **Sign up / Log in to Render.com**
   - Go to https://render.com
   - Sign up with GitHub account (easiest)

2. **Create New Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select the `brandguard-os` repository

3. **Configure Build Settings**
   ```
   Name: brandguard-os
   Root Directory: brand-guard-os
   Build Command: npm install && npm run build
   Publish Directory: brand-guard-os/dist
   ```

4. **Environment Variables** (if needed later)
   - Add any API keys or environment variables here
   - For now, leave empty (we're using mock data)

5. **Deploy**
   - Click "Create Static Site"
   - Wait ~2-3 minutes for build to complete
   - Your app will be live at `https://brandguard-os.onrender.com` (or similar)

### Option B: Web Service (For Future Backend Integration)

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository

2. **Configure Settings**
   ```
   Name: brandguard-os
   Root Directory: brand-guard-os
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm run preview
   ```

3. **Plan**: Free (or Starter if you need custom domain)

4. **Deploy** and wait for build completion

## 🔧 Troubleshooting

### Build Fails on Render

**Issue:** Missing dependencies or build errors

**Solution:**
```bash
# Test build locally first
cd brand-guard-os
npm run build

# If successful, commit and push any changes
git add .
git commit -m "Fix build configuration"
git push
```

### Routes Don't Work (404 errors)

**Issue:** React Router routes return 404 on Render

**Solution:** Already configured in `render.yaml` with rewrite rules. If using dashboard:
- Add rewrite rule: `/*` → `/index.html`

### Environment Variables

For future API integration:
```bash
# In Render.com dashboard, add environment variables:
VITE_SALESFORCE_API_URL=your-api-url
VITE_API_KEY=your-api-key
```

## 📊 What's Deployed

### Pages (All P0 Complete)
- ✅ Dashboard - Key metrics and recent activity
- ✅ Campaigns - Campaign management with taxonomy
- ✅ Claims - ClaimID registry with evidence
- ✅ MLR - Medical Legal Review workflow
- ✅ Segments - Audience segmentation builder
- ✅ Events - Event tracking and analytics
- ✅ Email - Email execution and metrics
- ✅ Admin - User management and system health

### Features
- Mock Salesforce services with realistic data
- React Query for data fetching and caching
- shadcn/ui component library
- Dark mode support
- Responsive design
- Toast notifications

## 🎯 Next Steps After Deployment

1. **Test all pages** on the deployed URL
2. **Share demo link** with stakeholders
3. **Build P1 features** (Journey Canvas next!)
4. **Connect real APIs** (replace mock services)

## 📝 Useful Commands

```bash
# View git log
git log --oneline

# Check what's committed
git status

# Add remote repository
git remote -v

# Force push (if needed)
git push -f origin main

# View deployment logs on Render
# (Available in Render.com dashboard → Logs tab)
```

## 🔗 URLs After Deployment

- **GitHub Repo**: `https://github.com/YOUR_USERNAME/brandguard-os`
- **Render Deploy**: `https://brandguard-os.onrender.com` (will be different)
- **Local Dev**: `http://localhost:8080`

---

**Ready to deploy!** Create your GitHub repo and follow the steps above.
