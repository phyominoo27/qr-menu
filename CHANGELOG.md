# QR Menu — Change Log

## 2026-04-27 — Performance Fix: Inline Font Faces

### Issue
Requests blocking the page's initial render, delaying LCP (Largest Contentful Paint).

### Changes Made

#### `index.html`
- **Inlined all `@font-face` declarations** directly into `<style>` block in `<head>`:
  - Outfit 300/400/500/600/700
  - Cormorant 400/500/600/700
  - Padauk 400/700
- **Removed** `<link rel="stylesheet" href="fonts/fonts.css">` — eliminated that blocking CSS request entirely
- **Added `fetchpriority="high"`** to font and JS preloads for better bandwidth prioritization
- **Added `<link rel="prefetch">` for `/data/shops.json`** — fetch starts before JS needs it, reducing menu render delay
- Removed `<link rel="preconnect">` for fonts.gstatic.com (no longer needed since we self-host fonts)

#### `fonts/fonts.css`
- **Deleted** — font faces moved inline into `index.html`

#### `fonts/google-fonts.css`
- **Deleted** — unused orphaned file

### Before vs After — Critical Render Path

**Before:**
```
HTML (971B)
  → fonts/fonts.css (2KB) — BLOCKING round-trip #1
     → outfit-400.ttf, cormorant-400.ttf, padauk-400.ttf (discovered)
  → css/styles.css (15KB) — BLOCKING round-trip #2
  → js/app.js (starts fetching)
     → shops.json (fetched after JS executes)
```

**After:**
```
HTML (3.2KB) — font @font-face rules inlined
  → font URLs discovered immediately, browser fetches them in parallel
  → css/styles.css (15KB) — BLOCKING
  → js/app.js (starts fetching in parallel)
     → shops.json (already cached from earlier prefetch)
```

### Result
- **1 fewer blocking network request** (fonts.css eliminated)
- **shops.json prefetched** before JS needs it
- **Faster LCP** — fonts discovered immediately from inline CSS vs. waiting for fonts.css to download first

### Build & Deploy
- `vercel.json` unchanged — immutable cache headers still active for static assets
- Deployed to: https://qr-menu-opal.vercel.app
- Git commit: `perf: inline font faces in head, remove fonts.css blocking request` (commit `339a7fb`)

---

## Project Info

- **Repo:** https://github.com/phyominoo27/qr-menu
- **Vercel:** https://qr-menu-opal.vercel.app
- **Google Cloud Project:** qr-menu-api-494512
- **Shops:** Cafe Aurora (with-images), Velvet Bar (without-images)
