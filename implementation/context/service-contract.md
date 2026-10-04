# Context Service Contract

## Purpose

The Context service creates and resolves governed situational context. It provides semantic scope for downstream Capability, Policy and Authority decisions without making those decisions itself.

## Commands

POST /context — create a context.
POST /context/:id/participants — attach a participant/reference.
POST /context/:id/relationships — attach a governed relationship reference.
POST /context/:id/conditions — record a contextual condition with truth state and provenance.
POST /context/:id/scope — add or change explicit scope.
POST /context/:id/close — close a context without deleting history.

## Queries

GET /context/:id — retrieve canonical context.
GET /context/:id/participants — retrieve participants/references.
GET /context/:id/relationships — retrieve contextual relationships.
GET /context/:id/conditions — retrieve conditions and provenance.
GET /context/:id/timeline — retrieve temporal history.
GET /context/resolve — resolve relevant contexts for a governed request.

## Context resolution

Resolution may use:
- participant identity
- participation
- place
- relationship
- requested purpose
- time
- declared conditions
- observed conditions
- service/resource references

Resolution must return evidence and truth state for relevant facts.

## Truth boundary

UNKNOWN is not FALSE.
INFERRED is not VERIFIED.
PROPOSED is not ACTIVE.

Context resolution must never silently promote a weaker truth state.

## Authorization boundary

Context may be supplied to Authorization as decision input. Context itself never grants authorization, access or consequential execution.

A context such as "resident at Unit A", "visitor at Building B", or "maintenance worker at Facility C" is descriptive. The Authority layer decides whether any consequential action is permitted.

## Idempotency and consistency

Create/attach/condition commands require request identity and idempotency semantics. Context updates must not silently overwrite historical conditions. Concurrent writes use transactional consistency.

## Failure behavior

Missing World or Identity references fail closed for governed commands.
Unknown external state remains UNKNOWN/UNAVAILABLE.
Provider absence never creates fabricated context.
Cross-scope references require explicit scope validation.

## Output contract

Context resolution returns:
- contextId
- contextType
- scope
- actor/subject references
- relevant World/Identity references
- purpose
- time window
- conditions
- truth states
- provenance
- resolution status

It does not return an authorization grant.
