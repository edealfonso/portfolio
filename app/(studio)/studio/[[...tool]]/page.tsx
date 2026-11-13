import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { isConfigured } from "@/sanity/env";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isConfigured) {
    return (
      <p style={{ fontFamily: "sans-serif", padding: 40 }}>
        Sanity is not connected yet. Set NEXT_PUBLIC_SANITY_PROJECT_ID in
        .env.local and restart.
      </p>
    );
  }
  return <NextStudio config={config} />;
}
