"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { ToolFollowupForm } from "@/components/tool-followup-form";
import type { WebsiteCheckResult } from "@/lib/website-check";

export function WebsiteCheckTool() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [result, setResult] = useState<WebsiteCheckResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("running");
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/tools/website-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          company_site: event.currentTarget.company_site.value,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        result?: WebsiteCheckResult;
      };
      if (!response.ok || !data.result) {
        throw new Error(data.error || "The check did not finish.");
      }
      setResult(data.result);
      setStatus("done");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "The check did not finish.",
      );
      setStatus("error");
    }
  }

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
        <div className="form-submit-row">
          <button className="button" type="submit" disabled={status === "running"}>
            {status === "running" ? "Checking…" : "Run the check"}
            <ArrowRight aria-hidden="true" />
          </button>
          <p>Takes about 15–30 seconds. Results show up on this page.</p>
        </div>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
      </form>

      {result ? (
        <div className="tool-results">
          <p className="eyebrow">Results for</p>
          <h2>{result.url.replace(/^https?:\/\//, "")}</h2>

          <div className="score-boards">
            <ScoreBoard label="Mobile" scores={result.scores.mobile} />
            <ScoreBoard label="Desktop" scores={result.scores.desktop} />
          </div>

          {result.vitals.lcp || result.vitals.cls || result.vitals.inp ? (
            <dl className="vital-row">
              <div>
                <dt>Largest content</dt>
                <dd>{result.vitals.lcp || "—"}</dd>
              </div>
              <div>
                <dt>Layout shift</dt>
                <dd>{result.vitals.cls || "—"}</dd>
              </div>
              <div>
                <dt>Input delay</dt>
                <dd>{result.vitals.inp || "—"}</dd>
              </div>
            </dl>
          ) : null}

          <ul className="note-list">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <div className="reach-grid">
            {result.reachability.map((item) => (
              <article
                key={item.id}
                className={item.ok ? "reach-ok" : "reach-miss"}
              >
                <strong>{item.ok ? "Yes" : "No"}</strong>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>

          <p className="tool-disclaimer">
            Speed scores come from Google’s PageSpeed / Lighthouse test. They
            move around a bit from run to run. This is not a ranking promise.
          </p>

          <ToolFollowupForm
            tool="website-check"
            heading="If you want this rebuilt so customers can actually use it, tell me."
            context={{
              url: result.url,
              mobile_speed:
                result.scores.mobile.find((item) => item.id === "performance")
                  ?.score ?? null,
              missing: result.reachability
                .filter((item) => !item.ok)
                .map((item) => item.label),
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function ScoreBoard({
  label,
  scores,
}: {
  label: string;
  scores: WebsiteCheckResult["scores"]["mobile"];
}) {
  return (
    <section className="score-board">
      <p className="eyebrow">{label}</p>
      <div className="score-grid">
        {scores.map((score) => (
          <div key={score.id} className={`score-cell band-${score.band}`}>
            <span>{score.label}</span>
            <strong>{score.score ?? "—"}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
