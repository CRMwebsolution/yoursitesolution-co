"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { ToolFollowupForm } from "@/components/tool-followup-form";
import { scoreBusywork, timeQuestions } from "@/config/tools";

export function TimeCheckTool() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<ReturnType<typeof scoreBusywork> | null>(
    null,
  );

  function toggle(id: string, value: boolean) {
    setAnswers((current) => ({ ...current, [id]: value }));
    setResult(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const scored = scoreBusywork(answers);
    setResult(scored);
    await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "tool_run",
        tool: "time-check",
        company_site: event.currentTarget.company_site.value,
        tool_input: answers,
        tool_result: scored,
      }),
    }).catch(() => undefined);
  }

  const unanswered = timeQuestions.some(
    (question) => typeof answers[question.id] !== "boolean",
  );

  return (
    <div className="tool-stage">
      <form className="lead-form tool-form" onSubmit={handleSubmit}>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="time-check-company-site">Leave this field empty</label>
          <input
            id="time-check-company-site"
            name="company_site"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <ol className="question-list">
          {timeQuestions.map((question, index) => (
            <li key={question.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p>{question.prompt}</p>
                <div className="yes-no">
                  <button
                    type="button"
                    className={answers[question.id] === true ? "is-on" : ""}
                    onClick={() => toggle(question.id, true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={answers[question.id] === false ? "is-on" : ""}
                    onClick={() => toggle(question.id, false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <div className="form-submit-row">
          <button className="button" type="submit" disabled={unanswered}>
            See the read <ArrowRight aria-hidden="true" />
          </button>
          <p>Answer every question. This is a gut-check, not a timesheet.</p>
        </div>
      </form>

      {result ? (
        <div className="tool-results">
          <p className="eyebrow">
            {result.yes} of {timeQuestions.length} look like repeat work
          </p>
          <h2>{result.headline}</h2>
          <p className="lede">{result.detail}</p>
          <p className="hours-callout">
            Rough range if each “yes” is about 90 minutes a week:{" "}
            <strong>{result.hours} hours / week</strong>
          </p>
          <ToolFollowupForm
            tool="time-check"
            heading="If you want those handoffs connected, tell me what the week looks like."
            context={result}
          />
        </div>
      ) : null}
    </div>
  );
}
