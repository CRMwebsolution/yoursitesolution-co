import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { WebsiteCheckTool } from "./website-check-tool";

export const metadata: Metadata = {
  title: "Website check",
  description:
    "Free website check for small businesses. See mobile speed scores and whether customers can call, write, or find hours from the homepage.",
};

export default function WebsiteCheckPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Free tool"
        title={
          <>
            Is the website actually <em>usable?</em>
          </>
        }
        description="Paste a URL. I run Google’s speed test and look at the homepage for a phone number, a form, hours, and the other basics customers need."
      />
      <section className="section">
        <div className="shell tool-page">
          <WebsiteCheckTool />
        </div>
      </section>
    </main>
  );
}
