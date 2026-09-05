"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

type LeadFormProps = {
  type?: "contact" | "demo";
};

export function LeadForm({ type = "contact" }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, form_type: type }),
      });

      if (!response.ok) throw new Error("Submission failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <h2>Message sent.</h2>
        <p>
          Thanks for the details. Cody will personally respond {siteConfig.responseTime}.
        </p>
        <button className="text-link" type="button" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  const isDemo = type === "demo";

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <input type="hidden" name="source" value="yoursitesolution.com" />
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${type}-company-site`}>Leave this field empty</label>
        <input
          id={`${type}-company-site`}
          name="company_site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-grid">
        <label>
          Your name <span aria-hidden="true">*</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          Business name <span aria-hidden="true">*</span>
          <input name="business_name" type="text" autoComplete="organization" required />
        </label>
        <label>
          Email <span aria-hidden="true">*</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          Best way to reach you
          <select name="preferred_contact" defaultValue="text">
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="phone">Phone call</option>
          </select>
        </label>
        <label>
          Current website
          <input name="current_website" type="url" placeholder="https://" />
        </label>
      </div>

      {isDemo ? (
        <>
          <label>
            What does the business do? <span aria-hidden="true">*</span>
            <textarea
              name="business_summary"
              rows={4}
              required
              placeholder="What you sell, who you serve, and where you work."
            />
          </label>
          <div className="form-grid">
            <label>
              Who is the website for?
              <input name="target_customer" type="text" />
            </label>
            <label>
              What should visitors do?
              <input
                name="primary_action"
                type="text"
                placeholder="Call, request a quote, book…"
              />
            </label>
          </div>
          <label>
            Pages or features you need
            <textarea name="features" rows={3} />
          </label>
          <label>
            Style, colors, or existing brand assets
            <textarea name="style_assets" rows={3} />
          </label>
        </>
      ) : (
        <>
          <div className="form-grid">
            <label>
              Rough budget
              <select name="budget" defaultValue="not-sure">
                <option value="300-749">$300–$749</option>
                <option value="750-1499">$750–$1,499</option>
                <option value="1500-2999">$1,500–$2,999</option>
                <option value="3000-plus">$3,000+</option>
                <option value="not-sure">Not sure yet</option>
              </select>
            </label>
            <label>
              Ideal timing
              <input name="timeline" type="text" placeholder="A date or general timeframe" />
            </label>
          </div>
          <label>
            Tell me what you need <span aria-hidden="true">*</span>
            <textarea
              name="details"
              rows={6}
              required
              placeholder="A new site, a rebuild, a repetitive task that needs automating—start wherever makes sense."
            />
          </label>
        </>
      )}

      <div className="form-submit-row">
        <button className="button" type="submit" disabled={status === "sending"}>
          {status === "sending"
            ? "Sending…"
            : isDemo
              ? "Request a demo"
              : "Send the details"}
          <ArrowRight aria-hidden="true" />
        </button>
        <p>
          You will get an automatic confirmation now. Cody follows up personally {siteConfig.responseTime}.
        </p>
      </div>

      {status === "error" ? (
        <p className="form-error" role="alert">
          The form did not go through. Text {siteConfig.phoneDisplay} or email{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      ) : null}
    </form>
  );
}
