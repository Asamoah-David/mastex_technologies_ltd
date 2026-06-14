# Mastex Technologies Ltd — Platform

The official digital headquarters and management platform for **Mastex Technologies Ltd** — a
product company shipping enterprise systems, SaaS platforms and AI tools. This repository
contains both the public-facing website and the private admin dashboard / CMS.

Built to feel like a billion-dollar software company and to scale to many products without a
redesign.

---

## ✨ Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| Framework    | Next.js 15 (App Router, RSC, Server Actions)           |
| Language     | TypeScript                                             |
| Styling      | Tailwind CSS + shadcn/ui + Framer Motion               |
| Database     | PostgreSQL (Supabase) via Prisma ORM                   |
| Auth         | Supabase Auth (+ dev cookie session for local mode)    |
| Storage      | Supabase Storage (media library)                       |
| Charts       | Recharts                                               |
| Deployment   | Docker + Railway                                       |
| Package mgr  | pnpm                                                   |

---

## 🚀 Quick start

```bash
# 1. Install dependencies
pnpm install

# 2. Start a local Postgres (or point DATABASE_URL at Supabase)
docker compose up -d db

# 3. Push the schema and seed content
pnpm db:push
pnpm db:seed

# 4. Run the dev server
pnpm dev
```

Open **http://localhost:3000**.

> The site is resilient: if the database isn't running yet, public pages render from curated
> fallback content so you always see a working site.

### Admin access

Visit **http://localhost:3000/admin**. In local/dev mode, sign in with the seeded credentials
from `.env`:

```
SEED_SUPERADMIN_EMAIL=admin@mastex.tech
SEED_SUPERADMIN_PASSWORD=ChangeMe!2026
```

In production, the same `/admin` route is protected by Supabase Auth (see middleware).

---

## ⚙️ Environment variables

Copy `.env.example` → `.env` and fill in. Key variables:

| Variable                          | Purpose                                        |
| --------------------------------- | ---------------------------------------------- |
| `DATABASE_URL` / `DIRECT_URL`     | Postgres connection (pooled / direct)          |
| `NEXT_PUBLIC_SUPABASE_URL`        | Supabase project URL                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Supabase anon key                              |
| `SUPABASE_SERVICE_ROLE_KEY`       | Server-only service role key                   |
| `SUPABASE_STORAGE_BUCKET`         | Media library bucket name                      |
| `AUTH_SECRET`                     | Signs dev admin sessions                       |
| `SEED_SUPERADMIN_EMAIL/PASSWORD`  | Seeded super admin                             |
| `NEXT_PUBLIC_SITE_URL`            | Canonical site URL (SEO, sitemap)              |

---

## 📁 Project structure

```
src/
├─ app/
│  ├─ (marketing)/          Public site (home, about, products, solutions, docs, blog, careers, contact)
│  ├─ admin/                Private dashboard
│  │  ├─ login/             Auth gate (not in nav)
│  │  └─ (panel)/           Gated chrome: dashboard, products, blog, docs, media, leads, careers, analytics, settings, users
│  ├─ api/contact/          Lead-capture endpoint (rate-limited, validated)
│  ├─ sitemap.ts / robots.ts
│  └─ layout.tsx / globals.css
├─ components/
│  ├─ ui/                   shadcn/ui primitives
│  ├─ site/                 Navbar, footer, sections, product card, lead form, docs sidebar
│  ├─ admin/                Sidebar, topbar, stat cards, data table
│  └─ motion / theme / brand / markdown / icon
├─ lib/                     prisma, supabase, auth, rbac, audit, rate-limit, seo, queries, validations
└─ config/                  site config & navigation
prisma/
├─ schema.prisma           Full data model
└─ seed.ts                 Seed data
```

---

## 🔐 Security

- **RBAC** — five roles (Super Admin, Admin, Editor, Support, Viewer) with hierarchical
  permissions plus per-user grants (`src/lib/rbac.ts`).
