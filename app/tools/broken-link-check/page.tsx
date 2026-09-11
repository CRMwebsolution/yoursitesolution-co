import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { getTool } from "@/config/tools";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

const tool = getTool("broken-link-check");

export const metadata: Metadata = {
  title: "Limited broken-link checker",
  description: tool.hero,
  alternates: { canonical: "/tools/broken-link-check" },
};

export default function BrokenLinkCheckPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <N8nDiagnosticTool
            tool="broken-link-check"
            eyebrow="Limited broken-link checker"
            title={<>Find the links that send people <em>nowhere.</em></>}
            description={tool.hero}
            inputTitle="Website starting page"
            inputHelp="Start at the homepage or the main page for the section you want checked."
            buttonLabel="Check the website links"
          />
        </div>
      </section>
      <CtaBanner
        eyebrow="Found dead ends?"
        title="Broken links are a small repair that makes a website feel cared for."
        text="I can fix the paths, redirects, and leftover pages so customers land where they should."
      />
    </main>
  );
}
