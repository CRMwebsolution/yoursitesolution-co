import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Box, MessageSquareText, Sparkles } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ChatPreview } from "./chat-preview";
import { ThreePreview } from "./three-preview";

export const metadata: Metadata = {
  title: "Optional Upgrades",
  description:
    "Optional website upgrades such as AI chat assistants, Three.js 3D scenes, booking tools, and custom dashboards—quoted only when they help the business.",
};

const extras = [
  {
    title: "Booking and scheduling",
    text: "Let customers request a time without the back-and-forth. Confirmations can go to you, them, and the calendar.",
  },
  {
    title: "Customer or staff dashboards",
    text: "A private page for job status, invoices, inventory, or whatever the business already tracks by hand.",
  },
  {
    title: "Maps, payments, and live data",
    text: "Service-area maps, checkout flows, live availability, or a feed from a tool you already pay for.",
  },
];

export default function UpgradesPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Optional upgrades"
        title={
          <>
            The extras that make a site <em>do more.</em>
          </>
        }
        description="A basic website does not need a chatbot or a 3D scene. When one of those pieces would actually help customers—or help you look like the business they should call—I can add it and quote it separately."
        aside={
          <div className="workflow-mark" aria-hidden="true">
            <span>WEBSITE</span>
            <Sparkles />
            <strong>UPGRADE</strong>
          </div>
        }
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="See it, then decide"
            title={
              <>
                Two examples that stay <span>optional.</span>
              </>
            }
            description="These are add-ons, not part of the $300 or $750 starting websites. If they are useful, we scope them. If they are decoration, we'll let you know."
          />

          <div className="upgrade-showcase">
            <article className="upgrade-card">
              <p className="eyebrow">Customer questions</p>
              <h3>
                <MessageSquareText aria-hidden="true" /> AI chat assistant
              </h3>
              <p>
                A small assistant on the site can answer hours, pricing ranges, and
                service-area questions after you close. Real jobs still come to you.
                It does not replace a conversation when the work is custom.
              </p>
              <div className="upgrade-stage">
                <ChatPreview />
              </div>
            </article>

            <article className="upgrade-card">
              <p className="eyebrow">Interactive 3D</p>
              <h3>
                <Box aria-hidden="true" /> Three.js scenes
              </h3>
              <p>
                Product viewers, a brand mark, or a homepage piece that moves.
                Built with Three.js when the extra motion earns its keep—not
                because every site needs it. Drag the YS plate to turn it.
              </p>
              <div className="upgrade-stage">
                <ThreePreview />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell">
          <SectionHeading
            eyebrow="Other upgrades"
            title={
              <>
                Same idea: add it when it <span>solves a problem.</span>
              </>
            }
          />
          <div className="upgrade-list">
            {extras.map((item) => (
              <article key={item.title}>
                <p className="eyebrow">Quoted separately</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell system-callout">
          <Sparkles aria-hidden="true" />
          <div>
            <p className="eyebrow eyebrow-light">No menu of mystery fees</p>
            <h2>You describe the result. I tell you if it is worth building.</h2>
            <p>
              Upgrades are quoted as their own job. If a paid service is required
              to run the chatbot or host a 3D model, that cost is written down
              before work starts.
            </p>
          </div>
          <Link className="button" href="/contact">
            Ask about an upgrade <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <CtaBanner
        eyebrow="Want one of these on a site?"
        title="Tell me what it should do."
        text="A chatbot, a 3D product view, a booking flow, or something I have not listed. Plain English is enough."
      />
    </main>
  );
}
