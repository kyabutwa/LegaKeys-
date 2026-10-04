# Action / Event / Evidence Runtime Verification Matrix

## Authorization and execution
- AEE-001 action cannot execute without authorization.
- AEE-002 authorization is revalidated immediately before execution.
- AEE-003 expired authorization is rejected.
- AEE-004 revoked authorization is rejected.
- AEE-005 principal mismatch is rejected.
- AEE-006 target mismatch is rejected.
- AEE-007 scope mismatch is rejected.
- AEE-008 failed policy recheck never reaches adapter.
- AEE-009 UI cannot bypass the execution gate.
- AEE-010 AI proposal cannot execute without authorization.

## Idempotency and concurrency
- AEE-011 first request creates one action.
- AEE-012 identical replay returns original result.
- AEE-013 same key with different material parameters is rejected.
- AEE-014 concurrent single-use execution produces at most one consequential success.
- AEE-015 duplicate provider callback is idempotent.
- AEE-016 timeout retry preserves action identity.
- AEE-017 execution attempts are monotonic.
- AEE-018 correlation survives retries.
- AEE-019 causation lineage survives retries.
- AEE-020 deadline is server-enforced.

## Lifecycle
- AEE-021 REQUESTED -> VALIDATING is recorded.
- AEE-022 valid authorization permits AUTHORIZED.
- AEE-023 EXECUTING occurs only after the gate.
- AEE-024 successful adapter result can produce SUCCEEDED.
- AEE-025 adapter failure produces FAILED.
- AEE-026 timeout without authoritative result produces UNKNOWN.
- AEE-027 cancellation never erases events.
- AEE-028 later revocation never rewrites history.
- AEE-029 expired action cannot execute.
- AEE-030 repeated completion is idempotent.

## Event integrity
- AEE-031 every material transition emits an event.
- AEE-032 events are append-only.
- AEE-033 event IDs are unique.
- AEE-034 action sequence is monotonic.
- AEE-035 occurred_at differs from recorded_at.
- AEE-036 correlation ID is mandatory.
- AEE-037 causation ID links derived events.
- AEE-038 provider response is not automatically canonical truth.
- AEE-039 historical events cannot be overwritten.
- AEE-040 reconciliation appends a new event.

## Evidence
- AEE-041 evidence requires provenance.
- AEE-042 truth state is explicit.
- AEE-043 protected evidence does not expose raw sensitive payload.
- AEE-044 content hash is preserved when applicable.
- AEE-045 evidence cannot grant authority.
- AEE-046 missing completion evidence prevents false completion.
- AEE-047 new evidence can resolve supported UNKNOWN outcomes.
- AEE-048 duplicate evidence ingestion is idempotent.
- AEE-049 retention class is preserved.
- AEE-050 source remains identifiable.

## Outcomes and reconciliation
- AEE-051 ACCEPTED is not COMPLETED.
- AEE-052 UNKNOWN stays UNKNOWN without new evidence.
- AEE-053 FAILED remains visible.
- AEE-054 reconciliation never rewrites events.
- AEE-055 completion requires action-specific evidence.
- AEE-056 requested and observed results remain separate.
- AEE-057 outcome truth cannot exceed supporting evidence.
- AEE-058 current state derives from persisted facts.
- AEE-059 Digital Twin cannot authorize.
- AEE-060 provider outcome is normalized through a declared adapter.

## Cross-module and security
- AEE-061 BeatAccess actions bind access-point target and authorization.
- AEE-062 Service actions bind service/version/capability.
- AEE-063 BeatVisitor re-entry creates a fresh action and authorization evaluation.
- AEE-064 payment actions preserve provider provenance.
- AEE-065 biometric evidence is referenced, not raw-stored.
- AEE-066 community scope cannot become global scope.
- AEE-067 workspace visibility cannot create authority.
- AEE-068 subscription cannot create consequential authority.
- AEE-069 relationship cannot create authorization.
- AEE-070 capability cannot execute without authorization.

## Resilience and release
- AEE-071 unavailable adapter yields UNKNOWN/UNAVAILABLE semantics.
- AEE-072 timeout differs from provider rejection.
- AEE-073 duplicate callbacks reconcile safely.
- AEE-074 late callbacks preserve original occurrence time.
- AEE-075 provider substitution preserves action lineage.
- AEE-076 compensation is a new action.
- AEE-077 audit history is not silently deleted.
- AEE-078 sensitive errors are protected.
- AEE-079 event/evidence ordering is deterministic.
- AEE-080 retention policy is enforceable.
- AEE-081 schema applies cleanly to fresh PostgreSQL.
- AEE-082 schema is repeatable.
- AEE-083 TypeScript compiles.
- AEE-084 execution transaction is atomic where required.
- AEE-085 authorization check occurs inside execution boundary.
- AEE-086 idempotency is database-backed.
- AEE-087 normal runtime cannot update events.
- AEE-088 evidence cannot mutate authorization.
- AEE-089 outcomes are reproducible from persisted facts.
- AEE-090 fixtures contain no fabricated provider state.
- AEE-091 consequential actions have correlation and idempotency IDs.
- AEE-092 accepted differs from completed.
- AEE-093 UNKNOWN has reconciliation path.
- AEE-094 compensation preserves lineage.
- AEE-095 runtime errors do not leak protected data.
- AEE-096 audit history remains queryable under retention.
- AEE-097 action/event/evidence IDs are distinct.
- AEE-098 evidence references are integrity-checkable.
- AEE-099 cross-module authorization contract remains intact.
- AEE-100 final gate rejects every consequential execution without current authorization.

Final release rule: NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
