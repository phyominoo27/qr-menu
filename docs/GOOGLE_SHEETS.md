# Google Sheets Integration Guide

## Overview

Every shop has its own Google Sheet that acts as their menu database. The sheet is published to the web as CSV, and the build script fetches it at deploy time.

---

## Creating a Google Sheet

### Step 1: Create a New Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new sheet
3. Name it something like "Cafe Aurora Menu"

### Step 2: Set Up the Sheet Structure

The sheet has **two types of rows**:

#### Header Row (Row 1)
```
type,key,value
```
Or for items:
```
type,name,description,price,image,category
```

#### Config Rows (Rows 2+ for config)
```
type,key,value
config,shop_name,Cafe Aurora
config,template,with-images
```

#### Item Rows (Below config)
```
type,name,description,price,image,category
item,Tonkotsu Ramen,Pork bone broth with chashu and egg,$14.90,https://...,Ramen
```

---

## Required Config Fields

| Key | Required | Default | Description |
|-----|----------|---------|-------------|
| `shop_name` | ✅ Yes | — | Display name shown in header |
| `template` | ✅ Yes | `with-images` | `with-images` or `without-images` |
| `theme_bg` | No | `#FFFFFF` | Page background color |
| `theme_accent` | No | `#C4956A` | Price badges, accent elements |
| `theme_text` | No | `#2D2D2D` | Body text color |
| `theme_header` | No | `#3D2B1F` | Sticky header background |
| `theme_header_text` | No | `#FFFFFF` | Header text color |
| `currency` | No | `$` | Currency symbol |
| `currency_position` | No | `before` | `before` or `after` |
| `tagline` | No | — | Short text under shop name |
| `logo_url` | No | — | URL to logo image |

---

## Item Fields

| Column | Required | Description |
|--------|----------|-------------|
| `name` | ✅ Yes | Item name |
| `description` | No | Short description (1-2 sentences) |
| `price` | ✅ Yes | Price (e.g., `$9.90` or `9.90`) |
| `image` | No | URL to item photo |
| `category` | No | Category name (groups items) |

---

## Color Format

Any valid CSS color:
- `#FF5733` — Hex (recommended)
- `rgb(255, 87, 51)` — RGB
- `hsl(14, 100%, 60%)` — HSL
- `red` — Named colors

> ⚠️ Include `#` prefix for hex colors!

---

## Image Guidelines

### Item Images
- Use real photo URLs (Unsplash, shop's own CDN, etc.)
- Supported formats: JPG, PNG, WebP
- Recommended size: 400×400px minimum
- Leave empty for no image (uses placeholder icon)

### Logo Image
- Square image recommended (200×200px)
- PNG with transparent background works well

---

## Publishing the Sheet

### Step 1: Make the Sheet Public

1. Click **Share** button
2. Click **"Anyone with the link"**
3. Select **"Anyone"** (not "Anyone within organization")
4. Role: **Reader**
5. Click **Done**

### Step 2: Publish to Web

1. Click **File → Share → Publish to web**
2. Select **"Entire document"**
3. Select **"CSV"** (NOT "Link")
4. Click **Publish**
5. Copy the URL

### The URL Format

```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
```

> ⚠️ Keep the sheet published! If you unpublish it, the menu will break.

---

## Google Sheet URL

After publishing, you'll get a URL like:

```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=csv
```

This URL goes into `data/shops.json`:

```json
{
  "id": "cafe-aurora",
  "name": "Cafe Aurora",
  "sheet_url": "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=csv"
}
```

---

## Updating the Menu

1. Edit the Google Sheet (add items, change prices, update descriptions)
2. Changes are **NOT** instant — you need to redeploy

### To Redeploy:

**Option A: Manual (Vercel Dashboard)**
1. Go to Vercel Dashboard → Deployments
2. Find latest deployment → Click **⋯** → **Redeploy**

**Option B: Vercel CLI**
```bash
vercel --prod
```

**Option C: GitHub (Auto-deploy)**
Push to GitHub → Vercel auto-deploys

---

## Troubleshooting

### Menu not loading?

1. **Check sheet is published**
   - Go to the sheet URL in your browser
   - Should download a CSV file
   - If you see a Google login page → sheet is not public

2. **Check sheet URL format**
   - Must end with `/export?format=csv`
   - Must be accessible without login

3. **Check column names**
   - Must be: `type,name,description,price,image,category`
   - No extra spaces, no different spellings

### Old data showing?

Menu JSON is cached at build time. After updating the sheet:
1. Redeploy on Vercel
2. Hard refresh browser (Ctrl+Shift+R)

### Build failing?

Run build locally to see errors:
```bash
npm run build
```

---

## Sample Sheet Template

### Sheet URL
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
```

### Complete Example (with-images template)

```
type,key,value
config,shop_name,My Restaurant
config,template,with-images
config,theme_bg,#FFFFFF
config,theme_accent,#E53935
config,theme_text,#212121
config,theme_header,#212121
config,theme_header_text,#FFFFFF
config,currency,$
config,currency_position,before
config,tagline,Best food in town
item,name,description,price,image,category
item,Margherita Pizza,Classic tomato, mozzarella, basil,$14.90,https://example.com/pizza.jpg,Pizza
item,Pepperoni Pizza,Spicy pepperoni, mozzarella,$16.90,,Pizza
item,Caesar Salad,Crisp romaine, parmesan, croutons,$10.50,,Salads
item,Tiramisu,Coffee-flavored Italian dessert,$8.50,,Desserts
```

### Complete Example (without-images template)

```
type,key,value
config,shop_name,My Bar
config,template,without-images
config,theme_bg,#1A1A1A
config,theme_accent,#FFD700
config,theme_text,#F5F5F5
config,theme_header,#0D0D0D
config,theme_header_text,#FFD700
config,currency,$
config,currency_position,before
config,tagline,Craft cocktails & fine spirits
item,name,description,price,image,category
item,Old Fashioned,Bourbon, bitters, sugar,$16.00,,Signature Cocktails
item,Negroni,Gin, Campari, vermouth,$15.00,,Signature Cocktails
item,Margarita,Tequila, Cointreau, lime,$14.00,,Classic Cocktails
```
