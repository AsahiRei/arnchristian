import type { MetadataRoute } from "next";

const BASE_URL = "https://arnchristian.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/skills", "/projects", "/experience", "/certificates", "/contact", "/blog"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
