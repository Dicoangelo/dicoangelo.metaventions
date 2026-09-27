# DQ Scoring: Formula Adapted from arXiv:2511.15755 (Since Withdrawn)

> Corrected 2026-09-26. An earlier version of this artifact described a research collaboration, a co-authored paper, a "replication" of the paper and several benchmark numbers. Those claims were wrong and have been removed. What actually happened is below.

## What Actually Happened

- **Formula adapted, not replicated.** Dico adapted the V+S+C Decision Quality formula (validity + specificity + correctness) from arXiv:2511.15755 by Philip Drammeh (MyAntFarm.ai) and built it into the META-VENGINE router. He did not replicate the paper.
- **Paper withdrawn by its author.** On 2026-08-31 the author withdrew arXiv:2511.15755 (v2). His arXiv comment says a code audit found the multi-agent arm's action list was a source constant rather than model output, and that all Decision Quality results, including the zero-variance and actionability claims, are withdrawn.
- **Met the author, no co-authorship.** Dico met Philip Drammeh in March 2026 (2026-03-06) and they later discussed a separate business venture. Dico did not co-author the paper, and there is no co-authored paper.
- **The internal SUPERMAX comparison did not hold up.** An internal 100-query comparison of single-model scoring against 3-agent SUPERMAX consensus did not hold up on audit (the arms were scored with different weights). Its lift and variance figures have been withdrawn.
- **The DQ log is not a decision count.** Most of the DQ log (about 91%) is backfilled session records, not routing decisions, so earlier "decisions scored" and "average DQ" figures have been removed.

## What Is True

- The V+S+C DQ scorer exists in META-VENGINE and has routed real `claude -p` decisions. Validity is a real conditional function, not a constant.
- DQ formula as implemented: `DQ = validity (40%) + specificity (30%) + correctness (30%)`.
- **System One router test (2026-09-17, n=17):** against an Opus 5 reference on 17 live routing decisions, the keyword DQ scorer agreed 29% of the time, Haiku with typed questions agreed 88-94%, and the Jev model agreed 75-80% at about $0.02 per 1k calls and 0.18s latency. The sample is small.
- The finding that keyword DQ agreed only 29% with a strong reference is itself the useful result: it led to replacing keyword heuristics with typed model judgments.

## Extensions Built Around the Formula

| Extension | Description |
|-----------|-------------|
| Cognitive OS integration | DQ weights adjust by time-of-day, energy level, flow state |
| Expertise routing | High-expertise domains downgrade model (save cost), low-expertise upgrades |
| Cost-aware tie-breaking | When DQ scores are within 0.05, prefer the cheaper model |
| HSRGS | Experimental latent-space routing with DQ as an evaluation layer |
| Feedback loop | Explicit success/failure signals update correctness scoring |

## Transferable Skills Demonstrated

- **Research-to-production translation:** took a published scoring formula and built it into a working router
- **Auditing your own claims:** re-audited the benchmark and log data, found the comparison did not hold, and corrected the public record
- **Evaluation design:** moved from a keyword heuristic to a reference-model agreement test with typed judgments

## Key People

| Person | Role |
|--------|------|
| **Philip Drammeh** | Author of arXiv:2511.15755 (withdrawn 2026-08-31), MyAntFarm.ai. Met Dico in March 2026. Not a co-author with Dico. |
| **Dico Angelo** | Adapted the V+S+C formula into META-VENGINE |
