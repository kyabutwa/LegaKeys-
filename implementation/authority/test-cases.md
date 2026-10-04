# AUTHORITY VERIFICATION MATRIX

Authority is green only when governance source, scope, delegation, policy, provenance and separation from final authorization are preserved.

## L0 Contract
- A-001 stable authority identifier
- A-002 explicit principal
- A-003 explicit source
- A-004 explicit action scope
- A-005 explicit resource/place scope
- A-006 explicit truth state
- A-007 explicit lifecycle
- A-008 policy version representable
- A-009 delegation first-class
- A-010 resolution status explicit

## L1 Persistence
- A-011 valid source persists
- A-012 valid authority persists
- A-013 invalid principal rejected
- A-014 invalid source rejected
- A-015 scope persists
- A-016 action scope persists
- A-017 conditions persist
- A-018 evidence persists
- A-019 delegation persists
- A-020 history persists
- A-021 duplicate authority is idempotent
- A-022 duplicate delegation is idempotent
- A-023 history remains queryable
- A-024 principal/source/scope indexes resolve

## L2 Truth and provenance
- A-025 DECLARED stays DECLARED without verification
- A-026 OBSERVED stays OBSERVED without verification
- A-027 INFERRED never silently becomes VERIFIED
- A-028 PROPOSED never silently becomes ACTIVE
- A-029 UNKNOWN remains UNKNOWN
- A-030 evidence links to verification
- A-031 provenance retained
- A-032 rejected evidence cannot silently establish authority
- A-033 contradictory sources become CONFLICTED
- A-034 governance outage becomes UNKNOWN/UNAVAILABLE

## L3 Temporal and scope
- A-035 not active before effective time
- A-036 expired resolves EXPIRED
- A-037 suspended does not resolve active
- A-038 revoked does not resolve active
- A-039 scope explicit
- A-040 action scope explicit
- A-041 context qualifies resolution
- A-042 context cannot create authority
- A-043 capability can inform resolution
- A-044 capability cannot create authority
- A-045 cross-scope resolution requires validation
- A-046 history remains queryable

## L4 Delegation
- A-047 delegation requires active parent
- A-048 delegated scope contained by parent
- A-049 delegated action scope contained by parent
- A-050 delegated time contained by parent
- A-051 mandatory constraints survive delegation
- A-052 delegate cannot exceed received scope
- A-053 nested delegation preserves lineage
- A-054 revoked parent invalidates dependent delegation
- A-055 delegation remains auditable
- A-056 delegation cannot silently transfer ownership

## L5 Authorization boundary
- A-057 authority alone cannot create authorization
- A-058 authority alone cannot grant BeatAccess
- A-059 authority alone cannot unlock a door
- A-060 authority alone cannot initiate payment
- A-061 authority alone cannot execute consequential service action
- A-062 role alone cannot create authority
- A-063 capability alone cannot create authority
- A-064 participation alone cannot create authority
- A-065 subscription alone cannot create authority
- A-066 workspace membership alone cannot create authority
- A-067 active authority does not authorize every action
- A-068 consequential action requires separate authorization

## L6 Security and governance
- A-069 least-privilege scope enforceable
- A-070 separation of duties enforceable
- A-071 mandatory constraints cannot be bypassed
- A-072 sensitive authority data respects privacy
- A-073 unauthorized caller cannot expand scope
- A-074 UI visibility does not create authority
- A-075 AI authority claims remain non-authoritative until governed
- A-076 Digital Twin representation cannot create authority
- A-077 external state never fabricated
- A-078 history cannot be silently deleted

## L7 Intelligence, concurrency and regression
- A-079 GENESIS may analyze but cannot grant authority
- A-080 CONSTANTYNA may explain but cannot grant authority
- A-081 recommendations cannot mutate authority without command
- A-082 resolution is explainable
- A-083 UNKNOWN distinct from FALSE
- A-084 UNAVAILABLE distinct from FALSE
- A-085 concurrent updates preserve consistency
- A-086 rollback leaves no partial authoritative update
- A-087 retries do not duplicate authority
- A-088 retries do not duplicate delegation
- A-089 no Authority endpoint executes consequential actions
- A-090 regression preserves Identity, World, Context, Capability and future Authorization boundaries

## Release gate

AUTHORITY is GREEN only when A-001 through A-090 pass, all 50 invariants are covered, source/scope/policy/evidence/provenance/time remain explicit, delegation cannot exceed parent authority, mandatory constraints and separation of duties cannot be bypassed, non-positive states remain explicit, AI/Digital Twin cannot create authority, Authority cannot trigger BeatAccess or consequential services, the future AUTHORIZATION module remains the concrete decision gate, and idempotency/transaction/concurrency/privacy/history requirements pass.

**NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.**

Recommended CI:
authority:lint
authority:typecheck
authority:schema
authority:unit
authority:integration
authority:truth
authority:provenance
authority:delegation
authority:temporal
authority:scope
authority:security
authority:authorization-boundary
authority:regression
authority:release-gate
