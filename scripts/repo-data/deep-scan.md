# Deep Repository Scan - Technical Details

Generated: Thu 29 Jan 2026 10:32:13 EST

---
## OS-App

### package.json (Tech Stack)
```json
{
  "name": "metaventions-ai-v1",
  "version": "0.0.0",
  "description": null,
  "dependencies": {
    "@antigravity/agent-core-sdk": "file:./libs/agent-core-sdk",
    "@deepgram/sdk": "^3.9.0",
    "@google/genai": "^1.31.0",
    "@ricky0123/vad-web": "^0.0.22",
    "@metaventionsai/cpb-core": "file:./libs/cpb-core",
    "@metaventionsai/voice-nexus": "file:./libs/voice-nexus",
    "@react-three/fiber": "^9.0.0-rc.0",
    "@supabase/supabase-js": "^2.91.1",
    "@xyflow/react": "^12.10.0",
    "clsx": "^2.1.1",
    "d3": "^7.9.0",
    "face-api.js": "^0.20.0",
    "framer-motion": "^11.18.2",
    "html-to-image": "^1.11.11",
    "idb": "^8.0.0",
    "jszip": "^3.10.1",
    "lucide-react": "^0.475.0",
    "mermaid": "^10.9.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "recharts": "^2.15.0",
    "serve": "^14.2.3",
    "tailwind-merge": "^2.5.2",
    "three": "^0.170.0",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.1",
    "@types/d3": "^7.4.3",
    "@types/node": "^22.14.0",
    "@types/three": "^0.170.0",
    "@vitejs/plugin-react": "^4.3.4",
    "@vitest/coverage-v8": "^4.0.18",
    "happy-dom": "^20.3.1",
    "tsx": "^4.21.0",
    "typescript": "^5.7.3",
    "vite": "^6.1.1",
    "vitest": "^4.0.17"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "sync:lattice": "tsx scripts/sync_code_graph.ts",
    "scan:codebase": "node scripts/scan-codebase-voice.cjs ./ --output ./public/codebase_graph.json",
    "build:libs": "cd libs/cpb-core && npm install && npm run build && cd ../voice-nexus && npm install && npm run build",
    "prebuild": "npm run build:libs && npm run scan:codebase",
    "start": "serve -s dist -l 8080",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Documentation Files
ACE_AB_TEST_REPORT.md
ACE_IMPLEMENTATION_MANUAL.md
ACE_TECHNICAL_WHITEPAPER.md
HRPO_IMPLEMENTATION.md
PAPER_DRAFT.md
RLM_TECHNICAL_OVERVIEW.md
SYSTEM_MIND.md

### Repository Structure
```
dir .agent
file .env
file .env.example
file .eslintrc.cjs
dir .github
file .gitignore
file App.tsx
file CLAUDE.md
file CODEBASE_REVIEW.md
file CONTRIBUTING.md
file LICENSE
file README.md
file RESEARCHGRAVITY_UPDATE.md
file UNIFIED_REGISTRY_REPORT.md
file VOICE_system_repair_report.md
dir Visualizations
file [full_path_of_file_1]
file [full_path_of_file_2]
dir components
dir config
dir data
dir docs
file global.d.ts
dir hooks
file index.css
file index.html
file index.tsx
dir libs
file metadata.json
file package-lock.json
file package.json
dir public
dir scripts
dir services
file store.ts
dir store
dir stores
dir styles
dir supabase
dir test-results
file tsconfig.json
file types.ts
dir types
dir utils
file vercel.json
file vite.config.ts
file vitest.config.ts
```

---
## meta-vengine

### CHANGELOG
# Changelog

All notable changes to META-VENGINE will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-21

### 🩹 Self-Healing Infrastructure

The system now heals itself. Auto-Recovery Engine bridges error detection and automatic remediation.

### Added

#### Auto-Recovery Engine
- **recovery-engine.py** — Core orchestration that categorizes errors and routes to appropriate actions
- **recovery_actions.py** — 8 recovery action implementations:
  - `fix_username_case` — Git username case sensitivity (Dicoangelo vs dicoangelo)
  - `clear_git_locks` — Remove stale .git/index.lock files
  - `clear_stale_locks` — Remove stale session locks (>1 hour old)
  - `kill_zombie_processes` — Clean up zombie claude processes
  - `chmod_safe_paths` — Fix permissions on ~/.claude, ~/.agent-core, ~/.antigravity
  - `clear_cache` — Remove old cache files (>24 hours)
  - `clear_corrupt_state` — Remove corrupted JSON state files
  - `kill_runaway_process` — Terminate runaway high-CPU processes
- **recovery-config.json** — Safe paths, thresholds, category overrides
- **recovery_outcomes table** — SQLite table in supermemory.db for analytics
- **recovery-outcomes.jsonl** — Append-only log of all recovery attempts

#### Cognitive OS
- **cognitive-os.py** — Personal Cognitive Operating System
- Flow state detection and protection hooks
- Energy pattern tracking and optimization
- Focus session management
- Command Center Cognitive tab integration

#### Error Mitigations
- **error-tracker.js** — Proactive error pattern detection
- Automated error mitigation suggestions
- Solution lookup from error_patterns table

### Changed
- **error-capture.sh** — Now triggers recovery engine for high-severity errors
- Hook integration runs recovery in background (non-blocking)
- Category detection for targeted recovery routing

### Performance Metrics
- **Error Coverage:** 94% (655 of 700 historical errors addressable)
- **Auto-Fix Rate:** 70% (errors resolved without human intervention)
- **Success Rate:** 90% (actions that achieve intended outcome)
- **Max Recovery Time:** <5 seconds

### Recovery Matrix

| Category | Errors | Auto-Fix | Suggest-Only |
|----------|--------|----------|--------------|
| Git | 560 | username, locks | merge conflicts, force push |
| Concurrency | 55 | stale locks, zombies | parallel sessions |
| Permissions | 40 | safe paths | system paths |
| Quota | 25 | cache | model switch |
| Crash | 15 | corrupt state | restore backup |
| Recursion | 3 | kill runaway | — |
| Syntax | 2 | — | always suggest |

### Documentation
- **RECOVERY_ENGINE_ARCHITECTURE.md** — Comprehensive 30-year-xp-level architecture docs
- State machines, decision trees, data flow diagrams
- Security model and extensibility guide
- Updated README.md component registry
- Updated system architecture docs

### Commits
- `b4b5407` - Add Auto-Recovery Engine for automatic error remediation
- `6fdba3d` - Add Cognitive OS dashboard tab with data backfill
- `2bfff97` - Add automated error mitigations for proactive error prevention

---

## [1.1.1] - 2026-01-19

### 🎉 Major Achievement
- **100% Real Data in Command Center** - Eliminated all simulated/placeholder data

### Added
- Session Outcomes tab (Tab 10) with quality tracking and outcome distribution
- Productivity tab (Tab 11) with read/write ratios and LOC velocity
- Tool Analytics tab (Tab 12) with success rates and git activity
- Keyboard shortcuts for Observatory tabs (0/O, P, T)
- Git activity backfilling from repository history (216 commits)
- Productivity velocity tracking (LOC/day calculations)
- Dynamic trend calculations from historical data
- Real DQ score calculation from routing history (last 30 days)

### Fixed
- **Observatory tracking bug** - Fixed regex syntax error in `tool-tracker.sh:51,55,57` that broke automatic data collection
- Command Center trend percentages now calculated dynamically (was: hardcoded +12%, +8%, +15%)
- DQ score now calculated from routing history (was: hardcoded 0.839, now: 0.889 from 158 decisions)
- Created missing Observatory data files (session-outcomes, command-usage, tool-success, git-activity)
- Restored automatic tracking via bash preexec/precmd hooks

### Documentation Files
COMMAND_CENTER_ARCHITECTURE.md
GIT_PROTECTION.md
HOOK_STATUS.md
HSRGS_BUILD_LOG.md
RECOVERY_ENGINE_ARCHITECTURE.md
SOP-dashboard-data-integration.md
SQLITE_MIGRATION_PLAN.md
SYSTEM_ARCHITECTURE_DATA_FLOW.md
architecture
coevolution

### Repository Structure
```
file .DS_Store
dir .agent
file .gitignore
file .session.lock
file .watchdog-heartbeat
file ARCHITECTURE_PRINCIPLES.md
file AUTONOMOUS_CAPABILITIES.md
file CAPABILITY_QUICK_REFERENCE.md
file CHANGELOG.md
file CLAUDE.md
file DASHBOARD_README.md
file ERRORS.md
file OBSERVATORY_README.md
file README.md
file RESEARCHGRAVITY_UPDATE.md
file ROUTING_ARCHITECTURE_DIAGRAM.txt
file ROUTING_DOCS_INDEX.md
file ROUTING_QUICK_REFERENCE.md
file ROUTING_SYSTEM_README.md
file SECURITY.md
file SKILL-GUIDE.md
dir briefs
file claude-md-history
dir commands
dir config
dir coordinator
dir daemon
dir dashboard
dir data
dir docs
dir hooks
file init.sh
dir kernel
dir logs
dir memory
dir plugins
dir scripts
dir session-summaries
file settings.json
dir skills
file statusline-command.sh
file statusline-command.sh.bak
dir supermemory
dir tasks
dir tmp
dir versions
```

---
## ResearchGravity

### Repository Structure
```
dir .github
file .gitignore
file API_REFERENCE.md
file ARCHITECTURE_AUDIT.md
file CLAUDE.md
file CLAUDE.md.template
file CONTEXT_PACKS_ADVANCED.md
file CONTEXT_PACKS_COMPLETE.md
file CONTEXT_PACKS_IMPLEMENTATION_SUMMARY.md
file CONTEXT_PACKS_PROPOSAL.md
file CONTEXT_PACKS_V2_BUILD_COMPLETE.md
file CONTEXT_PACKS_V2_COMPLETE.md
file CONTEXT_PACKS_V2_DESIGN.md
file CONTEXT_PACKS_V2_PROTOTYPE_RESULTS.md
file CONTEXT_PACKS_V2_RESEARCH.md
file CONTRIBUTING.md
file DEPLOYMENT_COMPLETE.md
file ECOSYSTEM_INTEGRATION.md
file LICENSE
file MCP_INTEGRATION.md
file META_LEARNING_ARCHITECTURE.md
file META_LEARNING_ENGINE_COMPLETE.md
file META_LEARNING_IMPLEMENTATION.md
file META_LEARNING_IMPLEMENTATION_COMPLETE.md
file META_LEARNING_QUICK_START.md
file PHASE_2_COMPLETE.md
file PHASE_3_COMPLETE.md
file PHASE_4_COMPLETE.md
file PHASE_5_COMPLETE.md
file PHASE_6_COMPLETE.md
file PHASE_7_COMPLETE.md
file PHASE_7_INTEGRATION_READY.md
file PHASE_7_PLAN.md
file QUICK_START.md
file README.md
file README_CONTEXT_PACKS_V2.md
file README_META_LEARNING.md
file ROADMAP.md
file ROUTING_RESEARCH_WORKFLOW.md
file ROUTING_USAGE_BASED_UPDATE.md
file SESSION_COMPLETION_2026-01-26.md
file SKILL.md
file STORAGE_GUIDE.md
file SYSTEM_READY.md
file USER_GUIDE.md
file agent-core-v2.skill
dir api
file archive_session.py
file auto_capture.py
file backfill_learnings.py
file backfill_telemetry.py
file backfill_vectors.py
file build_packs.py
file check_backfill.sh
file checkpoint.py
file claude_desktop_config.json
file confidence_scorer.py
file context_packs_v2_layer4_rl.py
file context_packs_v2_layer5_focus.py
file context_packs_v2_prototype.py
dir cpb
dir critic
file demo_queries.sh
file deploy_v2.sh
file evidence_extractor.py
file evidence_validator.py
file explore_research.sh
dir graph
file init_session.py
file log_url.py
file mcp_server.py
dir methods
file pack_metrics.py
file predict_api_client.py
file predict_errors.py
file predict_session.py
file prefetch.py
file principle_injector.py
file project_context.py
file query_research.sh
file reinvigorate.py
file requirements.txt
file rg-semantic.sh
file routing-metrics.py
file routing-research-sync.py
file routing-test-suite.py
file ruff.toml
symlink select-packs
file select_packs.py
file select_packs_v2_integrated.py
file session_tracker.py
file setup.sh
file status.py
dir storage
file sync_environments.py
file sync_to_ccc.py
file test_mcp.py
file test_mcp_manual.py
file test_semantic_search.py
dir tests
dir ucw
symlink v2
file wallet.py
file youtube_channel.py
```

---
## agent-core

### CHANGELOG
# Changelog

## [2.0.1] - 2026-01-09

### Fixed
- Python 3.9 compatibility (`Optional[dict]` instead of `dict | None`)
- `scratchpad.json` now includes `urls_used` and `urls_skipped` keys
- `log_url.py` adds missing keys to existing scratchpads
- Setup.sh uses individual `mkdir` instead of brace expansion

### Added
- `--update` flag for setup.sh to update existing install
- `ensure_scratchpad_keys()` helper in log_url.py

## [2.0.0] - 2026-01-09

### Added
- `agent-log` command for URL tracking
- `agent-status` alias for quick status
- Cross-environment sync (CLI ↔ Antigravity ↔ Web)
- Auto-extract learnings on archive
- Session index tracking
- CLAUDE.md template
- Parallel sessions workflow

### Changed
- Separated global (`~/.agent-core/`) from local (`.agent/`)
- Improved status output with visual formatting

## [1.0.0] - 2026-01-09

### Added
- Initial release
- Innovation Scout workflow
- Deep Research workflow
- Memory system
- Session management

### Repository Structure
```
dir .github
file .gitignore
file CHANGELOG.md
file CONTRIBUTING.md
file LICENSE
file README.md
file SKILL.md
dir assets
dir references
dir scripts
file setup.sh
dir specs
dir workflows
```

---
## CareerCoachAntigravity

### package.json (Tech Stack)
```json
{
  "name": "career-board",
  "version": "0.1.0",
  "description": "A Human-AI Career Governance System - catch drift early by forcing receipts and decisions",
  "dependencies": {
    "@anthropic-ai/sdk": "^0.71.2",
    "@google/genai": "^1.35.0",
    "@google/generative-ai": "^0.24.1",
    "@react-three/drei": "^9.122.0",
    "@react-three/fiber": "^8.18.0",
    "@sentry/nextjs": "^10.36.0",
    "@types/three": "^0.182.0",
    "@xyflow/react": "^12.10.0",
    "ai": "^6.0.11",
    "autoprefixer": "^10.4.0",
    "clsx": "^2.1.0",
    "date-fns": "^3.6.0",
    "framer-motion": "^12.25.0",
    "lucide-react": "^0.441.0",
    "next": "^15.5.9",
    "next-themes": "^0.4.6",
    "openai": "^6.16.0",
    "postcss": "^8.4.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.5.0",
    "tailwindcss": "^3.4.0",
    "three": "^0.182.0",
    "unpdf": "^1.4.0",
    "zod": "^3.23.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/pdf-parse": "^1.1.5",
    "@types/react": "^18.3.27",
    "@types/react-dom": "^18.3.7",
    "@vitest/coverage-v8": "^4.0.18",
    "docx": "^9.5.1",
    "eslint": "^9.39.2",
    "eslint-config-next": "^15.5.9",
    "tsx": "^4.19.0",
    "typescript": "^5.5.0",
    "vitest": "^4.0.16"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "pulse": "tsx scripts/weekly-pulse.ts",
    "check-config": "tsx scripts/check-config.ts",
    "migrate": "tsx scripts/migrate-storage.ts",
    "migrate:dry": "tsx scripts/migrate-storage.ts --dry-run",
    "migrate:backup": "tsx scripts/migrate-storage.ts --backup"
  }
}
```

### CHANGELOG
# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-01-24

### Added
- **Production Infrastructure**
  - Supabase storage adapter with automatic fallback to file-based storage
  - Redis rate limiting via Upstash with in-memory fallback for development
  - Structured logging with Pino (JSON format, request correlation IDs)
  - API middleware with security headers, CORS, and rate limit integration
  - Sentry error tracking with client, server, and edge runtime support

- **Modular Architecture**
  - Extracted `lib/ai/tools.ts` (1,095 LOC) into `lib/ai/tools/` directory
  - Extracted `lib/career-intelligence/nexus-engine.ts` (941 LOC) into modular directory
  - Extracted `lib/career-intelligence/skill-graph.ts` (820 LOC) into focused modules
  - Extracted `JobsSection` (839 LOC) into `app/components/job-tracker/` components
  - Extracted `ResumeSection` (648 LOC) into `app/components/resume-builder/` components

- **Testing & Quality**
  - 382 passing tests with Vitest
  - E2E test suites for onboarding, resume upload, interview simulator, job pipeline, settings
  - Unit tests for all extracted modules
  - Zero `any` types - complete TypeScript type safety

- **Documentation**
  - Comprehensive API documentation at `docs/api.md`
  - Performance benchmarking script at `scripts/benchmark.ts`

### Changed
- Adjacency list in skill-graph now uses module-level memoization for O(1) lookups
- Resume builder service layer extracted from route handler
- Model gateway refactored for cleaner provider management

### Fixed
- Rate limiting now persists across serverless cold starts (Redis)
- Storage no longer loses data on deployment (Supabase)

## [2.0.0] - 2026-01-10
### Added
- **Career Intelligence Module:** Skill Graph & Positioning Playbook.
- **Multi-Agent Evaluation:** Hiring Manager, Tech Lead, HR personas.
- **Model Gateway:** Support for Grok, Gemini, OpenAI via BYOK.
- **Sovereign Identity:** Metaventions AI branding.

### Changed
- Refactored `resume-builder` to use `ModelGateway`.
- Cleaned up root directory (moved schemas to `lib`).
- Updated documentation with comprehensive architecture guide.

### Removed
- Legacy single-agent logic in favor of committee simulation.
- Hardcoded demo data (now fully dynamic/clean slate).

## [1.0.0] - 2026-01-05
### Added
- Initial release of Career Board.
- Basic Resume Builder (Chameleon V1).
- Portfolio Governance (Problems, Bets, Receipts).

### Documentation Files
V3_HIGH_FIDELITY_PLAN.md
V3_VISION.md
api.md
reference

### Repository Structure
```
dir .agent
file .env.example
file .eslintrc.json
dir .github
file .gitignore
file CHANGELOG.md
file CITATION.cff
file CLAUDE.md
file CONTRIBUTING.md
dir CareerResumeBuilder
file IMPLEMENTATION_PLAN.md
file LICENSE
file README.md
file RESEARCHGRAVITY_UPDATE.md
file SECURITY.md
dir app
dir data
dir docs
file instrumentation.ts
dir lib
file next-env.d.ts
file next.config.js
file package-lock.json
file package.json
file postcss.config.js
dir public
dir scripts
file sentry.client.config.ts
file sentry.edge.config.ts
file sentry.server.config.ts
file tailwind.config.js
dir tests
file tsconfig.json
file vitest.config.ts
```

---
## cpb-core

### package.json (Tech Stack)
```json
{
  "name": "@metaventionsai/cpb-core",
  "version": "1.0.0",
  "description": "Cognitive Precision Bridge - Unified AI orchestration with precision-aware routing through RLM, ACE, and DQ scoring",
  "dependencies": null,
  "devDependencies": {
    "@types/node": "^20.11.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0"
  },
  "scripts": {
    "build": "tsup src/index.ts src/router.ts src/types.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts src/router.ts src/types.ts --format cjs,esm --dts --watch",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build"
  }
}
```

### Repository Structure
```
file .eslintrc.cjs
file .gitignore
file CONTRIBUTING.md
file LICENSE
file README.md
dir dist
dir node_modules
file package-lock.json
file package.json
dir src
file tsconfig.json
```

---
## voice-nexus

### package.json (Tech Stack)
```json
{
  "name": "@metaventionsai/voice-nexus",
  "version": "1.0.0",
  "description": "Universal multi-provider voice architecture - seamless routing between STT, reasoning, and TTS providers",
  "dependencies": null,
  "devDependencies": {
    "@types/node": "^20.11.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0"
  },
  "scripts": {
    "build": "tsup src/index.ts src/types.ts src/router.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts src/types.ts src/router.ts --format cjs,esm --dts --watch",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build"
  }
}
```

### Repository Structure
```
file .eslintrc.cjs
file .gitignore
file CONTRIBUTING.md
file LICENSE
file README.md
file package-lock.json
file package.json
dir src
file tsconfig.json
```

---
## FlowDesk

### Documentation Files
CUSTOMIZATION.md
QUICK_START.md
TROUBLESHOOTING.md
USER_GUIDE.md

### Repository Structure
```
file .DS_Store
dir .github
file .gitignore
file CONTRIBUTING.md
file LICENSE
file README.md
dir assets
dir config
dir docs
dir scripts
```

---
## chrome-history-export

### CHANGELOG
# Changelog

All notable changes to Chrome History Export will be documented in this file.

## [2.0.0] - 2026-01-10

### Added
- **Cross-platform support**: Now works on macOS, Windows, and Linux
- **Multiple output formats**: Export to Markdown, JSON, and HTML
- **CLI arguments**: Full command-line interface with options
  - `--format`: Choose output formats (md, json, html)
  - `--days`: Export last N days
  - `--start`/`--end`: Specify date range
  - `--profile`: Select Chrome profile
  - `--list-profiles`: Show available profiles
  - `--config`: Use custom configuration file
- **Custom categories**: Configure your own URL categories via JSON/YAML
- **Weekly summary script**: Generate weekly browsing reports
- **HTML reports**: Beautiful, interactive HTML export
- **JSON export**: Machine-readable format for further processing
- **Install script**: Easy one-command installation
- **Claude Code skill**: `/history` command for quick exports
- **Type hints**: Full Python type annotations
- **Docstrings**: Comprehensive code documentation

### Changed
- Improved time spent calculation with configurable cap
- Better domain extraction and categorization
- More detailed navigation type analysis
- Enhanced Markdown formatting for NotebookLM

### Fixed
- Handle missing page titles gracefully
- Better error messages when Chrome is running
- Proper handling of special characters in URLs

## [1.0.0] - 2026-01-10

### Added
- Initial release
- Basic Chrome history export to Markdown
- Individual visit tracking (not aggregated)
- Navigation type detection
- Time spent estimation
- Smart URL categorization
- NotebookLM-optimized output format

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 2.0.0 | 2026-01-10 | Cross-platform, multi-format, CLI |
| 1.0.0 | 2026-01-10 | Initial release |

## Roadmap

Planned features for future releases:

- [ ] Browser extension for one-click export
- [ ] Scheduled automatic exports
- [ ] Google Drive auto-upload
- [ ] Safari and Firefox support
- [ ] Data visualization dashboard
- [ ] Export comparison (week over week)
- [ ] Privacy mode (exclude specific domains)

### Documentation Files
technical-notes.md

### Repository Structure
```
file .gitignore
file CHANGELOG.md
file CONTRIBUTING.md
file LICENSE
file README.md
file WORKFLOW.md
file config.example.json
dir docs
dir examples
file install.sh
dir scripts
dir skills
```

