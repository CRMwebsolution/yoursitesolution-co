import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { AutomationFinderTool } from "./automation-finder-tool";

export const metadata: Metadata = {
  title: "Free automation opportunity finder",
  description:
    "Turn repetitive business handoffs into practical automation outlines with triggers, actions, human checkpoints, and safe first tests.",
  alternates: { canonical: "/tools/automation-finder" },
};

export default function AutomationFinderPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <AutomationFinderTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Found a worthwhile handoff?"
        title="The first automation should be easy to verify and easy to stop."
        text="I can map the real systems, edge cases, permissions, and failure alerts before anything touches customer data."
      />
    </main>
  );
}
