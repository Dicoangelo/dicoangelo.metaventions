/** Compatibility index: only reviewed public entries can become answer context. */
import { getPublicKnowledgeEntries } from "./dossier";
export async function getArtifactIndex(): Promise<string> {
  const entries = await getPublicKnowledgeEntries();
  return entries.map((entry) => `- ${entry.title} [${entry.slug}; reviewed ${entry.reviewed_at}]`).join("\n");
}
export function clearArtifactIndexCache(): void { /* No stale summary cache is retained. */ }
