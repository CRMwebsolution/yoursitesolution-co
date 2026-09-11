import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

export const metadata: Metadata = {
  title: "Limited broken-link checker",
  description: "Check a limited crawl of a public website for broken and redirected links.",
  alternates: { canonical: "/tools/broken-link-check" },
  robots: { index: false, follow: true },
};

export default function BrokenLinkCheckPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <N8nDiagnosticTool
            tool="broken-link-check"
            eyebrow="Limited broken-link checker"
            title={<>Find dead ends before a <em>customer finds them.</em></>}
            description="Crawl up to 20 public pages and inspect up to 250 links for broken destinations and redirects. Limits keep the free check responsible and predictable."
            inputTitle="Website starting page"
            inputHelp="Start at the homepage or the main page for the section you want checked."
            buttonLabel="Check the website links"
            setupDescription="Add a Switch output where $json.body.tool equals broken-link-check. Enforce the server-supplied crawl limits and return the documented diagnostic JSON."
          />
        </div>
      </section>
      <CtaBanner eyebrow="Found links worth repairing?" title="A small broken-link list is usually a straightforward cleanup." text="I can update the destinations, preserve useful redirects, and find where the stale links are coming from." />
    </main>
  );
}
