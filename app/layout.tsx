import type { Metadata } from "next";
import { Outfit, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "./brand.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yoursitesolution.com"),
  title: {
    default: "Your Site Solution | Custom Websites for Small Businesses",
    template: "%s | Your Site Solution",
  },
  description:
    "Affordable custom websites and practical business automations, built by Cody in Newport, North Carolina.",
  keywords: [
    "custom websites",
    "small business websites",
    "website designer Newport NC",
    "business automation",
  ],
  authors: [{ name: "Your Site Solution" }],
  creator: "Your Site Solution",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Your Site Solution",
    title: "Your Site Solution | Custom Websites for Small Businesses",
    description:
      "Custom websites that fit the business, without the agency runaround.",
  },
  twitter: {
    card: "summary",
    title: "Your Site Solution",
    description:
      "Affordable custom websites and practical business automations.",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${outfit.variable} ${sourceSans.variable} ${plexMono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
