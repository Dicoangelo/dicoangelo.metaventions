# Key Source Files - Architecture & Services

Generated: Thu 29 Jan 2026 10:32:51 EST

## OS-App Services

## ResearchGravity Core
### mcp_server.py
```python
#!/usr/bin/env python3
"""
ResearchGravity MCP Server

Exposes ResearchGravity context and research tools via Model Context Protocol (MCP).
This allows Claude Desktop and other MCP clients to access ResearchGravity data.

Tools Provided:
- get_session_context: Get active session information
- search_learnings: Search archived learnings
- get_project_research: Load project-specific research
- log_finding: Record a finding to active session
- select_context_packs: Select relevant context packs (V2)
- get_research_index: Get unified research index

Resources Provided:
- session://active - Active session data
- session://{id} - Specific session data
- learnings://all - All learnings
- project://{name}/research - Project research files
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional
from datetime import datetime

# MCP SDK imports
try:
    from mcp.server import Server
    from mcp.server.stdio import stdio_server
    from mcp.types import (
        Tool,
        TextContent,
        ImageContent,
        EmbeddedResource,
        LoggingLevel
    )
except ImportError:
    print("ERROR: MCP SDK not installed. Install with: pip install mcp", file=sys.stderr)
    sys.exit(1)

# ResearchGravity paths
AGENT_CORE = Path.home() / ".agent-core"
SESSION_TRACKER = AGENT_CORE / "session_tracker.json"
PROJECTS_FILE = AGENT_CORE / "projects.json"
LEARNINGS_FILE = AGENT_CORE / "memory" / "learnings.md"
RESEARCH_DIR = AGENT_CORE / "research"
SESSIONS_DIR = AGENT_CORE / "sessions"
CONTEXT_PACKS_DIR = AGENT_CORE / "context-packs"

# Initialize MCP server
app = Server("researchgravity")


def load_json(path: Path) -> Dict:
    """Load JSON file safely"""
    try:
        if not path.exists():
            return {}
        with open(path, 'r') as f:
            return json.load(f)
    except Exception as e:
        app.server.request_context.session.send_log_message(
            level=LoggingLevel.ERROR,
            data=f"Error loading {path}: {e}"
        )
        return {}


def load_text(path: Path) -> str:
    """Load text file safely"""
    try:
        if not path.exists():
            return ""
        with open(path, 'r') as f:
            return f.read()
    except Exception as e:
        app.server.request_context.session.send_log_message(
            level=LoggingLevel.ERROR,
            data=f"Error loading {path}: {e}"
        )
        return ""


def get_active_session() -> Optional[Dict]:
    """Get active session data"""
    tracker = load_json(SESSION_TRACKER)
    if not tracker or 'active_session' not in tracker:
        return None

    session_id = tracker['active_session']
    if not session_id or session_id not in tracker.get('sessions', {}):
        return None

    return tracker['sessions'][session_id]


def get_session_by_id(session_id: str) -> Optional[Dict]:
```

### status.py
```python
#!/usr/bin/env python3
"""
Show ResearchGravity session status.
Used for cold start protocol — check state before proceeding.

Usage:
  python3 status.py
"""

import json
import sys
from datetime import datetime
from pathlib import Path

# Add parent for UCW imports
sys.path.insert(0, str(Path(__file__).parent))


def get_agent_core_dir() -> Path:
    return Path.home() / ".agent-core"


def get_local_agent_dir() -> Path:
    return Path.cwd() / ".agent"


def get_active_session():
    """Check for active session in current project."""
    session_file = get_local_agent_dir() / "research" / "session.json"
    if session_file.exists():
        return json.loads(session_file.read_text())
    return None


def get_archived_sessions(limit: int = 5):
    """Get recent archived sessions."""
    sessions_dir = get_agent_core_dir() / "sessions"
    if not sessions_dir.exists():
        return []

    sessions = []
    for session_dir in sorted(sessions_dir.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True):
        if session_dir.is_dir():
            metadata_file = session_dir / "session.json"
            if metadata_file.exists():
                try:
                    data = json.loads(metadata_file.read_text())
                    sessions.append({
                        "id": session_dir.name,
                        "topic": data.get("topic", "Unknown"),
                        "started": data.get("started", "Unknown"),
                        "status": data.get("status", "unknown"),
                        "workflow": data.get("workflow", "research")
                    })
                except:
                    pass
        if len(sessions) >= limit:
            break

    return sessions


def format_time(iso_time: str) -> str:
    """Format ISO time to human readable."""
    try:
        dt = datetime.fromisoformat(iso_time)
        return dt.strftime("%Y-%m-%d %H:%M")
    except:
        return iso_time


def get_wallet_value():
    """Get cognitive wallet value and stats."""
    try:
        from ucw.export import build_wallet_from_agent_core
        wallet = build_wallet_from_agent_core()
        stats = wallet.get_stats()
        return {
            "value": stats["value"],
            "sessions": stats["sessions"],
            "concepts": stats["concepts"],
            "papers": stats["papers"],
            "urls": stats["urls"],
            "domains": stats.get("domains", {}),
        }
    except Exception:
        return None


def main():
    print()
    print("=" * 50)
    print("  ResearchGravity — Metaventions AI")
    print("=" * 50)
    print()

    # Show wallet value
    wallet = get_wallet_value()
    if wallet:
        print(f"💰 COGNITIVE WALLET VALUE: ${wallet['value']:,.2f}")
```

