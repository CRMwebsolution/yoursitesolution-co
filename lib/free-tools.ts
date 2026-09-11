export type SearchPreviewInput = {
  businessName: string;
  service: string;
  location: string;
  differentiator: string;
  url: string;
};

export type SearchPreviewCopy = {
  title: string;
  description: string;
  heading: string;
  displayUrl: string;
};

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function sentence(value: string) {
  const cleaned = clean(value).replace(/[.!?]+$/, "");
  if (!cleaned) return "";
  return `${cleaned.charAt(0).toUpperCase()}${cleaned.slice(1)}.`;
}

function capitalize(value: string) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : "";
}

function displayUrl(value: string) {
  const cleaned = clean(value);
  if (!cleaned) return "yourbusiness.com";

  try {
    const normalized = /^https?:\/\//i.test(cleaned)
      ? cleaned
      : `https://${cleaned}`;
    const parsed = new URL(normalized);
    const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return `${parsed.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return cleaned.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  }
}

export function buildSearchPreview(
  input: SearchPreviewInput,
): SearchPreviewCopy {
  const business = clean(input.businessName);
  const service = clean(input.service);
  const location = clean(input.location);
  const difference = sentence(input.differentiator);

  const serviceAndPlace = [capitalize(service), location ? `in ${location}` : ""]
    .filter(Boolean)
    .join(" ");
  const title =
    [serviceAndPlace, business].filter(Boolean).join(" | ") ||
    "Your page title will appear here";
  const heading =
    serviceAndPlace || business || "Your clear page heading will appear here";

  let description =
    "Add your business, service, and location to build a useful search description.";

  if (serviceAndPlace || business) {
    const searchPhrase = [service.toLowerCase(), location ? `in ${location}` : ""]
      .filter(Boolean)
      .join(" ");
    const opening = searchPhrase
      ? `Looking for ${searchPhrase}?`
      : `Looking for ${business}?`;
    const subject = business || "This local business";
    description = difference
      ? `${opening} ${subject}: ${difference} See what to expect and request a quote.`
      : `${opening} Contact ${subject} for clear answers, straightforward service, and a quote.`;
  }

  return {
    title,
    description,
    heading,
    displayUrl: displayUrl(input.url),
  };
}

export type ReviewRequestInput = {
  businessName: string;
  customerName: string;
  service: string;
  reviewLink: string;
  tone: "warm" | "direct";
};

export type ReviewRequestMessages = {
  sameDay: string;
  followUp: string;
  emailSubject: string;
  emailBody: string;
};

export function buildReviewRequests(
  input: ReviewRequestInput,
): ReviewRequestMessages {
  const business = clean(input.businessName) || "[your business]";
  const customer = clean(input.customerName) || "[customer name]";
  const service = clean(input.service) || "[work completed]";
  const link = clean(input.reviewLink) || "[paste your Google review link]";

  if (input.tone === "direct") {
    return {
      sameDay: `Hi ${customer}, thanks for choosing ${business} for ${service}. Would you take a minute to leave an honest review? ${link}`,
      followUp: `Hi ${customer}, one quick follow-up from ${business}: if you would like to share feedback on ${service}, here is the review link. ${link} Thank you again.`,
      emailSubject: `Would you share feedback for ${business}?`,
      emailBody: `Hi ${customer},\n\nThank you for choosing ${business} for ${service}. If you have a minute, would you leave an honest review about your experience? Your feedback helps future customers know what to expect.\n\n${link}\n\nThank you,\n${business}`,
    };
  }

  return {
    sameDay: `Hi ${customer}! Thank you again for trusting ${business} with ${service}. If you have a minute, we would really appreciate an honest review: ${link}`,
    followUp: `Hi ${customer}! Just a friendly follow-up from ${business}. If you would like to share feedback about ${service}, here is the review link: ${link} No pressure—and thank you again for choosing us.`,
    emailSubject: `Thank you from ${business}`,
    emailBody: `Hi ${customer},\n\nThank you again for trusting ${business} with ${service}. We hope everything went smoothly. If you have a minute, we would really appreciate an honest review. It helps us improve and helps future customers know what to expect.\n\n${link}\n\nThanks again,\n${business}`,
  };
}

export type TaskCostInput = {
  taskName: string;
  timesPerWeek: number;
  minutesEach: number;
  hourlyValue: number;
  workingWeeks: number;
};

export type TaskCostResult = {
  taskName: string;
  weeklyHours: number;
  monthlyHours: number;
  yearlyHours: number;
  monthlyCost: number;
  yearlyCost: number;
};

function nonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function calculateTaskCost(input: TaskCostInput): TaskCostResult {
  const timesPerWeek = nonNegative(input.timesPerWeek);
  const minutesEach = nonNegative(input.minutesEach);
  const hourlyValue = nonNegative(input.hourlyValue);
  const workingWeeks = Math.min(52, nonNegative(input.workingWeeks));
  const weeklyHours = (timesPerWeek * minutesEach) / 60;
  const yearlyHours = weeklyHours * workingWeeks;

  return {
    taskName: clean(input.taskName) || "This repeated task",
    weeklyHours,
    monthlyHours: yearlyHours / 12,
    yearlyHours,
    monthlyCost: (yearlyHours * hourlyValue) / 12,
    yearlyCost: yearlyHours * hourlyValue,
  };
}

export type UtmBuilderInput = {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
};

export type UtmBuilderResult = {
  valid: boolean;
  url: string;
  displayUrl: string;
  error: string;
  parameters: Array<{ label: string; value: string }>;
};

function publicHttpUrl(value: string) {
  const cleaned = clean(value);
  if (!cleaned) return null;

  try {
    const parsed = new URL(
      /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`,
    );
    return ["http:", "https:"].includes(parsed.protocol) ? parsed : null;
  } catch {
    return null;
  }
}

