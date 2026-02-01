/**
 * PageIndex Reasoning RAG Service
 *
 * Uses PageIndex's tree-based reasoning for document retrieval.
 * Replaces vector similarity search with LLM-powered document navigation.
 *
 * Benefits over Cohere/Supabase:
 * - 98.7% accuracy (vs ~30-50% for vector search)
 * - No chunking needed - preserves document context
 * - Reasoning-based retrieval - better for complex questions
 * - Transparent citations with page references
 */

const PAGEINDEX_API_BASE = 'https://api.pageindex.ai';

interface PageIndexConfig {
  apiKey: string;
  documentId?: string;
}

interface RelevantContent {
  section_title: string;
  physical_index: string;
  relevant_content: string;
}

interface RetrievedNode {
  id: string;
  title: string;
  metadata: string[];
  relevant_contents: RelevantContent[][];
}

interface RetrievalResponse {
  retrieval_id: string;
  doc_id: string;
  status: 'processing' | 'completed' | 'failed';
  query: string;
  retrieved_nodes?: RetrievedNode[];
}

interface SubmitQueryResponse {
  retrieval_id: string;
}

let pageIndexConfig: PageIndexConfig | null = null;

function getConfig(): PageIndexConfig | null {
  if (!process.env.PAGEINDEX_API_KEY) {
    return null;
  }
  if (!pageIndexConfig) {
    pageIndexConfig = {
      apiKey: process.env.PAGEINDEX_API_KEY,
      documentId: process.env.PAGEINDEX_DOCUMENT_ID,
    };
  }
  return pageIndexConfig;
}

/**
 * Submit a retrieval query to PageIndex
 */
async function submitQuery(
  query: string,
  documentId: string,
  thinking: boolean = true
): Promise<string | null> {
  const config = getConfig();
  if (!config) return null;

  try {
    const response = await fetch(`${PAGEINDEX_API_BASE}/retrieval/`, {
      method: 'POST',
      headers: {
        'api_key': config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doc_id: documentId,
        query,
        thinking,
      }),
    });

    if (!response.ok) {
      console.error('PageIndex submit query error:', response.status);
      return null;
    }

    const data: SubmitQueryResponse = await response.json();
    return data.retrieval_id;
  } catch (error) {
    console.error('PageIndex submit query failed:', error);
    return null;
  }
}

/**
 * Get retrieval results from PageIndex
 */
async function getRetrieval(retrievalId: string): Promise<RetrievalResponse | null> {
  const config = getConfig();
  if (!config) return null;

  try {
    const response = await fetch(`${PAGEINDEX_API_BASE}/retrieval/${retrievalId}/`, {
      method: 'GET',
      headers: {
        'api_key': config.apiKey,
      },
    });

    if (!response.ok) {
      console.error('PageIndex get retrieval error:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('PageIndex get retrieval failed:', error);
    return null;
  }
}

/**
 * Poll for retrieval completion with timeout
 * Default 5s to stay within Vercel's serverless limit and allow time for Claude
 */
async function waitForRetrieval(
  retrievalId: string,
  maxWaitMs: number = 5000,
  pollIntervalMs: number = 300
): Promise<RetrievalResponse | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const result = await getRetrieval(retrievalId);

    if (!result) return null;

    if (result.status === 'completed') {
      return result;
    }

    if (result.status === 'failed') {
      console.error('PageIndex retrieval failed');
      return null;
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  console.error('PageIndex retrieval timeout');
  return null;
}

/**
 * Retrieve relevant context from PageIndex using tree-based reasoning
 */
export async function retrieveFromPageIndex(
  query: string,
  options: {
    documentId?: string;
    thinking?: boolean;
    maxWaitMs?: number;
  } = {}
): Promise<RetrievalResponse | null> {
  const config = getConfig();

  if (!config) {
    console.warn('PageIndex unavailable: missing PAGEINDEX_API_KEY');
    return null;
  }

  const docId = options.documentId || config.documentId;

  if (!docId) {
    console.warn('PageIndex: no document ID configured');
    return null;
  }

  // Submit the query
  const retrievalId = await submitQuery(query, docId, options.thinking ?? true);

  if (!retrievalId) {
    return null;
  }

  // Wait for results
  return await waitForRetrieval(retrievalId, options.maxWaitMs ?? 30000);
}

/**
 * Format PageIndex retrieval results as context for Claude
 */
export function formatPageIndexContext(retrieval: RetrievalResponse): string {
  if (!retrieval?.retrieved_nodes?.length) {
    return '';
  }

  const sections = retrieval.retrieved_nodes.map((node) => {
    const header = `### ${node.title}`;

    // Extract all relevant content from nested arrays
    const contents = node.relevant_contents
      .flat()
      .map((content) => {
        const pageMatch = content.physical_index.match(/<physical_index_(\d+)>/);
        const pageNum = pageMatch ? parseInt(pageMatch[1]) + 1 : null;
        const pageRef = pageNum ? `[Page ${pageNum}]` : '';
        return `${pageRef} ${content.relevant_content}`;
      })
      .join('\n\n');

    return `${header}\n${contents}`;
  });

  return `## Retrieved Context from Career Dossier (PageIndex Reasoning RAG)

The following information was retrieved using tree-based reasoning from Dico Angelo's career dossier:

${sections.join('\n\n---\n\n')}`;
}

/**
 * Get context for chat using PageIndex reasoning
 * Falls back to empty string if PageIndex is unavailable
 */
export async function getPageIndexContext(query: string): Promise<string> {
  const retrieval = await retrieveFromPageIndex(query);

  if (retrieval && retrieval.retrieved_nodes?.length) {
    return formatPageIndexContext(retrieval);
  }

  return '';
}

/**
 * Strip inline citations for voice output
 * PageIndex returns citations like: <doc=file.pdf;page=5>
 */
export function stripCitationsForVoice(text: string): string {
  return text
    .replace(/<doc=[^>]+>/g, '')
    .replace(/<physical_index_\d+>/g, '')
    .replace(/\[Page \d+\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if PageIndex is configured and available
 */
export function isPageIndexAvailable(): boolean {
  return !!(process.env.PAGEINDEX_API_KEY && process.env.PAGEINDEX_DOCUMENT_ID);
}

export type { RetrievalResponse, RetrievedNode, RelevantContent };
