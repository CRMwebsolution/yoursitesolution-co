import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { LeadResponseTool } from "./lead-response-tool";

export const metadata: Metadata = {
  title: "Free new lead response kit",
  description:
    "Create a clear immediate reply, after-hours message, email, and polite follow-up for a new customer inquiry.",
  alternates: { canonical: "/tools/lead-response" },
};

export default function LeadResponsePage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <LeadResponseTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Want every lead answered automatically?"
        title="The right reply is more useful when it reaches the customer on time."
        text="I can connect your website form, phone notifications, follow-ups, and pipeline without making the conversation feel robotic."
      />
    </main>
  );
}
