import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

const routes: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] =
  [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/projects", changeFrequency: "monthly", priority: 0.6 },
    { path: "/projects/hft", changeFrequency: "weekly", priority: 0.8 },
    { path: "/projects/hft/live", changeFrequency: "daily", priority: 0.9 },
    { path: "/projects/hft/research", changeFrequency: "monthly", priority: 0.5 },
    { path: "/projects/hft/architecture", changeFrequency: "monthly", priority: 0.5 },
    { path: "/projects/hft/execution", changeFrequency: "monthly", priority: 0.5 },
    { path: "/about", changeFrequency: "monthly", priority: 0.4 },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route.path, `${siteConfig.url}/`).toString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
