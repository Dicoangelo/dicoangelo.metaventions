# Technical Dossier Integration

## Overview

Your dicoangelo.vercel.app portfolio site now includes a comprehensive technical dossier that powers the AI chat feature. Recruiters can ask questions via voice or text, and the AI will provide detailed, accurate answers based on your actual achievements.

## Files Created

### 1. `/public/TECHNICAL_DOSSIER.md` (29KB)
**Comprehensive technical dossier for recruiters**

Contains:
- Executive summary
- Deep-dive on each project (ACE, ARCHON, npm packages, META-VENGINE)
- Code statistics (297K+ LOC verified)
- arXiv papers implemented (8+ with locations)
- Professional experience with quantified metrics
- Target roles and company fit
- Evaluation guidelines for recruiters
- FAQ section

### 2. `/public/RECRUITER_QUICK_FACTS.md` (4KB)
**Quick reference for fast lookups**

Contains:
- One-sentence pitch
- Key metrics dashboard
- Research implementations
- Experience snapshot
- Portfolio links
- Unique value proposition

### 3. `/scripts/ingest-technical-dossier.ts`
**Ingestion script for Supabase pgvector**

Chunks the markdown files and uploads them with embeddings to Supabase for semantic search.

## How It Works

```
Recruiter asks question
         ↓
[Voice or Text Input]
         ↓
[/api/chat route]
         ↓
[getDossierContext() - Semantic Search]
         ↓
[Retrieves relevant chunks from Supabase]
         ↓
[Claude Sonnet 4 generates response]
         ↓
[Streams answer back to recruiter]
```

## Setup Instructions

### 1. Environment Variables

Make sure you have these set in `.env.local`:

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
COHERE_API_KEY=your_cohere_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### 2. Database Schema

