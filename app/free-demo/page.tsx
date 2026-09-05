import type { Metadata } from "next";
import { Check, Clock3, MousePointerClick } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Free Website Demo",
  description:
    "Request a personally approved, semi-functional homepage demo for your small business.",
};

export default function FreeDemoPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Free website demo"
        title={<>See the direction <em>before you commit.</em></>}
        description="For selected businesses, I’ll build a semi-functional homepage concept and walk you through it. No stock pitch deck—an actual direction for your actual business."
        aside={
          <div className="demo-ticket">
            <span>DEMO SCOPE</span>
            <strong>1 HOMEPAGE</strong>
            <small>Personally approved</small>
          </div>
        }
      />

      <section className="section demo-intro">
        <div className="shell demo-intro-grid">
          <div>
            <p className="eyebrow">What you get</p>
            <h2>A focused look at what your site could become.</h2>
          </div>
          <div className="demo-feature-grid">
            <article><MousePointerClick aria-hidden="true" /><h3>Semi-functional homepage</h3><p>A custom page direction with working interactions where they help show the idea.</p></article>
            <article><Clock3 aria-hidden="true" /><h3>About half a day of work</h3><p>Enough to show the concept without pretending it is a completed website.</p></article>
            <article><Check aria-hidden="true" /><h3>Consultation included</h3><p>We review the direction, what a full build needs, and what it would cost.</p></article>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell form-page-grid">
          <div>
            <p className="eyebrow">Request a demo</p>
            <h2>Give me enough to make it specific.</h2>
            <p>
              Demo requests are reviewed personally and are not guaranteed. If the
              concept is not purchased, the work remains mine and may be reused or
              developed further.
            </p>
          </div>
          <LeadForm type="demo" />
        </div>
      </section>
    </main>
  );
}
