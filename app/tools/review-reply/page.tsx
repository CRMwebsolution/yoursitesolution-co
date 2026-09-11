import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { ReviewReplyTool } from "./review-reply-tool";

export const metadata: Metadata = {
  title: "Free customer review reply writer",
  description:
    "Draft a professional response to a positive, mixed, or negative customer review using only details you provide.",
  alternates: { canonical: "/tools/review-reply" },
};

export default function ReviewReplyPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <ReviewReplyTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Want reviews handled consistently?"
        title="A useful review process asks honestly, responds calmly, and protects customer privacy."
        text="I can connect completed jobs to a measured request-and-response workflow while keeping adding the human review sensitive messages need."
      />
    </main>
  );
}
