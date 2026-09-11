"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Link2 } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import { buildUtmUrl } from "@/lib/free-tools";

export function UtmBuilderTool() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const result = useMemo(
    () => buildUtmUrl({ url, source, medium, campaign, term, content }),
    [campaign, content, medium, source, term, url],
  );
  const missingBasics = [
    !source.trim() ? "source" : "",
    !medium.trim() ? "medium" : "",
    !campaign.trim() ? "campaign" : "",
  ].filter(Boolean);

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free campaign link builder"
        title={
          <>
            Know which promotion <em>earned the visit.</em>
          </>
        }
        description="Add standard UTM tags to a page link. The destination still opens normally, while compatible analytics can separate traffic by source, medium, and campaign."
      />

      <div className="utility-grid">
        <section className="tool-input-panel" aria-labelledby="utm-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="utm-input-title">Name the link and campaign</h2>
              <p>Use short, consistent names such as facebook, email, or fall-flyer.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label className="tool-field-wide">
              Destination page
              <input
                type="text"
                inputMode="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://example.com/spring-special"
              />
            </label>
            <label>
              Campaign source
              <input
                value={source}
                onChange={(event) => setSource(event.target.value)}
                placeholder="facebook"
              />
              <span>Where the visitor found the link.</span>
            </label>
            <label>
              Campaign medium
              <input
                value={medium}
                onChange={(event) => setMedium(event.target.value)}
                placeholder="social"
              />
              <span>The general channel: social, email, print, or cpc.</span>
            </label>
            <label className="tool-field-wide">
              Campaign name
              <input
                value={campaign}
                onChange={(event) => setCampaign(event.target.value)}
                placeholder="spring-cleanup"
              />
            </label>
            <label>
              Search term (optional)
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="dump trailer rental"
              />
            </label>
            <label>
              Link variation (optional)
              <input
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="orange-button"
              />
            </label>
          </div>
        </section>

        <section className="tool-output-panel" aria-labelledby="utm-output-title">
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="utm-output-title">Use the tagged link</h2>
              <p>The original page and non-campaign query parameters stay intact.</p>
            </div>
          </div>

          <div className="link-result-card" aria-live="polite">
            <Link2 aria-hidden="true" />
            <div>
              <span>Campaign URL</span>
              <p>{result.displayUrl}</p>
            </div>
          </div>

          {result.error ? (
            <p className="tool-inline-warning">{result.error}</p>
          ) : missingBasics.length ? (
            <p className="tool-inline-warning">
              Add the {missingBasics.join(", ")} field
              {missingBasics.length === 1 ? "" : "s"} before sharing the link.
            </p>
          ) : null}

          {result.parameters.length ? (
            <dl className="parameter-list">
              {result.parameters.map((parameter) => (
                <div key={parameter.label}>
                  <dt>{parameter.label}</dt>
                  <dd>{parameter.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="tool-action-row">
            <CopyButton
              text={result.url}
              label="Copy campaign link"
              disabled={!result.valid || Boolean(missingBasics.length)}
            />
            {result.valid ? (
              <a
                className="tool-secondary-link"
                href={result.url}
                target="_blank"
                rel="noreferrer"
              >
                Test destination <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
          </div>

          <p className="tool-accuracy-note">
            This builds the tagged URL. Your analytics platform still needs to
            be installed and configured to record campaign visits.
          </p>
        </section>
      </div>
    </div>
  );
}
