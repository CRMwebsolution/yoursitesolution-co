import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

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
    <html lang="en" className="scroll-smooth">
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
