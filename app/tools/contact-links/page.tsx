import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { ContactLinksTool } from "./contact-links-tool";

export const metadata: Metadata = {
  title: "Free call, text and email link builder",
  description:
    "Create tap-to-call, prefilled text-message, and ready-to-email links with copyable HTML for a business website.",
  alternates: { canonical: "/tools/contact-links" },
};

export default function ContactLinksPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <ContactLinksTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Want those buttons installed?"
        title="The easiest contact method should be obvious on every screen."
        text="I can add the right call, text, form, or booking action to a website and make sure it works on a phone."
      />
    </main>
  );
}
