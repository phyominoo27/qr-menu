# QR Menu — Multi-Tenant QR Code Menu System

## Project Overview

A lightweight, multi-tenant QR Code Menu system designed for cafes, restaurants, and bars. Multiple shops share a single web application while displaying customized menus and distinct brand colors.

**Goal:** Build secure, highly efficient, and scalable applications with zero server maintenance.

---

## Features

- 📱 **Mobile-first** — Optimized for smartphone QR code scanning
- 🎨 **Dynamic Theming** — Each shop has its own brand colors
- 🖼️ **Two Templates** — Photo card grid OR clean text list
- 🔗 **Google Sheets Powered** — Update menus without touching code
- ⚡ **Static & Fast** — Served from Vercel's CDN, zero server maintenance
- 🔢 **Scalable** — 1 shop to 50+ shops, same code
- 🌐 **Multi-tenant** — URL-based routing (`?shop=SHOP_ID`)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5 + Vanilla JavaScript |
| **Styling** | Tailwind CSS (CDN) |
| **Data Parsing** | PapaParse (CSV) |
| **Database** | Google Sheets (published as CSV) |
| **Build System** | Node.js build script |
| **Hosting** | Vercel (static) |
| **Source Control** | GitHub |

---

## Architecture

### Build-Time Data Fetch (Option B)

```
BUILD TIME (when you update menu):
┌────────────────────────────────────────┐
│  1. You edit Google Sheets             │
│  2. Trigger Vercel rebuild             │
│  3. Build script fetches ALL CSV data  │
│  4. Generates static JSON files        │
│  5. App redeployed with fresh data     │
└────────────────────────────────────────┘

RUNTIME (when customer scans QR):
┌────────────────────────────────────────┐
│  1. Customer scans QR → ?shop=SHOP_ID  │
│  2. App loads pre-built JSON (CDN)     │
│  3. Applies theme + renders menu        │
│  4. ZERO Google Sheets dependency       │
└────────────────────────────────────────┘
```

### Why Option B (Static JSON)?

| Option | Speed | Reliability | Updates |
|--------|-------|-------------|---------|
| Live Google Sheets fetch | Medium | Depends on Google | Instant |
| **Static JSON (build-time)** | ⚡ Fastest | 🔒 No dependency | After rebuild |
| Cached hybrid | Fast | Mostly reliable | Background refresh |

---

## Directory Structure

```
qr-menu/
├── index.html              # Single-page shell
├── css/
│   └── styles.css          # Custom styles, animations, theme vars
├── js/
│   ├── app.js              # Orchestrator — routing, init
│   ├── shop.js             # Shop config loader
│   ├── menu.js             # Menu data loader + parser
│   └── ui.js               # Rendering engine
├── data/
│   ├── shops.json           # Shop directory (ID → sheet URL mapping)
│   └── menus/              # Pre-built menu JSON (generated at build)
│       ├── cafe-aurora.json
│       └── velvet-bar.json
├── scripts/
│   └── build-menus.js      # Build script — fetches sheets → generates JSON
├── assets/                 # Placeholder images
├── vercel.json             # Vercel build config
├── package.json            # Node.js dependencies
├── docs/                   # Project documentation
│   ├── README.md           # Quick start guide
│   ├── ARCHITECTURE.md     # Technical architecture
│   ├── GOOGLE_SHEETS.md    # Sheet format reference
│   ├── DEPLOYMENT.md        # Vercel + GitHub deployment guide
│   └── CHANGELOG.md        # Version history
└── PROJECT.md              # This file
```

---

## Two Menu Templates

### Template 1: `with-images` (Photo Card Grid)

Best for: Cafés, brunch spots, modern restaurants with food photography

```
┌─────────────────────────────────────┐
│  [Logo]  CAFE AURORA                │  ← Glassmorphism sticky header
├─────────────────────────────────────┤
│  🍜 Ramen  🍹 Drinks  🍰 Dessert     │  ← Category pills (scrollable)
├─────────────────────────────────────┤
│ ┌──────────┐  Tonkotsu Ramen        │
│ │  [img]   │  Rich pork broth        │
│ │          │  $14.90                 │
│ └──────────┘                         │
│ ┌──────────┐  Gyoza (6pcs)          │
│ │  [img]   │  Pan-fried dumplings   │
│ │          │  $8.90                  │
│ └──────────┘                         │
└─────────────────────────────────────┘
```

### Template 2: `without-images` (Clean List)

Best for: Bars, tea houses, minimalist brands, cocktail lounges

```
┌─────────────────────────────────────┐
│  [Logo]  VELVET BAR                  │  ← Dark glassmorphism header
├─────────────────────────────────────┤
│  SIGNATURE COCKTAILS                │  ← Category header with line
│  ─────────────────────────────────  │
│  Old Fashioned               $16.00  │
│  Bourbon, bitters, sugar              │
│  ─────────────────────────────────  │
│  Negroni                     $15.00  │
│  Gin, Campari, sweet vermouth        │
└─────────────────────────────────────┘
```

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Shops
Edit `data/shops.json` with your Google Sheet URLs.

### 3. Run Build Script
```bash
npm run build
```

### 4. Preview Locally
```bash
npm run dev
```

### 5. Deploy to Vercel
Push to GitHub → Import to Vercel → Done!

---

## For Detailed Documentation

See the `/docs` folder:
- [README.md](docs/README.md) — Quick start & troubleshooting
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Detailed technical architecture
- [GOOGLE_SHEETS.md](docs/GOOGLE_SHEETS.md) — Sheet format & field reference
- [DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel + GitHub setup guide
- [CHANGELOG.md](docs/CHANGELOG.md) — Version history

---

## Sample Shops Included

| Shop ID | Name | Template | Theme |
|---------|------|----------|-------|
| `cafe-aurora` | Cafe Aurora | with-images | Warm café (cream, brown, gold) |
| `velvet-bar` | Velvet Bar | without-images | Dark mode (black, gold) |

---

## License

MIT