## META-VENGINE Systems
### kernel/cognitive-os.py
```
#!/usr/bin/env python3
"""
Personal Cognitive Operating System
====================================
Transforms telemetry into intelligence. Knows your cognitive rhythms,
predicts session outcomes, protects flow states, and routes to optimal models.

Foundation: SuperMemory (34,134 events, 424 sessions, 26,888 tool calls)

Usage:
    python3 cognitive-os.py start         # Pre-session briefing with predictions
    python3 cognitive-os.py monitor       # Mid-session flow check
    python3 cognitive-os.py end           # Post-session learning

    python3 cognitive-os.py state         # Current cognitive mode
    python3 cognitive-os.py fate          # Session outcome prediction
    python3 cognitive-os.py flow          # Flow state status
    python3 cognitive-os.py route         # Model recommendation
    python3 cognitive-os.py weekly        # Weekly energy map

    python3 cognitive-os.py train         # Retrain predictors
    python3 cognitive-os.py analyze       # Pattern analysis
    python3 cognitive-os.py status        # Full system status

Architecture:
    +------------------------------------------------------------------+
    |                    COGNITIVE OS                                  |
    +------------------------------------------------------------------+
    |  CognitiveState  |  SessionFate   |  FlowState    |  Personal   |
    |    Detector      |   Predictor    |   Protector   |   Router    |
    +------------------------------------------------------------------+
    |              WeeklyEnergyMapper  |  SuperMemory (foundation)     |
    +------------------------------------------------------------------+
"""

import json
import os
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import statistics

# ============================================================================
# CONFIGURATION
# ============================================================================

HOME = Path.home()
CLAUDE_DIR = HOME / ".claude"
DATA_DIR = CLAUDE_DIR / "data"
KERNEL_DIR = CLAUDE_DIR / "kernel"
MEMORY_DIR = CLAUDE_DIR / "memory"

# Data sources (aligned with supermemory.py)
SOURCES = {
    "session_outcomes": DATA_DIR / "session-outcomes.jsonl",
    "session_events": DATA_DIR / "session-events.jsonl",
    "session_windows": DATA_DIR / "session-windows.jsonl",
    "tool_usage": DATA_DIR / "tool-usage.jsonl",
    "routing_metrics": DATA_DIR / "routing-metrics.jsonl",
    "dq_scores": KERNEL_DIR / "dq-scores.jsonl",
    "session_state": KERNEL_DIR / "session-state.json",
    "activity_events": DATA_DIR / "activity-events.jsonl",
}

# Cognitive OS outputs
COS_DIR = KERNEL_DIR / "cognitive-os"
COS_STATE_FILE = COS_DIR / "current-state.json"
COS_PREDICTIONS_FILE = COS_DIR / "fate-predictions.jsonl"
COS_FLOW_LOG = COS_DIR / "flow-states.jsonl"
COS_FLOW_STATE_FILE = COS_DIR / "flow-state.json"  # Quick-access flow state
COS_ROUTING_LOG = COS_DIR / "routing-decisions.jsonl"
COS_LEARNING_FILE = COS_DIR / "learned-weights.json"
COS_DQ_WEIGHTS_FILE = COS_DIR / "cognitive-dq-weights.json"  # DQ weight adjustments


# ============================================================================
# DATA LOADING UTILITIES (from supermemory.py patterns)
# ============================================================================

def load_jsonl(path: Path, limit: int = None, since_days: int = None) -> List[Dict]:
    """Load JSONL file with optional filtering."""
    results = []
    cutoff = None
    if since_days:
        cutoff = datetime.now() - timedelta(days=since_days)

    try:
        if path.exists():
            with open(path) as f:
                for line in f:
                    if line.strip():
                        try:
                            entry = json.loads(line)
                            if cutoff:
                                ts = entry.get("ts") or entry.get("timestamp") or entry.get("started_at") or entry.get("date")
                                if ts:
                                    if isinstance(ts, (int, float)):
                                        ts = ts / 1000 if ts > 1e12 else ts
```

