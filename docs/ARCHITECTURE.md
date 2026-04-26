# Architecture Document

## System Design

### Design Philosophy

1. **Serverless & Database-less** — Maximum speed and simplicity
2. **Build-time data fetch** — Google Sheets CSV → Static JSON at deploy time
3. **Static hosting** — Zero server maintenance, served from CDN
4. **Multi-tenant routing** — URL parameter-based (`?shop=SHOP_ID`)

---

## Data Flow

### Build Time (Vercel Deploy)

```
┌─────────────────────────────────────────────────────────┐
│  Google Sheets (per shop)                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ type,key,value                                   │   │
│  │ config,shop_name,Cafe Aurora                     │   │
│  │ config,template,with-images                       │   │
│  │ config,theme_bg,#FDF8F3                          │   │
│  │ item,name,description,price,image,category        │   │
│  │ item,Tonkotsu Ramen,...                          │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓ File → Share → Publish to web │
│                          ↓ CSV export URL                │
└─────────────────────────────────────────────────────────┘
                           ↓ fetch()
┌─────────────────────────────────────────────────────────┐
│  Build Script (build-menus.js)                          │
│  - Fetch all Google Sheet CSVs                          │
│  - Parse with PapaParse                                 │
│  - Separate config rows vs item rows                   │
│  - Normalize data (prices, colors, etc.)                 │
│  - Write to data/menus/[shop-id].json                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Static JSON Files (committed to repo)                  │
│  /data/menus/cafe-aurora.json                           │
│  /data/menus/velvet-bar.json                            │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│  Vercel Deploy (static CDN)                             │
│  - index.html                                           │
│  - css/styles.css                                       │
│  - js/app.js, shop.js, menu.js, ui.js                   │
│  - data/menus/*.json                                    │
└─────────────────────────────────────────────────────────┘
```

### Runtime (Customer Scans QR)

```
Customer scans QR Code
    ↓
URL: https://yourapp.vercel.app/?shop=cafe-aurora
    ↓
Browser loads index.html + CSS + JS
    ↓
app.js reads ?shop=cafe-aurora
    ↓
fetch('/data/menus/cafe-aurora.json') → instant (CDN cached)
    ↓
ui.js applies theme colors (CSS variables)
    ↓
ui.js renders: header + category pills + menu cards
    ↓
Customer sees customized menu ✅
```

---

## Component Architecture

### File: index.html
- Single-page shell
- Loads: Tailwind CDN, Google Fonts, PapaParse, Lucide Icons
- Mount point: `<div id="app">`

### File: js/shop.js
- Fetches `/data/shops.json` (shop directory)
- Provides `getShop(shopId)` — lookup shop by ID
- Provides `getDefaultShop()` — get first shop as default
- In-memory cache after first fetch

### File: js/menu.js
- Fetches `/data/menus/[shopId].json` (pre-built menu data)
- Provides `fetchMenu(shopId)` — load menu data
- Provides `formatPrice()` — format currency
- Provides `getCategories()` — extract unique categories
- Provides `filterByCategory()` — filter items by category
- In-memory cache after first fetch

### File: js/ui.js
- `applyTheme(config)` — set CSS custom properties
- `renderHeader(config)` — shop logo + name + tagline
- `renderCategoryNav(categories)` — horizontal scrollable pills
- `renderPhotoCard(item)` — card with image (template: with-images)
- `renderListItem(item)` — row without image (template: without-images)
- `renderCategorySection()` — category header + items
- `renderMenu()` — full menu with all sections
- `renderLoading()` — shimmer skeleton animation
- `renderError()` / `renderEmpty()` — state screens
- `escapeHtml()` — XSS protection

### File: js/app.js
- Entry point, orchestrator
- `init()` — parse URL → load shop → load menu → render
- `parseShopFromURL()` — extract `?shop=` param
- `loadMenu()` — fetch + render with loading state
- `attachCategoryListeners()` — handle category pill clicks
- Browser back/forward button support via `popstate`

---

## Theming System

CSS custom properties (set dynamically per shop):

```css
:root {
    --theme-bg: #FFFFFF;          /* Page background */
    --theme-accent: #C4956A;       /* Prices, buttons, accents */
    --theme-text: #2D2D2D;          /* Body text */
    --theme-header: #3D2B1F;        /* Header background */
    --theme-header-text: #FFFFFF;   /* Header text */
}
```

Applied via: `document.documentElement.style.setProperty('--theme-bg', config.theme_bg)`

---

## Google Sheet Format

Each shop has its own Google Sheet with this structure:

### Config Rows (type = config)
```
type,key,value
config,shop_name,Cafe Aurora
config,template,with-images
config,theme_bg,#FDF8F3
config,theme_accent,#D4A574
config,theme_text,#3D3D3D
config,theme_header,#5C3D2E
config,theme_header_text,#FFFFFF
config,currency,$
config,currency_position,before
config,tagline,Good coffee, great vibes
config,logo_url,https://example.com/logo.png
```

### Item Rows (type = item)
```
type,name,description,price,image,category
item,Tonkotsu Ramen,Pork bone broth with chashu,$14.90,https://...,Ramen
item,Gyoza,Pan-fried dumplings,$8.90,,Sides
```

---

## Build Script Logic (build-menus.js)

```
1. Read data/shops.json (array of {id, name, sheet_url})
2. For each shop:
   a. Validate config (id, name, sheet_url required)
   b. Fetch CSV from sheet_url
   c. PapaParse(csv) → rows
   d. Separate: config rows → config object, item rows → items array
   e. Normalize prices (strip currency symbols, parse float)
   f. Validate required fields
   g. Write data/menus/[shop.id].json
3. Print build summary (success/fail count)
4. Exit 1 if any shop failed
```

---

## Vercel Configuration

```json
{
  "version": 2,
  "buildCommand": "node scripts/build-menus.js",
  "outputDirectory": ".",
  "installCommand": "npm install"
}
```

Build runs before deploy → all menu JSON files are generated → app is deployed.

---

## Security Considerations

1. **XSS Prevention** — All user-visible text passed through `escapeHtml()`
2. **Path Traversal** — Shop IDs sanitized: `/[^a-zA-Z0-9_-]/g`
3. **Fetch Timeout** — 15 second timeout on Google Sheets fetch
4. **CSP Headers** — Vercel sets Content-Security-Policy
5. **Google Sheets URL** — Anyone with the URL can read (use throwaway account)

---

## Performance Optimizations

1. **Static JSON** — Served from Vercel CDN edge network
2. **Immutable caching** — Menu JSON cached for 1 year (`immutable`)
3. **Lazy loading images** — `loading="lazy"` on all item images
4. **Google Fonts preconnect** — Reduces font loading time
5. **Tailwind CDN** — Cached globally by CDN
6. **Shimmer skeleton** — Perceived performance during load
7. **Staggered animations** — CSS animation delays for cards

---

## Scalability

| Aspect | Current | Max |
|--------|---------|-----|
| Shops | 2 (dynamic from shops.json) | 50+ (same code) |
| Items per shop | 21-24 | Limited by sheet size |
| Categories | Dynamic per shop | Unlimited |
| Concurrent users | Vercel handles scaling | Vercel handles scaling |

The architecture is designed to scale horizontally — each shop is completely independent data.
