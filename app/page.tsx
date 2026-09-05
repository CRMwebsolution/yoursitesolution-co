import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Check,
  Code2,
  MapPin,
  MessageSquareText,
  MoveRight,
} from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PricingCard } from "@/components/pricing-card";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Custom Websites for Small Businesses",
  description:
    "Affordable custom websites built around your business. Based in Newport, NC and serving small businesses nationwide.",
};

const websiteFeatures = [
  "Custom design and copy",
  "Contact forms",
  "Domain setup",
  "Basic SEO setup",
];

export default function Home() {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: "https://yoursitesolution.com",
    email: siteConfig.email,
    telephone: siteConfig.phoneHref,
    areaServed: "United States",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Newport",
      addressRegion: "NC",
      addressCountry: "US",
    },
    priceRange: "$300+",
  };

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <section className="home-hero section-dark">
        <div className="blueprint-grid" aria-hidden="true" />
        <div className="shell hero-layout">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">
              <MapPin aria-hidden="true" /> Newport, NC · Serving nationwide
            </p>
            <h1>
              A website built around <em>your business.</em>
            </h1>
            <p className="hero-lede">
              Custom websites for small businesses that need something clear,
              useful, and affordable—without being forced into a template or a
              platform you do not want.
            </p>
            <div className="hero-actions">
              <Link className="button" href="/contact">
                Tell me what you need <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="text-link text-link-light" href="/pricing">
                See straightforward pricing <MoveRight aria-hidden="true" />
              </Link>
            </div>
            <p className="hero-assurance">
              Basic websites: approve the finished preview before you pay.
            </p>
          </div>

          <div className="build-sheet" aria-label="Typical basic website details">
            <div className="sheet-topline">
              <span>BUILD SHEET</span>
              <span>YSS—001</span>
            </div>
            <div className="sheet-title">
              <span className="status-dot" />
              <div>
                <p>Basic business website</p>
                <strong>Ready in about 1 week</strong>
              </div>
            </div>
            <dl className="sheet-specs">
              <div>
                <dt>Build</dt>
                <dd>Custom</dd>
              </div>
              <div>
                <dt>Pages</dt>
                <dd>3–5</dd>
              </div>
              <div>
                <dt>Starting price</dt>
                <dd>$750</dd>
              </div>
              <div>
                <dt>Personal reply</dt>
                <dd>≤ 12 hrs</dd>
              </div>
            </dl>
            <div className="sheet-footer-line">
              <Code2 aria-hidden="true" />
              <span>Designed for the work your business actually does.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Service highlights">
        <div className="shell proof-grid">
          <p><strong>$300</strong><span>single-page sites</span></p>
          <p><strong>1 week</strong><span>typical basic build</span></p>
          <p><strong>2 rounds</strong><span>of revisions included</span></p>
          <p><strong>30 days</strong><span>post-launch support</span></p>
        </div>
      </section>

      <section className="section section-services">
        <div className="shell">
          <SectionHeading
            eyebrow="What I build"
            title={<>Start with the website. <span>Build from there.</span></>}
            description="You do not need to know the right technical words. Tell me the outcome you want, and I’ll work out the practical way to get there."
          />
          <div className="service-grid">
            <article className="service-panel service-panel-primary">
              <div className="service-number">01</div>
              <Code2 aria-hidden="true" />
              <h3>Custom websites</h3>
              <p>
                A site shaped around your business, your customers, and the action
                you want visitors to take.
              </p>
              <ul className="plain-check-list">
                {websiteFeatures.map((feature) => (
                  <li key={feature}><Check aria-hidden="true" />{feature}</li>
                ))}
              </ul>
              <Link className="text-link" href="/websites">
                See what is included <ArrowRight aria-hidden="true" />
              </Link>
            </article>
            <article className="service-panel service-panel-secondary">
              <div className="service-number">02</div>
              <Bot aria-hidden="true" />
              <h3>Business automation</h3>
              <p>
                When a repeated task is stealing time, I can connect the pieces and
                make the handoff happen automatically.
              </p>
              <ul className="plain-check-list">
                {siteConfig.automationExamples.slice(0, 3).map((feature) => (
                  <li key={feature}><Check aria-hidden="true" />{feature}</li>
                ))}
              </ul>
              <Link className="text-link" href="/automation">
                Explore automation <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-process section-dark">
        <div className="shell">
          <SectionHeading
            light
            eyebrow="How it works"
            title={<>Simple enough to explain <span>in three steps.</span></>}
          />
          <ol className="process-list">
            <li>
              <span>01</span>
              <div><h3>Tell me about the business.</h3><p>You supply the facts, goals, and must-haves. Plain English is fine.</p></div>
            </li>
            <li>
              <span>02</span>
              <div><h3>I build the preview.</h3><p>I turn those details into a custom site. You review the full result and check every fact.</p></div>
            </li>
            <li>
              <span>03</span>
              <div><h3>Approve, pay, and launch.</h3><p>For basic sites, you do not pay until the preview is ready and you decide to move forward.</p></div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section section-pricing-preview">
        <div className="shell">
          <SectionHeading
            eyebrow="Clear starting points"
            title={<>Custom does not have to mean <span>unaffordable.</span></>}
            description="Pay in full or spread the build cost across one year. The payment plan costs 20% more, and build payments end after month twelve."
          />
          <div className="pricing-grid">
            <PricingCard
              name={siteConfig.pricing.singlePage.name}
              price={siteConfig.pricing.singlePage.price}
              description={siteConfig.pricing.singlePage.description}
              payments={["$30 / month × 12", "$90 / quarter × 4"]}
              features={["Custom single-page design", "Contact form", "Mobile-ready", "Basic SEO setup"]}
            />
            <PricingCard
              featured
              name={siteConfig.pricing.basic.name}
              price={siteConfig.pricing.basic.price}
              description={siteConfig.pricing.basic.description}
              payments={["$75 / month × 12", "$225 / quarter × 4"]}
              features={["3–5 custom pages", "Copy built from your facts", "Domain setup", "30 days of support"]}
            />
          </div>
          <div className="pricing-footnote">
            <p>Need a store, dashboard, payment flow, or custom system?</p>
            <Link className="text-link" href="/pricing">See full pricing details <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section about-section">
        <div className="shell about-grid">
          <div className="about-stamp" aria-hidden="true">
            <span>BUILT IN</span>
            <strong>NC</strong>
            <span>FOR BUSINESS</span>
          </div>
          <div className="about-copy">
            <p className="eyebrow">Who you are working with</p>
            <h2>A builder, not a sales department.</h2>
            <p className="about-lede">
              I’m Cody. I build websites and automations from Newport, North Carolina,
              because I enjoy the work and I’m good at it.
            </p>
            <p>
              You talk directly to the person doing the work. I also know what it is
              like to run a real local business through my work with 3M Trailer Rental,
              so the goal is not a pretty website for its own sake. It is a useful tool
              that makes sense for the business behind it.
            </p>
            <div className="quote-block">
              <MessageSquareText aria-hidden="true" />
              <p>What I want customers to say</p>
              <blockquote>
                “I told him what I needed. He built it quickly, kept it affordable,
                and I didn’t have to chase him down.”
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
