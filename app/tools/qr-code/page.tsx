import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { QrCodeTool } from "./qr-code-tool";

export const metadata: Metadata = {
  title: "Free QR code generator",
  description:
    "Create and download a QR code for a website, review page, payment link, phone number, or short message.",
  alternates: { canonical: "/tools/qr-code" },
};

export default function QrCodePage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <QrCodeTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Need the destination built too?"
        title="A QR code works best when the page behind it is quick and clear."
        text="I can build the landing page, review flow, form, or payment handoff the code should open."
      />
    </main>
  );
}
