# Lumière Studio — Photo Studio Website

A premium, production-ready **Next.js 14** frontend for a professional photography studio. Built with App Router, TypeScript, Tailwind CSS, and a luxury editorial design aesthetic.

---

## ✨ Features

- **7 complete pages**: Home, Services, Equipment Rental, Shop, Booking, Reviews, Contact
- **Admin dashboard** with tabs: Dashboard, Bookings, Services, Equipment, Products, Reviews
- **Dark mode** toggle with system preference detection
- **Responsive** mobile-first design
- **Sticky navbar** with transparent → frosted glass on scroll
- **Form handling** with success states (Booking, Contact, Reviews)
- **Mock data layer** ready for API swap
- **SEO-friendly** metadata per page
- **Image optimisation** via Next.js `<Image>` component

---

## 🗂 Project Structure

```
photostudio/
├── app/
│   ├── layout.tsx          # Root layout (Navbar + Footer + ThemeProvider)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles + design tokens
│   ├── not-found.tsx       # 404 page
│   ├── services/page.tsx
│   ├── equipment/page.tsx
│   ├── shop/
│   │   ├── page.tsx        # Product listing
│   │   └── [id]/page.tsx   # Product detail
│   ├── booking/page.tsx
│   ├── reviews/page.tsx
│   ├── contact/page.tsx
│   └── admin/page.tsx      # Admin dashboard
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── index.tsx       # Button, Badge, StarRating, Skeleton, Input, etc.
│       └── ThemeProvider.tsx
├── lib/
│   ├── utils.ts            # cn(), formatPrice(), formatDate()
│   └── data/
│       ├── services.ts     # Mock service data
│       ├── equipment.ts    # Mock equipment data
│       └── products.ts     # Mock products + reviews
├── types/
│   └── index.ts            # TypeScript interfaces
├── tailwind.config.ts
├── next.config.ts
└── vercel.json
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Build for production
```bash
npm run build
npm start
```

---

## ☁️ Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — GitHub + Vercel Dashboard
1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository
4. Vercel auto-detects Next.js — click **Deploy**

No environment variables required for the frontend-only version.

---

## 🔗 Connecting to Your Spring Boot Backend

The app uses **`NEXT_PUBLIC_API_BASE_URL`** (see `.env.example`) — full base including `/api`, e.g. `http://localhost:8090/api` for local Spring Boot (port may vary).

**Deployed frontend vs backend:** change this to your public API URL at **build** time (Vercel/host env). **User accounts are stored in the backend’s MySQL database**, so pointing the UI at production means you **register and log in against production data** (separate from local dev unless you use the same DB).

First **admin** on a new production database: see [photoshop-backend/deploy/README-DEPLOY.md](../photoshop-backend/deploy/README-DEPLOY.md) (optional env bootstrap or SQL grant of `ROLE_ADMIN`).

```typescript
// Example service fetch (base URL already includes /api):
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services?page=0&size=20`);
```

Add to `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8090/api
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Font (Display) | Cormorant Garamond |
| Font (Body) | DM Sans |
| Font (Mono) | DM Mono |
| Accent | `#d4a843` (Gold) |
| Background | `#FAF8F4` (Cream) |
| Dark BG | `#0f0e0c` (Obsidian) |

---

## 📱 Pages Summary

| Route | Page |
|-------|------|
| `/` | Home — Hero, services, equipment, testimonials |
| `/services` | All services with details & booking CTA |
| `/equipment` | Equipment rental grid with availability |
| `/shop` | Product listing with filters |
| `/shop/[id]` | Product detail with gallery |
| `/booking` | Booking form with service selector |
| `/reviews` | Reviews grid + add review form |
| `/contact` | Contact form + map + studio info |
| `/admin` | Admin dashboard (no auth — add middleware) |

---

## 🔒 Next Steps (Backend Integration)

1. **Auth** — Add NextAuth.js for admin authentication
2. **API Routes** — Connect Spring Boot REST endpoints
3. **Database** — MySQL via Spring Boot JPA
4. **File Upload** — Image upload for products/services
5. **Payments** — Stripe integration for bookings/shop
6. **Email** — Nodemailer/SendGrid for booking confirmations
