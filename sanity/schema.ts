import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    // Drag to reorder in the Studio list; hidden field.
    orderRankField({ type: "project" }),
    defineField({
      name: "year",
      description: 'A year ("2024") or a range ("2022–2024").',
      type: "string",
    }),
    defineField({
      name: "kind",
      title: "Type",
      description: "Shown in grey at the top right of the popup.",
      type: "string",
      options: {
        list: [
          { title: "Website", value: "website" },
          { title: "Web platform", value: "platform" },
          { title: "Platform contribution", value: "contribution" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "keyTechnologies",
      title: "Key technologies",
      description:
        "The 2–3 shown on hover. Pick from the list; create a new one only if it does not exist yet.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "technology" }] }],
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "technologies",
      title: "Full stack",
      description: "Everything, shown in the popup. Pick from the list.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "technology" }] }],
    }),
    // Old free-text tags, kept hidden as a backup until the migration is checked.
    defineField({
      name: "keyTech",
      type: "array",
      of: [{ type: "string" }],
      hidden: true,
    }),
    defineField({
      name: "stack",
      type: "array",
      of: [{ type: "string" }],
      hidden: true,
    }),
    defineField({
      name: "summary",
      title: "What it is",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "role", title: "My part", type: "text", rows: 3 }),
    defineField({
      name: "caseStudy",
      title: "Case Study",
      description: "Long write-up for my own reference. Not shown on the site.",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullets", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
        },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "url",
      title: "Link to the result",
      description:
        'Shown as "Visit site". Only when what people see is my work.',
      type: "url",
    }),
    defineField({
      name: "companyUrl",
      title: "Link to the company",
      description:
        'Shown as "About the company". For internal products with no public result.',
      type: "url",
    }),
    defineField({
      name: "video",
      description: "Short muted loop (mp4). Used instead of the image if set.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "image",
      title: "Screenshot",
      description:
        "Without video or screenshot the site shows a blurred placeholder.",
      type: "image",
    }),
  ],
  orderings: [orderRankOrdering],
  preview: { select: { title: "title", subtitle: "year", media: "image" } },
});

export const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "bio", title: "Text", type: "text", rows: 6 }),
    defineField({ name: "photo", type: "image" }),
    defineField({
      name: "cv",
      title: "CV (PDF)",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({ name: "github", title: "GitHub", type: "url" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
  ],
  preview: { prepare: () => ({ title: "About" }) },
});

/** One entry per technology, so "Swiper" and "Swiper.js" can never both exist. */
export const technology = defineType({
  name: "technology",
  title: "Technology",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      description:
        "Exactly as it should read on the site (e.g. Swiper.js, Next.js).",
      validation: (r) =>
        r.required().custom(async (name, context) => {
          if (!name) return true;
          const client = context.getClient({ apiVersion: "2024-01-01" });
          const id = (context.document?._id ?? "").replace(/^drafts\./, "");
          const clash = await client.fetch<number>(
            `count(*[_type == "technology" && lower(name) == lower($name) && !(_id in [$id, "drafts." + $id])])`,
            { name, id },
          );
          return clash ? "A technology with this name already exists." : true;
        }),
    }),
  ],
  orderings: [
    { title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] },
  ],
  preview: { select: { title: "name" } },
});

export const schemaTypes = [project, technology, about];
