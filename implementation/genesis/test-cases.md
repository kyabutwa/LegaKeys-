# GENESIS Verification Matrix

## L0 — Identity, scope and run lifecycle
G-001 stable run identity
G-002 initiating actor required
G-003 purpose required
G-004 explicit data scope
G-005 explicit context
G-006 correlation ID
G-007 policy version
G-008 model/provider lineage
G-009 run state lifecycle
G-010 cancellation preserves history

## L1 — Truth and provenance
G-011 verified input remains verified
G-012 declared input remains declared
G-013 observed input remains observed
G-014 inference remains inference
G-015 proposal remains proposal
G-016 unknown remains unknown
G-017 model confidence cannot promote truth
G-018 missing provenance is exposed
G-019 observed and ingestion timestamps differ
G-020 stale input is marked/handled

## L2 — Understanding and reasoning
G-021 context is preserved
G-022 relationship scope preserved
G-023 temporal scope preserved
G-024 finding references evidence
G-025 anomaly is explainable
G-026 inference exposes uncertainty
G-027 forecast is not fact
G-028 recommendation exposes rationale
G-029 contradictory evidence remains visible
G-030 source disagreement is not silently erased

## L3 — Tool safety
G-031 tool identity/version declared
G-032 tool side-effect class declared
G-033 read-only tool allowed within scope
G-034 consequential tool denied without policy
G-035 prompt injection cannot expand scope
G-036 retrieved content cannot issue authority
G-037 tool timeout becomes bounded failure/unknown
G-038 tool output provenance retained
G-039 external tool result not automatically verified
G-040 tool capability cannot exceed declared scope

## L4 — Proposal and authority boundary
G-041 proposal is not authorization
G-042 GENESIS cannot self-approve
G-043 required capability explicit
G-044 required authority explicit
G-045 authorization reference explicit when approved
G-046 target explicit
G-047 reason explicit
G-048 expected outcome explicit
G-049 assumptions explicit
G-050 risk level explicit
G-051 expiry/revalidation explicit
G-052 human review required for configured high-impact cases
G-053 approval identity preserved
G-054 approval cannot rewrite proposal provenance
G-055 authorization failure remains visible

## L5 — Action / Event / Evidence
G-056 consequential proposal crosses Action Runtime
G-057 action binds authorization
G-058 action is idempotent
G-059 execution emits event
G-060 execution evidence is linked
G-061 outcome does not exceed evidence
G-062 unknown result remains unknown
G-063 reconciliation creates new evidence
G-064 history is append-only
G-065 provider response is provenance-tagged

## L6 — Digital Twin / Knowledge
G-066 governed events can update derived knowledge
G-067 Digital Twin remains derived
G-068 Digital Twin cannot authorize
G-069 GENESIS output cannot mutate canonical history
G-070 projection lag is visible
G-071 derived state is traceable to sources

## L7 — Security and privacy
G-072 least-privilege data access
G-073 sensitive data minimized
G-074 protected references instead of raw secrets
G-075 memory is scoped
G-076 memory cannot create authority
G-077 impersonation attempt rejected
G-078 cross-context data leakage rejected
G-079 policy conflict fails closed
G-080 high-risk autonomy denied without explicit governance

## L8 — Evaluation and operations
G-081 groundedness evaluation
G-082 correctness evaluation
G-083 safety evaluation
G-084 policy compliance evaluation
G-085 calibration/uncertainty evaluation
G-086 model/version drift detected
G-087 tool behavior drift detected
G-088 cost/latency telemetry traceable
G-089 run replay has input/config lineage
G-090 evaluation does not rewrite original output

## L9 — Resilience and regression
G-091 provider unavailable
G-092 model unavailable
G-093 knowledge source unavailable
G-094 partial evidence
G-095 duplicate tool callback
G-096 duplicate run request
G-097 stale proposal
G-098 paused run cannot execute
G-099 degraded mode exposes limitation
G-100 NO AUTHORIZATION → NO CONSEQUENTIAL ACTION
