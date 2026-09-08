import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { TaskCostTool } from "./task-cost-tool";

export const metadata: Metadata = {
  title: "Free repetitive-task cost calculator",
  description:
    "Calculate the monthly and yearly time cost of a repetitive business task without assuming or promising automation savings.",
  alternates: { canonical: "/tools/time-check" },
};

export default function TaskCostPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <TaskCostTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Found an expensive handoff?"
        title="I can tell you whether it is actually worth automating."
        text="Start with the repeated task and the systems it touches. I’ll recommend the smallest useful fix—not a giant software project."
      />
    </main>
  );
}
