"use client";

import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schema";

export default defineConfig({
  name: "default",
  title: "Portfolio",
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            orderableDocumentListDeskItem({
              type: "project",
              title: "Projects",
              S,
              context,
            }),
            S.listItem()
              .title("Technologies")
              .child(
                S.documentTypeList("technology")
                  .title("Technologies")
                  .defaultOrdering([{ field: "name", direction: "asc" }]),
              ),
            // About is a single document with a fixed id.
            S.listItem()
              .title("About")
              .child(S.document().schemaType("about").documentId("about")),
          ]),
    }),
  ],
});
