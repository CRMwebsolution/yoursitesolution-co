import type { MetadataRoute } from "next";
import { publishedProjects } from "@/config/site";
import { publishedTools } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/websites",
    "/automation",
    "/tools",
    ...publishedTools.map((tool) => tool.href),
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
