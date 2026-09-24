import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Your Site Solution handles form submissions, website tools, and analytics.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Privacy"
        title={<>How this site uses <em>data.</em></>}
        description="A plain-language summary of information used when you contact me or browse this site."
      />
      <section className="section">
        <div className="shell mx-auto max-w-3xl space-y-10">
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Information you submit</h2>
            <p>
              Contact and demo forms collect the details you enter, such as your name,
              business, contact information, and project notes. Those details are sent
              through my form processing workflow so I can respond. Live website tools
              send the website address and other inputs you submit to the workflow
              that produces the requested result.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Website analytics</h2>
            <p>
              This site uses Google Analytics to understand visits and interactions.
              Google Analytics uses cookies and similar technology to collect usage
              information such as pages viewed and browser or device details. Vercel
              Analytics also measures website traffic.
            </p>
            <p>
              Read{" "}
              <a
                className="underline"
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
              >
                how Google uses information from sites that use its services
              </a>
              . You can manage cookies through your browser settings.
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl font-bold">Questions</h2>
            <p>
              For questions about this site and your information, email{" "}
              <a className="underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
