"use client";

import { useMemo, useState } from "react";
import { Eye, LockKeyhole, Search } from "lucide-react";
import { CopyButton } from "../copy-button";
import { buildSearchPreview } from "@/lib/free-tools";

function lengthRead(value: string, minimum: number, maximum: number) {
  if (value.length < minimum) {
    return { tone: "short", text: "Room to be more specific" };
  }
  if (value.length > maximum) {
    return { tone: "long", text: "May be shortened in results" };
  }
  return { tone: "good", text: "In a useful working range" };
}

function LengthGuide({
  value,
  minimum,
  maximum,
}: {
  value: string;
  minimum: number;
  maximum: number;
}) {
  const read = lengthRead(value, minimum, maximum);

  return (
    <div className={`length-guide length-guide-${read.tone}`}>
      <span>{value.length} characters</span>
      <span>{read.text}</span>
    </div>
  );
}

export function SearchPreviewTool() {
  const [businessName, setBusinessName] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [differentiator, setDifferentiator] = useState("");
  const [url, setUrl] = useState("");

  const copy = useMemo(
    () =>
      buildSearchPreview({
        businessName,
        service,
        location,
        differentiator,
        url,
      }),
    [businessName, service, location, differentiator, url],
  );

  return (
    <div className="utility-tool">
      <header className="utility-intro">
        <div>
          <p className="eyebrow eyebrow-light">Free Google search preview</p>
          <h1>
            Make the search result <em>earn the click.</em>
          </h1>
          <p className="lede lede-light">
            Draft the three pieces a service page needs: a clear page title,
            search description, and main heading. See the preview as you type.
          </p>
        </div>
        <p className="browser-only-note">
          <LockKeyhole aria-hidden="true" /> Runs in your browser. Nothing you
          type here is submitted or saved.
        </p>
      </header>

      <div className="utility-grid">
        <section className="tool-input-panel" aria-labelledby="search-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="search-input-title">Describe the page</h2>
              <p>Use one service and one service area per page.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label>
              Business name
              <input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                type="text"
                autoComplete="organization"
                placeholder="Smith Plumbing"
              />
            </label>
            <label>
              Main service on this page
              <input
                value={service}
                onChange={(event) => setService(event.target.value)}
                type="text"
                placeholder="Emergency plumbing"
              />
            </label>
            <label>
              City or service area
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                type="text"
                autoComplete="address-level2"
                placeholder="Ottawa, IL"
              />
            </label>
            <label>
              Website or page address
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="smithplumbing.com/emergency"
              />
            </label>
            <label className="tool-field-wide">
              One reason to choose you
              <input
                value={differentiator}
                onChange={(event) => setDifferentiator(event.target.value)}
                type="text"
                placeholder="Same-day appointments with upfront pricing"
              />
            </label>
          </div>
        </section>

        <section className="tool-output-panel search-output" aria-labelledby="search-output-title">
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="search-output-title">Preview and copy</h2>
              <p>Google may rewrite or shorten any search listing.</p>
            </div>
          </div>

          <div className="search-preview-card">
            <div className="search-preview-site">
              <span aria-hidden="true"><Search /></span>
              <div>
                <strong>{businessName.trim() || "Your business"}</strong>
                <p>{copy.displayUrl}</p>
              </div>
            </div>
            <p className="search-preview-title">{copy.title}</p>
            <p className="search-preview-description">{copy.description}</p>
          </div>

          <div className="generated-copy-list">
            <article>
              <div className="generated-copy-heading">
                <div>
                  <span>Page title</span>
                  <LengthGuide value={copy.title} minimum={40} maximum={60} />
                </div>
                <CopyButton text={copy.title} label="Copy title" />
              </div>
              <p>{copy.title}</p>
            </article>
            <article>
              <div className="generated-copy-heading">
                <div>
                  <span>Meta description</span>
                  <LengthGuide value={copy.description} minimum={120} maximum={160} />
                </div>
                <CopyButton text={copy.description} label="Copy description" />
              </div>
              <p>{copy.description}</p>
            </article>
            <article>
              <div className="generated-copy-heading">
                <div>
                  <span>Main page heading (H1)</span>
                </div>
                <CopyButton text={copy.heading} label="Copy heading" />
              </div>
              <p>{copy.heading}</p>
            </article>
          </div>

          <p className="tool-accuracy-note">
            <Eye aria-hidden="true" /> Character counts are a writing guide,
            not a ranking score or a guarantee that Google will show the exact copy.
          </p>
        </section>
      </div>
    </div>
  );
}

