import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ReviewTextTool } from "./review-text-tool";

export const metadata: Metadata = {
  title: "Review request text",
  description:
    "Generate a short text you can send after a job to ask for a Google review.",
};

export default function ReviewTextPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Free tool"
        title={
          <>
            Ask for the review <em>the same day.</em>
          </>
        }
        description="Most people will write a review if you ask while the work is still fresh. This writes a short text you can copy and send."
      />
      <section className="section">
        <div className="shell tool-page">
          <ReviewTextTool />
        </div>
      </section>
    </main>
  );
}
