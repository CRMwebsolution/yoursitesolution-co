import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { getTool } from "@/config/tools";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

const tool = getTool("social-preview-check");

export const metadata: Metadata = {
  title: "Social sharing preview check",
  description: tool.hero,
  alternates: { canonical: "/tools/social-preview-check" },
};

export default function SocialPreviewCheckPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <N8nDiagnosticTool
            tool="social-preview-check"
            eyebrow="Social sharing preview check"
            title={<>See what appears when somebody <em>shares the link.</em></>}
            description={tool.hero}
            inputTitle="Public page to preview"
            inputHelp="Platforms cache results, so a recent website change may not appear immediately."
            buttonLabel="Check the sharing preview"
          />
        </div>
      </section>
      <CtaBanner
        eyebrow="Need a better first impression?"
        title="A shared link should look as clear as the page itself."
        text="I can tighten the page title, description, and image so the preview matches the business."
      />
    </main>
  );
}
