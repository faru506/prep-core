# Persistent Memory Skill

Use this skill before and after every non-trivial coding-agent task. Its input is the current task or request. It manages the repository's persistent engineering knowledge using `.agent/memory/`.

Persistent memory is a curated, repository-specific knowledge base, not chat history. Its lifecycle is:

**Remember → Verify → Work → Learn → Persist**

## Before Work: Load Memory

1. Read `AGENTS.md` completely.
2. Read `.agent/memory/index.md`.
3. Determine which memory categories are relevant to the task.
4. Read only the relevant memory files.
5. Extract knowledge that may affect implementation, investigation, constraints, prior decisions, or known pitfalls.

Do not dump or read unrelated memory. Use the index as the routing mechanism.

## Verify Memory

Memory is context, not authority. The current repository is always the source of truth.

For important memory, locate its referenced files, classes, methods, tests, or configuration and verify that it remains accurate and applicable. Check for changed behavior, names, paths, schemas, APIs, and flows.

If memory conflicts with the repository, current code wins. Correct the stale memory; never implement behavior solely because it appears in memory.

## Use Memory During Work

Use verified knowledge to avoid duplicate investigation and to reuse established architecture, patterns, data relationships, integrations, job flows, testing conventions, operational procedures, pitfalls, and decisions.

Memory accelerates investigation; it does not replace it. Implement the smallest correct change consistent with the current repository.

## After Work: Review and Persist

Ask whether the task revealed durable, reusable, verified, actionable, repository-specific knowledge that would help a future agent.

If it did:

1. Select the appropriate memory category.
2. Search that file for an existing topic.
3. Update or merge the existing entry instead of creating a duplicate.
4. Correct stale or contradictory information after verifying it against the repository.
5. Include concise source references and a `Last Verified` date.

If no durable knowledge was discovered, do not modify memory.

## Memory Routing

- `architecture.md` — application architecture, components, boundaries, and important flows.
- `domain.md` — business concepts, terminology, and rules.
- `patterns.md` — established implementation patterns and reusable approaches.
- `database.md` — persistence structures, relationships, indexes, queries, and data lifecycle.
- `apis.md` — internal/external API contracts, integrations, and constraints.
- `background-jobs.md` — jobs, queues, scheduling, retries, dependencies, and asynchronous flows.
- `testing.md` — test structure, fixtures, factories, helpers, and conventions.
- `operations.md` — deployment, services, runtime behavior, and operational procedures.
- `pitfalls.md` — confirmed recurring bugs, non-obvious behavior, failure modes, and compatibility issues.
- `decisions.md` — significant architecture/design decisions, trade-offs, and rationale.
- `index.md` — lightweight routing only; do not duplicate category knowledge here.

## Entry Format

```markdown
## <Topic>

**Knowledge**

<concise verified information>

**Use When**

<when future agents should use this knowledge>

**Source**

- `path/to/file.ext`
- `ClassName#method`
- `relevant test`

**Last Verified**

YYYY-MM-DD
```

## What Not to Persist

Never store chat transcripts, entire AI responses, temporary reasoning, debugging output, full logs, production data, personal data, credentials, API keys, tokens, passwords, secrets, unverified assumptions, speculation, one-time instructions, temporary paths or values, or temporary errors that are not durable confirmed pitfalls.

Do not persist every implementation detail or code-review finding. Persist only knowledge that is durable, reusable, verified, specific to this repository, actionable, concise, and source-backed.

## Safety and Maintenance

Persistent-memory updates do not grant Git permission. Continue to follow every Git rule in `AGENTS.md`, including the requirement for explicit user permission before any Git write operation.

Keep memory concise. Merge duplicates, correct or remove obsolete knowledge, resolve contradictions against current code, and preserve important design changes in `decisions.md` when applicable.
