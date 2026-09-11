"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { Download, LockKeyhole, QrCode } from "lucide-react";
import { CopyButton } from "../copy-button";
import { BrowserToolHeader } from "../browser-tool-header";

function safeFilename(value: string) {
  const name = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${name || "qr-code"}.png`;
}

export function QrCodeTool() {
  const [content, setContent] = useState("https://yoursitesolution.com");
  const [label, setLabel] = useState("website-link");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const value = content.trim();
    if (!value) {
      return;
    }

    QRCode.toDataURL(value, {
      width: 900,
      margin: 3,
      errorCorrectionLevel: "M",
      color: { dark: "#0b1624", light: "#fffdf8" },
    })
      .then((result) => {
        if (!active) return;
        setDataUrl(result);
        setError("");
      })
      .catch(() => {
        if (!active) return;
        setDataUrl("");
        setError("That content could not be turned into a QR code.");
      });

    return () => {
      active = false;
    };
  }, [content]);

  const filename = useMemo(() => safeFilename(label), [label]);
  const hasCode = Boolean(content.trim() && dataUrl);

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free QR code generator"
        title={
          <>
            Turn one useful destination into <em>one quick scan.</em>
          </>
        }
        description="Paste the exact page, review link, payment link, phone link, or short text you want the code to open. Download a high-resolution PNG when it looks right."
      />

      <div className="utility-grid qr-tool-grid">
        <section className="tool-input-panel" aria-labelledby="qr-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="qr-input-title">Choose what the scan opens</h2>
              <p>Use the final public link—not a private preview or editing URL.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label className="tool-field-wide">
              Link or text to encode
              <textarea
                value={content}
                onChange={(event) => {
                  const next = event.target.value;
                  setContent(next);
                  if (!next.trim()) {
                    setDataUrl("");
                    setError("");
                  }
                }}
                rows={6}
                maxLength={2000}
                placeholder="https://example.com/review"
              />
              <span>{content.length}/2,000 characters</span>
            </label>
            <label className="tool-field-wide">
              Download filename
              <input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                type="text"
                placeholder="counter-review-sign"
              />
              <span>The downloaded file will be named {filename}.</span>
            </label>
          </div>
          <p className="tool-accuracy-note">
            <LockKeyhole aria-hidden="true" /> The code is generated on this
            device. The link or text is not uploaded or saved.
          </p>
        </section>

        <section
          className="tool-output-panel qr-output"
          aria-labelledby="qr-output-title"
        >
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="qr-output-title">Download and test it</h2>
              <p>Scan it with a phone before printing a sign or ordering materials.</p>
            </div>
          </div>

          <div className="qr-preview" aria-live="polite">
            {hasCode ? (
              // A generated data URL cannot use the Next image optimizer.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dataUrl} alt="Generated QR code preview" />
            ) : (
              <div className="tool-empty-preview">
                <QrCode aria-hidden="true" />
                <p>Add a link or short message to create the code.</p>
              </div>
            )}
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <div className="tool-action-row">
            <a
              className={`button${hasCode ? "" : " is-disabled"}`}
              href={hasCode ? dataUrl : undefined}
              download={filename}
              aria-disabled={!hasCode}
              onClick={(event) => {
                if (!hasCode) event.preventDefault();
              }}
              tabIndex={hasCode ? undefined : -1}
            >
              <Download aria-hidden="true" /> Download PNG
            </a>
            <CopyButton
              text={content.trim()}
              label="Copy encoded text"
              disabled={!content.trim()}
            />
          </div>

          <p className="tool-accuracy-note">
            QR readability depends on final size, contrast, print quality, and
            distance. Leave the light border around the code intact.
          </p>
        </section>
      </div>
    </div>
  );
}
