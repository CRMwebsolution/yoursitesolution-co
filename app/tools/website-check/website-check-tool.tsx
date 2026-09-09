"use client";

import { useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleGauge,
  Clock3,
  Lightbulb,
  Monitor,
  Printer,
  Smartphone,
} from "lucide-react";
import { ToolFollowupForm } from "@/components/tool-followup-form";
import type {
  AuditFinding,
  CheckStrategy,
  WebsiteCheckReport,
} from "@/lib/website-check";

type FindingKind = "priority" | "improve" | "positive";

const SCORE_DETAILS = {
  performance: {
    label: "Performance",
    description: "Loading speed and responsiveness in this test.",
  },
  accessibility: {
    label: "Accessibility",
    description: "Automated checks for common barriers—not a full audit.",
  },
  bestPractices: {
    label: "Best practices",
    description: "Browser, security, and modern-code checks.",
  },
  seo: {
    label: "SEO basics",
    description: "Technical search checks, not a ranking prediction.",
  },
} as const;

function displayHost(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

function formatTestedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function scoreTone(score: number) {
  if (score >= 90) return "good";
  if (score >= 50) return "fair";
  return "poor";
}

function scoreMeaning(score: number) {
  if (score >= 90) return "Doing well";
  if (score >= 50) return "Needs improvement";
  return "Needs attention";
}

function ScoreCard({
  label,
  description,
  score,
}: {
  label: string;
  description: string;
  score: number | null;
}) {
  if (score === null) return null;

  return (
    <article className={`audit-score-card audit-score-${scoreTone(score)}`}>
      <div className="audit-score-number">
        <strong>{score}</strong>
        <span>/ 100</span>
      </div>
      <div>
        <h3>{label}</h3>
        <p className="audit-score-meaning">{scoreMeaning(score)}</p>
        <p>{description}</p>
      </div>
    </article>
  );
}

function MetricCard({ metric }: { metric: string }) {
  const separator = metric.indexOf(":");
  const label = separator > 0 ? metric.slice(0, separator).trim() : metric;
  const value = separator > 0 ? metric.slice(separator + 1).trim() : "";

  return (
    <li>
      <span>{label}</span>
      {value ? <strong>{value}</strong> : null}
    </li>
  );
}

function Findings({
  title,
  intro,
  items,
  kind,
}: {
  title: string;
  intro: string;
  items: AuditFinding[];
  kind: FindingKind;
}) {
  if (!items.length) return null;
  const Icon =
    kind === "priority"
      ? AlertTriangle
      : kind === "improve"
        ? Lightbulb
        : CheckCircle2;

  return (
    <section className={`audit-findings audit-findings-${kind}`}>
      <div className="audit-findings-heading">
        <Icon aria-hidden="true" />
        <div>
          <h2>{title}</h2>
          <p>{intro}</p>
        </div>
      </div>
      <div className="audit-finding-list">
        {items.map((item, index) => (
          <article className="audit-finding" key={`${item.title}-${index}`}>
            <span className="audit-finding-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.title}</h3>
              {item.explanation ? <p>{item.explanation}</p> : null}
              {item.businessImpact ? (
                <p>
                  <strong>Why this matters:</strong> {item.businessImpact}
                </p>
              ) : null}
              {item.recommendation ? (
                <p>
                  <strong>What can help:</strong> {item.recommendation}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WebsiteCheckTool() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<CheckStrategy>("mobile");
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [report, setReport] = useState<WebsiteCheckReport | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("running");
    setError("");
    setReport(null);

    try {
      const response = await fetch("/api/tools/website-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "website-check",
          url,
          strategy,
          company_site: event.currentTarget.company_site.value,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        report?: WebsiteCheckReport;
      };
      if (!response.ok || !data.report) {
        throw new Error(
          data.error || "The website could not be analyzed right now.",
        );
      }

      setReport(data.report);
      setStatus("done");
      window.setTimeout(() => {
        document.getElementById("website-audit-results")?.focus();
      }, 50);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "The check did not finish.",
      );
      setStatus("error");
    }
  }

  const scoreEntries = report
    ? Object.values(report.scores).filter((score) => score !== null).length
    : 0;

  return (
    <div className="website-audit">
      <div className="audit-launch">
        <div className="audit-intro">
          <p className="eyebrow eyebrow-light">Free website check</p>
          <h1>
            See what Google sees. <em>Know what to fix.</em>
          </h1>
          <p className="lede lede-light">
            Enter any public website and choose phone or desktop. The report
            turns Google PageSpeed results into a clear order of attack.
          </p>
          <ul className="audit-facts" aria-label="Website check details">
            <li>No login</li>
            <li>No email gate</li>
            <li>Results before the sales pitch</li>
          </ul>
        </div>

        <form className="lead-form tool-form" onSubmit={handleSubmit}>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website-check-company-site">
              Leave this field empty
            </label>
            <input
              id="website-check-company-site"
              name="company_site"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <label htmlFor="website-check-url">
            Website address
            <input
              id="website-check-url"
              name="url"
              type="text"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={status === "running"}
              required
            />
          </label>

          <fieldset className="device-choice">
            <legend>Test this version</legend>
            <div className="device-options">
              <label className={strategy === "mobile" ? "is-on" : ""}>
                <input
                  type="radio"
                  name="strategy"
                  value="mobile"
                  checked={strategy === "mobile"}
                  onChange={() => setStrategy("mobile")}
                  disabled={status === "running"}
                />
                <Smartphone aria-hidden="true" />
                Mobile
              </label>
              <label className={strategy === "desktop" ? "is-on" : ""}>
                <input
                  type="radio"
                  name="strategy"
                  value="desktop"
                  checked={strategy === "desktop"}
                  onChange={() => setStrategy("desktop")}
                  disabled={status === "running"}
                />
                <Monitor aria-hidden="true" />
                Desktop
              </label>
            </div>
            <p>Start with mobile. That is usually where weak sites show it.</p>
          </fieldset>

          <button className="button audit-submit" type="submit" disabled={status === "running"}>
            {status === "running" ? "Checking the website…" : "Check my website"}
            {status === "running" ? null : <ArrowRight aria-hidden="true" />}
          </button>

          <p className="audit-limit">
            <Clock3 aria-hidden="true" /> Two checks every three minutes. Most
            reports take 20–90 seconds.
          </p>

          <p className="audit-accessibility-note">
            <strong>Automated accessibility notice:</strong> This check uses
            Google PageSpeed Insights. Neither the submitted website nor this
            report is manually reviewed by Your Site Solution. It is not a
            complete WCAG evaluation, legal review, or ADA compliance
            certification.
          </p>

          {status === "running" ? (
            <div className="audit-loading" role="status" aria-live="polite">
              <span className="audit-spinner" aria-hidden="true" />
              <div>
                <strong>Google is testing the page now.</strong>
                <p>
                  Keep this tab open. I’ll put the scores and priorities right
                  here when the run finishes.
                </p>
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>

      {report && status === "done" ? (
        <section
          className="audit-results"
          id="website-audit-results"
          tabIndex={-1}
        >
          <header className="audit-result-header">
            <div>
              <p className="eyebrow">Your results</p>
              <h2>{displayHost(report.url)}</h2>
              <p>
                {report.strategy === "desktop" ? "Desktop" : "Mobile"} test ·{" "}
                {formatTestedAt(report.testedAt)}
              </p>
            </div>
            <div className="audit-result-actions">
              <CircleGauge aria-hidden="true" />
              <button
                className="button button-outline audit-print"
                type="button"
                onClick={() => window.print()}
              >
                <Printer aria-hidden="true" /> Print / save
              </button>
            </div>
          </header>

          <div className="audit-summary">
            <strong>The short version</strong>
            <p>{report.summary}</p>
          </div>

          {scoreEntries ? (
            <>
              <div className="audit-score-grid">
                {(Object.keys(SCORE_DETAILS) as Array<keyof typeof SCORE_DETAILS>).map(
                  (key) => (
                    <ScoreCard
                      key={key}
                      {...SCORE_DETAILS[key]}
                      score={report.scores[key]}
                    />
                  ),
                )}
              </div>
              <p className="audit-score-key">
                <span className="score-key-good">90–100: doing well</span>
                <span className="score-key-fair">50–89: needs improvement</span>
                <span className="score-key-poor">0–49: needs attention</span>
              </p>
            </>
          ) : null}

          {report.metrics.length ? (
            <section className="audit-metrics">
              <div>
                <p className="eyebrow">Performance details</p>
                <h2>What the test measured</h2>
              </div>
              <ul>
                {report.metrics.map((metric) => (
                  <MetricCard key={metric} metric={metric} />
                ))}
              </ul>
            </section>
          ) : null}

          <Findings
            title="Fix these first"
            intro="These findings are most likely to affect how the website feels or works for visitors."
            items={report.fixFirst}
            kind="priority"
          />
          <Findings
            title="Worth improving"
            intro="These changes may make the website faster, clearer, or easier to use."
            items={report.worthImproving}
            kind="improve"
          />
          <Findings
            title="What the website does well"
            intro="These parts are already helping the visitor experience."
            items={report.doingWell}
            kind="positive"
          />

          <p className="tool-disclaimer">{report.disclaimer}</p>

          <ToolFollowupForm
            tool="website-check"
            heading="Want a straight answer on what is actually worth fixing?"
            context={{
              url: report.url,
              strategy: report.strategy,
              scores: report.scores,
              fix_first: report.fixFirst.map((item) => item.title),
            }}
          />
        </section>
      ) : null}
    </div>
  );
}
