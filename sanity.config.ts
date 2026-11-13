"use client";

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
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("project").title("Projects"),
            // About is a single document with a fixed id.
            S.listItem()
              .title("About")
              .child(S.document().schemaType("about").documentId("about")),
          ]),
    }),
  ],
});
