"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, FileQuestion } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import { buildWebsiteBrief } from "@/lib/free-tools";

const pageOptions = [
  "Home",
  "About",
  "Services",
  "Individual service pages",
  "Work or portfolio",
  "Reviews",
  "Frequently asked questions",
  "Contact",
];

export function WebsiteBriefTool() {
  const [businessName, setBusinessName] = useState("");
  const [audience, setAudience] = useState("");
  const [services, setServices] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [primaryAction, setPrimaryAction] = useState("");
  const [differentiators, setDifferentiators] = useState("");
  const [proof, setProof] = useState("");
  const [contact, setContact] = useState("");
  const [pages, setPages] = useState<string[]>(["Home", "Services", "Contact"]);
  const [notes, setNotes] = useState("");
  const result = useMemo(
    () =>
      buildWebsiteBrief({
        businessName,
        audience,
        services,
        serviceArea,
        primaryAction,
        differentiators,
        proof,
        contact,
        pages,
        notes,
      }),
    [audience, businessName, contact, differentiators, notes, pages, primaryAction, proof, serviceArea, services],
  );

  function togglePage(page: string) {
    setPages((current) =>
      current.includes(page)
        ? current.filter((item) => item !== page)
        : [...current, page],
    );
  }

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free website project brief builder"
        title={
          <>
            Turn scattered ideas into a <em>buildable website plan.</em>
          </>
        }
        description="Answer the questions that affect scope, content, and customer action. You will leave with one organized brief and a visible missing-information list."
      />

      <div className="utility-grid utility-grid-wide-input">
        <section className="tool-input-panel" aria-labelledby="brief-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="brief-input-title">Describe the business and goal</h2>
              <p>Plain language is better than polished marketing copy here.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label>
              Business name
              <input value={businessName} onChange={(event) => setBusinessName(event.target.value)} placeholder="Acme Home Services" />
            </label>
            <label>
              Service area
              <input value={serviceArea} onChange={(event) => setServiceArea(event.target.value)} placeholder="Greater Cincinnati" />
            </label>
            <label className="tool-field-wide">
              Ideal customer
              <textarea value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="Homeowners who need dependable same-week repairs" rows={2} />
            </label>
            <label className="tool-field-wide">
              Services or products
              <textarea value={services} onChange={(event) => setServices(event.target.value)} placeholder="List what you sell and which service matters most." rows={3} />
            </label>
            <label className="tool-field-wide">
              Main action visitors should take
              <input value={primaryAction} onChange={(event) => setPrimaryAction(event.target.value)} placeholder="Call for a quote, book online, visit the store..." />
            </label>
            <label className="tool-field-wide">
              Why customers choose the business
              <textarea value={differentiators} onChange={(event) => setDifferentiators(event.target.value)} placeholder="Specific response time, process, experience, guarantee, specialty..." rows={3} />
            </label>
            <label className="tool-field-wide">
              Proof available
              <textarea value={proof} onChange={(event) => setProof(event.target.value)} placeholder="Real reviews, licenses, photos, case studies, associations..." rows={2} />
            </label>
            <label className="tool-field-wide">
              Public contact information
              <textarea value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Phone, email, address, hours, booking link" rows={2} />
            </label>
          </div>

          <fieldset className="page-choice">
            <legend>Pages you expect to need</legend>
            <div>
              {pageOptions.map((page) => (
                <label key={page} className={pages.includes(page) ? "is-on" : ""}>
                  <input
                    type="checkbox"
                    checked={pages.includes(page)}
                    onChange={() => togglePage(page)}
                  />
                  {page}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="tool-field-grid tool-fields-spaced">
            <label className="tool-field-wide">
              Other requirements or notes
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Forms, online payments, integrations, examples you like..." rows={3} />
            </label>
          </div>
        </section>

        <section className="tool-output-panel" aria-labelledby="brief-output-title">
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="brief-output-title">Take the organized brief</h2>
              <p>Edit the source fields at any time; the brief updates immediately.</p>
            </div>
          </div>

          <div className="brief-status-card">
            {result.missing.length ? <FileQuestion aria-hidden="true" /> : <ClipboardCheck aria-hidden="true" />}
            <div>
              <strong>
                {result.missing.length
                  ? `${result.missing.length} core ${result.missing.length === 1 ? "detail" : "details"} still missing`
                  : "Core brief complete"}
              </strong>
              <p>
                {result.missing.length
                  ? result.missing.join(", ")
                  : "Verify every fact and gather the actual photos and copy before publishing."}
              </p>
            </div>
          </div>

          <div className="document-output-card">
            <pre>{result.brief}</pre>
          </div>
          <CopyButton text={result.brief} label="Copy complete brief" />
        </section>
      </div>
    </div>
  );
}
