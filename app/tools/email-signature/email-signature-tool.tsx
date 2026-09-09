"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Code2 } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import { buildEmailSignature } from "@/lib/free-tools";

function CopySignatureButton({
  html,
  plain,
}: {
  html: string;
  plain: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function copySignature() {
    try {
      if (navigator.clipboard.write && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plain], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(plain);
      }
      setState("copied");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 2200);
  }

  return (
    <button className="button" type="button" onClick={copySignature}>
      {state === "copied" ? (
        <Check aria-hidden="true" />
      ) : (
        <Clipboard aria-hidden="true" />
      )}
      {state === "copied"
        ? "Signature copied"
        : state === "error"
          ? "Copy failed"
          : "Copy signature"}
    </button>
  );
}

export function EmailSignatureTool() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [accent, setAccent] = useState("#d9420b");
  const signature = useMemo(
    () =>
      buildEmailSignature({
        name,
        role,
        business,
        phone,
        email,
        website,
        accent,
      }),
    [accent, business, email, name, phone, role, website],
  );

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free email signature builder"
        title={
          <>
            End every email with <em>clear next steps.</em>
          </>
        }
        description="Build a lightweight signature with contact details that stay clickable. It uses text instead of a remotely hosted logo, so there is less to break or block."
      />

      <div className="utility-grid">
        <section
          className="tool-input-panel"
          aria-labelledby="signature-input-title"
        >
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="signature-input-title">Add the public details</h2>
              <p>Leave out anything you do not want included.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label>
              Your name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                placeholder="Alex Morgan"
              />
            </label>
            <label>
              Job title
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                autoComplete="organization-title"
                placeholder="Owner"
              />
            </label>
            <label className="tool-field-wide">
              Business name
              <input
                value={business}
                onChange={(event) => setBusiness(event.target.value)}
                autoComplete="organization"
                placeholder="Morgan Home Services"
              />
            </label>
            <label>
              Phone
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                type="tel"
                autoComplete="tel"
                placeholder="(252) 555-0123"
              />
            </label>
            <label>
              Email
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                autoComplete="email"
                placeholder="alex@example.com"
              />
            </label>
            <label className="tool-field-wide">
              Website
              <input
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                inputMode="url"
                autoComplete="url"
                placeholder="example.com"
              />
            </label>
            <label className="tool-color-field">
              Accent color
              <span className="color-input-row">
                <input
                  type="color"
                  value={accent}
                  onChange={(event) => setAccent(event.target.value)}
                  aria-label="Choose signature accent color"
                />
                <input
                  value={accent}
                  onChange={(event) => setAccent(event.target.value)}
                  maxLength={7}
                  aria-label="Signature accent color hex value"
                />
              </span>
            </label>
          </div>
        </section>

        <section
          className="tool-output-panel signature-output"
          aria-labelledby="signature-output-title"
        >
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="signature-output-title">Copy the finished signature</h2>
              <p>Paste it into the signature editor inside your email settings.</p>
            </div>
          </div>

          <div
            className="signature-preview"
            style={{ borderLeftColor: signature.accent }}
          >
            <strong>{name.trim() || "Your name"}</strong>
            <span>
              {[role.trim(), business.trim() || "Your business"]
                .filter(Boolean)
                .join(" | ")}
            </span>
            <div>
              {phone.trim() ? <a href={`tel:${phone}`}>{phone}</a> : null}
              {email.trim() ? <a href={`mailto:${email}`}>{email}</a> : null}
              {signature.websiteUrl ? (
                <a
                  href={signature.websiteUrl}
                  style={{ color: signature.accent }}
                  target="_blank"
                  rel="noreferrer"
                >
                  {signature.websiteUrl
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")}
                </a>
              ) : null}
            </div>
          </div>

          <div className="tool-action-row">
            <CopySignatureButton html={signature.html} plain={signature.plain} />
            <CopyButton
              text={signature.html}
              label="Copy HTML"
              className="tool-copy-button"
            />
          </div>

          <p className="tool-accuracy-note">
            <Code2 aria-hidden="true" /> Email programs format signatures
            differently. Send yourself a test from both desktop and phone
            before using it with customers.
          </p>
        </section>
      </div>
    </div>
  );
}
