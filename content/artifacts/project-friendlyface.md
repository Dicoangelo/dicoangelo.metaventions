# FriendlyFace: AI Compliance & Forensic Evidence System

## Overview

FriendlyFace is a forensic evidence generation system for AI compliance — specifically designed for EU AI Act conformity. It wraps existing facial recognition systems (NEC, AWS Rekognition, Cognitec) with a compliance proxy that generates cryptographically verifiable forensic evidence chains. The core invention is the ForensicSeal — a W3C Verifiable Credential that binds six independent verification dimensions into one publicly-verifiable artifact.

## Live URL

https://friendlyface.metaventionsai.com

## Core Architecture

### ForensicSeal — The Real Invention
Not face recognition, not federated learning — those are table stakes. The ForensicSeal is a compliance primitive: a W3C Verifiable Credential that cryptographically binds six independent verification dimensions into one publicly-verifiable artifact. A court can verify a seal without access to FriendlyFace. That's sovereignty.

### Compliance Proxy — "Stripe for AI Compliance"
A pip-installable SDK decorator that wraps existing inference calls. Existing FR deployments become EU AI Act compliant without ripping out their recognition stack. Not competing with Rekognition — wrapping it. Every police force, border agency, and enterprise using third-party FR needs this.

### Triple Verification Structure
- **Hash Chain:** Temporal ordering — did event B come after A?
- **Merkle Tree:** Membership verification — is this event in the set?
- **Provenance DAG:** Data lineage — which dataset trained this model that made this decision?

### Forensic Logging of Training (Novel)
Nobody else logs the training process as forensic evidence. Every federated learning paper treats training as a black box. FriendlyFace says: training itself is evidence. Poisoning detection events are hash-chained, courtroom-grade.

### Explainability-as-Evidence
LIME/SHAP/SDD outputs aren't just XAI — they're forensic artifacts with provenance links. Explanations are hash-chained to exact inference events, model versions, and training data lineage. Can't tamper after the fact. Direct response to EU AI Act Article 13.

## Technical Stack

- **Framework:** Next.js, React, TypeScript
- **Cryptography:** W3C Verifiable Credentials, hash chains, Merkle trees, provenance DAGs
- **ML/AI:** Federated Learning (DP-FedAvg), LIME/SHAP/SDD explainability
- **Compliance:** EU AI Act Annex IV conformity assessment
- **Deployment:** Vercel
- **Codebase:** 42K+ LOC

## Key Innovations

| Innovation | Analogy | Value |
|------------|---------|-------|
| ForensicSeal | SSL Certificate of AI | Public verification URLs, embeddable badges, trust infrastructure |
| Compliance Proxy SDK | Stripe for AI Compliance | pip-installable decorator wrapping existing inference |
| Annex IV Report Generator | Standalone wedge product | Self-assessment with verifiable evidence |
| Seal Chaining | Continuous Compliance | previous_seal_id creates verifiable compliance timeline |

## Market Context

- EU AI Act compliance deadline approaching (August 2026)
- No notified bodies designated for AI conformity assessment yet — massive market opening
- Self-assessment with verifiable evidence is the only viable path before August 2026
- Closest competitor (eyreACT) sells documentation, not cryptographic proof
- Every organization using third-party facial recognition needs compliance wrapping

## Research Foundation

- ICDF2C 2026 paper submission with 10 publication-quality architecture diagrams
- Collaboration with Safiia Mohammed (University of Windsor PhD candidate, framework creator)
- Research into privacy-preserving federated learning with forensic audit trails
- Novel contribution: DP-FedAvg with forensic logging — training process as courtroom evidence

## Transferable Skills Demonstrated

- **Cryptographic Systems Design:** W3C VCs, hash chains, Merkle trees, provenance DAGs
- **EU AI Act Compliance Engineering:** Annex IV conformity, Article 13 explainability
- **Privacy-Preserving ML:** Federated learning with differential privacy
- **Forensic Evidence Architecture:** Courtroom-grade audit trails with tamper detection
- **SDK/Platform Design:** pip-installable compliance proxy wrapping third-party APIs
- **Academic Research:** ICDF2C paper, architecture diagrams, formal verification
