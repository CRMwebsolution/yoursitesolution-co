export const tools = [
  {
    slug: "website-check",
    href: "/tools/website-check",
    number: "01",
    name: "Website check",
    summary:
      "Paste a URL. Get speed scores plus a plain-English read on whether a customer can actually reach you.",
    action: "Check a website",
  },
  {
    slug: "review-text",
    href: "/tools/review-text",
    number: "02",
    name: "Review request text",
    summary:
      "Write a short message you can send after a job. No login. Copy it and send it.",
    action: "Write a review text",
  },
  {
    slug: "time-check",
    href: "/tools/time-check",
    number: "03",
    name: "Busywork check",
    summary:
      "Answer a few yes/no questions about repeat office work. See whether automation is even worth talking about.",
    action: "Check the busywork",
  },
] as const;

export const reviewTrades = [
  "General service",
  "Mechanic / auto repair",
  "Plumbing",
  "Electrical",
  "HVAC",
  "Carpentry / remodeling",
  "Lawn / landscaping",
  "Cleaning",
  "Hotel / lodging",
  "Other local business",
] as const;

export const reviewJobs = [
  "a service call",
  "a repair",
  "an install",
  "a quote visit",
  "a completed project",
  "a stay",
] as const;

export function buildReviewText(input: {
  ownerName: string;
  businessName: string;
  customerName: string;
  trade: string;
  job: string;
  reviewLink: string;
}) {
  const owner = input.ownerName.trim() || "I";
  const customer = input.customerName.trim() || "there";
  const business = input.businessName.trim();
  const from = business ? ` — ${business}` : "";
  const link = input.reviewLink.trim();
  const closer = link
    ? ` If it looked right, a quick Google review helps more than anything. ${link}`
    : " If it looked right, a quick Google review helps more than anything.";

  return `Hey ${customer}, thanks for having ${owner === "I" ? "me" : owner} out for ${input.job} today.${closer}${from}`;
}

export const timeQuestions = [
  {
    id: "forms",
    label: "Form follow-up",
    prompt: "Do you copy website form submissions into email, a spreadsheet, or a notebook by hand?",
  },
  {
    id: "invoices",
    label: "Invoices",
    prompt: "Do you type the same customer and job details into an invoice after you already wrote them somewhere else?",
  },
  {
    id: "calendar",
    label: "Calendar",
    prompt: "Do accepted jobs get added to a calendar by hand?",
  },
  {
    id: "reminders",
    label: "Reminders",
    prompt: "Do customers wait until you personally remember to confirm an appointment or send a reminder?",
  },
  {
    id: "reviews",
    label: "Reviews",
    prompt: "Do you forget to ask for a review unless you happen to think of it after the job?",
  },
] as const;

export function scoreBusywork(answers: Record<string, boolean>) {
  const yes = timeQuestions.filter((question) => answers[question.id]).length;
  const hours = yes * 1.5;
  let headline = "Not much to automate yet.";
  let detail =
    "If the office work is already light, a website that makes the next call easier may be the better first step.";

  if (yes >= 4) {
    headline = "This is eating real hours.";
    detail =
      "Several of these tasks are the same motion every week. That is the kind of work worth connecting once instead of repeating.";
  } else if (yes >= 2) {
    headline = "There is enough repeat work to look at.";
    detail =
      "You do not need a giant system. One or two handoffs—form to inbox, job to invoice, job to calendar—usually pay for themselves.";
  }

  return { yes, hours, headline, detail };
}
