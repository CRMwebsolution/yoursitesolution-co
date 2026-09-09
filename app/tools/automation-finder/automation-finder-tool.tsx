"use client";

import { useMemo, useState } from "react";
import { Check, ClipboardList, Settings2 } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import {
  automationOpportunityCatalog,
  buildAutomationPlan,
  type AutomationSignal,
} from "@/lib/free-tools";

export function AutomationFinderTool() {
  const [businessName, setBusinessName] = useState("");
  const [signals, setSignals] = useState<AutomationSignal[]>([]);
  const result = useMemo(
    () => buildAutomationPlan(businessName, signals),
    [businessName, signals],
  );

  function toggleSignal(signal: AutomationSignal) {
    setSignals((current) =>
      current.includes(signal)
        ? current.filter((item) => item !== signal)
        : [...current, signal],
    );
  }

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free automation opportunity finder"
        title={
          <>
            Find a repeated handoff worth <em>fixing carefully.</em>
          </>
        }
        description="Choose the work that repeatedly slows the business down. Get a concrete outline for what starts the automation, what it does, where a person stays involved, and how to test it."
      />

      <div className="utility-grid utility-grid-wide-input">
        <section
          className="tool-input-panel"
          aria-labelledby="automation-input-title"
        >
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="automation-input-title">Choose the real friction</h2>
              <p>
                Select only processes that happen now. More selections do not
                mean a better plan.
              </p>
            </div>
          </div>
          <div className="tool-field-grid automation-business-field">
            <label className="tool-field-wide">
              Business name (optional)
              <input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="Acme Home Services"
              />
            </label>
          </div>
          <div className="automation-choice-list">
            {automationOpportunityCatalog.map((opportunity) => {
              const selected = signals.includes(opportunity.id);
              return (
                <label key={opportunity.id} className={selected ? "is-on" : ""}>
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleSignal(opportunity.id)}
                  />
                  <span>
                    {selected ? (
                      <Check aria-hidden="true" />
                    ) : (
                      <Settings2 aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <strong>{opportunity.name}</strong>
                    <p>{opportunity.problem}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <section
          className="tool-output-panel"
          aria-labelledby="automation-output-title"
        >
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="automation-output-title">Take the implementation outline</h2>
              <p>Start with one small process that is easy to verify and stop.</p>
            </div>
          </div>

          {result.opportunities.length ? (
            <div className="automation-plan-list">
              {result.opportunities.map((opportunity, index) => (
                <article key={opportunity.id}>
                  <header>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{opportunity.name}</h3>
                  </header>
                  <dl>
                    <div>
                      <dt>Trigger</dt>
                      <dd>{opportunity.trigger}</dd>
                    </div>
                    <div>
                      <dt>Action</dt>
                      <dd>{opportunity.action}</dd>
                    </div>
                    <div>
                      <dt>Human checkpoint</dt>
                      <dd>{opportunity.humanCheckpoint}</dd>
                    </div>
                    <div>
                      <dt>First test</dt>
                      <dd>{opportunity.firstTest}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <div className="tool-empty-preview">
              <ClipboardList aria-hidden="true" />
              <p>
                Choose a repeated handoff to see its trigger, action, human
                checkpoint, and first test.
              </p>
            </div>
          )}

          <CopyButton
            text={result.plan}
            label="Copy complete plan"
            className="tool-copy-button utility-copy-summary"
            disabled={!result.opportunities.length}
          />
          <p className="tool-accuracy-note">
            This is a shortlist, not a cost or savings estimate. Confirm system
            access, consent, edge cases, failure alerts, and a manual recovery
            path before automating customer or business data.
          </p>
        </section>
      </div>
    </div>
  );
}
