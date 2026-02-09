# ClawPact SEO Strategy

> Comprehensive SEO metadata strategy for clawpact.com — "The Trust Layer for AI Agents"

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [Priority-Ordered Recommendations](#2-priority-ordered-recommendations)
3. [Root Layout Metadata (metadataBase + Defaults)](#3-root-layout-metadata)
4. [Per-Page Metadata](#4-per-page-metadata)
5. [robots.ts Configuration](#5-robotsts-configuration)
6. [sitemap.ts Configuration](#6-sitemapts-configuration)
7. [JSON-LD Structured Data](#7-json-ld-structured-data)
8. [Dynamic OG Image Generation](#8-dynamic-og-image-generation)
9. [Keyword Strategy](#9-keyword-strategy)
10. [Technical Fixes](#10-technical-fixes)
11. [Web Manifest](#11-web-manifest)
12. [Favicon & Icons](#12-favicon--icons)
13. [Implementation Checklist](#13-implementation-checklist)

---

## 1. Current State Audit

### What Exists

| File | Metadata | Issues |
|------|----------|--------|
| `app/layout.tsx` | Basic `title` + `description` | No `metadataBase`, no title template, no OG/Twitter defaults, no icons |
| `app/page.tsx` | **None** | `"use client"` directive prevents metadata export |
| `app/agents/[slug]/page.tsx` | `generateMetadata` with basic OG/Twitter | Missing: JSON-LD, canonical URL, keywords, OG images |
| `app/login/page.tsx` | **None** | `"use client"` directive prevents metadata export |
| `app/dashboard/page.tsx` | **None** | `"use client"` directive; should be `noindex` regardless |
| `app/robots.ts` | **Does not exist** | Search engines have no crawl directives |
| `app/sitemap.ts` | **Does not exist** | Search engines can't discover pages efficiently |
| `public/` | Only default SVGs + `favicon.ico` | No apple-touch-icon, no OG image assets |
| `app/manifest.ts` | **Does not exist** | No PWA support |

### What's Missing (Critical)

- `metadataBase` — all relative URLs in metadata resolve incorrectly
- Title template — no consistent `%s | ClawPact` pattern
- Default Open Graph — social shares from non-agent pages have no preview
- Default Twitter card — no `@clawpact` attribution
- `robots.ts` — no crawl directives at all
- `sitemap.ts` — Googlebot can't efficiently discover agent profile pages
- JSON-LD — missing rich snippets for agent profiles (the most valuable pages)
- Canonical URLs — potential duplicate content issues
- Landing page has zero metadata (the most important page for brand searches)

---

## 2. Priority-Ordered Recommendations

### P0 — Critical (Do First)

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 1 | Add `metadataBase` to root layout | Fixes all relative URL resolution for OG images, canonicals | 5 min |
| 2 | Add title template `%s | ClawPact` to root layout | Consistent branding across all pages | 5 min |
| 3 | Add default OG + Twitter metadata to root layout | Every page gets social sharing fallback | 10 min |
| 4 | Create `app/robots.ts` | Allows search engines to crawl correctly | 10 min |
| 5 | Create `app/sitemap.ts` | Enables efficient page discovery by Googlebot | 15 min |
| 6 | Extract landing page to server component + add metadata | Landing page (highest traffic) gets indexed properly | 30 min |
| 7 | Add canonical URLs to agent profile pages | Prevents duplicate content | 5 min |

### P1 — Important (Do Next)

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 8 | Add JSON-LD structured data to agent profiles | Rich snippets in search results | 20 min |
| 9 | Create dynamic OG image (`app/agents/[slug]/opengraph-image.tsx`) | Per-agent social preview cards | 30 min |
| 10 | Add metadata to login page (via layout or server wrapper) | Proper title/description for login | 10 min |
| 11 | Add `noindex` to dashboard pages | Prevents indexing of private pages | 5 min |
| 12 | Create `app/manifest.ts` for PWA support | Mobile add-to-homescreen, brand consistency | 10 min |

### P2 — Nice to Have

| # | Item | Impact | Effort |
|---|------|--------|--------|
| 13 | Add apple-touch-icon and multiple favicon sizes | Better mobile/tablet appearance | 15 min |
| 14 | Add Google Search Console verification meta tag | Enables GSC monitoring | 5 min |
| 15 | Add hreflang if i18n is planned | Future-proofing for internationalization | N/A |
| 16 | Add JSON-LD `Organization` schema to root layout | Brand knowledge panel in Google | 10 min |
| 17 | Create a default OG image asset (`public/og-default.png`) | Fallback social image for all pages | 15 min |

---

## 3. Root Layout Metadata

Replace the current minimal metadata in `app/layout.tsx` with a comprehensive default:

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  // Base URL for resolving relative metadata URLs (OG images, canonicals, etc.)
  metadataBase: new URL("https://clawpact.com"),

  // Title template: child pages use `title: "Page Name"` and get "Page Name | ClawPact"
  title: {
    template: "%s | ClawPact",
    default: "ClawPact — The Trust Layer for AI Agents",
  },

  description:
    "Should you trust this agent? ClawPact provides verifiable profiles, trust scores, and portfolios for AI agents. One link to prove your agent is legit.",

  keywords: [
    "AI agent trust",
    "AI agent profiles",
    "AI agent verification",
    "trust score AI agents",
    "AI agent portfolio",
    "AI agent reputation",
    "AI agent directory",
  ],

  authors: [{ name: "ClawPact" }],
  creator: "ClawPact",
  publisher: "ClawPact",

  // Format detection — prevent auto-linking of phone numbers/emails
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Default Open Graph (inherited by all pages unless overridden)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://clawpact.com",
    siteName: "ClawPact",
    title: "ClawPact — The Trust Layer for AI Agents",
    description:
      "Verifiable profiles, trust scores, and portfolios for AI agents. One link to prove your agent is legit.",
    images: [
      {
        url: "/og-default.png",   // Resolved via metadataBase to https://clawpact.com/og-default.png
        width: 1200,
        height: 630,
        alt: "ClawPact — The Trust Layer for AI Agents",
      },
    ],
  },

  // Default Twitter card
  twitter: {
    card: "summary_large_image",
    site: "@clawpact",
    creator: "@clawpact",
    title: "ClawPact — The Trust Layer for AI Agents",
    description:
      "Verifiable profiles, trust scores, and portfolios for AI agents. One link to prove your agent is legit.",
    images: ["/og-default.png"],
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Web manifest for PWA
  manifest: "/manifest.webmanifest",

  // Default robots (index + follow for all pages; override per-page as needed)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical alternates
  alternates: {
    canonical: "https://clawpact.com",
  },

  // Verification (add your real codes after setting up GSC)
  // verification: {
  //   google: "your-google-site-verification-code",
  // },
};
```

### Why This Matters

- **`metadataBase`**: Without this, relative URLs in `openGraph.images` and `alternates.canonical` don't resolve. Next.js needs a base URL to construct absolute URLs for OG meta tags.
- **`title.template`**: Every child page just exports `title: "Page Name"` and automatically gets `"Page Name | ClawPact"`. Consistent branding with zero effort.
- **Default OG/Twitter**: Any page that doesn't define its own OG gets a branded social preview. Currently, sharing any non-agent page on X/LinkedIn shows nothing.

---

## 4. Per-Page Metadata

### 4a. Landing Page (`app/page.tsx`)

**Problem:** Currently `"use client"` — cannot export `metadata` or `generateMetadata`.

**Solution:** Split into a server component page + client component content. See [Section 10: Technical Fixes](#10-technical-fixes).

```tsx
// app/page.tsx (server component — NO "use client")
import type { Metadata } from "next";
import { LandingPageContent } from "@/components/landing-page-content";

export const metadata: Metadata = {
  title: "ClawPact — The Trust Layer for AI Agents",
  description:
    "Should you trust this agent? ClawPact provides shareable profiles, trust scores, and portfolios for AI agents. Register your agent in seconds.",
  alternates: {
    canonical: "https://clawpact.com",
  },
  openGraph: {
    title: "ClawPact — The Trust Layer for AI Agents",
    description:
      "Verifiable profiles, trust scores, and portfolios for AI agents. One link to prove your agent is legit.",
    url: "https://clawpact.com",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "ClawPact — The Trust Layer for AI Agents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawPact — The Trust Layer for AI Agents",
    description:
      "Verifiable profiles, trust scores, and portfolios for AI agents. One link to prove your agent is legit.",
  },
};

export default function Page() {
  return <LandingPageContent />;
}
```

> **Note:** The landing page title uses the `absolute` form implicitly because the root layout `title.default` already matches. If you want to force it, use `title: { absolute: "ClawPact — The Trust Layer for AI Agents" }`.

### 4b. Agent Profile Page (`app/agents/[slug]/page.tsx`)

**Enhanced `generateMetadata`:**

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = getMockAgent(slug); // Replace with real DB call
  if (!agent) return { title: "Agent Not Found" };

  const title = agent.name;
  const description = agent.description.length > 160
    ? agent.description.slice(0, 157) + "..."
    : agent.description;
  const url = `https://clawpact.com/agents/${agent.slug}`;

  return {
    title, // Becomes "AgentName | ClawPact" via template
    description,
    keywords: [
      agent.name,
      "AI agent",
      "trust score",
      ...agent.skills.slice(0, 5),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${agent.name} — AI Agent Profile`,
      description,
      url,
      type: "profile",
      images: [
        {
          url: `/agents/${agent.slug}/opengraph-image`, // Dynamic OG image route
          width: 1200,
          height: 630,
          alt: `${agent.name} — AI Agent Profile on ClawPact`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${agent.name} — AI Agent Profile`,
      description,
      images: [`/agents/${agent.slug}/opengraph-image`],
    },
  };
}
```

### 4c. Login Page (`app/login/page.tsx`)

**Problem:** `"use client"` — cannot export metadata.

**Solution:** Add a `layout.tsx` in the login directory:

```tsx
// app/login/layout.tsx (server component)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",  // Becomes "Sign In | ClawPact"
  description: "Sign in with Google to register and manage your AI agents on ClawPact.",
  robots: {
    index: false,  // Login pages shouldn't be indexed
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### 4d. Dashboard Page (`app/dashboard/page.tsx`)

**Problem:** `"use client"` and should be `noindex`.

**Solution:** Add a `layout.tsx` in the dashboard directory:

```tsx
// app/dashboard/layout.tsx (server component)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",  // Becomes "Dashboard | ClawPact"
  description: "Manage your registered AI agents on ClawPact.",
  robots: {
    index: false,   // Private dashboard — never index
    follow: false,
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {children}
    </div>
  );
}
```

---

## 5. robots.ts Configuration

Create `app/robots.ts`:

```tsx
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",        // Block API routes
          "/dashboard/",  // Block authenticated dashboard
          "/login/",      // Block login page
        ],
      },
    ],
    sitemap: "https://clawpact.com/sitemap.xml",
    host: "https://clawpact.com",
  };
}
```

### What This Does

- **Allows** all crawlers to index `/` (landing), `/agents/*` (profiles)
- **Blocks** `/api/` (REST endpoints), `/dashboard/` (private), `/login/` (auth)
- **Points** to sitemap for efficient URL discovery
- **Declares** canonical host to prevent www vs non-www issues

---

## 6. sitemap.ts Configuration

Create `app/sitemap.ts`:

```tsx
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://clawpact.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Dynamic agent pages
  // TODO: Replace with real Supabase query:
  // const { data: agents } = await supabase.from('agents').select('slug, updated_at');
  const agents = [
    { slug: "codereview-pro", updated_at: "2025-01-20T10:00:00Z" },
    { slug: "datapipeline-agent", updated_at: "2025-02-01T14:30:00Z" },
    { slug: "researchbot", updated_at: "2025-02-05T09:15:00Z" },
  ];

  const agentPages: MetadataRoute.Sitemap = agents.map((agent) => ({
    url: `https://clawpact.com/agents/${agent.slug}`,
    lastModified: new Date(agent.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...agentPages];
}
```

### Scaling Strategy

When the number of agents exceeds 50,000 (Google's per-sitemap limit), use `generateSitemaps`:

```tsx
// app/sitemap.ts (future — when agents exceed 50,000)
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  const totalAgents = await getAgentCount();
  const sitemapCount = Math.ceil(totalAgents / 50000);
  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }));
}

export default async function sitemap(
  props: { id: Promise<string> }
): Promise<MetadataRoute.Sitemap> {
  const id = Number(await props.id);
  const start = id * 50000;
  const agents = await getAgentsBatch(start, 50000);

  return agents.map((agent) => ({
    url: `https://clawpact.com/agents/${agent.slug}`,
    lastModified: new Date(agent.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}
```

---

## 7. JSON-LD Structured Data

### 7a. Agent Profile — `SoftwareApplication` Schema

Add to `app/agents/[slug]/page.tsx` inside the page component. The JSON-LD is rendered
as a `<script type="application/ld+json">` tag, which is the Next.js-recommended approach
(see https://nextjs.org/docs/app/guides/json-ld). The `.replace(/</g, "\\u003c")` call
sanitizes the output to prevent XSS injection per the official docs.

```tsx
export default async function AgentProfilePage({ params }: Props) {
  const { slug } = await params;
  const agent = getMockAgent(slug);
  if (!agent) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: agent.name,
    description: agent.description,
    url: `https://clawpact.com/agents/${agent.slug}`,
    applicationCategory: "AI Agent",
    operatingSystem: "Cloud",
    author: {
      "@type": "Person",
      name: agent.owner.name,
    },
    ...(agent.moltbook_karma !== null && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Math.min(5, agent.moltbook_karma / 1000).toFixed(1),
        bestRating: "5",
        ratingCount: 1,
      },
    }),
    datePublished: agent.created_at,
    dateModified: agent.updated_at,
    keywords: agent.skills.join(", "),
    ...(agent.website_url && { sameAs: agent.website_url }),
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      {/* JSON-LD structured data for search engine rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* ... rest of page content */}
    </main>
  );
}
```

### 7b. Organization Schema (Root Layout)

Add to `app/layout.tsx` body:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClawPact",
    url: "https://clawpact.com",
    logo: "https://clawpact.com/logo.png",
    description: "The trust layer for AI agents. Verifiable profiles, trust scores, and portfolios.",
    sameAs: [
      "https://x.com/clawpact",
      "https://github.com/clawpact",
    ],
  };

  return (
    <html lang="en">
      <body>
        {/* Organization JSON-LD for Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        <Nav />
        {children}
      </body>
    </html>
  );
}
```

### 7c. Landing Page — `WebSite` Schema with SearchAction

Add to the landing page component:

```tsx
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ClawPact",
  url: "https://clawpact.com",
  description: "The trust layer for AI agents.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://clawpact.com/agents/{search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};
```

### JSON-LD Validation

After implementation, validate with:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

---

## 8. Dynamic OG Image Generation

Create `app/agents/[slug]/opengraph-image.tsx` for per-agent social preview cards:

```tsx
// app/agents/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getMockAgent } from "@/lib/mock-data";

export const alt = "Agent Profile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = getMockAgent(slug);

  if (!agent) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090b",
            color: "#fafafa",
            fontSize: 48,
            fontWeight: 600,
          }}
        >
          Agent Not Found
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 60,
          backgroundColor: "#09090b",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: ClawPact branding */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, color: "#a1a1aa" }}>
          <span>ClawPact</span>
        </div>

        {/* Center: Agent info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
            {agent.name}
          </div>
          <div style={{ fontSize: 24, color: "#a1a1aa", maxWidth: 800, lineHeight: 1.4 }}>
            {agent.description.length > 120
              ? agent.description.slice(0, 117) + "..."
              : agent.description}
          </div>
          {/* Skills */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {agent.skills.slice(0, 4).map((skill) => (
              <div
                key={skill}
                style={{
                  padding: "6px 16px",
                  backgroundColor: "#27272a",
                  borderRadius: 4,
                  fontSize: 16,
                  color: "#d4d4d8",
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: owner + URL */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 18, color: "#a1a1aa" }}>
            by {agent.owner.name}
          </div>
          <div style={{ fontSize: 18, color: "#71717a" }}>
            clawpact.com/agents/{agent.slug}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
```

### Also Create a Default OG Image

Create `public/og-default.png` (1200x630px) with:
- ClawPact logo
- Tagline: "The Trust Layer for AI Agents"
- Clean dark background matching the site theme
- URL: clawpact.com

This serves as the fallback for any page that doesn't have a dynamic OG image.

---

## 9. Keyword Strategy

### Primary Keywords (Use in Titles, H1s, Descriptions)

| Keyword | Monthly Search Volume (Est.) | Difficulty | Target Page |
|---------|------------------------------|------------|-------------|
| AI agent trust | Low (emerging) | Low | Landing page |
| AI agent profiles | Low (emerging) | Low | Landing page, Agent pages |
| AI agent verification | Low (emerging) | Low | Landing page |
| trust score AI agents | Very low | Very low | Landing page |
| AI agent reputation | Low | Low | Landing page |

### Secondary Keywords (Use in Body Copy, Skills, Descriptions)

| Keyword | Target Page |
|---------|-------------|
| AI agent directory | Landing page |
| AI agent portfolio | Landing page, Agent pages |
| AI agent builder | Agent profile pages |
| automated code review agent | Agent-specific (CodeReview Pro) |
| AI agent benchmarks | Future — Phase 3 |
| AI agent security audit | Future — Phase 3 |

### Long-Tail Keywords (Natural Use in Content)

- "should you trust this AI agent"
- "how to verify AI agent reliability"
- "AI agent trust score platform"
- "shareable AI agent profile"
- "verified AI agent directory"

### Per-Page Keyword Mapping

| Page | Primary Keywords | Secondary Keywords |
|------|------------------|--------------------|
| Landing (`/`) | AI agent trust, AI agent profiles, trust layer AI agents | AI agent verification, agent reputation |
| Agent Profile (`/agents/[slug]`) | `{agent.name}`, AI agent, trust score | `{agent.skills}`, AI agent profile |
| Login (`/login`) | N/A (noindex) | N/A |
| Dashboard (`/dashboard`) | N/A (noindex) | N/A |

---

## 10. Technical Fixes

### Fix 1: Landing Page — Remove `"use client"` (P0)

**Current problem:** `app/page.tsx` has `"use client"` at the top, which prevents exporting `metadata` or `generateMetadata`.

**Solution:** Extract the interactive JSX into a client component, keep the page as a server component.

**Steps:**
1. Move the content of `app/page.tsx` into `components/landing-page-content.tsx` (keep `"use client"`)
2. Replace `app/page.tsx` with a server component that imports and renders `<LandingPageContent />`
3. Export `metadata` from the new server component `app/page.tsx`

```tsx
// components/landing-page-content.tsx
"use client"
// ... (all current content from app/page.tsx)
export function LandingPageContent() {
  return <main>...</main>;
}
```

```tsx
// app/page.tsx (server component)
import type { Metadata } from "next";
import { LandingPageContent } from "@/components/landing-page-content";

export const metadata: Metadata = {
  // ... (see Section 4a)
};

export default function Page() {
  return <LandingPageContent />;
}
```

> **Note:** The landing page doesn't actually use any client-side hooks (useState, useEffect, etc.) or event handlers. It only uses `"use client"` because it imports Lucide icons. Since Lucide icons work fine in Server Components (they're just SVGs), you may be able to simply **remove `"use client"`** entirely without any code changes. Test this first — it's the simplest fix.

### Fix 2: Login Page — Add Metadata via Layout (P1)

The login page uses client-side rendering for the OAuth button. Rather than restructuring, add metadata via a co-located layout:

```tsx
// app/login/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in with Google to register and manage your AI agents on ClawPact.",
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### Fix 3: Dashboard — Add noindex via Layout (P1)

```tsx
// app/dashboard/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your registered AI agents.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {children}
    </div>
  );
}
```

---

## 11. Web Manifest

Create `app/manifest.ts`:

```tsx
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClawPact — The Trust Layer for AI Agents",
    short_name: "ClawPact",
    description: "Verifiable profiles, trust scores, and portfolios for AI agents.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
```

---

## 12. Favicon & Icons

### Required Assets (create in `public/`)

| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 32x32 | Browser tab icon (already exists) |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `icon-192.png` | 192x192 | Android/PWA |
| `icon-512.png` | 512x512 | PWA splash screen |
| `og-default.png` | 1200x630 | Default social sharing image |

### Alternative: File-Based Metadata

Instead of configuring icons in the metadata object, Next.js supports file-based icons:

```
app/
  favicon.ico          → Already exists
  icon.png             → Favicon (auto-detected)
  apple-icon.png       → Apple touch icon (auto-detected)
```

Place these in the `app/` directory and Next.js will automatically add the correct `<link>` tags.

---

## 13. Implementation Checklist

### Phase 1: P0 Items (Do Immediately)

- [ ] Update `app/layout.tsx` with full metadata config (metadataBase, title template, OG defaults, Twitter defaults, icons, robots)
- [ ] Add Organization JSON-LD to `app/layout.tsx`
- [ ] Create `app/robots.ts`
- [ ] Create `app/sitemap.ts`
- [ ] Refactor `app/page.tsx` — remove `"use client"`, extract to `components/landing-page-content.tsx`, add metadata
- [ ] Update `app/agents/[slug]/page.tsx` — enhance generateMetadata with canonical, keywords
- [ ] Create `public/og-default.png` (1200x630 branded image)

### Phase 2: P1 Items (Next Sprint)

- [ ] Create `app/agents/[slug]/opengraph-image.tsx` for dynamic per-agent OG images
- [ ] Add JSON-LD structured data to agent profile page
- [ ] Create `app/login/layout.tsx` with noindex metadata
- [ ] Create `app/dashboard/layout.tsx` with noindex metadata
- [ ] Create `app/manifest.ts`
- [ ] Create icon assets: `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`

### Phase 3: P2 Items (Polish)

- [ ] Add WebSite JSON-LD with SearchAction to landing page
- [ ] Set up Google Search Console + add verification meta tag
- [ ] Monitor Core Web Vitals via GSC
- [ ] Submit sitemap to Google Search Console
- [ ] Validate all JSON-LD with Rich Results Test

---

## References

- [Next.js Metadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Metadata & OG Images Guide](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js robots.ts Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Next.js sitemap.ts Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld)
- [Next.js 16 SEO Configuration Guide](https://jsdevspace.substack.com/p/how-to-configure-seo-in-nextjs-16)
- [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
