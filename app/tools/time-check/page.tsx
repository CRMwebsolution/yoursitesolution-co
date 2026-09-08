import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { TimeCheckTool } from "./time-check-tool";

export const metadata: Metadata = {
  title: "Busywork check",
  description:
    "A short yes/no check for repeat office work that a small business can automate.",
};

export default function TimeCheckPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Free tool"
        title={
          <>
            How much of the week is <em>the same task twice?</em>
          </>
        }
        description="If you are copying form submissions, retyping invoices, or adding jobs to a calendar by hand, that is the kind of work I can connect."
      />
      <section className="section">
        <div className="shell tool-page">
          <TimeCheckTool />
        </div>
      </section>
    </main>
  );
}
