"use client";

import { useMemo, useState } from "react";
import { LockKeyhole, MessageSquareText, ShieldCheck } from "lucide-react";
import { CopyButton } from "../copy-button";
import { buildReviewRequests, type ReviewRequestInput } from "@/lib/free-tools";

export function ReviewRequestTool() {
  const [businessName, setBusinessName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [service, setService] = useState("");
  const [reviewLink, setReviewLink] = useState("");
  const [tone, setTone] = useState<ReviewRequestInput["tone"]>("warm");

  const messages = useMemo(
    () =>
      buildReviewRequests({
        businessName,
        customerName,
        service,
        reviewLink,
        tone,
      }),
    [businessName, customerName, service, reviewLink, tone],
  );

  const emailCopy = `Subject: ${messages.emailSubject}\n\n${messages.emailBody}`;

  return (
    <div className="utility-tool">
      <header className="utility-intro">
        <div>
          <p className="eyebrow eyebrow-light">Free review request kit</p>
          <h1>
            Ask while the good work is <em>still fresh.</em>
          </h1>
          <p className="lede lede-light">
            Build a same-day text, one polite follow-up, and an email. Every
            version asks for honest feedback—not a guaranteed five-star review.
          </p>
        </div>
        <p className="browser-only-note">
          <LockKeyhole aria-hidden="true" /> Runs in your browser. Nothing you
          type here is submitted or saved.
        </p>
      </header>

      <div className="utility-grid review-tool-grid">
        <section className="tool-input-panel" aria-labelledby="review-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="review-input-title">Add the job details</h2>
              <p>The messages update as you type.</p>
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
              Customer first name
              <input
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                type="text"
                autoComplete="given-name"
                placeholder="Maria"
              />
            </label>
            <label className="tool-field-wide">
              Work completed
              <input
                value={service}
                onChange={(event) => setService(event.target.value)}
                type="text"
                placeholder="the water-heater replacement"
              />
            </label>
            <label className="tool-field-wide">
              Google review link
              <input
                value={reviewLink}
                onChange={(event) => setReviewLink(event.target.value)}
                type="url"
                inputMode="url"
                placeholder="https://g.page/r/..."
              />
              <span>Add the direct link so the message is ready to send.</span>
            </label>
          </div>

          <fieldset className="tone-choice">
            <legend>Writing style</legend>
            <div className="segmented-options">
              <label className={tone === "warm" ? "is-on" : ""}>
                <input
                  type="radio"
                  name="tone"
                  value="warm"
                  checked={tone === "warm"}
                  onChange={() => setTone("warm")}
                />
                Warm
              </label>
              <label className={tone === "direct" ? "is-on" : ""}>
                <input
                  type="radio"
                  name="tone"
                  value="direct"
                  checked={tone === "direct"}
                  onChange={() => setTone("direct")}
                />
                Direct
              </label>
            </div>
          </fieldset>

          {!reviewLink.trim() ? (
            <p className="tool-inline-warning" role="status">
              <MessageSquareText aria-hidden="true" /> The preview includes a
              link placeholder until you add your review link.
            </p>
          ) : null}
        </section>

        <section className="tool-output-panel" aria-labelledby="review-output-title">
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="review-output-title">Copy the right message</h2>
              <p>Send one request and, if needed, one follow-up.</p>
            </div>
          </div>

          <div className="message-output-list">
            <article>
              <div className="message-output-heading">
                <div>
                  <span>Same-day text</span>
                  <small>{messages.sameDay.length} characters</small>
                </div>
                <CopyButton text={messages.sameDay} label="Copy text" />
              </div>
              <p>{messages.sameDay}</p>
            </article>
            <article>
              <div className="message-output-heading">
                <div>
                  <span>One polite follow-up</span>
                  <small>{messages.followUp.length} characters</small>
                </div>
                <CopyButton text={messages.followUp} label="Copy follow-up" />
              </div>
              <p>{messages.followUp}</p>
            </article>
            <article>
              <div className="message-output-heading">
                <div>
                  <span>Email</span>
                  <small>Subject + message</small>
                </div>
                <CopyButton text={emailCopy} label="Copy email" />
              </div>
              <p className="email-subject"><strong>Subject:</strong> {messages.emailSubject}</p>
              <p className="email-body">{messages.emailBody}</p>
            </article>
          </div>

          <p className="tool-accuracy-note">
            <ShieldCheck aria-hidden="true" /> Ask real customers for honest
            feedback. Do not offer a reward, pressure anyone, or ask only the
            people you expect to leave five stars.
          </p>
        </section>
      </div>
    </div>
  );
}
