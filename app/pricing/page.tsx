import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { PricingCard } from "@/components/pricing-card";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Website Pricing",
  description:
    "Straightforward pricing for custom small-business websites, with pay-in-full, monthly, and quarterly options.",
};

const standardFeatures = [
  "Custom design",
  "Copy built from your facts",
  "Contact forms",
  "Domain setup",
  "Mobile-ready pages",
  "Basic SEO setup",
  "Google Business Profile guidance",
  "Two revision rounds",
  "30 days of post-launch support",
];

export default function PricingPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Pricing"
        title={<>Know the starting point <em>before we talk.</em></>}
        description="The prices below cover the most common website builds. If the work is larger or more specialized, you get one clear project price after we define the scope."
        aside={
          <div className="quote-note">
            <span>QUOTES STAY VALID FOR</span>
            <strong>1 MONTH</strong>
          </div>
        }
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Website build prices"
            title={<>Pay once or <span>spread it across a year.</span></>}
            description="Scheduled payments add 20% to the build price. After twelve months, there are no more build payments."
          />
          <div className="pricing-grid">
            <PricingCard
              name={siteConfig.pricing.singlePage.name}
              price={siteConfig.pricing.singlePage.price}
              description={siteConfig.pricing.singlePage.description}
              payments={["$30 / month × 12", "$90 / quarter × 4"]}
              features={["One custom page", "Contact form", "Mobile-ready", "Basic SEO setup"]}
            />
            <PricingCard
              featured
              name={siteConfig.pricing.basic.name}
              price={siteConfig.pricing.basic.price}
              description={siteConfig.pricing.basic.description}
              payments={["$75 / month × 12", "$225 / quarter × 4"]}
              features={["3–5 custom pages", "Contact form", "Domain setup", "30 days of support"]}
            />
          </div>
          <div className="payment-explainer">
            <Info aria-hidden="true" />
            <p>
              For a basic website, you review the completed preview first. The site is
              activated when you pay in full or make the first monthly or quarterly payment.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell custom-price-grid">
          <div>
            <p className="eyebrow">Custom scope</p>
            <h2>More moving parts get a custom quote.</h2>
            <p>
              Stores, dashboards, booking and payment flows, automations, and other
              specialized features are priced around the actual job.
            </p>
            <Link className="text-link" href="/contact">Describe the job <ArrowRight aria-hidden="true" /></Link>
          </div>
          <ul className="large-list">
            <li><span>01</span>Small custom ecommerce stores</li>
            <li><span>02</span>Admin dashboards</li>
            <li><span>03</span>Booking and payment integrations</li>
            <li><span>04</span>Business automations</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell inclusion-section">
          <SectionHeading
            eyebrow="Included"
            title={<>A basic site is a <span>complete site.</span></>}
            description="New pages, custom features, and integrations outside the original scope are quoted separately."
          />
          <ul className="feature-columns">
            {standardFeatures.map((feature) => (
              <li key={feature}><Check aria-hidden="true" />{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell care-plan-grid">
          <div>
            <p className="eyebrow eyebrow-light">Optional care plan</p>
            <div className="care-price"><strong>$25</strong><span>/ month</span></div>
          </div>
          <div>
            <h2>Small changes without a new quote every time.</h2>
            <p>
              Request routine updates—such as copy, hours, or photos—a couple of times
              per week across the website. Requests do not roll over, and you can cancel
              anytime.
            </p>
            <p className="muted-dark">
              New pages, features, integrations, and larger changes are quoted separately.
            </p>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="shell faq-grid">
          <div>
            <p className="eyebrow">Details worth knowing</p>
            <h2>No fine-print maze.</h2>
          </div>
          <div className="faq-list">
            <details>
              <summary>Are there ongoing costs?</summary>
              <p>Normal small-business hosting is included. If the site needs a paid database, review tool, or other managed platform, that ongoing price is included in your quote before work starts.</p>
            </details>
            <details>
              <summary>Who owns the domain?</summary>
              <p>If you buy the domain, you own it. If I buy and manage it, I maintain it as part of the service. If Your Site Solution ever stops operating, I transfer any domain I bought for you.</p>
            </details>
            <details>
              <summary>What access do I receive?</summary>
              <p>After payment in full or the first scheduled payment, you receive your DNS setup and any business-facing admin dashboard credentials included with the project, plus a walkthrough. Infrastructure and source-code access are not included.</p>
            </details>
            <details>
              <summary>Can I buy the source code?</summary>
              <p>Yes. Source code is available for ten times the normal build price. If Your Site Solution stops operating, active customers receive the source code for their sites without that charge.</p>
            </details>
            <details>
              <summary>What happens if a scheduled payment is missed?</summary>
              <p>You receive warnings and a chance to catch up. After two consecutive missed payments, paid services may be paused. After a third, there is a 30-day recovery window before project data may be removed.</p>
            </details>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Need an exact number?"
        title="Get a price for your project."
        text="Send the scope, timeline, and anything unusual. I’ll respond personally within twelve hours."
      />
    </main>
  );
}
