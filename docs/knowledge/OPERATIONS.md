# Reviewed portfolio knowledge

Public chat and the anonymous artifact API use `src/content/knowledge/public-knowledge.ts` through `src/lib/dossier.ts`. The publication allowlist has 19 reviewed records covering career history, current EZRA responsibilities, selected projects, education, FAQs and the accepted LP4FM workshop paper. Historical source material remains available for authenticated administration and review.

## Publication contract

A record is eligible only when it is public, reviewed, within its fixed review window, and exactly matches the current reviewed pack's content, title, summary, category, provenance and review dates. A SHA-256 content hash detects corruption. Updating a database timestamp, running an LLM classifier, or setting an old artifact to published cannot establish review. Dates must be deliberately reviewed; ingestion never refreshes them automatically.

The separate `portfolio_knowledge` SQL table has read-only public access guarded by row-level security. `portfolio_knowledge_review_log` retains each revision and is server-only. Historical artifact/dossier tables and retrieval RPCs are inaccessible to public roles. Anonymous APIs never return legacy source bodies. The service credential is server-side and is used for authenticated administration, validated public contact/JD server writes, and the maintenance CLI.

Retrieval fetches a bounded number of records (at least the full reviewed pack; currently a 100-record cap) with a 1.5-second timeout, then ranks eligible entries locally with deterministic topic aliases. No query embedding or opaque remote document is required. A service outage uses the same dated reviewed pack. A working database's quarantined/missing entries stay excluded; unavailable entries are not silently replaced. An expired pack yields no public context. Chat receives source links and review dates and must acknowledge unsupported questions.

## Maintenance workflow

Run commands from the repository with an existing authorized environment file. Never print credentials or place snapshots/receipts in Git. Set shell variables to your private paths:

```sh
KNOWLEDGE_ENV=/absolute/path/to/existing/.env.local
KNOWLEDGE_RUN=/absolute/path/outside/the/repository/knowledge-run
mkdir -m 700 "$KNOWLEDGE_RUN"
python3 scripts/portfolio-knowledge.py backup --env-file "$KNOWLEDGE_ENV" --output "$KNOWLEDGE_RUN/backup"
python3 scripts/portfolio-knowledge.py audit --env-file "$KNOWLEDGE_ENV" --output "$KNOWLEDGE_RUN/audit.json"
python3 scripts/portfolio-knowledge.py plan --env-file "$KNOWLEDGE_ENV" --output "$KNOWLEDGE_RUN/plan.json"
```

1. Review the evidence for each change to `public-knowledge.ts`; use public source links and repository provenance. Exclude private application profiles, employer-internal details, unverified metrics and unreconciled historical claims.
2. Review changed content, source references and review dates together. Run the retrieval/gating tests. A build must include the same pack as the database reconciliation.
3. Inspect the plan's counts and slugs. `apply` rechecks the pack hash and database state, then stops on concurrent edits. It upserts reviewed records, quarantines removed entries, and archives historical sources with reason/hash/backup metadata. It never deletes records or chunks.

```sh
python3 scripts/portfolio-knowledge.py apply --env-file "$KNOWLEDGE_ENV" --backup "$KNOWLEDGE_RUN/backup" --plan "$KNOWLEDGE_RUN/plan.json" --output "$KNOWLEDGE_RUN/apply-receipt.json"
python3 scripts/portfolio-knowledge.py plan --env-file "$KNOWLEDGE_ENV" --output "$KNOWLEDGE_RUN/after-plan.json"
python3 scripts/portfolio-knowledge.py audit --env-file "$KNOWLEDGE_ENV" --output "$KNOWLEDGE_RUN/after-audit.json"
python3 scripts/portfolio-knowledge.py verify --env-file "$KNOWLEDGE_ENV" --backup "$KNOWLEDGE_RUN/backup" --output "$KNOWLEDGE_RUN/verification.json"
```

A completed reconciliation has zero pending upserts/quarantines. A repeat run produces no revisions. Receipts contain protected before-state and per-action progress, so interrupted runs remain inspectable. Do not rerun an obsolete plan; inspect the receipt and create a fresh plan after resolving the interruption.

## Backups and rollback

The backup snapshots portfolio artifacts, chunks, legacy sections, logs, gap analytics, job analyses, contact submissions, and reviewed tables when present. It captures PostgREST schema and file SHA-256 checksums. Direct SQL policy/function definitions are separate: run `scripts/portfolio-schema-snapshot.sql` and `scripts/portfolio-private-boundary-snapshot.sql` through authorized SQL access and save the output beside the backup before schema changes. Files are mode0600 and backup directories mode0700. These snapshots contain private material.

```sh
python3 scripts/portfolio-knowledge.py rollback --env-file "$KNOWLEDGE_ENV" --receipt "$KNOWLEDGE_RUN/apply-receipt.json" --output "$KNOWLEDGE_RUN/rollback-receipt.json"
```

Rollback validates checksums, rejects changed reviewed records, restores previous artifact metadata and reviewed entries, and quarantines newly created records. It does not delete rows or reopen public access to historical tables/RPCs. Schema/grant rollback is deliberately manual: restoring the former broad grants would republish private material. Keep the current access boundary while correcting data or reverting application code. The initial October reconciliation receipt also includes the one-row quarantine canary, covering all 101 historical artifacts.

## Review backlog and monitoring

The audit JSON includes status, sensitivity labels, source hashes, review/conflict signals, source freshness, duplicate chunk groups, missing chunks and catalog coverage. Historical duplicates remain preserved as review evidence; they are excluded from retrieval. Old `updated_at` timestamps are not factual review dates. Legacy ingest, auto-summary and classification scripts fail immediately with directions to this workflow, preventing private-profile re-ingestion and accidental publication through the old route.

Before release, verify anonymous raw-table and legacy-RPC reads fail, anonymous reviewed reads contain only expected eligible records, archival content/chunk hashes match the snapshot, public APIs cannot request historical statuses/UUIDs, and privileged administration still works. Review the pack before `review_after` expires; no scheduler is configured by this change.
