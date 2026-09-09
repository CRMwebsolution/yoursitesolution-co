import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { UtmBuilderTool } from "./utm-builder-tool";

export const metadata: Metadata = {
  title: "Free campaign link builder",
  description:
    "Build a UTM-tagged website link for a flyer, email, social post, advertisement, or other marketing campaign.",
  alternates: { canonical: "/tools/utm-builder" },
};

export default function UtmBuilderPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <UtmBuilderTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Need the tracking finished?"
        title="A tagged link only helps when the analytics behind it are ready."
        text="I can connect the website, form, and campaign source so you can see which promotion produced a real inquiry."
      />
    </main>
  );
}
