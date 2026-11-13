/**
 * One-off: turns the free-text keyTech/stack tags into shared "technology"
 * documents and links the projects to them.
 *
 *   npx sanity exec sanity/migrate-technologies.ts --with-user-token            (dry run)
 *   npx sanity exec sanity/migrate-technologies.ts --with-user-token -- --apply (writes)
 *
 * Safe to rerun: technology ids are derived from the name, and the old tags are
 * left in place as a backup.
 */
import { getCliClient } from "sanity/cli";

// Different spellings of the same thing, mapped to the name used on the site.
const ALIASES: Record<string, string> = {
  swiper: "Swiper.js",
  "swiper js": "Swiper.js",
};

const apply = process.argv.includes("--apply");
const client = getCliClient({ apiVersion: "2024-01-01" });

const key = (name: string) => name.trim().toLowerCase();
const slug = (name: string) =>
  key(name)
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Doc = { _id: string; title: string; keyTech?: string[]; stack?: string[] };

async function main() {
  const projects = await client.fetch<Doc[]>(
    `*[_type == "project" && !(_id in path("drafts.**"))]{_id, title, keyTech, stack}`,
  );

  // Pick one display name per technology: the alias target, else the most common spelling.
  const counts = new Map<string, Map<string, number>>();
  for (const p of projects)
    for (const raw of [...(p.keyTech ?? []), ...(p.stack ?? [])]) {
      const name = ALIASES[key(raw)] ?? raw.trim();
      const spellings = counts.get(key(name)) ?? new Map<string, number>();
      spellings.set(name, (spellings.get(name) ?? 0) + 1);
      counts.set(key(name), spellings);
    }
  const display = new Map<string, string>();
  for (const [k, spellings] of counts)
    display.set(k, [...spellings].sort((a, b) => b[1] - a[1])[0][0]);

  const idOf = (raw: string) =>
    `technology-${slug(display.get(key(ALIASES[key(raw)] ?? raw))!)}`;

  console.log(`${display.size} technologies:`);
  console.log([...display.values()].sort().join(", "));
  for (const p of projects)
    for (const raw of [...(p.keyTech ?? []), ...(p.stack ?? [])])
      if (ALIASES[key(raw)])
        console.log(`merged "${raw}" -> "${ALIASES[key(raw)]}" in ${p.title}`);

  if (!apply) return console.log("\nDry run. Add `-- --apply` to write.");

  const tx = client.transaction();
  for (const name of display.values())
    tx.createIfNotExists({
      _id: `technology-${slug(name)}`,
      _type: "technology",
      name,
    });
  for (const p of projects) {
    const refs = (tags?: string[]) =>
      [...new Set((tags ?? []).map(idOf))].map((id) => ({
        _type: "reference",
        _key: id,
        _ref: id,
      }));
    tx.patch(p._id, {
      set: { technologies: refs(p.stack), keyTechnologies: refs(p.keyTech) },
    });
  }
  await tx.commit();
  console.log("\nDone.");
}

main();
