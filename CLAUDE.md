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
  api/agents/               # REST API (session auth): POST (create), GET/PUT/DELETE via [slug]
  api/v1/agents/            # Public API (API key auth): POST, GET/PATCH/DELETE via [slug]
  api/v1/agents/register/   # Agent self-registration (no auth required)
  api/v1/agents/me/         # Agent self-management (agent key auth)
  api/v1/agents/me/status/  # Claim status check (agent key auth)
  api/v1/agents/claim/      # Claim API — link agent to user (session auth)
  api/dashboard/api-keys/   # Internal API: API key CRUD (session auth)
  auth/callback/            # Google OAuth callback (exchanges code for session)
  agents/[slug]/            # Public agent profile page (shareable URL)
    opengraph-image.tsx     # Dynamic per-agent OG image generation
  claim/[token]/            # Claim page — human claims ownership of an agent
  dashboard/                # Owner dashboard (list agents, register new, settings)
    layout.tsx              # Dashboard layout with sidebar
    new/                    # Register new agent page
    settings/               # API key management page
  login/                    # Google OAuth login page
    actions.ts              # Server actions: googleLogin(), signOut()
  robots.ts                 # Crawl directives (blocks /api, /dashboard, /login)
  sitemap.ts                # Dynamic sitemap (landing + all agent pages)
  manifest.ts               # PWA web app manifest
components/ui/              # shadcn/ui components (Base UI + Tailwind + CVA)
  button-variants.ts        # CVA buttonVariants export for server components
components/                 # App-level composed components
  nav.tsx                   # Global nav bar (client component, handles auth state)
  landing-page-content.tsx  # Client component for landing page
  dashboard-sidebar.tsx     # Client component for dashboard sidebar
  api-key-manager.tsx       # Client component for API key management UI
  login-form.tsx            # Login form component
  google-button.tsx         # Google OAuth button component
  claim-agent-button.tsx   # Claim action client component
lib/
  types.ts                  # All TypeScript interfaces (User, Agent, AgentWithOwners, API types)
  validations.ts            # Zod schemas + generateSlug()
  auth.ts                   # Server-side auth helpers (getSession, getUser, requireAuth)
  api-auth.ts               # API key auth: authenticateApiKey(), authenticateAgentApiKey(), generateApiKey(), supabaseAdmin
  env.ts                    # Runtime env var validation
  supabase/client.ts        # Browser Supabase client
  supabase/server.ts        # Server Supabase client (RSC/API routes)
  supabase/middleware.ts     # Session refresh helper
supabase/migrations/        # SQL migration files (001–003: initial_schema, api_keys, agent_first_registration)
skill/SKILL.md              # OpenClaw skill for agent self-registration via API
__tests__/                  # Vitest tests (mirrors source structure)
  helpers/factories.ts      # Test data factories
  helpers/render.ts         # Custom render with re-exports
```

### Path Aliases

`@/*` maps to the project root (e.g., `@/components/ui/button`, `@/lib/utils`).

### Key Patterns

- **Auth flow:** Google OAuth via Supabase → `auth/callback` exchanges code for session → DB trigger auto-creates user record → redirects to dashboard. Login/logout use server actions in `app/login/actions.ts`.
- **Agent ownership:** `agents.owner_ids` is a `uuid[]` array supporting multiple owners. Queries use `.contains("owner_ids", [userId])` for filtering, `auth.uid() = ANY(owner_ids)` in RLS policies, and GIN index for performance.
- **Agent slugs:** Auto-generated from agent name via `generateSlug()` in `lib/validations.ts`
- **API routes (session auth):** `app/api/agents/` uses Supabase session auth via `requireAuth()`. Returns `ApiResponse<T>` or `ApiError` types.
- **API routes (API key auth):** `app/api/v1/agents/` uses Bearer token auth via `authenticateApiKey()` from `lib/api-auth.ts`. Uses `supabaseAdmin` (service_role) for DB access. Separate Zod schemas with stricter validation (slug required, description max 500 chars).
- **Agent-first registration:** Agents register themselves via `POST /api/v1/agents/register` (no auth required). Returns an API key + claim URL. Agent manages its own profile via `/api/v1/agents/me` with Bearer token auth (key stored as `agents.api_key_hash`). Human claims ownership via `/claim/[token]` page with Google OAuth. Claiming sets `owner_ids` and `status='claimed'`.
- **Dual auth system:** User API keys (`api_keys` table, `cp_` prefix) for human-driven operations via `authenticateApiKey()`. Agent-embedded keys (`agents.api_key_hash`) for agent self-management via `authenticateAgentApiKey()`. Both use Bearer token auth but resolve to different entities.
- **API key management:** `api_keys` table stores SHA-256 hashed keys. Keys use `cp_` prefix. Dashboard internal API at `/api/dashboard/api-keys/` uses session auth. Max 5 active keys per user.
- **RLS:** Agents are publicly readable; only authenticated owners can create/update/delete their own agents. `api_keys` are scoped to their owner via RLS.
- **Data fetching:** Profile pages use a two-step fetch (agent query + separate users query by `owner_ids`) since PostgREST cannot join on array foreign keys.
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

## Don't
- Never udpate components in `/components/ui/`