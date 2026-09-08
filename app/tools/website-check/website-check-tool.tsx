"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { ToolFollowupForm } from "@/components/tool-followup-form";
import type { CheckStrategy, WebsiteCheckReport } from "@/lib/website-check";

function displayHost(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "");
  }
}

function band(score: number | null) {
  if (score === null) return "unknown";
  if (score >= 90) return "good";
  if (score >= 50) return "okay";
  return "poor";
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
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "The check did not finish.",
      );
      setStatus("error");
    }
  }

  const scores = report
    ? [
        { id: "performance", label: "Speed", score: report.scores.performance },
        {
          id: "accessibility",
          label: "Accessibility",
          score: report.scores.accessibility,
        },
        {
          id: "best-practices",
          label: "Best practices",
          score: report.scores.bestPractices,
        },
        { id: "seo", label: "SEO basics", score: report.scores.seo },
      ]
    : [];

  return (
    <div className="tool-stage">
      <form className="lead-form tool-form" onSubmit={handleSubmit}>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website-check-company-site">Leave this field empty</label>
          <input
            id="website-check-company-site"
            name="company_site"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <label>
          Website address
          <input
            name="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourbusiness.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </label>
        <fieldset className="device-choice">
          <legend>Check this site as</legend>
          <div className="yes-no">
            <button
              type="button"
              className={strategy === "mobile" ? "is-on" : ""}
              onClick={() => setStrategy("mobile")}
            >
              Mobile
            </button>
            <button
              type="button"
              className={strategy === "desktop" ? "is-on" : ""}
              onClick={() => setStrategy("desktop")}
            >
              Desktop
            </button>
          </div>
          <p>
            Most customers use a phone. Start there unless you have a reason to
            check the desktop version.
          </p>
        </fieldset>
        <div className="form-submit-row">
          <button className="button" type="submit" disabled={status === "running"}>
            {status === "running" ? "Checking…" : "Run the check"}
            <ArrowRight aria-hidden="true" />
          </button>
          <p>Takes about 20–50 seconds. Stay on this page until scores show.</p>
        </div>
        {status === "running" ? (
          <p className="tool-disclaimer" role="status">
            Checking the site now. This uses the same PageSpeed test as the
            Southern Automate checker.
          </p>
        ) : null}
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      {report ? (
        <div className="tool-results">
          <p className="eyebrow">
            {report.strategy === "desktop" ? "Desktop" : "Mobile"} results for
          </p>
          <h2>{displayHost(report.url)}</h2>

          <div className="score-boards score-boards-single">
            <section className="score-board">
              <p className="eyebrow">
                {report.strategy === "desktop" ? "Desktop" : "Mobile"}
              </p>
              <div className="score-grid">
                {scores.map((score) => (
                  <div
                    key={score.id}
                    className={`score-cell band-${band(score.score)}`}
                  >
                    <span>{score.label}</span>
                    <strong>{score.score ?? "—"}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {report.metrics.length ? (
            <section className="audit-block">
              <p className="eyebrow">Key metrics</p>
              <ul>
                {report.metrics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {report.fixFirst.length ? (
            <section className="audit-block">
              <p className="eyebrow">Fix these first</p>
              <ul>
                {report.fixFirst.map((item) => (
                  <li key={item.title}>{item.title}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {report.worthImproving.length ? (
            <section className="audit-block">
              <p className="eyebrow">What to fix next</p>
              <ul>
                {report.worthImproving.map((item) => (
                  <li key={item.title}>{item.title}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {report.doingWell.length ? (
            <section className="audit-block audit-good">
              <p className="eyebrow">Already good</p>
              <ul>
                {report.doingWell.map((item) => (
                  <li key={item.title}>{item.title}</li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="tool-disclaimer">{report.disclaimer}</p>

          <ToolFollowupForm
            tool="website-check"
            heading="If you want this rebuilt so customers can actually use it, tell me."
            context={{
              url: report.url,
              strategy: report.strategy,
              speed: report.scores.performance,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
