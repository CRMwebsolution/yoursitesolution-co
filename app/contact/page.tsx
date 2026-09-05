import type { Metadata } from "next";
import { Mail, MapPin, MessageSquareText, Timer } from "lucide-react";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/page-hero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Cody what you need for your website or business automation project. Personal response within 12 hours.",
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Start a project"
        title={<>Tell me what <em>you need.</em></>}
        description="A polished brief is not required. Explain the business, the problem, and what a good result looks like. I can help define the rest."
        aside={
          <div className="contact-quick">
            <a href={`sms:${siteConfig.phoneHref}`}><MessageSquareText />Text {siteConfig.phoneDisplay}</a>
            <a href={`mailto:${siteConfig.email}`}><Mail />{siteConfig.email}</a>
          </div>
        }
      />

      <section className="section contact-section">
        <div className="shell contact-grid">
          <div className="contact-details">
            <p className="eyebrow">Direct contact</p>
            <h2>You are talking to the person who builds it.</h2>
            <p>
              The form sends an immediate confirmation. Cody reads the details and
              responds personally within twelve hours.
            </p>
            <dl>
              <div><dt><MessageSquareText aria-hidden="true" />Preferred</dt><dd>Text message</dd></div>
              <div><dt><Timer aria-hidden="true" />Response</dt><dd>Within 12 hours</dd></div>
              <div><dt><MapPin aria-hidden="true" />Based in</dt><dd>Newport, NC</dd></div>
            </dl>
          </div>
          <LeadForm />
        </div>
      </section>
    </main>
  );
}
