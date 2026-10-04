# AUTHORIZATION SERVICE CONTRACT

## Contract

The Authorization service evaluates concrete requests against governed authority, capability, context, policy, scope, conditions, evidence, and time.

It owns:

- authorization requests
- authorization decisions
- decision reasons
- policy references
- evaluated scopes
- evaluated conditions
- decision evidence references
- delegation lineage references
- expiry/revocation
- decision history
- execution-gate validation

It does not own identity, capability definitions, authority definitions, BeatAccess execution, payment execution, service execution, or action execution.

## Commands

### POST /authorization/evaluate

Evaluate a concrete consequential request.

Required semantic inputs:

- principal
- action
- target
- context
- requested resource/service where applicable
- request/idempotency key

The evaluator resolves applicable:

- capability
- authority
- policy
- scope
- conditions
- temporal validity
- required evidence

Possible decisions:

- ALLOW
- DENY
- STEP_UP
- PENDING
- UNKNOWN
- UNAVAILABLE

### POST /authorization/:id/recheck

Re-evaluate a still-pending or execution-bound authorization.

A recheck MUST produce a new decision record/version rather than mutating historical evaluation evidence.

### POST /authorization/:id/revoke

Revoke an active authorization when the authorization itself is revocable.

Revocation MUST preserve historical evidence.

### POST /authorization/:id/expire

Close an authorization at its expiry boundary.

### POST /authorization/:id/evidence

Attach permitted evidence references.

### POST /authorization/:id/decision

Record a governed decision result.

This endpoint MUST NOT permit arbitrary clients to self-assert ALLOW.

## Queries

### GET /authorization/:id

Return the authorization decision and bounded explanation.

### GET /authorization/:id/reasons

Return machine-readable decision reasons subject to scope.

### GET /authorization/:id/timeline

Return immutable decision history.

### GET /authorization/resolve

Evaluate a request using the canonical decision pipeline.

### POST /authorization/execution-gate

Validate that a specific action is still covered by an active ALLOW decision.

The execution gate MUST bind:

- authorization ID
- request ID
- action ID
- principal
- target
- action type
- scope
- policy version
- expiry
- idempotency key

The gate returns ALLOWED_TO_EXECUTE or REJECTED.

It does not execute the action.

## Decision rules

The service MUST fail closed for consequential actions.

UNKNOWN or UNAVAILABLE mandatory inputs cannot become ALLOW through defaulting.

STEP_UP means additional governed verification/approval is required.

PENDING means the request has not yet reached an executable decision.

## Idempotency

Repeated evaluation of the same request/idempotency key MUST be deterministic within the defined decision boundary and MUST NOT create duplicate consequential execution rights.

The execution gate MUST reject reuse of an already-consumed one-time authorization where policy requires one-time use.

## Temporal behavior

An authorization has:

- effective time
- optional expiry
- evaluation timestamp
- optional execution deadline

Expired or revoked authorization cannot pass the execution gate.

## Cross-scope behavior

Every scope crossing MUST be explicit and policy-evaluated.

Community membership, place containment, relationship, or current location MUST NOT silently grant cross-scope authorization.

## External integrations

Provider availability, payment state, door-controller state, identity-provider state, or service availability is input—not proof of authorization.

External failures produce explicit UNKNOWN/UNAVAILABLE states.

No provider connection may be fabricated.

## Security

Sensitive evidence and policy details are returned only within permitted visibility.

Authorization decisions are auditable.

No client-provided field may directly force ALLOW.

No UI control may bypass the service or execution gate.

## Canonical invariant

NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.
