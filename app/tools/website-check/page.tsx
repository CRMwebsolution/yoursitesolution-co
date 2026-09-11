import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { WebsiteCheckTool } from "./website-check-tool";

export const metadata: Metadata = {
  title: "Free PageSpeed website check",
  description:
    "Run a free mobile or desktop Google PageSpeed check and get the scores, measurements, and priorities in plain English.",
  alternates: { canonical: "/tools/website-check" },
};

export default function WebsiteCheckPage() {
  return (
    <main id="main-content">
      <section className="tool-workbench section-dark">
        <div className="shell">
          <WebsiteCheckTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="The report is free"
        title="If the website needs work, let’s see whether a rebuild is worth it."
        text="I’ll tell you what matters, what can wait, and what a better version would cost before any work starts."
      />
    </main>
  );
}
