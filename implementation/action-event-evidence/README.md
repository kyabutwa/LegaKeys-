# Action / Event / Evidence Runtime

Purpose: the runtime truth layer for consequential LegaKeys operations.

Canonical flow:
AUTHORIZATION -> ACTION -> EXECUTION -> EVENT -> EVIDENCE -> OUTCOME / STATE PROJECTION

LegaKeys owns canonical Action, Event and Evidence records, lineage, lifecycle, idempotency, execution correlation and audit semantics. Providers may return observations or external references, but never become canonical history.

Runtime:
1. Validate request and authorization binding.
2. Create or recover an idempotent Action.
3. Revalidate authorization immediately before consequential execution.
4. Execute through the declared Service or BeatAccess adapter.
5. Append immutable Event records for material transitions.
6. Attach Evidence with provenance and truth state.
7. Derive Outcome/current state only from recorded facts.
8. Reconcile UNKNOWN/DEGRADED outcomes by appending new facts.

Distinctions:
- ACTION = what LegaKeys was authorized to attempt.
- EVENT = what happened in the governed runtime timeline.
- EVIDENCE = supporting artifact/observation/provenance.
- OUTCOME = interpreted result, never a blind provider response.
- Current state is a projection, never a replacement for history.

NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.

Action states: REQUESTED, VALIDATING, AUTHORIZED, EXECUTING, SUCCEEDED, FAILED, UNKNOWN, CANCELLED, EXPIRED, REVOKED.
Evidence truth: VERIFIED, DECLARED, OBSERVED, INFERRED, PROPOSED, UNKNOWN.
Event history is append-only. Reconciliation creates new events/evidence and never rewrites historical facts.

Provider timeout means UNKNOWN unless authoritative evidence establishes the result.
AI cannot create or mutate authorization.
