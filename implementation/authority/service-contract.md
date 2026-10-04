# AUTHORITY SERVICE CONTRACT

The Authority service owns governed authority instances, sources, scopes, action classes, conditions, delegation, evidence, policy references, provenance, lifecycle and authority resolution. It does not own final consequential authorization or execution.

## Commands

POST /authority — create an authority instance. Validate principal, source, scope, action class, truth state, provenance and effective period.

POST /authority/:id/evidence — attach evidence.

POST /authority/:id/scope — add or update bounded scope.

POST /authority/:id/conditions — add or update conditions.

POST /authority/:id/delegate — create bounded delegation.

POST /authority/:id/revoke — revoke authority/delegation without deleting history.

POST /authority/:id/suspend — suspend applicability.

POST /authority/:id/verify — request a governed truth-state transition with evidence and provenance.

## Delegation validation

A delegation requires active parent authority, contained scope, contained action class, contained validity period, preserved mandatory constraints, explicit provenance and auditable lineage.

A delegate cannot delegate more than it received.

## Queries

GET /authority/:id
GET /authority/principal/:entityId
GET /authority/resolve
GET /authority/:id/timeline

Resolution inputs: principal, context, requested decision/action class, resource/scope and time.

Resolution must expose reasoning inputs and uncertainty.

ACTIVE + valid source + matching scope + valid time -> RESOLVED
missing evidence/source -> PARTIAL or UNKNOWN
external governance unavailable -> UNAVAILABLE
contradictory sources -> CONFLICTED
expired -> EXPIRED
revoked -> REVOKED
mandatory constraint violation -> DENIED

UNKNOWN is not FALSE. UNAVAILABLE is not FALSE. CONFLICTED is not permission.

## Boundaries

Capability describes ability.
Authority describes governed source/right to make a decision.
Authorization makes the concrete decision.

CAPABILITY + AUTHORITY + CONTEXT + POLICY -> AUTHORIZATION

Authority MUST NOT directly unlock, open, grant entry, initiate payment, or execute a service.

Invalid references fail closed. Historical and revoked states remain auditable. External outages never become fabricated truth.

**AUTHORITY PROVIDES GOVERNED DECISION SOURCE; AUTHORIZATION DECIDES THE CONCRETE REQUEST.**

**NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.**
