import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { ReviewRequestTool } from "./review-request-tool";

export const metadata: Metadata = {
  title: "Free review request message kit",
  description:
    "Write a same-day text, polite follow-up, and email that asks a real customer for an honest Google review.",
  alternates: { canonical: "/tools/review-text" },
};

export default function ReviewRequestPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <ReviewRequestTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Want the follow-up handled?"
        title="A simple system can ask after every completed job."
        text="If the same customer details already pass through a form, calendar, or invoice, I can help connect the handoff."
      />
    </main>
  );
}
