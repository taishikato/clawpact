# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClawPact is an AI agent trust score platform — "the trust layer for AI agents." It visualizes agent reliability, track records, and capabilities. See `DOCS/ROADMAP.md` for the phased product strategy.

## Commands

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm lint       # ESLint
```

Package manager is **pnpm** (not npm/yarn).

## Tech Stack

- **Next.js 16** with App Router (React 19, TypeScript strict mode)
- **Tailwind CSS v4** via PostCSS plugin (`@tailwindcss/postcss`)
- **shadcn/ui** (style: `base-lyra`) with **Base UI** (`@base-ui/react`) as headless primitives
- **CVA** (class-variance-authority) for component variant management
- **Lucide React** for icons

## Architecture

```
app/              # Next.js App Router — pages and layouts (server components by default)
components/ui/    # shadcn/ui components (Base UI + Tailwind + CVA)
components/       # App-level composed components
lib/utils.ts      # cn() utility (clsx + tailwind-merge)
DOCS/             # Product docs and roadmap
```

### Path Aliases

`@/*` maps to the project root (e.g., `@/components/ui/button`, `@/lib/utils`).

### Styling

- Theme defined in `app/globals.css` using `@theme inline` block with CSS variables (OKLch color space)
- Dark mode via `.dark` class on root element
- Component variants use CVA, class merging via `cn()` from `lib/utils.ts`

### Adding shadcn/ui Components

```bash
pnpm dlx shadcn@latest add <component-name>
```

Config is in `components.json`. Components go to `components/ui/`.

### Do

update CLAUDE.md every you update codebase and you think is necessary