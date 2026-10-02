/** The historical remote document has no reviewed public provenance manifest.
 * Retain compatibility exports while failing closed; public retrieval lives in dossier.ts.
 * Re-enabling a provider requires source-level visibility, hash and freshness gates.
 */
export function isPageIndexAvailable(): boolean { return false; }
export async function retrieveFromPageIndex(_query: string, _options: { documentId?: string; thinking?: boolean; maxWaitMs?: number } = {}): Promise<null> { void _query; void _options; return null; }
export function formatPageIndexContext(_retrieval: unknown): string { void _retrieval; return ""; }
export async function getPageIndexContext(_query: string): Promise<string> { void _query; return ""; }
