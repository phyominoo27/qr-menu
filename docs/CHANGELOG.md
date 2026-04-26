# Changelog

All notable changes to the QR Menu project.

## [1.0.0] — 2026-04-25

### Added

- **Multi-tenant QR Menu System** — Single app supports unlimited shops
- **Two Menu Templates:**
  - `with-images` — Photo card grid layout
  - `without-images` — Clean text list layout
- **Dynamic Theming** — Each shop has custom brand colors (background, accent, text, header)
- **Build-time Data Fetch** — Google Sheets → CSV → Static JSON at deploy time
- **Static Hosting** — Zero server maintenance, Vercel CDN
- **Mobile-First Design** — Optimized for QR code scanning on smartphones
- **Category Navigation** — Horizontal scrollable pills for filtering
- **Loading Skeleton** — Shimmer animation while menu loads
- **Error States** — Friendly error screens with retry option
- **XSS Protection** — All user text escaped
- **Browser Navigation** — Back/forward button support

### Sample Shops

- **Cafe Aurora** (`cafe-aurora`) — with-images template, warm café theme
- **Velvet Bar** (`velvet-bar`) — without-images template, dark mode gold accents

### Tech Stack

- HTML5 + Vanilla JavaScript
- Tailwind CSS (CDN)
- PapaParse for CSV parsing
- Node.js build script
- Vercel static hosting

### Documentation

- README.md — Quick start guide
- ARCHITECTURE.md — Technical architecture
- GOOGLE_SHEETS.md — Sheet format & integration guide
- DEPLOYMENT.md — Vercel + GitHub deployment guide

---

## Future Enhancements (Planned)

- [ ] Google Apps Script webhook for auto-redeploy
- [ ] Admin panel for managing shops
- [ ] Analytics dashboard (QR scans, popular items)
- [ ] Multi-language support
- [ ] Order/reservation integration
