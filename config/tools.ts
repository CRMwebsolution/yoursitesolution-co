export const tools = [
  {
    slug: "website-check",
    href: "/tools/website-check",
    number: "01",
    name: "PageSpeed website check",
    summary:
      "Test a public page on mobile or desktop. See Google PageSpeed scores, measurements, and the fixes worth looking at first.",
    action: "Run the website check",
    output: "Google data + plain-English priorities",
    category: "Website performance",
    featured: true,
  },
  {
    slug: "search-preview",
    href: "/tools/search-preview",
    number: "02",
    name: "Google search preview",
    summary:
      "Draft a page title, description, and main heading—then see how the listing may look before you publish it.",
    action: "Build a search listing",
    output: "Title, description, H1 + live preview",
    category: "Website SEO",
    featured: false,
  },
  {
    slug: "review-text",
    href: "/tools/review-text",
    number: "03",
    name: "Review request kit",
    summary:
      "Turn a few job details into a same-day text, a polite follow-up, and an email asking for an honest review.",
    action: "Write the messages",
    output: "SMS, follow-up + email",
    category: "Customer trust",
    featured: false,
  },
  {
    slug: "time-check",
    href: "/tools/time-check",
    number: "04",
    name: "Repetitive-task cost calculator",
    summary:
      "Put a real number on one repeated office task using its frequency, duration, and the value of the time it consumes.",
    action: "Calculate the task cost",
    output: "Monthly and yearly time + cost",
    category: "Business automation",
    featured: false,
  },
] as const;

export type ToolSlug = (typeof tools)[number]["slug"];
