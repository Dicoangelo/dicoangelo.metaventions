#!/usr/bin/env tsx
/**
 * Audit label distribution across the artifact corpus.
 * Reports counts per dimension to surface gaps (e.g. no
 * "investor" audience artifacts, or no "founder-cto" role-cut).
 *
 * Run: npx tsx scripts/audit-labels.ts
 */

import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { tagsToLabels, LABEL_DIMENSIONS } from "./lib/three-layer";

config({ path: resolve(process.cwd(), ".env.local") });

async function main(): Promise<void> {
  const sb = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await sb
    .from("artifacts")
    .select("slug,title,tags")
    .eq("status", "published");
  if (error || !data) {
    console.error("load failed:", error);
    process.exit(1);
  }

  const dist = {
    audience: new Map<string, number>(),
    role_cuts: new Map<string, number>(),
    sensitivity: new Map<string, number>(),
    evidence_strength: new Map<string, number>(),
    evidence_type: new Map<string, number>(),
  };
  let unlabeled = 0;
  const unlabeledSlugs: string[] = [];

  for (const a of data as { slug: string; title: string; tags: string[] | null }[]) {
    const { labels } = tagsToLabels(a.tags ?? []);
    const hasAny =
      (labels.audience?.length ?? 0) > 0 ||
      (labels.role_cuts?.length ?? 0) > 0 ||
      labels.sensitivity ||
      labels.evidence_strength;
    if (!hasAny) {
      unlabeled++;
      unlabeledSlugs.push(a.slug);
      continue;
    }
    for (const v of labels.audience ?? []) dist.audience.set(v, (dist.audience.get(v) ?? 0) + 1);
    for (const v of labels.role_cuts ?? []) dist.role_cuts.set(v, (dist.role_cuts.get(v) ?? 0) + 1);
    if (labels.sensitivity)
      dist.sensitivity.set(labels.sensitivity, (dist.sensitivity.get(labels.sensitivity) ?? 0) + 1);
    if (labels.evidence_strength)
      dist.evidence_strength.set(
        labels.evidence_strength,
        (dist.evidence_strength.get(labels.evidence_strength) ?? 0) + 1
      );
    for (const v of labels.evidence_type ?? [])
      dist.evidence_type.set(v, (dist.evidence_type.get(v) ?? 0) + 1);
  }

  console.log(`Audited ${data.length} published artifacts.\n`);
  if (unlabeled > 0) {
    console.log(`⚠  ${unlabeled} artifacts have NO labels yet. Run classify-and-catalog-existing.ts.`);
    for (const s of unlabeledSlugs.slice(0, 10)) console.log(`     · ${s}`);
    console.log("");
  }

  for (const [dim, allowed] of Object.entries(LABEL_DIMENSIONS)) {
    const map = dist[dim as keyof typeof dist];
    console.log(`\n## ${dim}`);
    for (const v of allowed) {
      const n = map.get(v) ?? 0;
      const bar = "█".repeat(Math.min(n, 50));
      const flag = n === 0 ? "  ⚠ GAP" : "";
      console.log(`  ${v.padEnd(35)} ${n.toString().padStart(3)}  ${bar}${flag}`);
    }
  }

  console.log(`\n# Coverage gaps`);
  for (const [dim, allowed] of Object.entries(LABEL_DIMENSIONS)) {
    const map = dist[dim as keyof typeof dist];
    const missing = (allowed as readonly string[]).filter((v) => (map.get(v) ?? 0) === 0);
    if (missing.length) {
      console.log(`  ${dim}: missing ${missing.join(", ")}`);
    }
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
