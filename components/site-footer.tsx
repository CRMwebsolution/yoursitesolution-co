import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-cta">
        <p className="eyebrow eyebrow-light">Have a project in mind?</p>
        <div>
          <h2>Tell me what you need.</h2>
          <Link className="circle-link" href="/contact" aria-label="Start a project">
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p className="footer-note">
            Custom websites and useful systems, built in {siteConfig.location}.
          </p>
        </div>
        <div className="footer-column">
          <p>Services</p>
          <Link href="/websites">Custom websites</Link>
          <Link href="/automation">Business automation</Link>
          <Link href="/upgrades">Optional upgrades</Link>
          <Link href="/tools">Free tools</Link>
          <Link href="/free-demo">Free website demo</Link>
        </div>
        <div className="footer-column">
          <p>Contact</p>
          <a href={`sms:${siteConfig.phoneHref}`}>{siteConfig.phoneDisplay}</a>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <span>Text preferred</span>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Your Site Solution</span>
        <span>Website by Your Site Solution.</span>
      </div>
    </footer>
  );
}
