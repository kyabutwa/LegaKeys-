# CAPABILITY SERVICE CONTRACT

## Contract

The Capability service owns capability definitions, capability assertions, capability scope, capability conditions, evidence references, provenance, lifecycle, and capability resolution.

It does not own authorization or consequential execution.

## Commands

### POST /capability

Create a capability assertion for a subject.

Required semantic inputs:

- subject entity
- capability type
- truth state
- source/provenance
- effective time

Optional:

- scope
- context
- conditions
- evidence reference
- expiry

Creation MUST be idempotent under a caller-supplied request/idempotency key where applicable.

### POST /capability/:id/evidence

Attach or register evidence supporting a capability.

Evidence may establish or update truth state only through an explicit governed verification transition.

### POST /capability/:id/scope

Add or update a temporal/scope constraint.

Scope is descriptive/qualifying and does not grant authorization.

### POST /capability/:id/conditions

Add or update capability conditions.

Conditions describe when or how a capability may be considered applicable.

### POST /capability/:id/verify

Request a governed truth-state transition.

The service MUST retain:

- previous state
- new state
- evidence
- verifier/source
- timestamp
- provenance
- reason

### POST /capability/:id/suspend

Suspend capability applicability without deleting historical evidence.

### POST /capability/:id/expire

Expire a capability at its policy-defined boundary.

## Queries

### GET /capability/:id

Return canonical capability state, scope, conditions, evidence references, and provenance.

### GET /capability/subject/:entityId

Return capabilities associated with an entity.

### GET /capability/resolve

Resolve capabilities for:

- subject
- context
- capability type
- scope
- time
- required conditions

The response MUST expose uncertainty and conflicts rather than inventing a result.

### GET /capability/:id/timeline

Return lifecycle and truth-state history.

## Resolution semantics

A resolution MUST distinguish:

- RESOLVED
- PARTIAL
- UNKNOWN
- UNAVAILABLE
- CONFLICTED
- EXPIRED

Examples:

```
VERIFIED + applicable scope + valid time → RESOLVED
DECLARED + insufficient evidence → PARTIAL
missing source → UNKNOWN
external capability source unavailable → UNAVAILABLE
contradictory assertions → CONFLICTED
expired capability → EXPIRED
```

UNKNOWN is not FALSE.

UNAVAILABLE is not FALSE.

CONFLICTED is not automatically TRUE or FALSE.

## Boundary with Context

Context supplies situation, scope, time, relationships, purpose, and conditions.

Capability describes ability.

Context can qualify applicability, but cannot create a capability or authorization.

## Boundary with Authority

Authority/Authorization evaluates whether an actor may perform a consequential action.

Capability is one possible input.

```
CONTEXT + CAPABILITY + POLICY + AUTHORITY
                    ↓
              AUTHORIZATION
```

Capability alone never reaches execution.

## Boundary with BeatAccess

BeatAccess may consume an authorization decision and verified capability data.

Capability MUST NOT directly unlock, open, permit entry, or execute access.

## External providers

External systems may assert capability only with explicit source/provenance and truth state.

If a provider is unavailable:

```
availability = UNKNOWN / UNAVAILABLE
```

The service MUST NOT invent provider support or availability.

## Failure behavior

Invalid references fail closed.

Expired capabilities remain queryable as history.

Revoked/suspended capabilities remain auditable.

Conflicting assertions remain visible.

A failed capability lookup MUST NOT become authorization by default.

## Primary invariant

> **CAPABILITY DESCRIBES ABILITY; AUTHORIZATION GOVERNS CONSEQUENTIAL ACTION.**

> **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**
