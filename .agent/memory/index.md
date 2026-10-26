# Agent Memory Index

Use this file before non-trivial work to route to only the memory files relevant to the task. The current repository remains the source of truth; verify important memory before relying on it.

- `architecture.md` — application architecture, component boundaries, and important flows.
- `domain.md` — business concepts and rules.
- `patterns.md` — established implementation patterns and reusable approaches.
- `database.md` — persistence structures, relationships, indexes, and queries.
- `apis.md` — APIs, integrations, and request/response contracts.
- `background-jobs.md` — jobs, scheduling, queues, retries, and asynchronous flows.
- `testing.md` — tests, fixtures, factories, helpers, and testing patterns.
- `operations.md` — deployment, services, runtime behavior, and operational procedures.
- `pitfalls.md` — confirmed recurring problems and non-obvious behavior.
- `decisions.md` — important architecture/design decisions and rationale.

Current topics:
- Monorepo topology, JWT auth flow, and frontend route map are documented in `architecture.md`.
- Content hierarchy, engagement rules, and roles are documented in `domain.md`.
- API client, ordering, and controller conventions are documented in `patterns.md`.
- Collections, indexes, and denormalized counters are documented in `database.md`.
- Endpoint contracts and status codes are documented in `apis.md`.
- Test tooling status and the unused worker layer are documented in `testing.md` and `background-jobs.md`.
- Docker workflow, environment variables, and CI jobs are documented in `operations.md`.
- Verified audit findings and recurring traps are documented in `pitfalls.md` and `decisions.md`.
- Recent hardenings: Mongoid safe lookups, Devise registration update handling, JWT_SECRET fail-fast, admin reorder validation.
