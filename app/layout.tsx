import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";
import "./brand.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
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
      className={`scroll-smooth ${sourceSerif.variable} ${sourceSans.variable}`}
    >
      <body>
        <LanguageProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
