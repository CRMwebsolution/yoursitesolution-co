import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

export const metadata: Metadata = {
  title: "Domain and email health check",
  description: "Check a domain's public DNS addresses, mail routing, SPF, and DMARC records.",
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
            description="Check the public records that point visitors to your website and route business email. See whether mail servers and basic email-sender policies are published, with plain-English findings. This does not test website availability or email delivery."
            inputTitle="Business website or domain"
            inputHelp="Use the domain that hosts the website and business email."
            buttonLabel="Check the public records"
          />
        </div>
      </section>
      <CtaBanner eyebrow="Need help interpreting DNS?" title="Domain changes are small on screen and consequential in practice." text="I can map the current records and recommend the safest change without promising inbox placement or replacing your email administrator." />
    </main>
  );
}
