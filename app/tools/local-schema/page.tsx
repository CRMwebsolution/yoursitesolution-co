import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { LocalSchemaTool } from "./local-schema-tool";

export const metadata: Metadata = {
  title: "Free Local Business schema builder",
  description:
    "Build factual LocalBusiness JSON-LD from your own business details, ready to add to a website and validate.",
  alternates: { canonical: "/tools/local-schema" },
};

export default function LocalSchemaPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <LocalSchemaTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Need it installed correctly?"
        title="Good structured data starts with accurate business facts."
        text="I can add the markup to the right pages, verify the published code, and keep it consistent with what customers can actually see."
      />
    </main>
  );
}
