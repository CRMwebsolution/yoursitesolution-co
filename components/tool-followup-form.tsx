"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

type ToolFollowupFormProps = {
  tool: "website-check";
  heading: string;
  context: Record<string, unknown>;
};

export function ToolFollowupForm({
  tool,
  heading,
  context,
}: ToolFollowupFormProps) {
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
        body: JSON.stringify({
          ...payload,
          form_type: "tool_followup",
          tool,
          tool_result: context,
        }),
      });
      if (!response.ok) throw new Error("failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="form-success tool-followup-success" role="status">
        <CheckCircle2 aria-hidden="true" />
        <h2>Got it.</h2>
        <p>
          Cody will personally respond {siteConfig.responseTime}. Text{" "}
          {siteConfig.phoneDisplay} if it is urgent.
        </p>
      </div>
    );
  }

  return (
    <form className="lead-form tool-followup" onSubmit={handleSubmit}>
      <input type="hidden" name="source" value="yoursitesolution.com" />
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${tool}-company-site`}>Leave this field empty</label>
        <input
          id={`${tool}-company-site`}
          name="company_site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <p className="eyebrow">Want help with this?</p>
      <h2>{heading}</h2>
      <div className="form-grid">
        <label>
          Your name
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label>
          Business name <span aria-hidden="true">*</span>
          <input
            name="business_name"
            type="text"
            autoComplete="organization"
            required
          />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Phone
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>
      <label>
        Anything I should know
        <textarea name="details" rows={3} />
      </label>
      <div className="form-submit-row">
        <button className="button" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Tell me what you need"}
          <ArrowRight aria-hidden="true" />
        </button>
        <p>Free to use the tool. No charge to ask a question.</p>
      </div>
      {status === "error" ? (
        <p className="form-error" role="alert">
          That did not go through. Text {siteConfig.phoneDisplay} or email{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      ) : null}
    </form>
  );
}
