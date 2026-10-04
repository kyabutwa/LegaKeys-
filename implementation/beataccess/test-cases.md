# BEATACCESS VERIFICATION MATRIX

BEATACCESS is green only when it cannot issue a consequential access command without a valid, bounded authorization and cannot misrepresent physical/system outcomes.

## L0 — Contract and type verification

- BA-001 stable access-point ID.
- BA-002 stable operation ID.
- BA-003 stable request ID.
- BA-004 unique command/idempotency binding.
- BA-005 access-point type is constrained.
- BA-006 access lifecycle is constrained.
- BA-007 operational state is explicit.
- BA-008 credential type is constrained.
- BA-009 operation state is constrained.
- BA-010 provider result state is constrained.

## L1 — Persistence verification

- BA-011 access point persists.
- BA-012 access credential persists without raw secret material.
- BA-013 operation persists.
- BA-014 operation references authorization.
- BA-015 validation result persists.
- BA-016 provider result persists.
- BA-017 access event persists.
- BA-018 history is append-oriented.
- BA-019 request/idempotency uniqueness is enforced.
- BA-020 operation indexes support authorization/access-point queries.

## L2 — Authorization boundary

- BA-021 no authorization rejects operation.
- BA-022 DENY rejects operation.
- BA-023 STEP_UP rejects until satisfied.
- BA-024 PENDING rejects execution.
- BA-025 UNKNOWN rejects execution.
- BA-026 UNAVAILABLE rejects execution.
- BA-027 expired authorization rejects.
- BA-028 revoked authorization rejects.
- BA-029 missing authorization decision rejects.
- BA-030 authorization cannot be client-forced.
- BA-031 access-point registration cannot create authorization.
- BA-032 credential registration cannot create authorization.
- BA-033 credential possession cannot create authorization.
- BA-034 recognition cannot create authorization.
- BA-035 location cannot create authorization.

## L3 — Binding and scope

- BA-036 principal must match.
- BA-037 action must match.
- BA-038 target must match.
- BA-039 access point must be inside authorized scope.
- BA-040 cross-community access requires explicit authorization.
- BA-041 cross-building access requires explicit authorization.
- BA-042 cross-unit access requires explicit authorization.
- BA-043 common-area scope remains explicit.
- BA-044 time window is enforced.
- BA-045 execution deadline is enforced.
- BA-046 temporary access activates only inside its window.
- BA-047 expired temporary access rejects.
- BA-048 revoked access operation cannot execute.

## L4 — Credential and provider boundary

- BA-049 credential belongs to the expected principal where binding is required.
- BA-050 revoked credential rejects.
- BA-051 expired credential rejects.
- BA-052 credential validity does not replace authorization.
- BA-053 provider identity is explicit.
- BA-054 controller identity is explicit.
- BA-055 unknown provider state remains UNKNOWN.
- BA-056 provider unavailable remains UNAVAILABLE.
- BA-057 controller offline does not become success.
- BA-058 reader fault does not become success.
- BA-059 provider cannot expand authorized scope.
- BA-060 provider cannot substitute a different authorization.

## L5 — Physical execution truth

- BA-061 authorization ALLOW is distinct from command acceptance.
- BA-062 command acceptance is distinct from physical grant.
- BA-063 access granted requires reliable provider/controller evidence.
- BA-064 access denied remains ACCESS_DENIED.
- BA-065 timeout remains TIMEOUT/UNKNOWN as defined.
- BA-066 unknown physical result remains UNKNOWN.
- BA-067 reconciliation does not rewrite original command response.
- BA-068 access events preserve timestamps.
- BA-069 provider evidence preserves provenance.
- BA-070 event/result correlation remains traceable.

## L6 — Replay, concurrency, offline and safety

- BA-071 duplicate request is idempotent.
- BA-072 safe retry does not create duplicate access.
- BA-073 unknown command is not blindly resent.
- BA-074 one-time authorization cannot replay where prohibited.
- BA-075 anti-replay token is enforced where supported.
- BA-076 concurrent execution cannot bypass validation.
- BA-077 access-point suspension blocks command issuance.
- BA-078 unknown critical controller state blocks unsafe execution.
- BA-079 offline cached access is bounded by policy.
- BA-080 offline access is reconciled after reconnect.
- BA-081 offline access cannot invent authorization.
- BA-082 emergency access requires explicit bounded policy.

## L7 — Security, AI, privacy and regression

- BA-083 GENESIS cannot issue an access command.
- BA-084 CONSTANTYNA cannot issue an access command.
- BA-085 Digital Twin cannot issue an access command.
- BA-086 UI cannot issue an access command without the service gate.
- BA-087 client fields cannot change authorization binding.
- BA-088 raw biometric material is never persisted.
- BA-089 restricted access history is not leaked.
- BA-090 provider adapter cannot fabricate a successful physical result.

## Extended release gates

- BA-091 authorization decision version is retained.
- BA-092 policy version binding is retained.
- BA-093 access-point provenance is retained.
- BA-094 controller/provider provenance is retained.
- BA-095 operation correlation ID is retained.
- BA-096 access event can be traced to authorization.
- BA-097 access event can be traced to operation and command.
- BA-098 failed provider operation remains auditable.
- BA-099 completed operation cannot be silently rewritten.
- BA-100 access-point lifecycle is independent from authorization lifecycle.
- BA-101 safety interlocks are not bypassed.
- BA-102 command execution is atomic with local operation transition.
- BA-103 authorization expiry is checked immediately before command issuance.
- BA-104 revoked authorization is checked immediately before command issuance.
- BA-105 scope is checked immediately before command issuance.
- BA-106 required conditions are checked immediately before command issuance.
- BA-107 consumed one-time authorization cannot execute again.
- BA-108 emergency operation records reason and initiating principal.
- BA-109 privacy scope is enforced for operation history.
- BA-110 future SERVICES/ACTION/EVENT/EVIDENCE modules cannot weaken BEATACCESS.

## Release gate

BEATACCESS is green only if:

1. BA-001 through BA-110 pass.
2. All 90 invariants hold.
3. No access command can be issued without a matching active ALLOW.
4. Authorization is checked immediately before consequential execution.
5. Credential validity never substitutes for authorization.
6. Controller/provider availability never substitutes for authorization.
7. COMMAND_ACCEPTED is never represented as ACCESS_GRANTED.
8. UNKNOWN is never represented as success.
9. Replay and duplicate execution are bounded.
10. Offline/degraded behavior is explicitly governed.
11. Emergency access is bounded and auditable.
12. GENESIS, CONSTANTYNA, Digital Twin and UI cannot bypass the enforcement boundary.
13. Physical/system evidence is preserved without fabricating results.
14. Future modules cannot weaken the invariant.

## Canonical invariant

NO AUTHORIZATION -> NO ACCESS COMMAND.
