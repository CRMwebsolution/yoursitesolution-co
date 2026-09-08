"use client";

import { useMemo, useState } from "react";
import { Calculator, LockKeyhole } from "lucide-react";
import { CopyButton } from "../copy-button";
import { calculateTaskCost } from "@/lib/free-tools";

const hours = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function boundedNumber(value: string, maximum: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(maximum, Math.max(0, number)) : 0;
}

export function TaskCostTool() {
  const [taskName, setTaskName] = useState("Copying job details between systems");
  const [timesPerWeek, setTimesPerWeek] = useState(12);
  const [minutesEach, setMinutesEach] = useState(8);
  const [hourlyValue, setHourlyValue] = useState(35);
  const [workingWeeks, setWorkingWeeks] = useState(50);

  const result = useMemo(
    () =>
      calculateTaskCost({
        taskName,
        timesPerWeek,
        minutesEach,
        hourlyValue,
        workingWeeks,
      }),
    [taskName, timesPerWeek, minutesEach, hourlyValue, workingWeeks],
  );

  const summary = `${result.taskName} takes about ${hours.format(result.monthlyHours)} hours per month and ${hours.format(result.yearlyHours)} hours per year. At ${money.format(hourlyValue)} per hour, that time is worth about ${money.format(result.monthlyCost)} per month or ${money.format(result.yearlyCost)} per year. This is the current cost of the task, not a promised automation saving.`;

  return (
    <div className="utility-tool">
      <header className="utility-intro">
        <div>
          <p className="eyebrow eyebrow-light">Free repetitive-task calculator</p>
          <h1>
            Put a real number on <em>“just a few minutes.”</em>
          </h1>
          <p className="lede lede-light">
            Price one repeated task using how often it happens, how long it
            takes, and what that time is worth. No made-up savings percentage.
          </p>
        </div>
        <p className="browser-only-note">
          <LockKeyhole aria-hidden="true" /> Runs in your browser. Nothing you
          type here is submitted or saved.
        </p>
      </header>

      <div className="utility-grid calculator-grid">
        <section className="tool-input-panel" aria-labelledby="task-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="task-input-title">Describe one repeated task</h2>
              <p>Use your normal week—not the unusually busy one.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label className="tool-field-wide">
              Task name
              <input
                value={taskName}
                onChange={(event) => setTaskName(event.target.value)}
                type="text"
                placeholder="Copying form details into a spreadsheet"
              />
            </label>
            <label>
              Times per week
              <input
                value={timesPerWeek}
                onChange={(event) =>
                  setTimesPerWeek(boundedNumber(event.target.value, 500))
                }
                type="number"
                min="0"
                max="500"
                step="1"
                inputMode="numeric"
              />
            </label>
            <label>
              Minutes each time
              <input
                value={minutesEach}
                onChange={(event) =>
                  setMinutesEach(boundedNumber(event.target.value, 480))
                }
                type="number"
                min="0"
                max="480"
                step="1"
                inputMode="numeric"
              />
            </label>
            <label>
              Value of that time ($ / hour)
              <input
                value={hourlyValue}
                onChange={(event) =>
                  setHourlyValue(boundedNumber(event.target.value, 1000))
                }
                type="number"
                min="0"
                max="1000"
                step="1"
                inputMode="decimal"
              />
              <span>Use wages plus overhead, or your own working-hour value.</span>
            </label>
            <label>
              Working weeks per year
              <input
                value={workingWeeks}
                onChange={(event) =>
                  setWorkingWeeks(boundedNumber(event.target.value, 52))
                }
                type="number"
                min="1"
                max="52"
                step="1"
                inputMode="numeric"
              />
            </label>
          </div>
        </section>

        <section className="tool-output-panel calculator-output" aria-labelledby="task-output-title">
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="task-output-title">What the task costs now</h2>
              <p>This is time consumed—not money an automation is guaranteed to save.</p>
            </div>
          </div>

          <div className="cost-output" aria-live="polite">
            <div className="cost-primary">
              <span>Yearly time value</span>
              <strong>{money.format(result.yearlyCost)}</strong>
              <p>{result.taskName}</p>
            </div>
            <div className="cost-stat-grid">
              <div>
                <span>Hours / week</span>
                <strong>{hours.format(result.weeklyHours)}</strong>
              </div>
              <div>
                <span>Hours / month</span>
                <strong>{hours.format(result.monthlyHours)}</strong>
              </div>
              <div>
                <span>Hours / year</span>
                <strong>{hours.format(result.yearlyHours)}</strong>
              </div>
              <div>
                <span>Cost / month</span>
                <strong>{money.format(result.monthlyCost)}</strong>
              </div>
            </div>
          </div>

          <div className="calculation-read">
            <Calculator aria-hidden="true" />
            <p>
              {timesPerWeek} times × {minutesEach} minutes × {workingWeeks} weeks
              at {money.format(hourlyValue)} per hour.
            </p>
          </div>

          <CopyButton
            text={summary}
            label="Copy this summary"
            className="button button-outline utility-copy-summary"
          />

          <p className="tool-accuracy-note">
            The right next step may be a checklist, a template, a small
            integration, or no automation at all. This calculator only shows
            whether the task is large enough to inspect.
          </p>
        </section>
      </div>
    </div>
  );
}
