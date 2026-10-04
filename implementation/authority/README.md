# AUTHORITY

AUTHORITY defines the governed source, scope, delegation, constraints, and accountability by which an actor or governing body may make or approve an authorization decision.

WORLD -> IDENTITY/PARTICIPATION -> CONTEXT -> CAPABILITY -> AUTHORITY -> AUTHORIZATION -> BEATACCESS/SERVICE -> ACTION -> EVENT -> EVIDENCE

## Boundary

Authority answers who or what is entitled to make a governed decision, from which source, over what scope, action classes, conditions, time, delegation, policy and evidence.

Authority does not itself permit a concrete consequential action.

AUTHORITY != IDENTITY
AUTHORITY != ACCOUNT
AUTHORITY != PARTICIPATION
AUTHORITY != ROLE
AUTHORITY != CAPABILITY
AUTHORITY != AUTHORIZATION
AUTHORITY != BEATACCESS
AUTHORITY != ACTION
AUTHORITY != OWNERSHIP

Role membership, capability, relationship, community membership, subscription, workspace membership, location, or Digital Twin representation never silently creates authority.

## Sources

Supported source classes include legal/regulatory source, ownership/title record, organizational mandate, community governance instrument, contractual delegation, appointment/designation, policy-defined administrative authority, service-provider mandate, system authority, and explicitly governed emergency authority.

Source type alone never proves an active authority instance. Evidence, scope, time, lifecycle and provenance remain explicit.

## Dimensions

Every authority evaluates PRINCIPAL + SOURCE + RESOURCE/SUBJECT SCOPE + ACTION SCOPE + CONTEXT + CONDITIONS + TIME + DELEGATION + POLICY VERSION + EVIDENCE + PROVENANCE + ACCOUNTABILITY.

## Delegation

DELEGATOR -> DELEGATION -> DELEGATEE -> BOUNDED AUTHORITY

Delegation is first-class, explicit, temporal, scoped and auditable. A delegate cannot receive or pass more scope or action authority than the parent authority contains. Delegation cannot bypass mandatory constraints or silently transfer ownership.

## Resolution

ACTOR + CONTEXT + CAPABILITY + AUTHORITY SOURCES + SCOPE + TIME + CONDITIONS + POLICY + EVIDENCE + DELEGATION -> AUTHORITY RESOLUTION

Resolution states: RESOLVED, PARTIAL, UNKNOWN, UNAVAILABLE, CONFLICTED, EXPIRED, REVOKED, DENIED.

Resolution is an input to AUTHORIZATION, never the final concrete authorization.

## Security boundary

Authority MUST NOT execute consequential actions, unlock access, initiate payments, mutate ownership, impersonate actors, fabricate governance sources, convert role/capability/context into authority, or allow delegation beyond its source.

**NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.**
