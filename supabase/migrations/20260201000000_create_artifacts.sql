-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- ================================================================
-- ARTIFACTS TABLE
-- ================================================================
-- Main artifacts table storing portfolio content
CREATE TABLE artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL CHECK (category IN ('project', 'skill', 'experience', 'faq', 'deep-dive')),
  tags TEXT[] DEFAULT '{}',
  related_artifacts UUID[] DEFAULT '{}',
  external_links JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ================================================================
-- ARTIFACT CHUNKS TABLE
-- ================================================================
-- Chunked content for semantic search with embeddings
CREATE TABLE artifact_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artifact_id UUID REFERENCES artifacts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  heading TEXT,
  chunk_index INTEGER NOT NULL,
  token_count INTEGER,
  chunk_type TEXT CHECK (chunk_type IN ('narrative', 'code', 'metrics', 'list')),
  technologies TEXT[] DEFAULT '{}',
  companies TEXT[] DEFAULT '{}',
  papers TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  embedding VECTOR(1024),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- INDEXES
-- ================================================================
-- Fast slug lookup for artifacts
CREATE INDEX idx_artifacts_slug ON artifacts(slug);

-- Category filtering for artifacts
CREATE INDEX idx_artifacts_category ON artifacts(category);

-- Status filtering for published artifacts
CREATE INDEX idx_artifacts_status ON artifacts(status);

-- Tags filtering using GIN index for array operations
CREATE INDEX idx_artifacts_tags ON artifacts USING GIN(tags);

-- Artifact lookup for chunks
CREATE INDEX idx_artifact_chunks_artifact_id ON artifact_chunks(artifact_id);

-- IVFFlat index for vector similarity search
-- Lists = 100 is good for datasets up to ~10K chunks
-- Adjust if dataset grows significantly larger
CREATE INDEX idx_artifact_chunks_embedding ON artifact_chunks
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ================================================================
-- RPC FUNCTION: match_artifact_chunks
-- ================================================================
-- Semantic search function for finding relevant artifact chunks
-- Uses cosine similarity with configurable threshold and filtering
CREATE OR REPLACE FUNCTION match_artifact_chunks(
  query_embedding VECTOR(1024),
  match_threshold FLOAT DEFAULT 0.15,
  match_count INT DEFAULT 20,
  category_filter TEXT DEFAULT NULL,
  tags_filter TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  artifact_id UUID,
  artifact_title TEXT,
  artifact_slug TEXT,
  content TEXT,
  heading TEXT,
  chunk_type TEXT,
  technologies TEXT[],
  skills TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ac.id,
    ac.artifact_id,
    a.title AS artifact_title,
    a.slug AS artifact_slug,
    ac.content,
    ac.heading,
    ac.chunk_type,
    ac.technologies,
    ac.skills,
    1 - (ac.embedding <=> query_embedding) AS similarity
  FROM artifact_chunks ac
  INNER JOIN artifacts a ON ac.artifact_id = a.id
  WHERE
    a.status = 'published'
    AND (1 - (ac.embedding <=> query_embedding)) > match_threshold
    AND (category_filter IS NULL OR a.category = category_filter)
    AND (tags_filter IS NULL OR a.tags && tags_filter)
  ORDER BY ac.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ================================================================
-- TRIGGERS
-- ================================================================
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_artifacts_updated_at
  BEFORE UPDATE ON artifacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================================
-- COMMENTS
-- ================================================================
COMMENT ON TABLE artifacts IS 'Main artifacts table storing portfolio content with metadata';
COMMENT ON TABLE artifact_chunks IS 'Chunked artifact content for semantic search with vector embeddings';
COMMENT ON COLUMN artifacts.category IS 'Content category: project, skill, experience, faq, deep-dive';
COMMENT ON COLUMN artifacts.status IS 'Publication status: draft, published, archived';
COMMENT ON COLUMN artifacts.external_links IS 'JSON object with external references (github, demo, docs, etc.)';
COMMENT ON COLUMN artifacts.metrics IS 'JSON object with quantitative metrics (stars, users, performance, etc.)';
COMMENT ON COLUMN artifact_chunks.embedding IS 'Vector embedding (1024-dim) for semantic search';
COMMENT ON COLUMN artifact_chunks.chunk_type IS 'Type of content: narrative, code, metrics, list';
COMMENT ON FUNCTION match_artifact_chunks IS 'Semantic search using cosine similarity with category and tag filtering';
