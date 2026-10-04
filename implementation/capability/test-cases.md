# CAPABILITY VERIFICATION MATRIX

Capability is green only when ability remains distinct from authority and all truth, scope, temporal, provenance, privacy, and authorization boundaries hold.

## L0 — Contract and type verification

- C-001 capability has stable identifier.
- C-002 capability has explicit subject.
- C-003 capability has explicit type and code.
- C-004 lifecycle state is constrained.
- C-005 truth state is constrained.
- C-006 resolution status is explicit.
- C-007 scope is separate from authorization.
- C-008 evidence is separate from capability truth.
- C-009 temporal validity is representable.
- C-010 sensitive capability classification is representable.

## L1 — Persistence

- C-011 valid capability persists.
- C-012 invalid subject reference is rejected.
- C-013 capability scope persists.
- C-014 capability conditions persist.
- C-015 capability evidence persists.
- C-016 capability history persists.
- C-017 duplicate capability command is idempotent.
- C-018 duplicate evidence attachment is idempotent.
- C-019 historical state is retained.
- C-020 indexes support subject/type/state resolution.

## L2 — Truth and provenance

- C-021 DECLARED remains DECLARED without verification.
- C-022 OBSERVED remains OBSERVED without verification.
- C-023 INFERRED never silently becomes VERIFIED.
- C-024 PROPOSED never silently becomes ACTIVE.
- C-025 UNKNOWN is preserved.
- C-026 UNAVAILABLE provider state is preserved.
- C-027 evidence is linked to verification.
- C-028 provenance is retained.
- C-029 contradictory assertions become CONFLICTED.
- C-030 rejected evidence cannot silently verify a capability.

## L3 — Scope and temporal behavior

- C-031 capability scope is explicit.
- C-032 scope does not grant authorization.
- C-033 expired capability resolves as EXPIRED.
- C-034 suspended capability is not currently applicable.
- C-035 revoked capability is not currently applicable.
- C-036 future capability is not treated as active before effective time.
- C-037 historical capability remains queryable.
- C-038 cross-scope capability requires explicit scope validation.
- C-039 context may qualify capability resolution.
- C-040 context cannot create capability.

## L4 — Authorization boundary

- C-041 capability alone cannot create authorization.
- C-042 capability alone cannot grant BeatAccess.
- C-043 capability alone cannot unlock a door.
- C-044 capability alone cannot initiate payment.
- C-045 capability alone cannot execute a consequential service action.
- C-046 role membership does not prove capability.
- C-047 capability does not imply role membership.
- C-048 capability does not imply current provider availability.
- C-049 capability does not imply authorization.
- C-050 every consequential execution requires a separate authorization decision.

## L5 — External systems

- C-051 external capability source is recorded with provenance.
- C-052 external provider timeout yields UNAVAILABLE or UNKNOWN, never fabricated truth.
- C-053 provider-reported capability is not automatically authorization.
- C-054 stale external capability cannot bypass expiry.
- C-055 external source disagreement produces explicit conflict.

## L6 — Security and privacy

- C-056 sensitive capability data respects scope.
- C-057 unauthorized caller cannot expand capability scope.
- C-058 UI visibility does not create capability.
- C-059 AI-generated capability claims remain non-authoritative until verified.
- C-060 Digital Twin capability representation cannot create authority.
- C-061 capability evidence access follows evidence sensitivity.
- C-062 capability history cannot be silently deleted.

## L7 — Intelligence and regression

- C-063 GENESIS may reason about capability but cannot grant it.
- C-064 CONSTANTYNA may explain capability but cannot grant it.
- C-065 recommendations do not mutate capability without governed command.
- C-066 capability resolution is explainable.
- C-067 UNKNOWN remains distinct from FALSE.
- C-068 UNAVAILABLE remains distinct from FALSE.
- C-069 capability does not imply service availability.
- C-070 capability does not imply provider connectivity.
- C-071 team capability does not automatically become individual authority.
- C-072 role expectation does not prove actual capability.
- C-073 capability changes produce auditable history.
- C-074 concurrent updates preserve state consistency.
- C-075 transaction rollback leaves no partial authoritative update.
- C-076 retries do not duplicate capability assertions.
- C-077 retries do not duplicate evidence.
- C-078 authorization layer remains the only consequential decision gate.
- C-079 no Capability endpoint executes consequential actions.
- C-080 regression preserves Identity, World, Context, and future Authority boundaries.

## Release gate

CAPABILITY is GREEN only when:

1. all L0-L7 cases pass;
2. all 40 capability invariants are covered;
3. capability remains descriptive rather than authoritative;
4. UNKNOWN, UNAVAILABLE, CONFLICTED, EXPIRED, and other non-positive states remain explicit;
5. evidence and provenance remain auditable;
6. temporal and scope rules fail closed;
7. external provider state is never invented;
8. AI and Digital Twin outputs cannot create authoritative capability;
9. Capability cannot directly trigger BeatAccess or any consequential service;
10. the future AUTHORITY and AUTHORIZATION modules consume capability without collapsing capability into permission;
11. idempotency and transaction behavior prevent duplicate or partial state;
12. privacy and sensitive capability boundaries pass;
13. historical truth is preserved;
14. **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**

## Recommended CI stages

```
capability:lint
capability:typecheck
capability:schema
capability:unit
capability:integration
capability:truth
capability:provenance
capability:temporal
capability:scope
capability:security
capability:authorization-boundary
capability:regression
capability:release-gate
```
