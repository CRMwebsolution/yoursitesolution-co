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
