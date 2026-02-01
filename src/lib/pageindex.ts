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

const PAGEINDEX_API_BASE = 'https://api.pageindex.ai/v1';

interface PageIndexConfig {
  apiKey: string;
  documentId?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PageIndexResponse {
  id: string;
  object: string;
  created: number;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: Array<{
    doc: string;
    page: number;
    content: string;
  }>;
}

interface RetrievalResponse {
  retrieval_id: string;
  doc_id: string;
  status: string;
  query: string;
  retrieved_nodes: Array<{
    title: string;
    node_id: string;
    relevant_contents: Array<{
      page_index: number;
      relevant_content: string;
    }>;
  }>;
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
 * Query PageIndex for relevant context using reasoning-based retrieval
 */
export async function queryPageIndex(
  query: string,
  options: {
    documentId?: string;
    enableCitations?: boolean;
    stream?: boolean;
  } = {}
): Promise<string> {
  const config = getConfig();

  if (!config) {
    console.warn('PageIndex unavailable: missing PAGEINDEX_API_KEY');
    return '';
  }

  const docId = options.documentId || config.documentId;

  if (!docId) {
    console.warn('PageIndex: no document ID configured');
    return '';
  }

  try {
    const response = await fetch(`${PAGEINDEX_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: query }],
        doc_id: docId,
        enable_citations: options.enableCitations ?? true,
        stream: options.stream ?? false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PageIndex API error:', response.status, errorText);
      return '';
    }

    const data: PageIndexResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('PageIndex query failed:', error);
    return '';
  }
}

/**
 * Retrieve relevant document nodes using PageIndex tree search
 */
export async function retrieveFromPageIndex(
  query: string,
  options: {
    documentId?: string;
  } = {}
): Promise<RetrievalResponse | null> {
  const config = getConfig();

  if (!config) {
    return null;
  }

  const docId = options.documentId || config.documentId;

  if (!docId) {
    return null;
  }

  try {
    const response = await fetch(`${PAGEINDEX_API_BASE}/retrieval`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        doc_id: docId,
        query,
      }),
    });

    if (!response.ok) {
      console.error('PageIndex retrieval error:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('PageIndex retrieval failed:', error);
    return null;
  }
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
    const contents = node.relevant_contents
      .map((c) => `[Page ${c.page_index}] ${c.relevant_content}`)
      .join('\n\n');
    return `${header}\n${contents}`;
  });

  return `## Retrieved Context from Career Dossier (PageIndex Reasoning RAG)\n\nThe following information was retrieved using tree-based reasoning from Dico Angelo's career dossier:\n\n${sections.join('\n\n---\n\n')}`;
}

/**
 * Get context for chat using PageIndex reasoning
 * Falls back to empty string if PageIndex is unavailable
 */
export async function getPageIndexContext(query: string): Promise<string> {
  const retrieval = await retrieveFromPageIndex(query);

  if (retrieval) {
    return formatPageIndexContext(retrieval);
  }

  // Alternative: Use chat completions to get a direct answer with context
  const directAnswer = await queryPageIndex(query, { enableCitations: true });

  if (directAnswer) {
    return `## PageIndex Retrieved Context\n\n${directAnswer}`;
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
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if PageIndex is configured and available
 */
export function isPageIndexAvailable(): boolean {
  return !!(process.env.PAGEINDEX_API_KEY && process.env.PAGEINDEX_DOCUMENT_ID);
}

export type { PageIndexResponse, RetrievalResponse, ChatMessage };