### kernel/supermemory.py
```
#!/usr/bin/env python3
"""
SuperMemory Intelligence Engine
================================
Transforms disconnected telemetry into compounding cross-session intelligence.

This is the missing layer that connects:
- 132K+ activity events
- 351+ sessions
- 41+ days of memory
- Orphaned paste/file/shell/debug data

Usage:
    python3 supermemory.py briefing          # Pre-session intelligence
    python3 supermemory.py synthesize        # Post-session learning
    python3 supermemory.py weekly            # Weekly knowledge synthesis
    python3 supermemory.py link-context      # Connect orphaned data
    python3 supermemory.py predict <task>    # Predict optimal config
    python3 supermemory.py status            # System status

Architecture:
    ┌─────────────────────────────────────────────────────────────┐
    │                    SUPERMEMORY LAYER                        │
    ├─────────────────────────────────────────────────────────────┤
    │  Session Intelligence → Pattern Correlation → Knowledge     │
    │  Context Linking → Cross-Project Learning → Prediction      │
    └─────────────────────────────────────────────────────────────┘
"""

import json
import os
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import hashlib
import statistics

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

HOME = Path.home()
CLAUDE_DIR = HOME / ".claude"
DATA_DIR = CLAUDE_DIR / "data"
KERNEL_DIR = CLAUDE_DIR / "kernel"
MEMORY_DIR = CLAUDE_DIR / "memory"

# Data sources
SOURCES = {
    "activity_events": DATA_DIR / "activity-events.jsonl",
    "session_events": DATA_DIR / "session-events.jsonl",
    "session_outcomes": DATA_DIR / "session-outcomes.jsonl",
    "session_windows": DATA_DIR / "session-windows.jsonl",
    "tool_usage": DATA_DIR / "tool-usage.jsonl",
    "routing_metrics": DATA_DIR / "routing-metrics.jsonl",
    "cost_tracking": DATA_DIR / "cost-tracking.jsonl",
    "errors": DATA_DIR / "errors.jsonl",
    "command_usage": DATA_DIR / "command-usage.jsonl",
    "git_activity": DATA_DIR / "git-activity.jsonl",
    "dq_scores": KERNEL_DIR / "dq-scores.jsonl",
    "modifications": KERNEL_DIR / "modifications.jsonl",
    "knowledge": MEMORY_DIR / "knowledge.json",
    "memory_graph": KERNEL_DIR / "memory-graph.json",
    "identity": KERNEL_DIR / "identity.json",
    "detected_patterns": KERNEL_DIR / "detected-patterns.json",
    "session_state": KERNEL_DIR / "session-state.json",
}

# Orphaned data (to be linked)
ORPHANED = {
    "paste_cache": CLAUDE_DIR / "paste-cache",
    "file_history": CLAUDE_DIR / "file-history",
    "shell_snapshots": CLAUDE_DIR / "shell-snapshots",
    "debug": CLAUDE_DIR / "debug",
    "todos": CLAUDE_DIR / "todos",
}

# Output
SUPERMEMORY_DIR = KERNEL_DIR / "supermemory"
BRIEFING_FILE = SUPERMEMORY_DIR / "current-briefing.json"
SYNTHESIS_FILE = SUPERMEMORY_DIR / "session-synthesis.jsonl"
WEEKLY_FILE = SUPERMEMORY_DIR / "weekly-synthesis.jsonl"
CONTEXT_INDEX = SUPERMEMORY_DIR / "context-index.jsonl"
PREDICTIONS_FILE = SUPERMEMORY_DIR / "predictions.jsonl"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA LOADING UTILITIES
# ═══════════════════════════════════════════════════════════════════════════════

def load_jsonl(path: Path, limit: int = None, since_days: int = None) -> List[Dict]:
    """Load JSONL file with optional filtering."""
    results = []
    cutoff = None
    if since_days:
        cutoff = datetime.now() - timedelta(days=since_days)

    try:
```

