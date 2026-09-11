import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { getTool } from "@/config/tools";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

const tool = getTool("seo-check");

export const metadata: Metadata = {
  title: "Website SEO essentials check",
  description: tool.hero,
  alternates: { canonical: "/tools/seo-check" },
};

export default function SeoCheckPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <N8nDiagnosticTool
            tool="seo-check"
            eyebrow="Website SEO essentials check"
            title={<>See what the page tells <em>search engines and customers.</em></>}
            description={tool.hero}
            inputTitle="Public page to inspect"
            inputHelp="This checks one page, not every page on the domain."
            buttonLabel="Run the SEO essentials check"
          />
        </div>
      </section>
      <CtaBanner eyebrow="Need the findings fixed?" title="Search essentials work best when every important page has a clear job." text="I can repair the technical signals and page structure without promising rankings or imaginary traffic." />
    </main>
  );
}