- **Server-side authorization** — every mutating Server Action re-checks permissions.
- **Input validation** — Zod schemas on all form/API input (`src/lib/validations.ts`).
- **Rate limiting** — per-IP limiter on the contact endpoint (`src/lib/rate-limit.ts`).
- **Audit logs** — sensitive actions recorded to `AuditLog`.
- **Security headers** — set in `next.config.ts` (frame, content-type, referrer, permissions).
- **Honeypot** — bot trap on public forms.
- **MFA-ready** — `User.mfaEnabled` flag and Supabase Auth foundation.
- Secrets via environment variables; `.env` is gitignored.

---

## 🔎 SEO & performance

- Metadata API with Open Graph + Twitter cards (`src/lib/seo.ts`)
- JSON-LD Organization structured data
- Dynamic `sitemap.xml` and `robots.txt`
- Canonical URLs, per-page metadata
- Server Components, `next/image`, standalone output, package-import optimization
- Dark / light mode with no flash (next-themes)

---

## 🐳 Deployment

### Docker (local full stack)

```bash
docker compose up --build
```

### Railway — zero-touch deploy

1. Create a Railway project and add a **PostgreSQL** plugin (or use Supabase).
2. Connect this repo — Railway uses `railway.json` → builds the `Dockerfile`.
3. Set environment variables (see table above), including `DATABASE_URL`.
4. Deploy. **That's it.** On every container start, `docker-entrypoint.sh` automatically:
   - runs `prisma migrate deploy` (falls back to `db push` if needed),
   - runs the **idempotent** seed,
   - then starts the server.

   No manual migration step. The seed only upserts, so redeploys are safe.

### Supabase wiring

1. Create a Supabase project.
2. Put the project URL + keys in your environment.
3. Set `DATABASE_URL` to the **pooled** connection string and `DIRECT_URL` to the **direct** one.
4. Create a Storage bucket matching `SUPABASE_STORAGE_BUCKET`.
5. Create admin users in Supabase Auth with emails matching `User` rows.

---

## 📜 Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm dev`         | Start dev server                     |
| `pnpm build`       | Generate Prisma client + build       |
| `pnpm start`       | Start production server              |
| `pnpm db:push`     | Push schema to the database          |
| `pnpm db:seed`     | Seed content                         |
| `pnpm db:studio`   | Open Prisma Studio                   |
| `pnpm lint`        | ESLint                               |
| `pnpm typecheck`   | TypeScript check                     |

---

## 🗺️ Build status

**Phase 1 (this delivery) — foundation, runnable end-to-end:**

- ✅ Full public website (home, about, products + detail, solutions, docs portal, blog + detail,
  careers, contact) with animation, dark/light mode and SEO
- ✅ Complete Prisma schema + seed for every entity
- ✅ Admin dashboard with metrics, recent activity, RBAC-gated chrome and auth
- ✅ **Functional** Leads management (status + archive) and Settings/CMS editor
- ✅ Admin list views for products, blog, docs, media, users, careers + analytics charts
- ✅ Lead-capture API (validated, rate-limited, audited)
- ✅ Docker, docker-compose, Railway config, security headers

**Phase 2 (this delivery) — full CRUD editors:**

- ✅ **Products** — full create/edit/delete editor: basics, classification, repeatable
  features/benefits, pricing tiers, industries, links and SEO (`/admin/products/new`, `…/[id]/edit`)
- ✅ **Blog** — editor with markdown write/preview, draft/scheduled/published states + publish
  date, category, comma-tags (auto-created), cover image and SEO
- ✅ **Docs** — markdown article editor with category, nesting (parent), version & order, plus
  inline category creator
- ✅ All mutations are RBAC-checked Server Actions with Zod validation, audit logging and
  path revalidation

**Phase 3 (this delivery) — media & users:**

- ✅ **Media library** — file uploads to Supabase Storage (service-role), add-by-URL fallback
  for local/mock mode, folders, tag + name search, image previews and delete
- ✅ **User management** — invite users (real Supabase invite when configured), change role,
  activate/deactivate, per-user permission grants on top of role defaults, delete (with
  self-protection guards)
- ✅ All RBAC-checked Server Actions (`media:write`, `users:write`) with audit logging

**Phase 4 (this delivery) — analytics & navigation CMS:**

