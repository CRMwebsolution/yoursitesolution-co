"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { ToolFollowupForm } from "@/components/tool-followup-form";
import {
  buildReviewText,
  reviewJobs,
  reviewTrades,
} from "@/config/tools";

export function ReviewTextTool() {
  const [ownerName, setOwnerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [trade, setTrade] = useState<(typeof reviewTrades)[number]>(
    "General service",
  );
  const [job, setJob] = useState<(typeof reviewJobs)[number]>("a service call");
  const [reviewLink, setReviewLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [logged, setLogged] = useState(false);

  const message = useMemo(
    () =>
      buildReviewText({
        ownerName,
        businessName,
        customerName,
        trade,
        job,
        reviewLink,
      }),
    [ownerName, businessName, customerName, trade, job, reviewLink],
  );

  async function logRun() {
    if (logged) return;
    setLogged(true);
    await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "tool_run",
        tool: "review-text",
        business_name: businessName,
        tool_input: { trade, job, has_link: Boolean(reviewLink.trim()) },
        tool_result: { message },
      }),
    }).catch(() => undefined);
  }

  async function handleCopy(event: FormEvent) {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
    void logRun();
  }

  return (
    <div className="tool-stage">
      <form className="lead-form tool-form" onSubmit={handleCopy}>
        <div className="form-grid">
          <label>
            Your first name
            <input
              value={ownerName}
              onChange={(event) => setOwnerName(event.target.value)}
              name="name"
              type="text"
              autoComplete="given-name"
            />
          </label>
          <label>
            Business name
            <input
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              name="business_name"
              type="text"
              autoComplete="organization"
            />
          </label>
          <label>
            Customer first name
            <input
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              name="customer_name"
              type="text"
              placeholder="Mike"
            />
          </label>
          <label>
            Type of work
            <select
              value={trade}
              onChange={(event) =>
                setTrade(event.target.value as (typeof reviewTrades)[number])
              }
              name="trade"
            >
              {reviewTrades.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            What you just finished
            <select
              value={job}
              onChange={(event) =>
                setJob(event.target.value as (typeof reviewJobs)[number])
              }
              name="job"
            >
              {reviewJobs.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            Google review link
            <input
              value={reviewLink}
              onChange={(event) => setReviewLink(event.target.value)}
              name="review_link"
              type="url"
              placeholder="https://g.page/r/…"
            />
          </label>
        </div>
        <div className="review-preview">
          <p className="eyebrow">Text you can send</p>
          <p>{message}</p>
        </div>
        <div className="form-submit-row">
          <button className="button" type="submit">
            {copied ? (
              <>
                Copied <Check aria-hidden="true" />
              </>
            ) : (
              <>
                Copy the text <ArrowRight aria-hidden="true" />
              </>
            )}
          </button>
          <p>Keep it short. Send it the same day the job is done.</p>
        </div>
      </form>

      <ToolFollowupForm
        tool="review-text"
        heading="If you want the review link, website, and follow-up handled for you, tell me."
        context={{ trade, job, business_name: businessName }}
      />
    </div>
  );
}
