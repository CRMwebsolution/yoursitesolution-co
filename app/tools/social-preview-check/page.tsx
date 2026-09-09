import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { N8nDiagnosticTool } from "../n8n-diagnostic-tool";

export const metadata: Metadata = {
  title: "Social sharing preview check",
  description: "Inspect the title, description, and image a public page provides when its link is shared.",
  alternates: { canonical: "/tools/social-preview-check" },
  robots: { index: false, follow: true },
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
            description="Read the public Open Graph and related sharing tags, preview the returned content, and identify important fields that are missing or unusable."
            inputTitle="Public page to preview"
            inputHelp="Platforms cache results, so a recent website change may not appear immediately."
            buttonLabel="Check the sharing preview"
            setupDescription="Add a Switch output where $json.body.tool equals social-preview-check, then return the documented preview and diagnostic JSON."
          />
        </div>
      </section>
      <CtaBanner eyebrow="Need a better shared link?" title="A useful preview should identify the page before somebody clicks." text="I can add page-specific sharing metadata and images, then verify the public markup platforms receive." />
    </main>
  );
}
