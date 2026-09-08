import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Gauge,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { tools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free small-business tools",
  description:
    "Free practical tools for website speed, Google search listings, customer review requests, and repetitive-task costs.",
  alternates: { canonical: "/tools" },
};

const toolIcons = {
  "website-check": Gauge,
  "search-preview": Search,
  "review-text": Star,
  "time-check": Clock3,
} as const;

export default function ToolsPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Free small-business tools"
        title={
          <>
            Get something useful. <em>Before we ever talk.</em>
          </>
        }
        description="Check the site, improve what customers see in search, ask for a review without sounding awkward, or put a price on repeated office work. Use any tool without an account or email wall."
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

      <section className="section tool-library-section">
        <div className="shell">
          <div className="tool-library-heading">
            <div>
              <p className="eyebrow">Choose a tool</p>
              <h2>Useful output. No filler score.</h2>
            </div>
            <p>
              Each tool gives you something you can inspect, copy, or act on.
              The only live outside test is PageSpeed; the others run entirely
              in your browser.
            </p>
          </div>

          <div className="tool-index-grid">
            {tools.map((tool) => {
              const Icon = toolIcons[tool.slug];
              return (
                <article
                  key={tool.slug}
                  className={`tool-index-card${tool.featured ? " tool-index-card-featured" : ""}`}
                >
                  <div className="tool-card-topline">
                    <span>{tool.number}</span>
                    <span>{tool.category}</span>
                  </div>
                  <Icon aria-hidden="true" />
                  <h3>{tool.name}</h3>
                  <p>{tool.summary}</p>
                  <dl>
                    <dt>You get</dt>
                    <dd>{tool.output}</dd>
                  </dl>
                  <Link className="text-link" href={tool.href}>
                    {tool.action} <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="tool-trust-note">
            <ShieldCheck aria-hidden="true" />
            <div>
              <strong>No results held hostage.</strong>
              <p>
                Use the tool first. Contact details only appear if you decide
                to ask for help afterward.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        eyebrow="Found something worth fixing?"
        title="Use the result yourself—or ask me to help with the next step."
        text="I’ll give you a straight answer about what matters, what can wait, and what a practical fix would cost."
      />
    </main>
  );
}
