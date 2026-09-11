import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { getTool } from "@/config/tools";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

const tool = getTool("domain-health-check");

export const metadata: Metadata = {
  title: "Domain and email health check",
  description: tool.hero,
  alternates: { canonical: "/tools/domain-health-check" },
};

export default function DomainHealthCheckPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <N8nDiagnosticTool
            tool="domain-health-check"
            eyebrow="Domain and email health check"
            title={<>Inspect the public records behind the <em>website and email.</em></>}
            description={tool.hero}
            inputTitle="Business website or domain"
            inputHelp="Use the domain that hosts the website and business email."
            buttonLabel="Check the public records"
          />
        </div>
      </section>
      <CtaBanner
        eyebrow="Records look off?"
        title="DNS and email records should be boring and correct."
        text="I can help sort the public records without pretending this is a full security or inbox-placement audit."
      />
    </main>
  );
}
