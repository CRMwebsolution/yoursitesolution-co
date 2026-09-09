import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { CopyClarityTool } from "./copy-clarity-tool";

export const metadata: Metadata = {
  title: "Free website copy clarity check",
  description:
    "Find long sentences, dense paragraphs, vague claims, and missing next steps in website wording without a made-up score.",
  alternates: { canonical: "/tools/copy-clarity" },
};

export default function CopyClarityPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <CopyClarityTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Need the whole page rewritten?"
        title="Clear website copy should answer the customer before it talks about the company."
        text="I can turn the real services, proof, process, and customer questions into concise page copy with an obvious next step."
      />
    </main>
  );
}
