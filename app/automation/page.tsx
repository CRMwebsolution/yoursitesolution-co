import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight, CalendarCheck, FileCheck2, MailCheck, Workflow } from "lucide-react";
import { CtaBanner } from "@/components/cta-banner";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Business Automation",
  description:
    "Practical small-business automations for form responses, invoices, bookings, calendars, and repetitive admin work.",
};

const examples = [
  {
    icon: MailCheck,
    title: "Form response",
    before: "A customer submits a form.",
    after: "They immediately receive the right reply and next steps.",
  },
  {
    icon: FileCheck2,
    title: "Accepted booking",
    before: "You approve a booking or job.",
    after: "The invoice is created without typing the same details again.",
  },
  {
    icon: CalendarCheck,
    title: "Job tracking",
    before: "A job is accepted.",
    after: "The right calendar is updated automatically.",
  },
];

export default function AutomationPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Business automation"
        title={<>If you keep doing it twice, <em>let’s fix that.</em></>}
        description="Automations connect the tools you already use so information moves where it needs to go—quickly, consistently, and without another repetitive task on your list."
        aside={
          <div className="workflow-mark" aria-hidden="true">
            <span>TRIGGER</span><ArrowDown /><span>ACTION</span><ArrowDown /><strong>DONE</strong>
          </div>
        }
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            eyebrow="Useful, not flashy"
            title={<>Small handoffs create <span>real breathing room.</span></>}
            description="The best first automation is usually a task you already repeat the same way every time."
          />
          <div className="automation-grid">
            {examples.map(({ icon: Icon, title, before, after }, index) => (
              <article key={title}>
                <div className="automation-card-head"><span>0{index + 1}</span><Icon aria-hidden="true" /></div>
                <h3>{title}</h3>
                <div className="before-after">
                  <p><small>WHEN</small>{before}</p>
                  <ArrowDown aria-hidden="true" />
                  <p><small>THEN</small>{after}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="shell detail-grid">
          <div>
            <p className="eyebrow">Bring the problem</p>
            <h2>You do not need to design the system before you call.</h2>
          </div>
          <div className="prose-stack">
            <p>
              Explain the task that wastes time, where the information starts, and
              where it needs to end up. I’ll determine whether it can be automated and
              give you a price for the whole job.
            </p>
            <p>
              Automation work is quoted by the project, not by the hour. If the solution
              needs a paid platform or another ongoing service, that cost is spelled out
              before the build starts.
            </p>
            <p>
              Already have a website? We can rebuild it when the site is the problem, or
              leave it alone and build an automation around the process that needs help.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell system-callout">
          <Workflow aria-hidden="true" />
          <div>
            <p className="eyebrow eyebrow-light">A good automation should be boring</p>
            <h2>It runs, does the job, and gets out of your way.</h2>
            <p>The scope includes what happens when something fails, who needs to know, and how the business keeps moving.</p>
          </div>
          <Link className="button" href="/contact">Tell me the problem <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <CtaBanner
        eyebrow="What keeps repeating?"
        title="Show me the bottleneck."
        text="A form, invoice, calendar, notification, or something stranger—describe the current process and the result you want."
      />
    </main>
  );
}
