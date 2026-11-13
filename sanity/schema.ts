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
    defineField({
      name: "order",
      type: "number",
      description: "Position in the list. Lower numbers come first.",
    }),
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
      name: "keyTech",
      title: "Key technologies",
      description: "The 2–3 shown on hover.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      validation: (r) => r.max(3),
    }),
    defineField({
      name: "stack",
      title: "Full stack",
      description: "Everything, shown in the popup.",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "summary",
      title: "What it is",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "role", title: "My part", type: "text", rows: 3 }),
    defineField({
      name: "url",
      title: "Link to the result",
      description: 'Shown as "Visit site". Only when what people see is my work.',
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
      description: "Without video or screenshot the site shows a blurred placeholder.",
      type: "image",
    }),
  ],
  orderings: [
    {
      title: "List order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
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

export const schemaTypes = [project, about];
