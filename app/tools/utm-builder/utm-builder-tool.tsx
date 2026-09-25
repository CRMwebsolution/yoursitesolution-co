"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Download, ExternalLink, Link2, QrCode } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import { buildUtmUrl } from "@/lib/free-tools";

function safeFilename(value: string) {
  const name = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${name || "campaign"}-qr-code.png`;
}

export function UtmBuilderTool() {
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [qrResult, setQrResult] = useState({
    url: "",
    dataUrl: "",
    error: "",
  });
  const result = useMemo(
    () => buildUtmUrl({ url, source, medium, campaign, term, content }),
    [campaign, content, medium, source, term, url],
  );
  const missingBasics = [
    !source.trim() ? "source" : "",
    !medium.trim() ? "medium" : "",
    !campaign.trim() ? "campaign" : "",
  ].filter(Boolean);
  const campaignReady = result.valid && missingBasics.length === 0;
  const qrFilename = useMemo(() => safeFilename(campaign), [campaign]);
  const qrDataUrl =
    campaignReady && qrResult.url === result.url ? qrResult.dataUrl : "";
  const qrError =
    campaignReady && qrResult.url === result.url ? qrResult.error : "";

  useEffect(() => {
    let active = true;

    if (!campaignReady) {
      return;
    }

    QRCode.toDataURL(result.url, {
      width: 900,
      margin: 3,
      errorCorrectionLevel: "M",
      color: { dark: "#0b1624", light: "#fffdf8" },
    })
      .then((dataUrl) => {
        if (!active) return;
        setQrResult({ url: result.url, dataUrl, error: "" });
      })
      .catch(() => {
        if (!active) return;
        setQrResult({
          url: result.url,
          dataUrl: "",
          error: "The finished campaign link could not be turned into a QR code.",
        });
      });

    return () => {
      active = false;
    };
  }, [campaignReady, result.url]);

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free campaign link builder"
        title={
          <>
            Know which promotion <em>earned the visit.</em>
          </>
        }
        description="Add tracking labels to a page link so compatible analytics can separate visits from flyers, email, social posts, and ads. Download a matching QR code for printed campaigns."
      />

      <div className="utility-grid">
        <section className="tool-input-panel" aria-labelledby="utm-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="utm-input-title">Name the link and campaign</h2>
              <p>
                These labels tell your analytics where a visitor found the link
                and which promotion brought them to your website.
              </p>
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
                placeholder="https://yourbusiness.com/spring-special"
              />
              <span>
                The page people should see after clicking or scanning. Example:
                yourbusiness.com/spring-special.
              </span>
            </label>
            <label>
              Campaign source
              <input
                value={source}
                onChange={(event) => setSource(event.target.value)}
                placeholder="food-lion"
              />
              <span>
                The exact place that sent the visitor. Example: facebook,
                food-lion, or carteret-speedway.
              </span>
            </label>
            <label>
              Campaign medium
              <input
                value={medium}
                onChange={(event) => setMedium(event.target.value)}
                placeholder="print"
              />
              <span>
                The kind of promotion they used. Example: social, email, print,
                banner, or paid-ad.
              </span>
            </label>
            <label className="tool-field-wide">
              Campaign name
              <input
                value={campaign}
                onChange={(event) => setCampaign(event.target.value)}
                placeholder="spring-trailer-special"
              />
              <span>
                One name that groups every link from the same promotion.
                Example: spring-trailer-special.
              </span>
            </label>
            <label>
              Search term (optional)
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="dump trailer rental"
              />
              <span>
                For a paid search ad, enter the words you targeted. Leave this
                blank for flyers, email, banners, and social posts.
              </span>
            </label>
            <label>
              Link variation (optional)
              <input
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="front-door-flyer"
              />
              <span>
                Use this to compare two versions or placements of the same
                campaign. Example: front-door-flyer or orange-button.
              </span>
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

          <section className="campaign-qr-section" aria-labelledby="campaign-qr-title">
            <div className="campaign-qr-heading">
              <QrCode aria-hidden="true" />
              <div>
                <h3 id="campaign-qr-title">Campaign QR code</h3>
                <p>
                  This QR code opens the tagged campaign link above, so scans
                  can be identified by the same campaign labels.
                </p>
              </div>
            </div>

            <div className="campaign-qr-grid" aria-live="polite">
              <div className="campaign-qr-preview">
                {qrDataUrl ? (
                  // A generated data URL cannot use the Next image optimizer.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrDataUrl} alt="QR code for the tagged campaign link" />
                ) : (
                  <div className="campaign-qr-empty">
                    <QrCode aria-hidden="true" />
                    <p>
                      Add a valid destination, source, medium, and campaign name
                      to create the QR code.
                    </p>
                  </div>
                )}
              </div>

              <div className="campaign-qr-actions">
                <a
                  className={`button${qrDataUrl ? "" : " is-disabled"}`}
                  href={qrDataUrl || undefined}
                  download={qrFilename}
                  aria-disabled={!qrDataUrl}
                  onClick={(event) => {
                    if (!qrDataUrl) event.preventDefault();
                  }}
                  tabIndex={qrDataUrl ? undefined : -1}
                >
                  <Download aria-hidden="true" /> Download QR code
                </a>
                <p>
                  Scan it with a phone before printing. Keep the light border
                  around the code intact.
                </p>
              </div>
            </div>
            {qrError ? <p className="form-error">{qrError}</p> : null}
          </section>

          <p className="tool-accuracy-note">
            This builds the tagged URL. Your analytics platform still needs to
            be installed and configured to record campaign visits.
          </p>
        </section>
      </div>
    </div>
  );
}
