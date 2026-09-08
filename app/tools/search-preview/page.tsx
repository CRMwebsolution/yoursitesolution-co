import type { Metadata } from "next";
import { CtaBanner } from "@/components/cta-banner";
import { SearchPreviewTool } from "./search-preview-tool";

export const metadata: Metadata = {
  title: "Free Google search preview",
  description:
    "Build a page title, meta description, and H1 for a small-business service page, then preview and copy the result.",
  alternates: { canonical: "/tools/search-preview" },
};

export default function SearchPreviewPage() {
  return (
    <main id="main-content">
      <section className="utility-workbench section-dark">
        <div className="shell">
          <SearchPreviewTool />
        </div>
      </section>
      <CtaBanner
        eyebrow="Need more than one page?"
        title="I can turn the message into a website that is ready to use."
        text="You get clear page structure, mobile-friendly design, and the basics set up properly—without writing every line yourself."
      />
    </main>
  );
}