### kernel/recovery-engine.py
```
#!/usr/bin/env python3
"""Auto-Recovery Engine - Routes errors to appropriate recovery actions."""

import sys
import json
import sqlite3
import hashlib
import subprocess
from pathlib import Path
from datetime import datetime

DATA_DIR = Path.home() / ".claude" / "data"
KERNEL_DIR = Path.home() / ".claude" / "kernel"
DB_PATH = Path.home() / ".claude" / "memory" / "supermemory.db"


def notify_recovery(action: str, category: str, success: bool):
    """Show terminal notification and optionally macOS notification for auto-recovery."""
    # Terminal notification with box
    status = "FIXED" if success else "ATTEMPTED"
    color = "\033[32m" if success else "\033[33m"  # Green or yellow
    reset = "\033[0m"

    print(f"""
{color}╔══════════════════════════════════════════════════════════════╗
║  🩹 AUTO-RECOVERY {status:8}                                  ║
╠══════════════════════════════════════════════════════════════╣
║  Category: {category:15} Action: {action:20} ║
╚══════════════════════════════════════════════════════════════╝{reset}
""")

    # macOS notification (non-blocking)
    if success:
        try:
            subprocess.run([
                "osascript", "-e",
                f'display notification "Auto-fixed: {action}" with title "🩹 Recovery Engine" subtitle "{category} error resolved"'
            ], capture_output=True, timeout=2)
        except:
            pass  # Silently fail if notification fails

# Actions safe for auto-execution (>90% historical success)
SAFE_ACTIONS = {
    "git": ["fix_username_case", "clear_git_locks"],
    "concurrency": ["clear_stale_locks", "kill_zombie_processes"],
    "permissions": ["chmod_safe_paths"],
    "quota": ["clear_cache"],
    "crash": ["clear_corrupt_state"],
    "recursion": ["kill_runaway_process"],
}

# Actions requiring human judgment
SUGGEST_ONLY = {
    "git": ["merge_conflict", "detached_head", "force_push"],
    "quota": ["model_switch"],
    "crash": ["restore_backup"],
    "syntax": ["all"],
}


class RecoveryEngine:
    def __init__(self):
        self.config = self.load_config()
        self.db = self.connect_db()

    def load_config(self):
        config_path = KERNEL_DIR / "recovery-config.json"
        if config_path.exists():
            try:
                return json.loads(config_path.read_text())
            except json.JSONDecodeError:
                pass
        return {"enabled": True, "async": True, "auto_fix_threshold": 0.90}

    def connect_db(self):
        try:
            return sqlite3.connect(DB_PATH)
        except Exception:
            return None

    def categorize(self, error_text: str) -> str:
        """Categorize error using pattern matching."""
        patterns = {
            "git": ["fatal:", "git", "repository", "branch", "merge", "remote", "push", "pull"],
            "concurrency": ["lock", "race", "parallel", "session", "another process"],
            "permissions": ["permission denied", "EACCES", "chmod", "access denied"],
            "quota": ["quota", "rate limit", "exceeded", "limit reached", "429"],
            "crash": ["SIGKILL", "segfault", "killed", "SIGSEGV", "core dumped"],
            "recursion": ["maximum call stack", "infinite", "overflow", "recursion"],
            "syntax": ["SyntaxError", "TypeError", "parse", "unexpected token"],
        }
        error_lower = error_text.lower()
        for category, keywords in patterns.items():
            if any(kw.lower() in error_lower for kw in keywords):
                return category
        return "unknown"

    def lookup_solution(self, category: str, error_text: str) -> str:
        """Lookup solution from error_patterns table."""
        if not self.db:
```

