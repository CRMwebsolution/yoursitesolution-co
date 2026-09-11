"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Braces, ExternalLink } from "lucide-react";
import { BrowserToolHeader } from "../browser-tool-header";
import { CopyButton } from "../copy-button";
import { buildLocalBusinessSchema } from "@/lib/free-tools";

const businessTypes = [
  ["LocalBusiness", "Local business (general)"],
  ["ProfessionalService", "Professional service"],
  ["HomeAndConstructionBusiness", "Home or construction service"],
  ["GeneralContractor", "General contractor"],
  ["Electrician", "Electrician"],
  ["Plumber", "Plumber"],
  ["RoofingContractor", "Roofing contractor"],
  ["HVACBusiness", "Heating and cooling business"],
  ["AutomotiveBusiness", "Automotive business"],
  ["Store", "Store"],
] as const;

export function LocalSchemaTool() {
  const [type, setType] = useState("LocalBusiness");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [serviceAreas, setServiceAreas] = useState("");
  const [hours, setHours] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [logo, setLogo] = useState("");

  const result = useMemo(
    () =>
      buildLocalBusinessSchema({
        type,
        name,
        url,
        phone,
        email,
        street,
        city,
        state,
        postalCode,
        country,
        serviceAreas,
        hours,
        priceRange,
        logo,
      }),
    [
      city,
      country,
      email,
      hours,
      logo,
      name,
      phone,
      postalCode,
      priceRange,
      serviceAreas,
      state,
      street,
      type,
      url,
    ],
  );

  return (
    <div className="utility-tool">
      <BrowserToolHeader
        eyebrow="Free Local Business schema builder"
        title={
          <>
            Describe the business in a format <em>search engines understand.</em>
          </>
        }
        description="Create JSON-LD from facts you provide. The tool does not invent reviews, ratings, locations, services, or other claims."
      />

      <div className="utility-grid utility-grid-wide-input">
        <section className="tool-input-panel" aria-labelledby="schema-input-title">
          <div className="tool-panel-heading">
            <span>01</span>
            <div>
              <h2 id="schema-input-title">Enter public business facts</h2>
              <p>Only include details that are accurate and visible to customers.</p>
            </div>
          </div>
          <div className="tool-field-grid">
            <label className="tool-field-wide">
              Business type
              <select value={type} onChange={(event) => setType(event.target.value)}>
                {businessTypes.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Business name
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Acme Electric" />
            </label>
            <label>
              Website
              <input inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" />
            </label>
            <label>
              Phone
              <input inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="(555) 555-0123" />
            </label>
            <label>
              Public email (optional)
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="hello@example.com" />
            </label>
            <label className="tool-field-wide">
              Street address (leave blank for a service-area business)
              <input value={street} onChange={(event) => setStreet(event.target.value)} placeholder="123 Main Street" />
            </label>
            <label>
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="Cincinnati" />
            </label>
            <label>
              State or region
              <input value={state} onChange={(event) => setState(event.target.value)} placeholder="OH" />
            </label>
            <label>
              Postal code
              <input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} placeholder="45202" />
            </label>
            <label>
              Country code
              <input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="US" maxLength={2} />
            </label>
            <label className="tool-field-wide">
              Service areas (comma separated)
              <input value={serviceAreas} onChange={(event) => setServiceAreas(event.target.value)} placeholder="Cincinnati, Norwood, Blue Ash" />
            </label>
            <label className="tool-field-wide">
              Opening hours (one entry per line)
              <textarea value={hours} onChange={(event) => setHours(event.target.value)} placeholder={"Mo-Fr 08:00-17:00\nSa 09:00-13:00"} rows={3} />
              <span>Use two-letter days and 24-hour time. Example: Mo-Fr 08:00-17:00.</span>
            </label>
            <label>
              Price range (optional)
              <input value={priceRange} onChange={(event) => setPriceRange(event.target.value)} placeholder="$$" />
            </label>
            <label>
              Logo image URL (optional)
              <input inputMode="url" value={logo} onChange={(event) => setLogo(event.target.value)} placeholder="https://example.com/logo.png" />
            </label>
          </div>
        </section>

        <section className="tool-output-panel" aria-labelledby="schema-output-title">
          <div className="tool-panel-heading">
            <span>02</span>
            <div>
              <h2 id="schema-output-title">Copy the finished markup</h2>
              <p>Add this script once to the page that describes the business.</p>
            </div>
          </div>

          {result.missing.length ? (
            <div className="tool-inline-warning">
              <AlertTriangle aria-hidden="true" />
              <span>Still useful to add: {result.missing.join(", ")}.</span>
            </div>
          ) : null}

          <div className="code-output-card">
            <div>
              <Braces aria-hidden="true" />
              <strong>JSON-LD script</strong>
              <CopyButton text={result.script} label="Copy script" disabled={!name.trim()} />
            </div>
            <pre>{result.script}</pre>
          </div>

          <a
            className="tool-secondary-link tool-secondary-link-spaced"
            href="https://search.google.com/test/rich-results"
            target="_blank"
            rel="noreferrer"
          >
            Test the published page with Google <ExternalLink aria-hidden="true" />
          </a>

          <p className="tool-accuracy-note">
            Structured data helps machines interpret a page; it does not guarantee a rich result or a ranking change. Validate the final published page and keep the markup consistent with visible content.
          </p>
        </section>
      </div>
    </div>
  );
}