export function buildUtmUrl(input: UtmBuilderInput): UtmBuilderResult {
  const parsed = publicHttpUrl(input.url);
  if (!parsed) {
    return {
      valid: false,
      url: "",
      displayUrl: "Your tagged link will appear here",
      error: input.url.trim()
        ? "Enter a complete website address."
        : "Add the page you want people to visit.",
      parameters: [],
    };
  }

  const values = [
    ["utm_source", clean(input.source)],
    ["utm_medium", clean(input.medium)],
    ["utm_campaign", clean(input.campaign)],
    ["utm_term", clean(input.term)],
    ["utm_content", clean(input.content)],
  ] as const;

  values.forEach(([key, value]) => {
    parsed.searchParams.delete(key);
    if (value) parsed.searchParams.set(key, value);
  });

  return {
    valid: true,
    url: parsed.toString(),
    displayUrl: `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname}${parsed.search}`,
    error: "",
    parameters: values
      .filter(([, value]) => Boolean(value))
      .map(([label, value]) => ({ label, value })),
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function dialablePhone(value: string) {
  const original = clean(value);
  const digits = original.replace(/\D/g, "");
  if (!digits) return "";
  if (original.startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return digits;
}

export type ContactLinksInput = {
  phone: string;
  textMessage: string;
  email: string;
  emailSubject: string;
  emailBody: string;
};

export function buildContactLinks(input: ContactLinksInput) {
  const phone = dialablePhone(input.phone);
  const email = clean(input.email);
  const callLink = phone ? `tel:${phone}` : "";
  const textLink = phone
    ? `sms:${phone}${input.textMessage.trim() ? `?body=${encodeURIComponent(input.textMessage.trim())}` : ""}`
    : "";
  const emailParameters = new URLSearchParams();
  if (input.emailSubject.trim()) {
    emailParameters.set("subject", input.emailSubject.trim());
  }
  if (input.emailBody.trim()) emailParameters.set("body", input.emailBody.trim());
  const emailLink = email
    ? `mailto:${email}${emailParameters.size ? `?${emailParameters.toString()}` : ""}`
    : "";

  return {
    callLink,
    textLink,
    emailLink,
    callHtml: callLink
      ? `<a href="${escapeHtml(callLink)}">Call us</a>`
      : "Add a phone number first.",
    textHtml: textLink
      ? `<a href="${escapeHtml(textLink)}">Text us</a>`
      : "Add a phone number first.",
    emailHtml: emailLink
      ? `<a href="${escapeHtml(emailLink)}">Email us</a>`
      : "Add an email address first.",
  };
}

export type EmailSignatureInput = {
  name: string;
  role: string;
  business: string;
  phone: string;
  email: string;
  website: string;
  accent: string;
};

export function buildEmailSignature(input: EmailSignatureInput) {
  const name = clean(input.name) || "Your name";
  const role = clean(input.role);
  const business = clean(input.business) || "Your business";
  const phone = clean(input.phone);
  const dialPhone = dialablePhone(input.phone);
  const email = clean(input.email);
  const website = publicHttpUrl(input.website);
  const websiteLabel = website
    ? `${website.hostname.replace(/^www\./, "")}${website.pathname === "/" ? "" : website.pathname}`
    : "";
  const accent = /^#[0-9a-f]{6}$/i.test(input.accent)
    ? input.accent
    : "#d9420b";
  const titleLine = [role, business].filter(Boolean).join(" | ");
  const contactLines = [
    phone && dialPhone
      ? `<a href="tel:${escapeHtml(dialPhone)}" style="color:#334250;text-decoration:none;">${escapeHtml(phone)}</a>`
      : "",
    email
      ? `<a href="mailto:${escapeHtml(email)}" style="color:#334250;text-decoration:none;">${escapeHtml(email)}</a>`
      : "",
    website
      ? `<a href="${escapeHtml(website.toString())}" style="color:${accent};text-decoration:none;">${escapeHtml(websiteLabel)}</a>`
      : "",
  ].filter(Boolean);

  const html = `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;color:#0b1624;"><tr><td style="border-left:4px solid ${accent};padding:4px 0 4px 14px;"><div style="font-size:18px;font-weight:700;line-height:1.25;">${escapeHtml(name)}</div><div style="font-size:14px;color:#586572;line-height:1.5;">${escapeHtml(titleLine)}</div>${contactLines.length ? `<div style="font-size:13px;line-height:1.65;margin-top:7px;">${contactLines.join("<br>")}</div>` : ""}</td></tr></table>`;
  const plain = [name, titleLine, phone, email, websiteLabel]
    .filter(Boolean)
    .join("\n");

  return { html, plain, websiteUrl: website?.toString() || "", accent };
}

function expandHex(value: string) {
  const cleaned = value.trim();
  const short = /^#([0-9a-f]{3})$/i.exec(cleaned);
  if (short) {
    return `#${short[1]
      .split("")
      .map((character) => `${character}${character}`)
      .join("")}`.toLowerCase();
  }
  return /^#[0-9a-f]{6}$/i.test(cleaned) ? cleaned.toLowerCase() : null;
}

function relativeLuminance(hex: string) {
  const channels = [1, 3, 5].map((position) =>
    Number.parseInt(hex.slice(position, position + 2), 16) / 255,
  );
  const linear = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

export function calculateContrast(foreground: string, background: string) {
  const text = expandHex(foreground);
  const surface = expandHex(background);
  if (!text || !surface) return null;
  const light = Math.max(relativeLuminance(text), relativeLuminance(surface));
  const dark = Math.min(relativeLuminance(text), relativeLuminance(surface));
  const ratio = (light + 0.05) / (dark + 0.05);

  return {
    foreground: text,
    background: surface,
    ratio,
    normalAA: ratio >= 4.5,
    largeAA: ratio >= 3,
    normalAAA: ratio >= 7,
    largeAAA: ratio >= 4.5,
  };
}

export type LocalBusinessSchemaInput = {
  type: string;
  name: string;
  url: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  serviceAreas: string;
  hours: string;
  priceRange: string;
  logo: string;
};

export function buildLocalBusinessSchema(input: LocalBusinessSchemaInput) {
  const name = clean(input.name);
  const url = publicHttpUrl(input.url);
  const logo = publicHttpUrl(input.logo);
  const serviceAreas = input.serviceAreas
    .split(",")
    .map(clean)
    .filter(Boolean);
  const hours = input.hours
    .split(/\n|,/)
    .map(clean)
    .filter(Boolean);
  const hasAddress = [input.street, input.city, input.state, input.postalCode]
    .some((value) => value.trim());
  const address = hasAddress
    ? {
        "@type": "PostalAddress",
        ...(clean(input.street) ? { streetAddress: clean(input.street) } : {}),
        ...(clean(input.city) ? { addressLocality: clean(input.city) } : {}),
        ...(clean(input.state) ? { addressRegion: clean(input.state) } : {}),
        ...(clean(input.postalCode)
          ? { postalCode: clean(input.postalCode) }
          : {}),
        ...(clean(input.country)
          ? { addressCountry: clean(input.country) }
          : {}),
      }
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": input.type || "LocalBusiness",
    ...(url ? { "@id": `${url.origin}/#business` } : {}),
    ...(name ? { name } : {}),
    ...(url ? { url: url.toString() } : {}),
    ...(logo ? { logo: logo.toString() } : {}),
    ...(clean(input.phone) ? { telephone: clean(input.phone) } : {}),
    ...(clean(input.email) ? { email: clean(input.email) } : {}),
    ...(clean(input.priceRange)
      ? { priceRange: clean(input.priceRange) }
      : {}),
    ...(address ? { address } : {}),
    ...(serviceAreas.length ? { areaServed: serviceAreas } : {}),
    ...(hours.length ? { openingHours: hours } : {}),
  };
  const json = JSON.stringify(schema, null, 2).replace(/</g, "\\u003c");
  const missing = [
    !name ? "business name" : "",
    !url ? "website address" : "",
    !clean(input.phone) ? "phone number" : "",
    !address && !serviceAreas.length ? "address or service area" : "",
  ].filter(Boolean);

  return {
    schema,
    json,
    script: `<script type="application/ld+json">\n${json}\n</script>`,
    missing,
  };
}

export type WebsiteBriefInput = {
  businessName: string;
  audience: string;
  services: string;
  serviceArea: string;
  primaryAction: string;
  differentiators: string;
  proof: string;
  contact: string;
  pages: string[];
  notes: string;
};

export function buildWebsiteBrief(input: WebsiteBriefInput) {
  const missing = [
    !clean(input.businessName) ? "Business name" : "",
    !clean(input.audience) ? "Ideal customer" : "",
    !clean(input.services) ? "Services or products" : "",
    !clean(input.serviceArea) ? "Service area" : "",
    !clean(input.primaryAction) ? "Main action visitors should take" : "",
    !clean(input.contact) ? "Public contact information" : "",
    !input.pages.length ? "Requested pages" : "",
  ].filter(Boolean);
  const value = (text: string) => clean(text) || "Not supplied yet";
  const brief = [
    "WEBSITE PROJECT BRIEF",
    "",
    `Business: ${value(input.businessName)}`,
    `Ideal customer: ${value(input.audience)}`,
    `Service area: ${value(input.serviceArea)}`,
    "",
    "WHAT THE BUSINESS SELLS",
    value(input.services),
    "",
    "MAIN WEBSITE GOAL",
    value(input.primaryAction),
    "",
    "WHY A CUSTOMER SHOULD CHOOSE THIS BUSINESS",
    value(input.differentiators),
    "",
    "PROOF AVAILABLE",
    value(input.proof),
    "",
    "PUBLIC CONTACT INFORMATION",
    value(input.contact),
    "",
    "PLANNED PAGES",
    input.pages.length
      ? input.pages.map((page) => `• ${page}`).join("\n")
      : "Not supplied yet",
    "",
    "OTHER REQUIREMENTS OR NOTES",
    value(input.notes),
    "",
    "MISSING BEFORE THE BUILD",
    missing.length
      ? missing.map((item) => `• ${item}`).join("\n")
      : "• No core brief fields are missing. Business facts still need final verification before publishing.",
  ].join("\n");

  return { brief, missing };
}

const vaguePhrases = [
  "best in class",
  "cutting edge",
  "customer satisfaction",
  "high quality",
  "industry leading",
  "innovative solutions",
  "one stop shop",
  "premier provider",
  "state of the art",
  "world class",
];

function countWords(value: string) {
  return value.match(/[\p{L}\p{N}][\p{L}\p{N}’'’-]*/gu)?.length || 0;
}

export type CopyClarityFinding = {
  title: string;
  detail: string;
};

export function inspectCopyClarity(value: string) {
  const text = value.trim();
  const words = countWords(text);
  const sentences = text
    .split(/[.!?]+(?:\s+|$)/)
    .map(clean)
    .filter(Boolean);
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(clean)
    .filter(Boolean);
  const sentenceLengths = sentences.map(countWords);
  const longSentences = sentenceLengths.filter((length) => length > 25).length;
  const longParagraphs = paragraphs.filter(
    (paragraph) => countWords(paragraph) > 80,
  ).length;
  const averageSentenceLength = sentences.length
    ? words / sentences.length
    : words;
  const lower = text.toLowerCase();
  const foundVaguePhrases = vaguePhrases.filter((phrase) =>
    lower.includes(phrase),
  );
  const hasNextStep =
    /\b(call|text|contact|book|schedule|request|reserve|get a quote|learn more|shop|buy|apply|visit)\b/i.test(
      text,
    );
  const customerWords = text.match(/\b(you|your|yours)\b/gi)?.length || 0;
  const companyWords = text.match(/\b(we|our|ours|us)\b/gi)?.length || 0;
  const findings: CopyClarityFinding[] = [];

  if (!text) {
    findings.push({
      title: "Add some website wording",
      detail: "Paste a homepage, service description, or About section to inspect it.",
    });
  } else {
    if (longSentences) {
      findings.push({
        title: `Shorten ${longSentences} long ${longSentences === 1 ? "sentence" : "sentences"}`,
        detail:
          "Sentences over 25 words can be harder to scan. Split the idea or remove words that do not change the meaning.",
      });
    }
    if (averageSentenceLength > 20) {
      findings.push({
        title: "Make the overall rhythm easier to read",
        detail: `The average sentence contains ${averageSentenceLength.toFixed(1)} words. Mix short statements with the necessary detail.`,
      });
    }
    if (longParagraphs) {
      findings.push({
        title: `Break up ${longParagraphs} dense ${longParagraphs === 1 ? "paragraph" : "paragraphs"}`,
        detail:
          "Paragraphs over 80 words can hide the main point on a phone. Add a useful heading or split the thought.",
      });
    }
    if (foundVaguePhrases.length) {
      findings.push({
        title: "Replace vague claims with facts",
        detail: `Found: ${foundVaguePhrases.join(", ")}. Explain what the business actually does differently or prove the claim.`,
      });
    }
    if (!hasNextStep) {
      findings.push({
        title: "Tell the visitor what to do next",
        detail:
          "Add one specific next step, such as calling, texting, requesting a quote, booking, or visiting the business.",
      });
    }
    if (words >= 40 && customerWords === 0) {
      findings.push({
        title: "Speak directly to the customer",
        detail:
          "The copy does not use “you” or “your.” Explain what the customer receives or what becomes easier for them.",
      });
    }
    if (words >= 40 && companyWords > customerWords * 3) {
      findings.push({
        title: "Shift some attention from the company to the customer",
        detail: `The copy uses company-focused words ${companyWords} times and customer-focused words ${customerWords} times. Reframe a few sentences around the visitor’s need.`,
      });
    }
  }

  return {
    words,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    averageSentenceLength,
    longSentences,
    longParagraphs,
    foundVaguePhrases,
    hasNextStep,
    customerWords,
    companyWords,
    findings,
  };
}

export type LeadResponseInput = {
  businessName: string;
  customerName: string;
  service: string;
  nextStep: string;
  contactLink: string;
  tone: "warm" | "direct";
};

export function buildLeadResponses(input: LeadResponseInput) {
  const business = clean(input.businessName) || "[your business]";
  const customer = clean(input.customerName) || "[customer name]";
  const service = clean(input.service) || "[requested service]";
  const nextStep =
    clean(input.nextStep).replace(/[.!?]+$/, "") || "[your next step]";
  const link = clean(input.contactLink);
  const linkLine = link ? ` ${link}` : "";

  if (input.tone === "direct") {
    return {
      immediate: `Hi ${customer}, this is ${business}. I received your request about ${service}. ${nextStep}.${linkLine}`,
      afterHours: `Hi ${customer}, ${business} received your message about ${service}. We are currently away, but we will follow up during the next business day. ${nextStep}.${linkLine}`,
      emailSubject: `${service} — next step from ${business}`,
      emailBody: `Hi ${customer},\n\nThank you for contacting ${business} about ${service}. ${nextStep}.${linkLine}\n\nIf any details changed, reply here and let us know.\n\n${business}`,
      followUp: `Hi ${customer}, following up from ${business} about ${service}. If you still need help, ${nextStep.toLowerCase()}.${linkLine} If not, no problem—just let us know.`,
    };
  }

  return {
    immediate: `Hi ${customer}! Thanks for reaching out to ${business} about ${service}. I received your message. ${nextStep}.${linkLine}`,
    afterHours: `Hi ${customer}! Thanks for contacting ${business} about ${service}. We are away right now, but your message came through and we will follow up during the next business day. ${nextStep}.${linkLine}`,
    emailSubject: `Thanks for contacting ${business}`,
    emailBody: `Hi ${customer},\n\nThanks for reaching out to ${business} about ${service}. Your message came through. ${nextStep}.${linkLine}\n\nIf there is anything else we should know before we respond, reply to this email and send it over.\n\nThanks,\n${business}`,
    followUp: `Hi ${customer}! Just following up from ${business} about ${service}. If you still need help, ${nextStep.toLowerCase()}.${linkLine} If you already handled it, no pressure—just let us know.`,
  };
}

export type ReviewReplyInput = {
  businessName: string;
  reviewerName: string;
  service: string;
  positiveDetail: string;
  concern: string;
  nextStep: string;
  sentiment: "positive" | "mixed" | "negative";
  tone: "warm" | "direct";
};

export function buildReviewReplies(input: ReviewReplyInput) {
  const business = clean(input.businessName) || "[your business]";
  const reviewer = clean(input.reviewerName);
  const greeting = reviewer ? `Hi ${reviewer}, ` : "";
  const service = clean(input.service);
  const positive = clean(input.positiveDetail).replace(/[.!?]+$/, "");
  const concern = clean(input.concern).replace(/[.!?]+$/, "");
  const nextStep = clean(input.nextStep).replace(/[.!?]+$/, "");
  const signoff = input.tone === "warm" ? " Thank you again." : "";

  if (input.sentiment === "positive") {
    const detail = positive
      ? `We are glad ${positive.charAt(0).toLowerCase()}${positive.slice(1)}.`
      : service
        ? `We appreciate the feedback about ${service}.`
        : "We appreciate the feedback.";
    return {
      short: `${greeting}thank you for taking the time to leave an honest review. ${detail} Thank you for choosing ${business}.${signoff}`,
      full: `${greeting}thank you for sharing your experience with ${business}. ${detail} Feedback like this helps our team understand what customers value. We appreciate the opportunity to help.${signoff}`,
    };
  }

  if (input.sentiment === "mixed") {
    const goodLine = positive
      ? `We are glad ${positive.charAt(0).toLowerCase()}${positive.slice(1)}. `
      : "";
    const concernLine = concern
      ? `We also hear your concern about ${concern}. `
      : "We also hear that part of the experience could have been better. ";
    const nextLine = nextStep
      ? `${nextStep.charAt(0).toUpperCase()}${nextStep.slice(1)}. `
      : "";
    return {
      short: `${greeting}thank you for the honest feedback. ${goodLine}${concernLine}${nextLine}We appreciate the chance to improve.${signoff}`,
      full: `${greeting}thank you for taking the time to share a balanced review of${service ? ` ${service}` : " your experience"}. ${goodLine}${concernLine}${nextLine}We appreciate your business and the opportunity to learn from the feedback.${signoff}`,
    };
  }

  const concernLine = concern
    ? `We take your concern about ${concern} seriously. `
    : "We take your concern seriously. ";
  const nextLine = nextStep
    ? `${nextStep.charAt(0).toUpperCase()}${nextStep.slice(1)}. `
    : "Please contact us directly so we can understand the details and discuss an appropriate next step. ";
  return {
    short: `${greeting}thank you for bringing this to our attention. ${concernLine}${nextLine}We would welcome the opportunity to speak with you directly.${signoff}`,
    full: `${greeting}thank you for taking the time to share this feedback with ${business}. ${concernLine}${nextLine}We do not want to discuss private details in a public reply, but we would welcome a direct conversation so we can better understand what happened.${signoff}`,
  };
}

export type AutomationSignal =
  | "lead-copying"
  | "slow-response"
  | "manual-scheduling"
  | "appointment-reminders"
  | "review-requests"
  | "duplicate-entry"
  | "recurring-reports"
  | "missing-information"
  | "payment-reminders"
  | "customer-onboarding";

export type AutomationOpportunity = {
  id: AutomationSignal;
  name: string;
  problem: string;
  trigger: string;
  action: string;
  humanCheckpoint: string;
  firstTest: string;
};

export const automationOpportunityCatalog: AutomationOpportunity[] = [
  {
    id: "slow-response",
    name: "Immediate lead acknowledgement",
    problem: "New inquiries wait for a manual first response.",
    trigger: "A valid website form or approved lead source receives a new inquiry.",
    action: "Confirm receipt, set an honest response expectation, and notify the right person.",
    humanCheckpoint: "A person reviews the request and sends any quote, diagnosis, or commitment.",
    firstTest: "Send five internal test leads during and after business hours, including one incomplete submission.",
  },
  {
    id: "lead-copying",
    name: "Lead capture and assignment",
    problem: "Someone copies website or inbox leads into a tracker by hand.",
    trigger: "A lead arrives from an approved form, email parser, or advertising source.",
    action: "Create one standardized lead record, attach the source, and assign an owner.",
    humanCheckpoint: "The assigned person verifies contact details before outreach.",
    firstTest: "Compare ten test submissions with the created records, including duplicates and missing fields.",
  },
  {
    id: "manual-scheduling",
    name: "Scheduling and confirmation",
    problem: "Appointments require repeated back-and-forth messages.",
    trigger: "A customer chooses an available appointment or requests a scheduling change.",
    action: "Create or update the calendar event and send the correct confirmation.",
    humanCheckpoint: "Staff controls availability, travel buffers, exceptions, and final acceptance rules.",
    firstTest: "Test booking, rescheduling, cancellation, time zones, and a slot that becomes unavailable.",
  },
  {
    id: "appointment-reminders",
    name: "Appointment reminders",
    problem: "Staff sends reminders manually or customers miss appointments.",
    trigger: "A confirmed appointment reaches a defined time before its start.",
    action: "Send the approved reminder with time, location, and change instructions.",
    humanCheckpoint: "Staff handles replies, special instructions, and failed deliveries.",
    firstTest: "Use internal appointments to test the timing, cancellation path, and duplicate prevention.",
  },
  {
    id: "review-requests",
    name: "Honest review request follow-up",
    problem: "Completed customers are asked for feedback inconsistently.",
    trigger: "A job is marked complete and the customer is eligible to be contacted.",
    action: "Send one honest-review request and, if appropriate, one polite follow-up.",
    humanCheckpoint: "Staff excludes disputes, confirms consent, and responds personally to sensitive feedback.",
    firstTest: "Run with internal records and confirm stop rules, links, timing, and contact preferences.",
  },
  {
    id: "duplicate-entry",
    name: "Approved system-to-system update",
    problem: "The same customer or job information is typed into multiple systems.",
    trigger: "An approved source record is created or a specific field changes.",
    action: "Update only mapped fields in the destination and log the result.",
    humanCheckpoint: "A person resolves conflicts, ambiguous matches, and failed updates.",
    firstTest: "Use copies of ten representative records, including duplicates and intentionally conflicting data.",
  },
  {
    id: "recurring-reports",
    name: "Recurring operational report",
    problem: "Someone rebuilds the same status report from known sources.",
    trigger: "A scheduled reporting time arrives.",
    action: "Collect defined facts, calculate documented totals, and deliver a consistent summary.",
    humanCheckpoint: "An owner checks anomalies and makes decisions; the report does not invent explanations.",
    firstTest: "Compare the automated output with three previously verified manual reports.",
  },
  {
    id: "missing-information",
    name: "Missing-information follow-up",
    problem: "Work stalls while staff repeatedly asks for the same documents or answers.",
    trigger: "A record remains incomplete after a defined period.",
    action: "List only the missing items and send an approved upload or reply path.",
    humanCheckpoint: "Staff decides whether an exception is acceptable and reviews sensitive documents.",
    firstTest: "Test complete, incomplete, overdue, and exempt records without using real sensitive information.",
  },
  {
    id: "payment-reminders",
    name: "Invoice reminder sequence",
    problem: "Staff manually checks due dates and sends routine payment reminders.",
    trigger: "An issued invoice reaches an approved reminder date and remains unpaid.",
    action: "Send the correct factual reminder with the invoice reference and approved payment path.",
    humanCheckpoint: "Staff handles disputes, partial payments, hardship, and any account action.",
    firstTest: "Test paid, unpaid, partially paid, disputed, canceled, and duplicate invoice states.",
  },
  {
    id: "customer-onboarding",
    name: "Customer onboarding checklist",
    problem: "Every new customer receives the same set of instructions and requests.",
    trigger: "A sale, agreement, or project reaches the approved starting stage.",
    action: "Send the relevant welcome information and create the internal checklist.",
    humanCheckpoint: "The project owner confirms scope, exceptions, and readiness before work begins.",
    firstTest: "Run one internal example for each service type and verify that irrelevant steps stay out.",
  },
];

export function buildAutomationPlan(
  business: string,
  selected: AutomationSignal[],
) {
  const opportunities = automationOpportunityCatalog.filter((item) =>
    selected.includes(item.id),
  );
  const businessName = clean(business) || "The business";
  const plan = [
    `AUTOMATION OPPORTUNITY PLAN — ${businessName}`,
    "",
    opportunities.length
      ? `Selected opportunities: ${opportunities.length}`
      : "No opportunities selected yet.",
    "",
    ...opportunities.flatMap((item, index) => [
      `${index + 1}. ${item.name.toUpperCase()}`,
      `Current friction: ${item.problem}`,
      `Trigger: ${item.trigger}`,
      `Automated action: ${item.action}`,
      `Human checkpoint: ${item.humanCheckpoint}`,
      `First safe test: ${item.firstTest}`,
      "",
    ]),
    "IMPLEMENTATION NOTES",
    "• Confirm the source of truth, field mapping, owner, permissions, failure alert, and stop rule before launch.",
    "• Start with test data, keep a manual fallback, and review the first real runs.",
    "• Estimate cost and time savings only after measuring the current process with real numbers.",
  ].join("\n");
  return { opportunities, plan };
}
