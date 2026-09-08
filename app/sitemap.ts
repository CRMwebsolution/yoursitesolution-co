import type { MetadataRoute } from "next";
import { publishedProjects } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/websites",
    "/automation",
    "/tools",
    "/tools/website-check",
    "/tools/search-preview",
    "/tools/review-text",
    "/tools/time-check",
    "/pricing",
    "/contact",
    "/free-demo",
  ];
  if (publishedProjects.length) routes.push("/work");

  return routes.map((route) => ({
    url: `https://yoursitesolution.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/contact" ? 0.9 : 0.8,
  }));
}
