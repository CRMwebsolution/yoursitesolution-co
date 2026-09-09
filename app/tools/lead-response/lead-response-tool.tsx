"use client";

import { useMemo, useState } from "react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import { buildLeadResponses } from "@/lib/free-tools";

export function LeadResponseTool() {
  const [businessName, setBusinessName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [tone, setTone] = useState<"warm" | "direct">("warm");
  const messages = useMemo(
    () =>
      buildLeadResponses({
        businessName,
        customerName,
        service,
        nextStep,
        contactLink,
        tone,
      }),
    [businessName, contactLink, customerName, nextStep, service, tone],
  );

  const outputs = [
    ["Immediate text", "Send when the inquiry arrives", messages.immediate],
    ["After-hours text", "Use when nobody is available", messages.afterHours],
    ["Email", messages.emailSubject, messages.emailBody],
    ["Follow-up text", "Use once if the lead has not replied", messages.followUp],
  ] as const;

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free new lead response kit"
        title={
          <>
            Give a new customer a <em>clear next step.</em>
          </>
        }
        description="Create four practical replies from facts you control. Review every message before sending and never promise timing or availability you cannot meet."
      />

      <div className="utility-grid">
        <section className="tool-input-panel" aria-labelledby="lead-kit-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="lead-kit-input-title">Set the response details</h2>
              <p>Write the next step as an instruction, such as “Choose a call time here.”</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label>
              Business name
              <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Acme Home Services" />
            </label>
            <label>
              Customer name (optional)
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Jordan" />
            </label>
            <label className="tool-field-wide">
              Service or request
              <input value={service} onChange={(event) => setService(event.target.value)} placeholder="a water-heater replacement" />
            </label>
            <label className="tool-field-wide">
              Next step
              <input value={nextStep} onChange={(event) => setNextStep(event.target.value)} placeholder="Choose a 15-minute call time here" />
            </label>
            <label className="tool-field-wide">
              Booking or contact link (optional)
              <input inputMode="url" value={contactLink} onChange={(event) => setContactLink(event.target.value)} placeholder="https://example.com/schedule" />
            </label>
          </div>
          <fieldset className="tone-choice">
            <legend>Writing style</legend>
            <div className="segmented-options">
              {(["warm", "direct"] as const).map((option) => (
                <label key={option} className={tone === option ? "is-on" : ""}>
                  <input type="radio" checked={tone === option} onChange={() => setTone(option)} />
                  {option === "warm" ? "Warm" : "Short and direct"}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="tool-output-panel" aria-labelledby="lead-kit-output-title">
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="lead-kit-output-title">Review before sending</h2>
              <p>Replace any bracketed placeholder and confirm the next step is accurate.</p>
            </div>
          </div>
          <div className="message-output-list">
            {outputs.map(([label, note, body]) => (
              <article key={label}>
                <div className="message-output-heading">
                  <div>
                    <span>{label}</span>
                    <small>{note}</small>
                  </div>
                  <CopyButton text={body} />
                </div>
                <p className={label === "Email" ? "email-body" : ""}>{body}</p>
              </article>
            ))}
          </div>
          <p className="tool-accuracy-note">
            This writes response drafts; it does not send messages or store lead information. Obtain any consent required before sending automated texts or emails.
          </p>
        </section>
      </div>
    </div>
  );
}
