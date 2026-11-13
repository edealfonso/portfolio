import { cacheLife } from "next/cache";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isConfigured, projectId } from "./env";

export type Project = {
  _id: string;
  title: string;
  year?: string;
  kind?: "website" | "platform" | "contribution";
  keyTech?: string[];
  stack?: string[];
  summary?: string;
  role?: string;
  url?: string;
  companyUrl?: string;
  video?: string;
  image?: string;
};

export type About = {
  heading?: string;
  bio?: string;
  photo?: string;
  cv?: string;
  github?: string;
  linkedin?: string;
};

export type SiteData = { projects: Project[]; about: About };

const query = `{
  "projects": *[_type == "project"] | order(orderRank asc, _createdAt desc) {
    _id, title, year, kind, summary, role, url, companyUrl,
    // Technologies are shared documents; the old free-text tags are the fallback.
    "keyTech": coalesce(keyTechnologies[]->name, keyTech),
    "stack": coalesce(technologies[]->name, stack),
    "video": video.asset->url,
    "image": image.asset->url
  },
  "about": *[_type == "about"][0] {
    heading, bio, github, linkedin,
    "photo": photo.asset->url,
    "cv": cv.asset->url
  }
}`;

// Shown until Sanity is connected, so the site runs out of the box.
const sample: SiteData = {
  projects: [
    ["Sample Project One", 2025, ["Next.js", "Sanity", "GSAP"]],
    ["Sample Project Two", 2025, ["Shopify", "Liquid", "Alpine"]],
    ["Sample Project Three", 2024, ["Astro", "Sanity", "Mux"]],
    ["Sample Project Four", 2024, ["WordPress", "ACF", "Three.js"]],
  ].map(([title, year, keyTech], i) => ({
    _id: `sample-${i}`,
    title: title as string,
    year: String(year),
    keyTech: keyTech as string[],
    stack: [...(keyTech as string[]), "TypeScript", "Vercel"],
    summary: "A sentence or two about the project and what made it special.",
    role: "What you built: front end, CMS integration, animation, performance.",
    url: "https://example.com",
  })),
  about: {
    heading: "Hi, I'm Elsa.",
    bio: "A short text about you goes here: who you are, the kind of projects you enjoy and how you work.",
    github: "https://github.com",
    linkedin: "https://www.linkedin.com",
  },
};

export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheLife("minutes");

  if (!isConfigured) return sample;

  const client = createClient({ projectId, dataset, apiVersion, useCdn: true });
  const data = await client.fetch<{ projects: Project[]; about: About | null }>(
    query,
  );
  // Until there is real content, keep showing the samples.
  return {
    projects: data.projects?.length ? data.projects : sample.projects,
    about: data.about ?? sample.about,
  };
}
