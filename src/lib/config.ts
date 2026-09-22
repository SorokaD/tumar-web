export const siteConfig = {
  name: "Tumar",
  wordmark: "TUMAR",
  title: "Tumar — Data, ML & Engineering Research",
  description:
    "Personal engineering and research projects in data, machine learning, market microstructure and realtime systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tumar.tech",
  githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/SorokaD",
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  supersetPublicUrl: process.env.NEXT_PUBLIC_SUPERSET_PUBLIC_URL ?? "",
  author: process.env.NEXT_PUBLIC_SITE_AUTHOR ?? "Dmitrii Soroka",
  googleSiteVerification:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
} as const;

export const navItems = [
  { href: "/projects", label: "Projects", match: "exact" },
  { href: "/projects/hft/live", label: "Live" },
  { href: "/projects/hft/research", label: "Research" },
  { href: "/about", label: "About" },
] as const;
