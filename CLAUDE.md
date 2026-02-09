# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClawPact is an AI agent trust score platform — "the trust layer for AI agents." It visualizes agent reliability, track records, and capabilities. See `DOCS/ROADMAP.md` for the phased product strategy.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm test         # Run all tests (Vitest)
pnpm test:watch   # Run tests in watch mode
pnpm test:coverage # Run tests with coverage
```

Package manager is **pnpm** (not npm/yarn).

## Tech Stack

- **Next.js 16** with App Router (React 19, TypeScript strict mode)
- **Tailwind CSS v4** via PostCSS plugin (`@tailwindcss/postcss`)
- **shadcn/ui** (style: `base-lyra`) with **Base UI** (`@base-ui/react`) as headless primitives
- **CVA** (class-variance-authority) for component variant management
- **Lucide React** for icons
- **Supabase** for database and auth (Google OAuth)
- **Zod** (`zod/v4`) for API input validation
- **Vitest** + Testing Library for tests

## Architecture

```
app/                        # Next.js App Router — server components by default
  api/agents/               # REST API: POST (create), GET/PUT/DELETE via [slug]
  auth/callback/            # Google OAuth callback (exchanges code for session)
  agents/[slug]/            # Public agent profile page (shareable URL)
    opengraph-image.tsx     # Dynamic per-agent OG image generation
  dashboard/                # Owner dashboard (list agents, register new)
    layout.tsx              # Dashboard layout with sidebar
    new/                    # Register new agent page
  login/                    # Google OAuth login page
    actions.ts              # Server actions: googleLogin(), signOut()
  robots.ts                 # Crawl directives (blocks /api, /dashboard, /login)
  sitemap.ts                # Dynamic sitemap (landing + all agent pages)
  manifest.ts               # PWA web app manifest
components/ui/              # shadcn/ui components (Base UI + Tailwind + CVA)
components/                 # App-level composed components
  nav.tsx                   # Global nav bar (client component, handles auth state)
  landing-page-content.tsx  # Client component for landing page
  dashboard-sidebar.tsx     # Client component for dashboard sidebar
  login-form.tsx            # Login form component
  google-button.tsx         # Google OAuth button component
lib/
  types.ts                  # All TypeScript interfaces (Agent, Owner, API types)
  validations.ts            # Zod schemas + generateSlug()
  auth.ts                   # Server-side auth helpers (getSession, getUser, requireAuth)
  env.ts                    # Runtime env var validation
  mock-data.ts              # Mock data for development
  supabase/client.ts        # Browser Supabase client
  supabase/server.ts        # Server Supabase client (RSC/API routes)
  supabase/middleware.ts     # Session refresh helper
supabase/migrations/        # SQL migration files
__tests__/                  # Vitest tests (mirrors source structure)
  helpers/factories.ts      # Test data factories
  helpers/render.ts         # Custom render with re-exports
```

### Path Aliases

`@/*` maps to the project root (e.g., `@/components/ui/button`, `@/lib/utils`).

### Key Patterns

- **Auth flow:** Google OAuth via Supabase → `auth/callback` exchanges code for session → upserts owner in `owners` table → redirects to dashboard. Login/logout use server actions in `app/login/actions.ts`.
- **Agent slugs:** Auto-generated from agent name via `generateSlug()` in `lib/validations.ts`
- **API routes:** All use Zod validation, return `ApiResponse<T>` or `ApiError` types
- **RLS:** Agents are publicly readable; only authenticated owner can create/update/delete their own agents
- **Mock data:** `lib/mock-data.ts` provides `getMockAgent(slug)` and `getMockAgents()` for development without Supabase
- **SEO metadata:** Root layout defines `metadataBase`, title template (`%s | ClawPact`), OG/Twitter defaults. Agent pages use `generateMetadata()` with JSON-LD structured data. Private pages (dashboard, login) are `noindex`. See `DOCS/SEO_STRATEGY.md` for full strategy.
- **Server/client split:** Pages that need metadata export must be server components. Interactive content is extracted into client components (e.g., `components/landing-page-content.tsx`).

### Styling

- Theme defined in `app/globals.css` using `@theme inline` block with CSS variables (OKLch color space)
- Dark mode via `.dark` class on root element
- Component variants use CVA, class merging via `cn()` from `lib/utils.ts`

### Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

Config is in `components.json`. Components go to `components/ui/`.

### Env Variables

See `.env.local.example`. Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

### Do

update CLAUDE.md every you update codebase and you think is necessary