### kernel/dq-scorer.js
```
#!/usr/bin/env node
/**
 * Decision Quality (DQ) Scorer - ACE Framework Implementation
 *
 * Based on: OS-App Adaptive Convergence Engine (ACE) DQ Framework
 * Measures: validity (0.4) + specificity (0.3) + correctness (0.3)
 *
 * Scores routing decisions and learns from history.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { estimateComplexity } = require('./complexity-analyzer');
const { PRICING } = require(path.join(process.env.HOME, '.claude/config/pricing.js'));

// ═══════════════════════════════════════════════════════════════════════════
// BASELINES LOADING
// ═══════════════════════════════════════════════════════════════════════════

const BASELINES_PATH = path.join(process.env.HOME, '.claude/kernel/baselines.json');

function loadBaselines() {
  if (!fs.existsSync(BASELINES_PATH)) {
    return null;  // Use hardcoded defaults
  }

  try {
    const data = fs.readFileSync(BASELINES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Error loading baselines:', e.message);
    return null;
  }
}

const BASELINES = loadBaselines();

// ═══════════════════════════════════════════════════════════════════════════
// DQ WEIGHTS (from ACE Framework + Cognitive OS adjustments)
// ═══════════════════════════════════════════════════════════════════════════

const COGNITIVE_DQ_WEIGHTS_PATH = path.join(process.env.HOME, '.claude/kernel/cognitive-os/cognitive-dq-weights.json');
const EXPERTISE_ROUTING_STATE_PATH = path.join(process.env.HOME, '.claude/kernel/expertise-routing-state.json');

function loadCognitiveDQWeights() {
  // Try to load cognitive-aware weights from Cognitive OS
  if (fs.existsSync(COGNITIVE_DQ_WEIGHTS_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(COGNITIVE_DQ_WEIGHTS_PATH, 'utf8'));
      const fileAge = Date.now() - new Date(data.timestamp).getTime();
      // Only use if less than 30 minutes old
      if (fileAge < 30 * 60 * 1000 && data.dq_weights) {
        return {
          weights: data.dq_weights,
          complexityModifier: data.complexity_threshold_modifier || 1.0,
          cognitiveMode: data.cognitive_mode,
          reasoning: data.reasoning
        };
      }
    } catch (e) {
      // Fall through to defaults
    }
  }
  return null;
}

const COGNITIVE_WEIGHTS = loadCognitiveDQWeights();

const DQ_WEIGHTS = COGNITIVE_WEIGHTS?.weights || BASELINES?.dq_weights || {
  validity: 0.4,      // Does the routing make logical sense?
  specificity: 0.3,   // How precise is the model selection?
  correctness: 0.3    // Historical accuracy of similar queries
};

// Complexity threshold modifier from Cognitive OS (affects model selection boundaries)
const COMPLEXITY_MODIFIER = COGNITIVE_WEIGHTS?.complexityModifier || 1.0;

// ═══════════════════════════════════════════════════════════════════════════
// EXPERTISE ROUTING
// ═══════════════════════════════════════════════════════════════════════════

function loadExpertiseState() {
  if (fs.existsSync(EXPERTISE_ROUTING_STATE_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(EXPERTISE_ROUTING_STATE_PATH, 'utf8'));
      const fileAge = Date.now() - new Date(data.timestamp).getTime();
      // Use if less than 1 hour old
      if (fileAge < 60 * 60 * 1000) {
        return data;
      }
    } catch (e) {}
  }
  return null;
}

const EXPERTISE_STATE = loadExpertiseState();

/**
 * Detect domain of query and check expertise level
```

