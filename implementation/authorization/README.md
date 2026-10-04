# AUTHORIZATION

## Purpose

AUTHORIZATION is the governed decision layer that determines whether a specific consequential request is permitted.

Authorization evaluates a concrete request against:

- principal / participant
- requested action
- capability
- authority
- context
- policy
- scope
- conditions
- temporal validity
- resource/service
- risk and required evidence

Authorization is the only layer in the canonical model that may produce an execution-permitting decision. It does not itself perform the action.

## Canonical position

```
WORLD
  ↓
IDENTITY / PARTICIPATION
  ↓
CONTEXT
  ↓
CAPABILITY
  ↓
AUTHORITY
  ↓
AUTHORIZATION
  ↓
BEATACCESS / SERVICE
  ↓
ACTION
  ↓
EVENT
  ↓
EVIDENCE
```

## Decision question

AUTHORIZATION answers:

> May this principal perform this specific action, against this specific target, in this context, under this authority and policy, now?

It does NOT answer:

- who a person is
- what an entity is capable of
- where an entity is
- what authority exists in the abstract
- how a consequential action is executed

## Non-negotiable distinctions

- Authentication ≠ Authorization
- Identity ≠ Authorization
- Participation ≠ Authorization
- Role ≠ Authorization
- Capability ≠ Authorization
- Authority ≠ Authorization
- Context ≠ Authorization
- Subscription ≠ Authorization
- Interface ≠ Authorization
- Digital Twin ≠ Authorization
- GENESIS ≠ Authorization
- CONSTANTYNA ≠ Authorization
- Authorization decision ≠ Action execution
- Recognition ≠ Authorization
- Policy proposal ≠ active policy

## Decision model

```
PRINCIPAL
  +
ACTION
  +
TARGET
  +
CONTEXT
  +
CAPABILITY
  +
AUTHORITY
  +
POLICY
  +
SCOPE
  +
CONDITIONS
  +
TIME
  +
EVIDENCE
       ↓
AUTHORIZATION EVALUATION
       ↓
ALLOW | DENY | STEP_UP | PENDING | UNKNOWN | UNAVAILABLE
       ↓
EXECUTION GATE
       ↓
ACTION
```

A decision of ALLOW is a bounded permission, not a permanent role.

## Fail-closed principle

A consequential request MUST NOT become ALLOW merely because information is missing.

At minimum:

- missing principal → DENY
- missing target → DENY
- missing action → DENY
- missing applicable authority → DENY
- missing required capability → DENY
- expired authority → DENY
- expired authorization → DENY
- revoked authority → DENY
- failed mandatory policy evaluation → DENY
- unresolved critical external state → UNKNOWN/UNAVAILABLE and no execution
- conflicting authoritative policy → DENY or explicit escalation
- insufficient evidence for a policy requiring evidence → DENY or STEP_UP

## Scope

Authorization scope is explicit and may include:

- entity
- participant
- community
- organization
- place
- building
- phase
- unit
- facility
- service
- resource
- action type
- time window
- policy version

Containment, location, relationship, or membership never silently expands scope.

## Delegation

Authorization may rely on delegated authority only when:

1. delegation is valid;
2. delegator is authorized to delegate;
3. delegatee is the requesting principal or valid intermediary;
4. delegation scope covers the request;
5. delegation has not expired/revoked;
6. constraints are satisfied;
7. lineage is retained.

Delegation MUST NOT create authority beyond the delegator's permitted boundary.

## Conditions

Conditions are first-class decision inputs.

Examples:

- time window
- place
- relationship
- approval requirement
- dual-control requirement
- resource state
- service state
- evidence requirement
- risk threshold
- purpose
- emergency mode
- external provider state

A condition that is required but unknown MUST NOT silently evaluate true.

## Policy versioning

Every consequential decision records the policy version(s) used.

Policy changes MUST NOT rewrite historical decisions.

A later policy version may produce a different result for a new request without mutating the historical record.

## Explainability

Every non-trivial decision SHOULD expose a machine-readable reason set:

- matched rules
- missing requirements
- satisfied conditions
- failed conditions
- authority chain
- capability evidence
- scope evaluation
- policy version
- decision timestamp
- expiry
- correlation/request IDs

Explanations MUST NOT disclose secrets or restricted evidence beyond the requester's permitted visibility.

## AI boundary

GENESIS and CONSTANTYNA may:

- prepare authorization context
- explain decisions
- detect missing information
- propose policy or authorization changes
- request human approval

They may NOT:

- grant themselves authorization
- override a DENY
- turn UNKNOWN into ALLOW
- invent authority
- fabricate evidence
- bypass the execution gate

## Execution gate

The execution gate accepts only a valid authorization decision whose:

- decision is ALLOW;
- authorization is active;
- expiry has not passed;
- scope matches the action;
- conditions remain satisfied;
- policy version is valid for execution;
- request/action identity is bound;
- idempotency constraints are satisfied.

Otherwise:

```
NO AUTHORIZATION → NO CONSEQUENTIAL ACTION
```
