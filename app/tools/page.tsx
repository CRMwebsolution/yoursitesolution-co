import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { tools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free website tools",
  description:
    "Free tools for small-business websites: a speed and contact check, a review-request text, and a busywork check.",
};

export default function ToolsPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Free tools"
        title={
          <>
            Useful checks. <em>No login.</em>
          </>
        }
        description="These are simple tools for a business that already has a website—or is trying to get more from the one it has. Use them, then tell me if you want the underlying problem fixed."
        aside={
          <div className="hero-aside-stack">
            <p>
              <span>Cost</span>
              <strong>Free</strong>
            </p>
            <p>
              <span>Account required</span>
              <strong>No</strong>
            </p>
          </div>
        }
      />

      <section className="section">
        <div className="shell tool-index-grid">
          {tools.map((tool) => (
            <article key={tool.slug} className="service-panel">
              <div className="service-number">{tool.number}</div>
              <h3>{tool.name}</h3>
              <p>{tool.summary}</p>
              <Link className="text-link" href={tool.href}>
                {tool.action} <ArrowRight aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <CtaBanner
        eyebrow="The tool is the start"
        title="If the check shows a problem, I can build the fix."
        text="A basic website starts at $300. A 3–5 page site starts at $750. You approve the preview before you pay."
      />
    </main>
  );
}