- ✅ **Live analytics ingestion** — first-party, cookie-less page-view tracker (`/api/track`),
  DNT-aware, excludes `/admin`; the analytics dashboard now aggregates real `PageView` data
  (visitors by session, page views, top pages, 14-day trend) and falls back to sample data when empty
- ✅ **Navigation CMS** — `/admin/navigation` manages the public header menu and extra footer
  links (add / inline-edit / reorder / delete); the public navbar & footer read from the DB
  with a built-in default fallback

**Phase 6 (this delivery) — beyond-best enhancements:**

- ✅ **Dynamic OG images** — branded `opengraph-image` for the site + per product + per post
- ✅ **Structured data** — `SoftwareApplication`, `BlogPosting`, `BreadcrumbList` JSON-LD
- ✅ **Command palette (⌘K)** — fuzzy nav across pages, products, docs, posts
- ✅ **Search** — docs sidebar (instant) + blog (query); **table of contents** on docs/blog with scroll-spy
- ✅ **`loading.tsx` + `error.tsx`** boundaries (marketing, admin, global)
- ✅ **New pages** — `/pricing`, `/status`, `/changelog`, `/privacy`, `/terms`; **RSS** at `/blog/feed.xml`
- ✅ **Newsletter** capture, **trusted-by marquee**, **product screenshot gallery**
- ✅ **CMS** — testimonials + trusted-by now editable via `SiteSetting`
- ✅ **A11y** — skip-to-content link, visible focus rings
- ✅ **Security** — Content-Security-Policy + HSTS headers; **Upstash**-backed distributed rate limiting (env-gated)
- ✅ **Perf** — ISR (`revalidate`) on marketing pages; **PWA** (manifest + icons, installable)
- ✅ **Quality** — Vitest unit tests (rbac, validations, utils) + **GitHub Actions CI** (typecheck, lint, test, build)

**Phase 8 — enterprise polish:**

- ✅ **Leads CSV export** (RBAC-checked route, audited) + **Audit-log viewer** (`/admin/audit`)
- ✅ **FAQ** accordion (CMS-editable, with **FAQPage** JSON-LD for rich results)
- ✅ **Breadcrumbs** (product + blog, with JSON-LD) · **related products** · **related posts**
- ✅ **Reading-progress bar** on articles · **back-to-top** button
- ✅ Real photography across **every** surface (hero/spotlight/testimonials rotate)

**Phase 9–10 — depth & operability:**

- ✅ **Solution detail pages** (`/solutions/[slug]`) with image hero, body, related products, per-page OG + breadcrumbs
- ✅ **Leadership section** on About (CMS-editable) · **Careers perks/culture** section
- ✅ **Docs breadcrumbs**
- ✅ **Error monitoring** — `instrumentation.ts onRequestError` + `/api/log-error` + `reportError()` util,
  webhook-gated via `ERROR_WEBHOOK_URL` (no-op without it). Sentry-ready: swap `src/lib/observability.ts`
  for the Sentry SDK without touching callers. Client error boundaries report automatically.

**Phase 11 — full admin coverage (everything public is editable):**

- ✅ **Solutions CRUD** · **Careers/Jobs CRUD** · **Changelog CRUD** · **Taxonomy** (categories + industries) CRUD
- ✅ **Product media gallery** in the editor (add/caption screenshots) + clearer **Live demo / site URL** (domain) field
- ✅ **WorkOp** added as the lead product (with demo domain, features, pricing)
- ✅ Every mutation is RBAC-checked, Zod-validated, audited, and revalidates the public pages

> **Admin can now create / edit / delete everything public**: products (with images + demo
> domain), solutions, changelog, blog, docs, media, careers, leads, taxonomy, navigation, and all
> CMS content blocks (homepage, company, footer, FAQ, testimonials, leadership). Each "Live demo"
> button links to the product's admin-set `demoUrl`.

**Optional later:** daily `AnalyticsSnapshot` rollups & exportable reports · full i18n (next-intl) ·
MFA enablement UI · Playwright e2e.

> Note: OG image routes render on-demand; they generate correctly on the Linux deploy. (A
> `@vercel/og` quirk prevents them rendering when the local dev path contains spaces.)

---

© Mastex Technologies Ltd
