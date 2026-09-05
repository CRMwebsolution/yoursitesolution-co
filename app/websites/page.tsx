import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleDollarSign, Clock3, Search } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Custom Websites",
  description:
    "Affordable custom websites for small businesses, including copy, forms, domain setup, basic SEO, revisions, and launch support.",
};

const included = [
  ["Custom website", "Designed for your business instead of squeezed into a prebuilt theme."],
  ["Copy", "You supply the facts. I shape them into clear website copy for you to review."],
  ["Forms", "Contact or inquiry forms built around the information you actually need."],
  ["Domain setup", "The technical connection between your domain and the finished site."],
  ["Basic SEO", "Titles, headings, metadata, schema, sitemap, and Search Console setup."],
  ["Google Business guidance", "A walkthrough of how to create or improve your profile."],
  ["Two revision rounds", "Two focused rounds after the initial facts and copy are agreed on."],
  ["Mobile-ready build", "Designed to work cleanly on phones, tablets, and desktop screens."],
  ["Launch", "I handle publishing and make sure the finished site is working."],
  ["30 days of support", "Post-launch help is included for the first thirty days."],
];

export default function WebsitesPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Custom websites"
        title={<>Made for the business. <em>Not the platform.</em></>}
        description="You should not have to change how your business works to fit a website builder. I start with what your customers need to understand and what you need the site to do."
        aside={
          <div className="hero-aside-stack">
            <p><span>Starting at</span><strong>$300</strong></p>
            <p><span>Basic turnaround</span><strong>1 week</strong></p>
          </div>
        }
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Included in a basic build"
            title={<>The useful parts are <span>already included.</span></>}
            description="The exact shape depends on the project, but every basic site starts with the work needed to make it credible, clear, and ready to use."
          />
          <div className="inclusion-grid">
            {included.map(([title, description], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell detail-grid">
          <div>
            <p className="eyebrow">From facts to finished copy</p>
            <h2>You know the business. I make it make sense online.</h2>
          </div>
          <div className="prose-stack">
            <p>
              Send the facts, services, service area, contact details, and anything
              customers need to know. I decide how to organize and present it, then
              you review the preview and change anything that is not right.
            </p>
            <p>
              Getting the facts and initial copy right does not use up your two revision
              rounds. Before launch, you are responsible for checking names, prices,
              hours, claims, and every other business detail in the preview.
            </p>
            <p>
              If I publish something differently from what you supplied and approved,
              I correct it for free. Corrections to my mistakes are always free.
            </p>
          </div>
        </div>
      </section>

      <section className="section expectations-section">
        <div className="shell">
          <SectionHeading
            eyebrow="Straight answers"
            title={<>What to expect <span>before and after launch.</span></>}
          />
          <div className="expectation-grid">
            <article>
              <Clock3 aria-hidden="true" />
              <h3>Fast, realistic timing</h3>
              <p>A basic 3–5 page site is usually ready in one week. Rush and larger projects are quoted around the actual scope.</p>
            </article>
            <article>
              <CircleDollarSign aria-hidden="true" />
              <h3>No gamble on a basic site</h3>
              <p>Review the completed preview first. Pay in full or make the first scheduled payment when you decide to launch.</p>
            </article>
            <article>
              <Search aria-hidden="true" />
              <h3>SEO without fairy tales</h3>
              <p>I build the technical foundation. No one can promise rankings, and a site still needs active promotion to earn attention.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell split-callout">
          <div>
            <p className="eyebrow eyebrow-light">Need more than the basic build?</p>
            <h2>A small store, admin dashboard, booking flow, or custom feature can be scoped separately.</h2>
          </div>
          <div>
            <ul className="check-list check-list-light">
              <li><Check aria-hidden="true" />Small custom catalogs and straightforward checkout</li>
              <li><Check aria-hidden="true" />Business-facing admin dashboards</li>
              <li><Check aria-hidden="true" />Payment and booking integrations</li>
              <li><Check aria-hidden="true" />Features built for a specific workflow</li>
            </ul>
            <Link className="button" href="/contact">Describe the project <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Ready for a better site?"
        title="Start with the facts."
        text="Tell me about the business, what the site needs to do, and when you need it. I’ll take it from there."
      />
    </main>
  );
}
