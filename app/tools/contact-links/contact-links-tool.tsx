"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Mail, MessageSquareText, Phone } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import { buildContactLinks } from "@/lib/free-tools";

function LinkResult({
  icon: Icon,
  label,
  href,
  html,
}: {
  icon: typeof Phone;
  label: string;
  href: string;
  html: string;
}) {
  return (
    <article className="contact-link-card">
      <div className="contact-link-heading">
        <Icon aria-hidden="true" />
        <div>
          <h3>{label}</h3>
          <p>{href || "Add the required contact detail."}</p>
        </div>
      </div>
      <div className="contact-link-actions">
        <CopyButton text={href} label="Copy link" disabled={!href} />
        <CopyButton text={html} label="Copy HTML" disabled={!href} />
        {href ? (
          <a href={href} className="tool-secondary-link">
            Test <ExternalLink aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function ContactLinksTool() {
  const [phone, setPhone] = useState("");
  const [textMessage, setTextMessage] = useState(
    "Hi! I have a question about your services.",
  );
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("Website inquiry");
  const [emailBody, setEmailBody] = useState(
    "Hi, I would like more information about your services.",
  );
  const links = useMemo(
    () =>
      buildContactLinks({
        phone,
        textMessage,
        email,
        emailSubject,
        emailBody,
      }),
    [email, emailBody, emailSubject, phone, textMessage],
  );

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free contact link builder"
        title={
          <>
            Make calling, texting, or emailing <em>one easy tap.</em>
          </>
        }
        description="Build working contact links for website buttons, digital flyers, email signatures, or QR codes. Copy the link itself or a simple HTML version."
      />

      <div className="utility-grid">
        <section
          className="tool-input-panel"
          aria-labelledby="contact-input-title"
        >
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="contact-input-title">Add the contact details</h2>
              <p>Only the phone number is used for the call and text links.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label className="tool-field-wide">
              Business phone
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="(252) 555-0123"
              />
            </label>
            <label className="tool-field-wide">
              Prefilled text message
              <textarea
                rows={4}
                value={textMessage}
                onChange={(event) => setTextMessage(event.target.value)}
                maxLength={500}
              />
            </label>
            <label className="tool-field-wide">
              Business email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="hello@example.com"
              />
            </label>
            <label className="tool-field-wide">
              Email subject
              <input
                value={emailSubject}
                onChange={(event) => setEmailSubject(event.target.value)}
              />
            </label>
            <label className="tool-field-wide">
              Prefilled email message
              <textarea
                rows={5}
                value={emailBody}
                onChange={(event) => setEmailBody(event.target.value)}
                maxLength={1500}
              />
            </label>
          </div>
        </section>

        <section
          className="tool-output-panel"
          aria-labelledby="contact-output-title"
        >
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="contact-output-title">Copy or test each link</h2>
              <p>A test opens the matching app on the device you are using.</p>
            </div>
          </div>
          <div className="contact-link-list" aria-live="polite">
            <LinkResult
              icon={Phone}
              label="Tap-to-call"
              href={links.callLink}
              html={links.callHtml}
            />
            <LinkResult
              icon={MessageSquareText}
              label="Prefilled text message"
              href={links.textLink}
              html={links.textHtml}
            />
            <LinkResult
              icon={Mail}
              label="Prefilled email"
              href={links.emailLink}
              html={links.emailHtml}
            />
          </div>
          <p className="tool-accuracy-note">
            Text-message link behavior can vary slightly between phone models
            and messaging apps. Test the finished link on the devices your
            customers use.
          </p>
        </section>
      </div>
    </div>
  );
}
