# LEGAKEYS — CONTEXT VERIFICATION MATRIX

Status: Canonical verification matrix.

## Verification levels

- L0 Contract
- L1 Persistence
- L2 Service
- L3 Truth/provenance
- L4 Scope/privacy/security
- L5 Temporal/history
- L6 Resolution
- L7 Adversarial/authorization boundary

## Matrix

| ID | Scenario | Expected result | Level |
|---|---|---|---|
| C-001 | Create valid Context | Stable Context ID and explicit type | L1/L2 |
| C-002 | Missing context type | Rejected | L1/L2 |
| C-003 | Unknown actor Entity ID | Rejected | L1 |
| C-004 | Unknown subject Entity ID | Rejected | L1 |
| C-005 | Unknown scope Entity ID | Rejected | L1 |
| C-006 | Invalid time window | Rejected | L1 |
| C-007 | Scheduled context reaches start | Becomes active only by lifecycle policy | L5 |
| C-008 | Context reaches end time | Becomes expired and is not active | L5 |
| C-009 | Closed context queried | Historical record remains available | L5 |
| C-010 | Attach World Place | Stable reference retained | L2/L3 |
| C-011 | Attach Participant | Reference does not create authorization | L2/L4 |
| C-012 | Attach relationship | Relationship meaning retained | L2/L3 |
| C-013 | Add UNKNOWN condition | UNKNOWN remains explicit | L3 |
| C-014 | Add OBSERVED condition | Observation time/source retained | L3 |
| C-015 | Add INFERRED condition | Remains INFERRED | L3 |
| C-016 | Promote INFERRED to VERIFIED without evidence | Rejected | L3/L7 |
| C-017 | Add PROPOSED condition | Remains non-active | L3/L7 |
| C-018 | Missing provenance for required verified fact | Rejected or remains non-verified | L3 |
| C-019 | Conflicting conditions | Both traceable; no silent overwrite | L3/L5 |
| C-020 | Add explicit scope | Scope is queryable independently | L4 |
| C-021 | Cross-community scope | Requires explicit scope validation | L4 |
| C-022 | Sensitive context query | Policy filters/denies as required | L4 |
| C-023 | Context for resident in unit | Does not grant access | L4/L7 |
| C-024 | Context for worker at facility | Does not grant authority | L4/L7 |
| C-025 | Context for visitor | Does not grant access | L4/L7 |
| C-026 | Context type set to emergency | Does not bypass Authorization | L4/L7 |
| C-027 | Purpose says payment | Does not authorize payment | L4/L7 |
| C-028 | Capability reference present | Does not activate capability | L4 |
| C-029 | Role reference present | Does not grant role authority | L4 |
| C-030 | Relationship says owner | Does not bypass Authorization | L4/L7 |
| C-031 | Client requests access grant through Context | Rejected/routed to Authority | L4/L7 |
| C-032 | Context endpoint receives consequential action | No action executes | L4/L7 |
| C-033 | Duplicate create with same idempotency key | One canonical context | L2 |
| C-034 | Duplicate condition event | One canonical condition/event | L2/L7 |
| C-035 | Concurrent context updates | No silent lost update | L1/L2 |
| C-036 | External provider unavailable | UNKNOWN/UNAVAILABLE | L3/L7 |
| C-037 | External provider claims verified context without trusted evidence | Not silently VERIFIED | L3/L7 |
| C-038 | UI infers context | UI cannot promote truth state | L3/L6 |
| C-039 | Digital Twin derives context | Remains derived and traceable | L6 |
| C-040 | GENESIS proposes context | Proposal cannot become active authority | L6/L7 |
| C-041 | CONSTANTYNA describes context | Response preserves truth/provenance | L3/L6 |
| C-042 | Context references deleted/retired World object | Historical reference remains explainable | L5 |
| C-043 | Scope leakage attempt | Protected context is denied | L4/L7 |
| C-044 | Client supplies another actor's scope | Server derives/enforces scope | L4/L7 |
| C-045 | Client changes lifecycle directly | Server applies lifecycle policy | L4 |
| C-046 | Injection in condition JSON | Safely validated/parameterized | L1/L7 |
| C-047 | Database failure during context write | Transaction prevents partial canonical mutation | L1/L7 |
| C-048 | Context resolution finds no reliable context | Returns UNKNOWN/PARTIAL, never invented | L6/L7 |
| C-049 | Context resolution finds conflicting contexts | Returns explicit conflict/partial status | L6 |
| C-050 | Consequential request without Authorization | Blocked: NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION | L4/L7 |

## Release gate

Context is GREEN only if:
1. All L0-L7 tests pass.
2. All 30 Context invariants are covered.
3. Context never grants authorization.
4. Context never executes consequential actions.
5. Truth state and provenance remain explicit.
6. Scope/privacy boundaries pass.
7. Temporal history remains reconstructable.
8. Idempotency and transaction tests pass.
9. World and Identity references remain valid.
10. Capability, Authority and BeatAccess cannot weaken the Context boundary.

NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
