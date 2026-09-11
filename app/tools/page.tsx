import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { ToolLibrary } from "./tool-library";

export const metadata: Metadata = {
  title: "Free small-business tools",
  description:
    "Free practical tools for websites, marketing links, customer communication, search visibility, images, and business planning.",
  alternates: { canonical: "/tools" },
};

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
        description="Check a website, build useful links, improve customer messages, prepare images, and organize the information a business needs online. Use any tool without an account or email wall."
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
              <h2>Useful output. No filler.</h2>
            </div>
            <p>
              Search by the problem you are trying to solve. Most tools run
              entirely on your device; live website checks clearly say when
              they contact an outside service.
            </p>
          </div>

          <ToolLibrary />

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
