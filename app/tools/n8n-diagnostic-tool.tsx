"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Info,
  LoaderCircle,
  Search,
} from "lucide-react";
import { BrowserToolHeader } from "./browser-tool-header";
import type {
  DiagnosticFinding,
  DiagnosticStatus,
  DiagnosticToolSlug,
  SiteDiagnosticReport,
} from "@/lib/site-diagnostic";

type N8nDiagnosticToolProps = {
  tool: DiagnosticToolSlug;
  eyebrow: string;
  title: ReactNode;
  description: string;
  inputTitle: string;
  inputHelp: string;
  buttonLabel: string;
};

const statusLabels: Record<DiagnosticStatus, string> = {
  pass: "Working",
  warning: "Review",
  fail: "Problem",
  info: "Information",
};

function StatusIcon({ status }: { status: DiagnosticStatus }) {
  if (status === "pass") return <CheckCircle2 aria-hidden="true" />;
  if (status === "warning") return <AlertTriangle aria-hidden="true" />;
  if (status === "fail") return <CircleAlert aria-hidden="true" />;
  return <Info aria-hidden="true" />;
}

function Finding({ finding }: { finding: DiagnosticFinding }) {
  return (
    <article className={`diagnostic-finding diagnostic-${finding.status}`}>
      <StatusIcon status={finding.status} />
      <div>
        <span>{statusLabels[finding.status]}</span>
        <h3>{finding.title}</h3>
        {finding.detail ? <p>{finding.detail}</p> : null}
        {finding.recommendation ? (
          <p><strong>What to do:</strong> {finding.recommendation}</p>
        ) : null}
        {finding.url ? (
          <a href={finding.url} target="_blank" rel="noreferrer">
            Open affected page <ExternalLink aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function N8nDiagnosticTool({
  tool,
  eyebrow,
  title,
  description,
  inputTitle,
  inputHelp,
  buttonLabel,
}: N8nDiagnosticToolProps) {
  const [url, setUrl] = useState("");
  const [companySite, setCompanySite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<SiteDiagnosticReport | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const response = await fetch(`/api/tools/${tool}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, company_site: companySite }),
      });
      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; report?: SiteDiagnosticReport; error?: string }
        | null;
      if (!response.ok || !data?.report) {
        throw new Error(data?.error || "The live check could not be completed.");
      }
      setReport(data.report);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The live check could not be completed.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="utility-tool diagnostic-tool">
      <BrowserToolHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        note="Live check. Your public website address is sent to an outside service to retrieve the results."
      />

      <form className="diagnostic-launch" onSubmit={submit}>
        <label>
          {inputTitle}
          <input
            inputMode="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            required
          />
          <span>{inputHelp}</span>
        </label>
        <label className="diagnostic-honeypot" aria-hidden="true">
          Company site
          <input
            value={companySite}
            onChange={(event) => setCompanySite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
        <button className="button" type="submit" disabled={loading}>
          {loading ? <LoaderCircle className="diagnostic-spinner" aria-hidden="true" /> : <Search aria-hidden="true" />}
          {loading ? "Running the live check…" : buttonLabel}
        </button>
      </form>

      {error ? <p className="form-error diagnostic-error" role="alert">{error}</p> : null}

      {report ? (
        <section className="diagnostic-results" aria-live="polite">
          <header>
            <div>
              <p className="eyebrow">Live report</p>
              <h2>{report.finalUrl.replace(/^https?:\/\//, "")}</h2>
              <p>Checked {new Date(report.checkedAt).toLocaleString()}</p>
            </div>
          </header>

          <div className="diagnostic-summary">
            <strong>What this means</strong>
            <p>{report.summary}</p>
          </div>

          {report.preview ? (
            <div className="social-result-preview">
              {report.preview.imageUrl ? (
                // Remote result URLs intentionally bypass the Next image optimizer.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={report.preview.imageUrl} alt="Social sharing image returned by the checked page" />
              ) : (
                <div className="social-result-no-image">No sharing image returned</div>
              )}
              <div>
                <span>{report.preview.siteName || new URL(report.finalUrl).hostname}</span>
                <strong>{report.preview.title || "No sharing title returned"}</strong>
                <p>{report.preview.description || "No sharing description returned."}</p>
              </div>
            </div>
          ) : null}

          {report.facts.length ? (
            <dl className="diagnostic-facts">
              {report.facts.map((fact, index) => (
                <div key={`${fact.label}-${index}`}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {report.findings.length ? (
            <div className="diagnostic-findings">
              {report.findings.map((finding, index) => (
                <Finding finding={finding} key={`${finding.title}-${index}`} />
              ))}
            </div>
          ) : (
            <p className="diagnostic-no-findings">
              The workflow did not return individual findings. Read the summary and facts above; do not interpret an empty list as a clean bill of health.
            </p>
          )}

          <p className="tool-disclaimer">{report.disclaimer}</p>
        </section>
      ) : null}
    </div>
  );
}
