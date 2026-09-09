import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { ContrastCheckerTool } from "./contrast-checker-tool";

export const metadata: Metadata = {
  title: "Free website color contrast checker",
  description:
    "Compare a text color with a background color and see whether the pair meets common WCAG text contrast thresholds.",
  alternates: { canonical: "/tools/contrast-checker" },
};

export default function ContrastCheckerPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <ContrastCheckerTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Found a hard-to-read combination?"
        title="Good design still has to work for the person reading it."
        text="I can adjust the full website palette without losing the business’s look or turning every page into a generic template."
      />
    </main>
  );
}
