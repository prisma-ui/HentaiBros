# HentaiBros Frontend

Frontend React untuk platform streaming hentai. Dibangun dengan React 19, TypeScript, dan Tailwind CSS.

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS** — styling
- **React Router v7** — routing
- **PWA** — service worker + manifest
- **Vercel** — hosting + API proxy

## Fitur

- SEO on-page — meta title, description, canonical, Open Graph, Twitter Card per halaman
- SEO off-page — JSON-LD structured data (WebSite, VideoObject, CollectionPage)
- Blazing fast — lazy loading gambar, cache statis 1 tahun, font preconnect
- PWA — installable, offline fallback via service worker
- Pretty slug URL — `/video/judul-anime`, `/genre/vanilla`
- Backend safe — URL backend tidak pernah expose ke browser (server-side proxy via Vercel)
- Security headers — X-Frame-Options, X-Content-Type-Options, Referrer-Policy

## Struktur Proyek

```
src/
├── api/
│   └── client.ts          # Semua fetch ke /api/* (same-origin, backend tidak expose)
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── VideoCard.tsx
│   ├── Pagination.tsx
│   ├── Skeleton.tsx
│   └── SectionHeader.tsx
├── hooks/
│   ├── useSEO.ts           # Set title, meta, canonical, OG per halaman
│   └── useStructuredData.ts # Inject JSON-LD ke <head>
├── pages/
│   ├── HomePage.tsx
│   ├── VideoDetailPage.tsx
│   ├── GenresPage.tsx
│   ├── GenreDetailPage.tsx
│   ├── ListPage.tsx
│   └── SearchPage.tsx
├── types/
│   └── index.ts
└── utils/
    └── slug.ts             # toSlug(), resolveSlug(), slugFromUrl()
public/
├── sw.js                   # Service worker (PWA)
├── manifest.json           # PWA manifest
├── index.html              # SEO meta tags, preconnect font
└── robots.txt
```

## Setup Lokal

### 1. Clone & install

```bash
git clone https://github.com/username/hentaibros-frontend.git
cd hentaibros-frontend
npm install
```

### 2. Buat file `.env.local`

```bash
cp .env.example .env.local
```

Isi nilainya:

```env
REACT_APP_SITE_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

> `BACKEND_URL` di lokal tidak dipakai oleh `vercel.json` (hanya dipakai saat deploy ke Vercel).
> Untuk lokal, ubah sementara `src/api/client.ts` jika backend berjalan di port berbeda.

### 3. Jalankan

```bash
npm start
```

Buka [http://localhost:3000](http://localhost:3000)

## Deploy ke Vercel

### 1. Push ke GitHub

```bash
git add .
git commit -m "initial commit"
git push
```

### 2. Import di Vercel

Buka [vercel.com/new](https://vercel.com/new), import repo, framework otomatis terdeteksi sebagai **Create React App**.

### 3. Set Environment Variables

Di **Vercel Dashboard → Settings → Environment Variables**, tambahkan:

| Key | Value | Scope |
|-----|-------|-------|
| `BACKEND_URL` | `https://api.backend-kamu.com` | Production |
| `REACT_APP_SITE_URL` | `https://domain-kamu.com` | Production |

> `BACKEND_URL` digunakan oleh `vercel.json` untuk proxy `/api/*` ke backend.
> Nilai ini tidak pernah dikirim ke browser.

### 4. Deploy

Klik **Deploy**. Setiap push ke `main` akan auto-deploy.

## Cara Kerja API Proxy

Browser hanya tahu `/api/*` di domain sendiri. Vercel mem-proxy request tersebut ke backend di server-side:

```
Browser → /api/videos → Vercel (server) → $BACKEND_URL/api/videos → Backend
```

URL backend tidak pernah muncul di source code, network tab, maupun JavaScript bundle.

## Environment Variables

| Key | Digunakan Di | Keterangan |
|-----|-------------|------------|
| `BACKEND_URL` | `vercel.json` (server-side) | URL backend API, tidak expose ke browser |
| `REACT_APP_SITE_URL` | `src/hooks/useSEO.ts` | URL publik website untuk canonical & OG tags |

## Scripts

```bash
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```