# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Next.js App Router routes, layouts, and API handlers (`app/api/*`).
- `app/agents/[slug]` serves public agent profile pages; `app/dashboard` and `app/login` are authenticated flows.
- OAuth callback handler lives in `app/auth/callback/route.ts`; login actions live in `app/login/actions.ts`.
- `components/` contains app-level UI; `components/ui/` contains reusable shadcn/ui primitives.
- `lib/` contains shared logic (`auth.ts`, `validations.ts`, `types.ts`, `supabase/*`).
- `proxy.ts` wires Supabase session refresh middleware for request-time auth state.
- `__tests__/` mirrors runtime areas (`api`, `components`, `lib`, `helpers`).
- `supabase/migrations/` stores SQL schema/RLS migrations; `DOCS/` stores product and SEO docs (including `DOCS/ROADMAP.md`).

## Product Scope (Current Phase)
- Current target is **Phase 1 (MVP)** from `DOCS/ROADMAP.md`: shareable agent profiles, Google OAuth owner auth, registration APIs, and public profile pages.
- Keep remaining Phase 1 deliverables in scope when requested: Moltbook karma integration and OpenClaw skill-based registration distribution.
- Prioritize shipping and hardening Phase 1 flows before adding Phase 2+ ideas (reviews, paid tiers, trust-score benchmarks, enterprise APIs), unless explicitly requested.
- Keep API and UI changes aligned with Phase 1 success metrics: fast registration, accurate profile display, and stable shareable URLs.

## Build, Test, and Development Commands
Use `pnpm` for all workflows.
- `pnpm dev`: start local dev server (`http://localhost:3000`).
- `pnpm build`: build production assets.
- `pnpm start`: run the production server.
- `pnpm lint`: run ESLint (Next.js core-web-vitals + TypeScript config).
- `pnpm test`: run Vitest once.
- `pnpm test:watch`: run Vitest in watch mode.
- `pnpm test:coverage`: run tests with v8 coverage for `app/`, `lib/`, and `components/` (excluding `components/ui/`).

## Coding Style & Naming Conventions
- TypeScript is strict; keep exported APIs and route handlers strongly typed.
- Match existing formatting: 2-space indentation, semicolons, double quotes.
- Use `@/` import alias for project-root imports.
- Name React components in `PascalCase`; keep route segments filesystem-based (`[slug]`, `new`, etc.).
- Validate request payloads with Zod and keep API response shapes consistent with `lib/types.ts`.

## Testing Guidelines
- Test stack: Vitest + Testing Library (`jsdom`, `@testing-library/jest-dom`).
- File pattern: `__tests__/**/*.{test,spec}.{ts,tsx}`.
- Keep tests close in intent to source structure (example: `__tests__/api/agents.test.ts` for `app/api/agents/route.ts`).
- `__tests__/api/agents.test.ts` is currently scaffolded/skipped; implement or unskip relevant cases when changing `app/api/agents/*`.
- Add or update tests when changing auth behavior, validation logic, or API contracts.

## Commit & Pull Request Guidelines
- Existing history favors imperative commit subjects (example: `Add comprehensive SEO metadata...`).
- Prefer concise format: `<scope>: <imperative summary>` (example: `api: validate slug uniqueness`).
- PRs should include a short description, linked issue/task, verification steps (`pnpm lint`, relevant tests), and screenshots for UI changes.

## Security & Configuration Tips
- Keep secrets in local environment files only; do not commit credentials.
- Required runtime environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- `lib/env.ts` tests still reference `NEXT_PUBLIC_SUPABASE_ANON_KEY`; keep env naming consistent with the code paths you touch.
- When editing `supabase/migrations/*`, preserve or improve RLS policies for owner-linked records and `agents`, and keep ownership checks aligned with app logic.
