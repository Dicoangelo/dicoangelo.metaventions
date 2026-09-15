# Dico Angelo — Technical Overview

Updated September 15, 2026

## Practical AI implementation

Dico builds software that connects information, tools, and operational workflows. His work includes research capture and retrieval, career workflow applications, and a portfolio assistant that answers questions using a maintained professional profile and retrieved supporting material.

The emphasis is on making systems usable: define the task, connect the necessary data, expose useful actions, review outputs, and maintain the application. This overview describes capabilities and implementation choices. It does not use code volume, repository counts, or model-generated scores as measures of engineering quality.

## How the work is built

Dico specifies requirements and architecture in plain English, directs AI coding tools, and reviews, tests, and deploys their output. His contribution includes choosing the workflow, defining the information the system needs, coordinating implementation, inspecting the result, and making revisions.

That process is particularly useful for integrations and internal tools: a business request must become a concrete flow with clear inputs, actions, outputs, and review points. The resulting software demonstrates AI-assisted implementation. It does not establish unaided programming fluency or independently validated performance.

## ResearchGravity and the Universal Cognitive Wallet

ResearchGravity organizes research sessions, source URLs, project context, and synthesis. Its architecture includes application services, searchable records, vector retrieval, and tools exposed through the Model Context Protocol (MCP). MCP provides a structured way for an AI application to request information or invoke a supported tool.

The Universal Cognitive Wallet (UCW) captures and organizes records of AI interactions across supported platforms. The implementation includes stored events, semantic embeddings, retrieval, and relationships between records. Embeddings allow the system to find material with related meaning, while retained source context helps a reviewer understand where an answer came from.

Together, these projects explore how research and prior work can remain accessible across sessions. Their dashboards and architecture views illustrate the implementation; historical screenshots should not be read as current system totals or independent measures of accuracy. See the [project showcase](https://dicoangelo.metaventionsai.com/showcase).

## CareerCoach Antigravity

CareerCoach applies AI-assisted workflows to career research and preparation. The project includes job-matching workflows, resume and cover-letter preparation, and interview practice. Its value as a technical example is the organization of several related tasks around a user's career information and a target role.

The [CareerCoach interface](https://careers.metaventionsai.com) is a deployed application. Deployment demonstrates that a software surface exists; it does not establish user adoption, hiring outcomes, or the correctness of every generated recommendation. Resume and application content requires review against the person's actual experience.

## Portfolio assistant and retrieval

The [portfolio](https://dicoangelo.metaventionsai.com) includes an assistant built around a maintained professional profile, an index of available artifacts, and material retrieved for the visitor's question. The application combines that context with the conversation before requesting a response from a language model.

The retrieval implementation can use PageIndex when configured, with artifact and dossier search through the Cohere/Supabase path as a fallback. Optional reranking helps order retrieved material. These are implementation choices, not guarantees that every response is complete or correct. The verified professional profile takes precedence when older documents conflict with it.

This is a practical example of retrieval-augmented generation: the assistant searches supporting material and uses the results while composing an answer.

## Research notes and project status

Dico studies and implements ideas from papers written by other researchers. Those papers are not his publications, and implementing an idea does not replicate or validate the source study.

Philip Drammeh's [arXiv:2511.15755](https://arxiv.org/abs/2511.15755) was withdrawn on August 31, 2026. The author's notice withdrew the Decision Quality results and related actionability and zero-variance claims after a code audit. Historical DQ implementations are retained as examples of internal routing heuristics; their scores do not establish scientific efficacy or validated accuracy.

Project status is stated separately from technical ambition. For example, the [Partnership Graph](https://partnerships.metaventionsai.com) is a concept demo with illustrative data, not a commercial deployment or an affiliation with the organizations shown. The showcase includes deployed interfaces, internal tooling, and historical implementation views. Each should be assessed using its stated scope and available evidence.
