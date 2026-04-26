# Deployment Guide

## Prerequisites

1. **GitHub Account** — For source control
2. **Vercel Account** — For hosting (free tier)
3. **Node.js 16+** — For running build script locally
4. **Git** — For version control

---

## Step 1: Push to GitHub

### 1.1: Initialize Git Repository

```bash
cd qr-menu
git init
git add .
git commit -m "Initial commit: QR Menu system"
```

### 1.2: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name: `qr-menu` (or your preference)
3. Make it **Public** or **Private**
4. Click **Create repository**

### 1.3: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/qr-menu.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New...** → **Project**
3. Select **GitHub** and authorize
4. Find your `qr-menu` repository
5. Click **Import**

### Configure Project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Other |
| **Root Directory** | `./` (or `qr-menu` if repo is in subfolder) |
| **Build Command** | `npm run build` (pre-filled from vercel.json) |
| **Output Directory** | `.` (pre-filled from vercel.json) |

6. Click **Deploy**

### Option B: Vercel CLI

```bash
npm install -g vercel
cd qr-menu
vercel --prod
```

---

## Step 3: Configure Environment (If Needed)

Vercel should auto-detect settings from `vercel.json`. If not:

1. Go to your project on Vercel Dashboard
2. Click **Settings**
3. Under **General**:
   - Build Command: `npm run build`
   - Output Directory: `.`
4. Under **Environment Variables**:
   - Add if needed for future integrations

---

## Step 4: Access Your Deployed App

After deploy, Vercel gives you a URL like:
```
https://qr-menu.vercel.app
```

Or your custom domain if configured.

**Test with shop param:**
```
https://qr-menu.vercel.app/?shop=cafe-aurora
```

---

## Step 5: Set Up Custom Domain (Optional)

### In Vercel:

1. Go to project **Settings** → **Domains**
2. Enter your domain (e.g., `menu.yourcafe.com`)
3. Click **Add**
4. Vercel will show DNS records to add

### In Your DNS Provider:

Add the records Vercel specifies (usually CNAME pointing to `cname.vercel-dns.com`)

### Wait for SSL:

Vercel auto-provisions HTTPS certificate. May take a few minutes.

---

## Step 6: Generate QR Codes

After deployment, generate QR codes for each shop:

```bash
# Format
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=YOUR_URL/?shop=SHOP_ID

# Examples
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qr-menu.vercel.app/?shop=cafe-aurora
https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://qr-menu.vercel.app/?shop=velvet-bar
```

Or use any QR code generator tool.

---

## Auto-Deploy on GitHub Push

Vercel auto-deploys when you push to GitHub. No extra setup needed if you imported via GitHub.

### Manual Trigger:
```
git add .
git commit -m "Update menu"
git push
```
Vercel will automatically start a new deployment.

---

## Redeploy Without Code Changes

To trigger a rebuild after updating Google Sheets:

### Option A: Vercel Dashboard
1. Go to **Deployments**
2. Click **⋯** on latest deployment
3. Click **Redeploy**

### Option B: Vercel CLI
```bash
vercel --prod
```

### Option C: GitHub Push
```bash
git commit --allow-empty -m "Trigger rebuild"
git push
```

---

## Troubleshooting Deployments

### Build Fails

1. Run `npm run build` locally to see errors
2. Check Google Sheet URLs are correct and sheets are published
3. Check `shops.json` has valid JSON

### Deployment Succeeds But Menu Empty

1. Check browser console for errors
2. Verify `data/menus/*.json` files exist
3. Verify shop IDs match URL params

### Custom Domain Not Working

1. Wait 24-48 hours for DNS propagation
2. Check DNS records are correct
3. Check SSL certificate provisioned

---

## Production Checklist

- [ ] All shops configured in `shops.json`
- [ ] Google Sheets published and accessible
- [ ] Build succeeds locally (`npm run build`)
- [ ] Deployed to Vercel
- [ ] QR codes generated for all shops
- [ ] Tested on mobile devices
- [ ] Custom domain configured (if needed)
- [ ] Owner knows how to update menus

---

## Useful Commands

```bash
# Install dependencies
npm install

# Run build locally
npm run build

# Preview locally
npm run dev

# Deploy to Vercel (CLI)
vercel --prod

# Check Vercel project status
vercel ls
```
