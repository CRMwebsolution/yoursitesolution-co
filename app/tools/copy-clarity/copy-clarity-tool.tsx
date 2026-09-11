"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FileSearch } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { inspectCopyClarity } from "@/lib/free-tools";

export function CopyClarityTool() {
  const [copy, setCopy] = useState("");
  const result = useMemo(() => inspectCopyClarity(copy), [copy]);
  const hasCopy = Boolean(copy.trim());

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free website copy clarity check"
        title={
          <>
            Find the wording that makes visitors <em>work too hard.</em>
          </>
        }
        description="This checks measurable writing patterns and points to specific edits. It does not invent a grade, judge truthfulness, or replace a human who knows your customers."
      />

      <div className="utility-grid">
        <section className="tool-input-panel" aria-labelledby="clarity-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="clarity-input-title">Paste one section or page</h2>
              <p>Headings and paragraph breaks help produce a more useful inspection.</p>
            </div>
          </div>
          <label className="standalone-tool-field">
            Website wording
            <textarea
              value={copy}
              onChange={(event) => setCopy(event.target.value.slice(0, 12000))}
              placeholder="Paste your homepage headline, service section, About page, or call to action..."
              rows={18}
            />
            <span>{copy.length.toLocaleString()} / 12,000 characters</span>
          </label>
        </section>

        <section className="tool-output-panel" aria-labelledby="clarity-output-title">
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="clarity-output-title">Make the next edits</h2>
              <p>These are flags to review, not automatic proof that wording is good or bad.</p>
            </div>
          </div>

          <dl className="copy-fact-grid" aria-live="polite">
            <div><dt>Words</dt><dd>{result.words}</dd></div>
            <div><dt>Sentences</dt><dd>{result.sentences}</dd></div>
            <div><dt>Average sentence</dt><dd>{hasCopy ? `${result.averageSentenceLength.toFixed(1)} words` : "—"}</dd></div>
            <div><dt>Clear next step found</dt><dd>{hasCopy ? (result.hasNextStep ? "Yes" : "No") : "—"}</dd></div>
          </dl>

          <div className="clarity-findings">
            {hasCopy && !result.findings.length ? (
              <article className="clarity-finding clarity-finding-good">
                <CheckCircle2 aria-hidden="true" />
                <div>
                  <h3>No mechanical flags found</h3>
                  <p>The copy avoided the patterns checked here. Still verify that it is accurate, specific, and persuasive to a real customer.</p>
                </div>
              </article>
            ) : (
              result.findings.map((finding, index) => (
                <article className="clarity-finding" key={`${finding.title}-${index}`}>
                  <FileSearch aria-hidden="true" />
                  <div>
                    <h3>{finding.title}</h3>
                    <p>{finding.detail}</p>
                  </div>
                </article>
              ))
            )}
          </div>

          <p className="tool-accuracy-note">
            Sentence and paragraph thresholds are practical editing prompts, not universal rules. Keep necessary technical details where customers need them.
          </p>
        </section>
      </div>
    </div>
  );
}
