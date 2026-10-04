# AUTHORIZATION VERIFICATION MATRIX

Authorization is green only when every consequential action is governed by a concrete, current, bounded authorization decision and the execution gate cannot be bypassed.

## L0 — Contract and type verification

- AZ-001 stable authorization ID.
- AZ-002 stable request ID.
- AZ-003 principal is explicit.
- AZ-004 action is explicit.
- AZ-005 target is explicit when applicable.
- AZ-006 decision enum is constrained.
- AZ-007 request lifecycle is constrained.
- AZ-008 policy version is representable.
- AZ-009 scope evaluation is explicit.
- AZ-010 condition evaluation is explicit.

## L1 — Persistence verification

- AZ-011 authorization request persists.
- AZ-012 decision persists separately from request.
- AZ-013 decision versions are unique.
- AZ-014 reasons reference a decision.
- AZ-015 scopes reference the request.
- AZ-016 conditions reference the request.
- AZ-017 evidence references preserve truth state.
- AZ-018 delegation lineage persists.
- AZ-019 history is append-oriented.
- AZ-020 request idempotency is enforced.

## L2 — Identity / capability / authority boundary

- AZ-021 authentication alone cannot produce ALLOW.
- AZ-022 participant status alone cannot produce ALLOW.
- AZ-023 role alone cannot produce ALLOW.
- AZ-024 capability alone cannot produce ALLOW.
- AZ-025 authority alone cannot execute an action.
- AZ-026 context alone cannot produce ALLOW.
- AZ-027 relationship alone cannot produce ALLOW.
- AZ-028 community membership alone cannot produce ALLOW.
- AZ-029 subscription alone cannot produce ALLOW.
- AZ-030 location alone cannot produce ALLOW.

## L3 — Policy and decision verification

- AZ-031 applicable policy is resolved.
- AZ-032 policy version is recorded.
- AZ-033 explicit scope is evaluated.
- AZ-034 required conditions are evaluated.
- AZ-035 required evidence is evaluated.
- AZ-036 time validity is evaluated.
- AZ-037 revoked authority causes DENY.
- AZ-038 expired authority causes DENY.
- AZ-039 expired authorization causes rejection.
- AZ-040 failed mandatory condition causes DENY.

## L4 — Truth, provenance, and failure

- AZ-041 UNKNOWN mandatory input never becomes ALLOW.
- AZ-042 UNAVAILABLE mandatory input never becomes ALLOW.
- AZ-043 INFERRED evidence cannot silently become VERIFIED.
- AZ-044 PROPOSED policy cannot silently become active policy.
- AZ-045 external provider failure remains explicit.
- AZ-046 fabricated provider state is rejected.
- AZ-047 conflicting authoritative policy fails closed or escalates.
- AZ-048 provenance remains queryable.
- AZ-049 decision reasons remain auditable.
- AZ-050 restricted evidence is not leaked.

## L5 — Scope, delegation, and temporal verification

- AZ-051 matching scope permits only within scope.
- AZ-052 mismatching scope denies.
- AZ-053 cross-community scope requires explicit authority.
- AZ-054 building containment does not expand authority.
- AZ-055 unit containment does not expand authority.
- AZ-056 current location does not expand authority.
- AZ-057 delegation requires delegator authority.
- AZ-058 delegation cannot exceed delegator scope.
- AZ-059 expired delegation cannot support ALLOW.
- AZ-060 revoked delegation cannot support ALLOW.
- AZ-061 delegation lineage is retained.
- AZ-062 one-time delegation cannot be replayed where forbidden.
- AZ-063 time-window conditions are enforced.
- AZ-064 execution deadline is enforced.

## L6 — Execution security

- AZ-065 DENY cannot pass execution gate.
- AZ-066 STEP_UP cannot pass without required step-up completion.
- AZ-067 PENDING cannot pass execution gate.
- AZ-068 UNKNOWN cannot pass execution gate.
- AZ-069 UNAVAILABLE cannot pass execution gate.
- AZ-070 expired ALLOW cannot pass.
- AZ-071 revoked ALLOW cannot pass.
- AZ-072 mismatched action cannot pass.
- AZ-073 mismatched target cannot pass.
- AZ-074 mismatched principal cannot pass.
- AZ-075 mismatched scope cannot pass.
- AZ-076 mismatched policy binding cannot pass.
- AZ-077 consumed one-time authorization cannot replay.
- AZ-078 client cannot force ALLOW through request fields.
- AZ-079 UI visibility cannot bypass the gate.
- AZ-080 execution gate does not execute the action itself.

## L7 — Intelligence, concurrency, audit, and regression

- AZ-081 GENESIS cannot grant authorization.
- AZ-082 CONSTANTYNA cannot grant authorization.
- AZ-083 Digital Twin state cannot grant authorization.
- AZ-084 AI proposal cannot become ALLOW without governed evaluation.
- AZ-085 concurrent evaluations preserve deterministic decision lineage.
- AZ-086 duplicate requests do not create duplicate consequential rights.
- AZ-087 recheck creates a new decision version.
- AZ-088 historical decisions are not rewritten.
- AZ-089 correlation/request/action IDs remain traceable.
- AZ-090 emergency authorization remains bounded and auditable.

## Release gate

AUTHORIZATION is green only if:

1. all AZ-001 through AZ-090 pass;
2. all 60 canonical invariants hold;
3. no client-controlled field can force ALLOW;
4. no UNKNOWN/UNAVAILABLE mandatory state becomes ALLOW;
5. scope and delegation are explicit;
6. policy versions and decision reasons are retained;
7. historical decisions remain immutable;
8. execution is impossible without a matching active ALLOW;
9. execution-gate validation does not itself execute actions;
10. GENESIS, CONSTANTYNA, Digital Twin, UI, relationships, location, membership, subscription, capability, and authority cannot bypass authorization;
11. duplicate/replay/concurrency behavior is deterministic and bounded;
12. future BEATACCESS, SERVICES, ACTION, EVENT, and EVIDENCE modules cannot weaken this boundary.

## Canonical invariant

NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
