"use client";

import { useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  AtSign,
  Clock3,
  FileText,
  Gauge,
  Globe,
  ImageIcon,
  Link2,
  Link2Off,
  Mail,
  MapPinned,
  MessageSquareReply,
  QrCode,
  Search,
  Settings2,
  Share2,
  Star,
  Tags,
  X,
} from "lucide-react";
import { publishedTools, type ToolSlug } from "@/config/tools";

type ToolIcon = ComponentType<{ "aria-hidden"?: boolean }>;

const INITIAL_VISIBLE = 10;

const toolIcons: Partial<Record<ToolSlug, ToolIcon>> = {
  "website-check": Gauge,
  "search-preview": Search,
  "review-text": Star,
  "time-check": Clock3,
  "qr-code": QrCode,
  "utm-builder": Tags,
  "contact-links": Link2,
  "email-signature": Mail,
  "contrast-checker": Accessibility,
  "image-optimizer": ImageIcon,
  "local-schema": MapPinned,
  "website-brief": FileText,
  "copy-clarity": AtSign,
  "lead-response": MessageSquareReply,
  "review-reply": Star,
  "automation-finder": Settings2,
  "seo-check": Search,
  "social-preview-check": Share2,
  "broken-link-check": Link2Off,
  "domain-health-check": Globe,
};

const categories = [
  "All tools",
  ...Array.from(new Set(publishedTools.map((tool) => tool.category))),
];

export function ToolLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All tools");
  const [showAll, setShowAll] = useState(false);

  const filteredTools = useMemo(() => {
    const search = query.trim().toLowerCase();
    return publishedTools.filter((tool) => {
      const categoryMatches =
        category === "All tools" || tool.category === category;
      const searchMatches =
        !search ||
        [tool.name, tool.summary, tool.hero, tool.output, tool.category]
          .join(" ")
          .toLowerCase()
          .includes(search);
      return categoryMatches && searchMatches;
    });
  }, [category, query]);

  const filtering = Boolean(query.trim()) || category !== "All tools";
  const visibleTools =
    showAll || filtering ? filteredTools : filteredTools.slice(0, INITIAL_VISIBLE);
  const hiddenCount = Math.max(filteredTools.length - visibleTools.length, 0);

  function clearFilters() {
    setQuery("");
    setCategory("All tools");
    setShowAll(false);
  }

  return (
    <div className="tool-browser">
      <div className="tool-browser-controls">
        <label className="tool-search-field">
          <Search aria-hidden="true" />
          <span className="sr-only">Search the free tools</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools by problem or result"
          />
        </label>
        <label className="tool-category-field">
          <span className="sr-only">Filter tools by category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <p aria-live="polite">
          {visibleTools.length}
          {hiddenCount ? ` of ${filteredTools.length}` : ""}{" "}
          {filteredTools.length === 1 ? "tool" : "tools"}
        </p>
      </div>

      {visibleTools.length ? (
        <>
          <div className="tool-index-grid">
            {visibleTools.map((tool) => {
              const Icon = toolIcons[tool.slug] || FileText;
              return (
                <article
                  key={tool.slug}
                  className={`tool-index-card${tool.featured ? " tool-index-card-featured" : ""}`}
                >
                  <div className="tool-card-topline">
                    <span>{tool.number}</span>
                    <span>{tool.category}</span>
                  </div>
                  <Icon aria-hidden={true} />
                  <h3>{tool.name}</h3>
                  <p>{tool.hero}</p>
                  <dl>
                    <dt>You get</dt>
                    <dd>{tool.output}</dd>
                  </dl>
                  <Link className="text-link" href={tool.href}>
                    {tool.action} <ArrowRight aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
          {hiddenCount ? (
            <div className="tool-more-wrap">
              <button
                className="button tool-more-button"
                type="button"
                onClick={() => setShowAll(true)}
              >
                More tools+
              </button>
              <p>{hiddenCount} more free tools sit below the fold.</p>
            </div>
          ) : null}
          {showAll && !filtering ? (
            <div className="tool-more-wrap">
              <button
                className="button button-outline tool-more-button"
                type="button"
                onClick={() => {
                  setShowAll(false);
                  document.getElementById("main-content")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
              >
                Show the top 10
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="tool-empty-state">
          <X aria-hidden="true" />
          <h3>No tools match those filters.</h3>
          <p>Clear the search to see the complete free-tool library.</p>
          <button type="button" onClick={clearFilters}>
            Show every tool
          </button>
        </div>
      )}
    </div>
  );
}
