import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { ImageOptimizerTool } from "./image-optimizer-tool";

export const metadata: Metadata = {
  title: "Free website image optimizer",
  description:
    "Resize and compress a website photo in your browser, compare the real file sizes, and download the optimized copy.",
  alternates: { canonical: "/tools/image-optimizer" },
};

export default function ImageOptimizerPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <ImageOptimizerTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Still fighting a slow page?"
        title="Smaller images help, but the full loading path still matters."
        text="I can inspect how the website loads, fix the right bottlenecks, and avoid trading image quality for a meaningless score."
      />
    </main>
  );
}
