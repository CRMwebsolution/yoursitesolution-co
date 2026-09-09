import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

export const metadata: Metadata = {
  title: "Domain and email health check",
  description: "Inspect public HTTPS, redirect, mail routing, SPF, and DMARC observations for a domain.",
  alternates: { canonical: "/tools/domain-health-check" },
  robots: { index: false, follow: true },
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
            description="Check observable HTTPS, redirect, mail-routing, SPF, and DMARC details without claiming to perform a complete security or deliverability audit."
            inputTitle="Business website or domain"
            inputHelp="Use the domain that hosts the website and business email."
            buttonLabel="Check the public records"
            setupDescription="Add a Switch output where $json.body.tool equals domain-health-check, use public DNS and HTTPS checks, and return the documented diagnostic JSON."
          />
        </div>
      </section>
      <CtaBanner eyebrow="Need help interpreting DNS?" title="Domain changes are small on screen and consequential in practice." text="I can map the current records and recommend the safest change without promising inbox placement or replacing your email administrator." />
    </main>
  );
}
