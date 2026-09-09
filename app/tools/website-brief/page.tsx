import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { WebsiteBriefTool } from "./website-brief-tool";

export const metadata: Metadata = {
  title: "Free website project brief builder",
  description:
    "Organize your audience, services, website goal, pages, proof, and missing information into a useful project brief.",
  alternates: { canonical: "/tools/website-brief" },
};

export default function WebsiteBriefPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <WebsiteBriefTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Ready to turn the brief into a site?"
        title="A clear plan makes the build faster and the final website stronger."
        text="Send me the brief and I can turn it into a practical scope, fixed-price recommendation, and next steps."
      />
    </main>
  );
}
