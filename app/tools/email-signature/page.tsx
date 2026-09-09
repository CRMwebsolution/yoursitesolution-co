import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { EmailSignatureTool } from "./email-signature-tool";

export const metadata: Metadata = {
  title: "Free business email signature builder",
  description:
    "Build a simple business email signature with clickable phone, email, and website links, then copy it into an email account.",
  alternates: { canonical: "/tools/email-signature" },
};

export default function EmailSignaturePage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <EmailSignatureTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Need the rest of the brand cleaned up?"
        title="The signature, website, and customer messages should feel connected."
        text="I can carry the same straightforward identity through the website, forms, emails, and follow-up system."
      />
    </main>
  );
}
