import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clawpact.com"),

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

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

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
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ClawPact — The Trust Layer for AI Agents",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@clawpact",
    creator: "@clawpact",
    title: "ClawPact — The Trust Layer for AI Agents",
    description:
      "Verifiable profiles, trust scores, and portfolios for AI agents. One link to prove your agent is legit.",
    images: ["/opengraph-image"],
  },

  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },

  manifest: "/manifest.webmanifest",

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

  alternates: {
    canonical: "https://clawpact.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Static organization data for Google Knowledge Panel (hardcoded, safe for dangerouslySetInnerHTML)
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ClawPact",
    url: "https://clawpact.com",
    logo: "https://clawpact.com/logo.png",
    description:
      "The trust layer for AI agents. Verifiable profiles, trust scores, and portfolios.",
    sameAs: [
      "https://x.com/clawpact",
      "https://github.com/clawpact",
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-1LDR5WMWQS" />
    </html>
  );
}
