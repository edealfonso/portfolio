import { getSiteData } from "@/sanity/data";
import Portfolio from "./Portfolio";

export default async function Page() {
  const { projects, about } = await getSiteData();
  const site = "https://elsadealfonso.vercel.app";
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Elsa de Alfonso",
      jobTitle: "Full Stack Software Engineer",
      url: site,
      sameAs: [about.github, about.linkedin].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Selected projects",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `${site}/#${p.title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")}`,
      })),
    },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Portfolio
        projects={projects}
        about={about}
        formKey={process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ""}
      />
    </>
  );
}
