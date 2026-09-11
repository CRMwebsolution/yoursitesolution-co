"use client";

import { useMemo, useState } from "react";
import { Check, RotateCcw, ShieldAlert, X } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { calculateContrast } from "@/lib/free-tools";

function ResultRow({
  label,
  requirement,
  passed,
}: {
  label: string;
  requirement: string;
  passed: boolean;
}) {
  return (
    <li className={passed ? "contrast-pass" : "contrast-fail"}>
      {passed ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
      <div>
        <strong>{label}</strong>
        <span>{requirement}</span>
      </div>
      <b>{passed ? "Pass" : "Fail"}</b>
    </li>
  );
}

export function ContrastCheckerTool() {
  const [foreground, setForeground] = useState("#0b1624");
  const [background, setBackground] = useState("#fffdf8");
  const result = useMemo(
    () => calculateContrast(foreground, background),
    [background, foreground],
  );

  function swapColors() {
    setForeground(background);
    setBackground(foreground);
  }

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free color contrast checker"
        title={
          <>
            Make sure the words are <em>actually readable.</em>
          </>
        }
        description="Compare one text color with one background color. See the exact contrast ratio and the common WCAG thresholds that pair passes or fails."
      />

      <div className="utility-grid">
        <section
          className="tool-input-panel"
          aria-labelledby="contrast-input-title"
        >
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="contrast-input-title">Choose the two colors</h2>
              <p>Enter a three- or six-digit hex color, including the # sign.</p>
            </div>
          </div>
          <div className="contrast-color-fields">
            <label>
              <span>Text color</span>
              <div className="color-input-row">
                <input
                  type="color"
                  value={result?.foreground || "#000000"}
                  onChange={(event) => setForeground(event.target.value)}
                  aria-label="Choose text color"
                />
                <input
                  value={foreground}
                  onChange={(event) => setForeground(event.target.value)}
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </label>
            <button
              type="button"
              className="contrast-swap"
              onClick={swapColors}
            >
              <RotateCcw aria-hidden="true" /> Swap colors
            </button>
            <label>
              <span>Background color</span>
              <div className="color-input-row">
                <input
                  type="color"
                  value={result?.background || "#ffffff"}
                  onChange={(event) => setBackground(event.target.value)}
                  aria-label="Choose background color"
                />
                <input
                  value={background}
                  onChange={(event) => setBackground(event.target.value)}
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </label>
          </div>
          {!result ? (
            <p className="tool-inline-warning" role="alert">
              Enter colors like #123 or #112233.
            </p>
          ) : null}
        </section>

        <section
          className="tool-output-panel"
          aria-labelledby="contrast-output-title"
        >
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="contrast-output-title">Read the result</h2>
              <p>Large text means at least 24px regular or about 19px bold.</p>
            </div>
          </div>

          {result ? (
            <>
              <div
                className="contrast-preview"
                style={{
                  color: result.foreground,
                  backgroundColor: result.background,
                }}
              >
                <span>Sample website heading</span>
                <p>
                  This is normal-size sample text for a service description,
                  contact instruction, or other important information.
                </p>
              </div>
              <div className="contrast-ratio" aria-live="polite">
                <span>Contrast ratio</span>
                <strong>{result.ratio.toFixed(2)}:1</strong>
              </div>
              <ul className="contrast-results">
                <ResultRow
                  label="AA normal text"
                  requirement="4.5:1 or higher"
                  passed={result.normalAA}
                />
                <ResultRow
                  label="AA large text"
                  requirement="3:1 or higher"
                  passed={result.largeAA}
                />
                <ResultRow
                  label="AAA normal text"
                  requirement="7:1 or higher"
                  passed={result.normalAAA}
                />
                <ResultRow
                  label="AAA large text"
                  requirement="4.5:1 or higher"
                  passed={result.largeAAA}
                />
              </ul>
            </>
          ) : (
            <div className="tool-empty-preview">
              <ShieldAlert aria-hidden="true" />
              <p>Correct both color values to see the contrast result.</p>
            </div>
          )}

          <p className="tool-accuracy-note">
            This checks one color pair only. It is not a complete accessibility,
            WCAG, ADA, design, or legal review of a website.
          </p>
        </section>
      </div>
    </div>
  );
}
