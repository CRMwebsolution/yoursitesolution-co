"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import { buildReviewReplies } from "@/lib/free-tools";

export function ReviewReplyTool() {
  const [businessName, setBusinessName] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [service, setService] = useState("");
  const [positiveDetail, setPositiveDetail] = useState("");
  const [concern, setConcern] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [sentiment, setSentiment] = useState<
    "positive" | "mixed" | "negative"
  >("positive");
  const [tone, setTone] = useState<"warm" | "direct">("warm");
  const replies = useMemo(
    () =>
      buildReviewReplies({
        businessName,
        reviewerName,
        service,
        positiveDetail,
        concern,
        nextStep,
        sentiment,
        tone,
      }),
    [
      businessName,
      concern,
      nextStep,
      positiveDetail,
      reviewerName,
      sentiment,
      service,
      tone,
    ],
  );

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free customer review reply writer"
        title={
          <>
            Reply professionally without <em>inventing the story.</em>
          </>
        }
        description="Build a short and a fuller public reply from details you know are accurate. The drafts avoid quoting private customer information or claiming a resolution you did not provide."
      />

      <div className="utility-grid">
        <section
          className="tool-input-panel"
          aria-labelledby="review-reply-input-title"
        >
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="review-reply-input-title">Add only verified details</h2>
              <p>Leave a field blank instead of guessing what happened.</p>
            </div>
          </div>

          <fieldset className="tone-choice review-sentiment-choice">
            <legend>Overall review</legend>
            <div className="segmented-options segmented-options-three">
              {(["positive", "mixed", "negative"] as const).map((option) => (
                <label
                  key={option}
                  className={sentiment === option ? "is-on" : ""}
                >
                  <input
                    type="radio"
                    checked={sentiment === option}
                    onChange={() => setSentiment(option)}
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="tool-field-grid tool-fields-spaced">
            <label>
              Business name
              <input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Acme Home Services"
              />
            </label>
            <label>
              Reviewer first name (optional)
              <input
                value={reviewerName}
                onChange={(event) => setReviewerName(event.target.value)}
                placeholder="Jordan"
              />
            </label>
            <label className="tool-field-wide">
              Service or visit (optional)
              <input
                value={service}
                onChange={(event) => setService(event.target.value)}
                placeholder="the water-heater installation"
              />
            </label>
            <label className="tool-field-wide">
              Positive detail the customer mentioned (optional)
              <input
                value={positiveDetail}
                onChange={(event) => setPositiveDetail(event.target.value)}
                placeholder="the technician arrived on time"
              />
            </label>
            {sentiment !== "positive" ? (
              <label className="tool-field-wide">
                Concern you can safely acknowledge (optional)
                <input
                  value={concern}
                  onChange={(event) => setConcern(event.target.value)}
                  placeholder="the delay in our arrival window"
                />
              </label>
            ) : null}
            {sentiment !== "positive" ? (
              <label className="tool-field-wide">
                Honest private next step (optional)
                <input
                  value={nextStep}
                  onChange={(event) => setNextStep(event.target.value)}
                  placeholder="Please call our office at 555-0123 and ask for Alex"
                />
                <span>Do not say the issue was fixed unless it actually was.</span>
              </label>
            ) : null}
          </div>

          <fieldset className="tone-choice">
            <legend>Writing style</legend>
            <div className="segmented-options">
              {(["warm", "direct"] as const).map((option) => (
                <label key={option} className={tone === option ? "is-on" : ""}>
                  <input
                    type="radio"
                    checked={tone === option}
                    onChange={() => setTone(option)}
                  />
                  {option === "warm" ? "Warm" : "Short and direct"}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section
          className="tool-output-panel"
          aria-labelledby="review-reply-output-title"
        >
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="review-reply-output-title">Check the reply before posting</h2>
              <p>Match it against the real review, customer record, and business policy.</p>
            </div>
          </div>

          {sentiment !== "positive" ? (
            <p className="tool-inline-warning">
              <AlertTriangle aria-hidden="true" />
              Keep account details, health information, payment disputes,
              employee information, and other private facts out of a public response.
            </p>
          ) : null}

          <div className="message-output-list">
            <article>
              <div className="message-output-heading">
                <div>
                  <span>Short reply</span>
                  <small>Concise public response</small>
                </div>
                <CopyButton text={replies.short} />
              </div>
              <p>{replies.short}</p>
            </article>
            <article>
              <div className="message-output-heading">
                <div>
                  <span>Full reply</span>
                  <small>More context without a long defense</small>
                </div>
                <CopyButton text={replies.full} />
              </div>
              <p>{replies.full}</p>
            </article>
          </div>

          <p className="tool-accuracy-note">
            These are writing drafts, not legal, reputation-management, or
            customer-service advice. Escalate threats, safety issues,
            discrimination claims, and legal disputes to an appropriate human reviewer.
          </p>
        </section>
      </div>
    </div>
  );
}