## NPM Packages - Core Logic
### cpb-core/src/index.ts
```typescript
/**
 * Cognitive Precision Bridge (CPB)
 *
 * Unified orchestration layer for precision-aware AI processing.
 * Routes queries through optimal paths based on complexity analysis.
 *
 * @example
 * ```typescript
 * import { createCPB, type CPBProvider } from '@antigravity/cpb-core';
 *
 * // Define your provider
 * const myProvider: CPBProvider = {
 *     name: 'openai',
 *     isConfigured: () => true,
 *     generate: async (prompt) => {
 *         // Your LLM call here
 *         return response;
 *     }
 * };
 *
 * // Create CPB instance
 * const cpb = createCPB({
 *     fast: myProvider,
 *     balanced: myProvider,
 *     deep: myProvider
 * });
 *
 * // Execute with auto-routing
 * const result = await cpb.execute({
 *     query: 'Analyze the trade-offs of microservices vs monolith',
 *     context: systemDesignDoc
 * }, (status) => {
 *     console.log(`${status.phase}: ${status.progress}%`);
 * });
 *
 * console.log(result.output);
 * console.log(`Path: ${result.path}, DQ: ${result.dqScore.overall}%`);
 * ```
 */

// Types
export type {
    CPBPath,
    CPBPhase,
    CPBConfig,
    CPBRequest,
    CPBResult,
    CPBStatus,
    CPBProvider,
    GenerateOptions,
    PathSignals,
    RoutingDecision,
    DQScore,
    RLMStatus,
    RLMResult,
    ACEResult,
    ImageInput,
    MultimodalContent,
    ModelTier,
    CPBPattern,
    LearnedRouting,
    CPBStatusCallback
} from './types';

export { DEFAULT_CPB_CONFIG, STANDARD_CPB_CONFIG } from './types';

// Router
export {
    extractPathSignals,
    selectPath,
    canUseDirectPath,
    needsRLMPath,
    wouldBenefitFromConsensus
} from './router';

// Orchestrator
export {
    CognitivePrecisionBridge,
    createCPB,
    cpbExecute
} from './orchestrator';

// Default export
export { default } from './orchestrator';
```

### voice-nexus/src/index.ts
```typescript
/**
 * VOICE NEXUS
 *
 * Universal multi-provider voice architecture.
 * Seamlessly routes between STT, reasoning, and TTS providers.
 *
 * @example
 * ```typescript
 * import { createVoiceNexus, type ReasoningProvider } from '@antigravity/voice-nexus';
 *
 * // Define your reasoning provider
 * const myReasoning: ReasoningProvider = {
 *     name: 'openai',
 *     models: { fast: 'gpt-3.5-turbo', balanced: 'gpt-4', deep: 'gpt-4-turbo' },
 *     isAvailable: () => true,
 *     generate: async (prompt, config) => {
 *         // Your LLM call here
 *         return { text: response, model: config.model || 'gpt-4' };
 *     }
 * };
 *
 * // Create Voice Nexus instance
 * const nexus = createVoiceNexus({
 *     config: {
 *         mode: 'turn-based',
 *         knowledgeInjection: false,
 *         providers: {
 *             reasoning: myReasoning
 *         }
 *     },
 *     events: {
 *         onTranscriptUpdate: (t) => console.log(`[${t.role}] ${t.text}`),
 *         onComplexityAnalyzed: (c) => console.log(`Complexity: ${c.score.toFixed(2)}`)
 *     }
 * });
 *
 * // Process text input
 * const response = await nexus.processTextInput('How do I implement authentication?');
 * console.log(response?.text);
 * ```
 */

// Types
export type {
    // Core configuration
    VoiceNexusConfig,
    VoiceNexusState,
    VoiceNexusOptions,
    VoiceNexusEvents,
    VoiceMode,
    ReasoningTier,

    // Transcripts
    Transcript,
    PartialTranscript,

    // Provider interfaces
    STTProvider,
    TTSProvider,
    TTSSettings,
    VoiceConfig,
    ReasoningProvider,
    ReasoningConfig,
    ReasoningResult,

    // Complexity
    ComplexitySignals,
    ComplexityResult,
    ProviderSelection,

    // Knowledge
    SearchResult,
    Finding,
    KnowledgeContext,
    KnowledgeInjectorConfig,
    KnowledgeInjector,

    // Audio
    AudioConfig,
    FrequencyData,

    // Tools
    VoiceToolCall,
    VoiceToolResult,
    VoiceToolHandler
} from './types';

// Complexity Router
export {
    analyzeComplexity,
    extractComplexitySignals,
    calculateComplexityScore,
    getComplexityTier,
    selectProviders,
    hasExplicitOverride,
    formatComplexityResult,
    STANDARD_THRESHOLDS,
    ELITE_THRESHOLDS
} from './router';

// Orchestrator
export {
    VoiceNexusOrchestrator,
    createVoiceNexus,
    createMinimalVoiceNexus
} from './orchestrator';

// Default export
export { default } from './orchestrator';
```

