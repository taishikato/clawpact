# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds Next.js App Router routes, layouts, and API handlers (`app/api/*`).
- `app/agents/[slug]` serves public agent profile pages; `app/dashboard` and `app/login` are authenticated flows.
- `components/` contains app-level UI; `components/ui/` contains reusable shadcn/ui primitives.
- `lib/` contains shared logic (`auth.ts`, `validations.ts`, `types.ts`, `supabase/*`).
- `__tests__/` mirrors runtime areas (`api`, `components`, `lib`, `helpers`).
- `supabase/migrations/` stores SQL schema/RLS migrations; `DOCS/` stores product and SEO docs.

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
- Add or update tests when changing auth behavior, validation logic, or API contracts.

## Commit & Pull Request Guidelines
- Existing history favors imperative commit subjects (example: `Add comprehensive SEO metadata...`).
- Prefer concise format: `<scope>: <imperative summary>` (example: `api: validate slug uniqueness`).
- PRs should include a short description, linked issue/task, verification steps (`pnpm lint`, relevant tests), and screenshots for UI changes.

## Security & Configuration Tips
- Keep secrets in local environment files only; do not commit credentials.
- Required environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- When editing `supabase/migrations/*`, preserve or improve RLS policies for `owners` and `agents`.
