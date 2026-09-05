export type Project = {
  name: string;
  category: string;
  summary: string;
  href?: string;
  published: boolean;
};

export const siteConfig = {
  name: "Your Site Solution",
  owner: "Cody",
  location: "Newport, North Carolina",
  serviceArea: "Serving businesses nationwide",
  email: "cody@yoursitesolution.com",
  phoneDisplay: "(252) 622-7921",
  phoneHref: "+12526227921",
  responseTime: "within 12 hours",
  pricing: {
    singlePage: {
      name: "Single-page website",
      price: 300,
      monthly: 30,
      quarterly: 90,
      description: "A focused custom website with a contact form.",
    },
    basic: {
      name: "Basic business website",
      price: 750,
      monthly: 75,
      quarterly: 225,
      description: "A custom 3–5 page website for an established small business.",
    },
    care: {
      monthly: 25,
      description:
        "Routine copy, hours, and photo updates a couple of times per week. No rollover.",
    },
  },
  automationExamples: [
    "Automatic replies to form submissions",
    "Invoices created from accepted bookings",
    "Calendar tracking for accepted jobs",
    "Custom workflows that cut out repeat admin work",
  ],
  projects: [
    {
      name: "Portfolio project",
      category: "Coming soon",
      summary: "A future Your Site Solution project will appear here.",
      published: false,
    },
  ] satisfies Project[],
} as const;

export const publishedProjects = siteConfig.projects.filter(
  (project) => project.published,
);
