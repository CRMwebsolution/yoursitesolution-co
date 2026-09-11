import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

export const metadata: Metadata = {
  title: "Website SEO essentials check",
  description: "Check the public page information that search engines rely on.",
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
            description="Check one public page for selected search essentials, such as a page title, description, crawlable links, and indexing instructions. See the issues the automated check found and what to review next."
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