Your Supabase should have a `dossier_chunks` table with pgvector:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE dossier_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  heading TEXT,
  category TEXT NOT NULL,
  file_path TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1024), -- Cohere embed-english-v3.0
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON dossier_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- RPC function for similarity search
CREATE OR REPLACE FUNCTION match_dossier_chunks(
  query_embedding VECTOR(1024),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  heading TEXT,
  category TEXT,
  file_path TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    id,
    content,
    heading,
    category,
    file_path,
    metadata,
    1 - (embedding <=> query_embedding) AS similarity
  FROM dossier_chunks
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### 3. Ingest the Dossier

Run the ingestion script to chunk and upload the dossier:

```bash
cd ~/dicoangelo.com
npx tsx scripts/ingest-technical-dossier.ts
```

Expected output:
```
🚀 Starting Technical Dossier ingestion...

📄 Chunking TECHNICAL_DOSSIER.md...
   → 47 chunks created

📄 Chunking RECRUITER_QUICK_FACTS.md...
   → 12 chunks created

Generating embeddings for 59 chunks...
✅ Generated 59 embeddings

Uploading 59 chunks to Supabase...
✅ Successfully uploaded 59 chunks

✨ Technical Dossier ingestion complete!

📊 Summary:
   Technical Dossier chunks: 47
   Quick Facts chunks: 12
   Total chunks uploaded: 59
```

### 4. Deploy

```bash
git add .
git commit -m "Add comprehensive technical dossier for recruiter AI chat"
git push
```

Vercel will automatically redeploy.

## Testing

1. Go to https://dicoangelo.vercel.app
2. Scroll to "Ask Me Anything" section
3. Try these questions:

**Technical Questions:**
- "What is the Adaptive Consensus Engine?"
- "Show me the code statistics for OS-App"
- "What arXiv papers has Dico implemented?"
- "Tell me about the ARCHON meta-orchestrator"

**Business Questions:**
- "What were the results at Contentsquare?"
- "How much in deals has Dico managed?"
- "What cost savings did he deliver?"

**Fit Questions:**
- "What roles is Dico targeting?"
- "Is he open to relocation?"
- "What makes him unique?"
- "Why should we hire him over a Stanford grad?"

## Example Conversations

### Technical Deep-Dive
```
Recruiter: "Tell me about ACE"

AI: "ACE (Adaptive Consensus Engine) is a production multi-agent
voting system with 1,462 LOC (839 core + 623 tests). It implements
arXiv:2511.15755 (MyAntFarm.ai's DQ Scoring framework) achieving
100% actionability vs 1.7% for single-agent systems.

Key features:
• Multi-agent voting with gap-based convergence
• Agent auction system (DALA framework - arXiv:2511.13193)
• Complexity-adaptive thresholds
• DQ scoring (Validity 40% + Specificity 30% + Correctness 30%)

Performance: 50% reduction in consensus rounds with 95% test coverage.

Code: OS-App/services/adaptiveConsensus.ts
Live demo: https://os-app-woad.vercel.app"
```

### Business Impact
```
Recruiter: "What's his GTM experience?"

AI: "At Contentsquare (May 2023 - Nov 2025), Dico managed $800M+
in cloud alliance deals with verified results:

• 40% cloud attachment rate (Microsoft Azure & AWS)
• 10% of company revenue via cloud channel
• 50% reduction in deal registration time through CRM automation
• 2x Microsoft Partner of the Year awards

He built OneCRM integration (Salesforce + AWS + PartnerStack) to
automate partner operations. This demonstrates he can both execute
GTM at scale AND build the systems to optimize it."
```

## What Makes This Powerful

### 1. **Verifiable Evidence**
Every claim includes:
- Specific LOC counts
- File paths (e.g., `adaptiveConsensus.ts`)
- arXiv paper IDs
- Live demo URLs
- npm package links

### 2. **Semantic Search**
Recruiters can ask naturally:
- "Is he good with multi-agent systems?" → Returns ACE details
- "Can he handle enterprise scale?" → Returns Contentsquare metrics
- "Show me the code" → Returns GitHub links

### 3. **Always Current**
The dossier is version-controlled. Update it and re-run ingestion:
```bash
# Edit the dossier
vim public/TECHNICAL_DOSSIER.md

# Re-ingest
npx tsx scripts/ingest-technical-dossier.ts

# Deploy
git push
```

## Updating the Dossier

When you have new achievements:

1. Update `public/TECHNICAL_DOSSIER.md`
2. Update `public/RECRUITER_QUICK_FACTS.md`
3. Re-run ingestion: `npx tsx scripts/ingest-technical-dossier.ts`
4. Commit and push

The AI will immediately have access to the new information.

## Metrics to Track

### Chat Analytics
- Number of recruiter conversations
- Most asked questions
- Average conversation length
- Questions that couldn't be answered (gaps in dossier)

### Conversion
- How many recruiters use voice vs text
- Time spent in chat
- Questions asked before reaching out via email
- Topics of highest interest

## Maintenance

### Monthly
- Review unanswered questions
- Update metrics (LOC, projects, papers)
- Add new achievements

### Quarterly
- Review chat analytics
- Optimize chunk size/strategy
- Update target roles based on market

### After Major Milestones
- New project launch → Update technical projects section
- New job → Update experience section
- New paper implementation → Update research section
- npm package update → Update package versions

## Troubleshooting

### "AI doesn't know about X"
- Check if it's in the dossier files
- Re-run ingestion script
- Verify Supabase has the chunks

### "Embeddings failing"
- Check COHERE_API_KEY in environment
- Verify Cohere quota/limits
- Check console logs for errors

### "Search returns no results"
- Lower the similarity threshold in `getDossierContext()`
- Check if query is too specific/generic
- Verify embeddings were generated correctly

## Future Enhancements

### Short-term
- [ ] Add chat analytics dashboard
- [ ] Track most asked questions
- [ ] A/B test different system prompts

### Medium-term
- [ ] Add voice response (TTS)
- [ ] Multi-lingual support
- [ ] Export conversation as PDF

### Long-term
- [ ] Live code demos in chat
- [ ] Integration with calendar for scheduling
- [ ] Recruiter CRM integration

---

## Support

Questions about the dossier integration?
- Email: dico.angelo97@gmail.com
- GitHub: @Dicoangelo

---

**Last Updated:** January 29, 2026
