# BEATACCESS SERVICE CONTRACT

## Contract

BEATACCESS enforces an existing authorization decision against a declared access-controlled endpoint.

It is an enforcement and integration boundary, not a policy-decision authority.

## Commands

### POST /beataccess/access-points

Register a declared access point.

Required:

- access point identity
- access point type
- world/place reference
- controller/provider reference
- lifecycle state
- provenance

No registration implies that the endpoint is reachable or operational.

### POST /beataccess/access-points/:id/credentials

Register a non-secret credential reference.

The service stores metadata/reference only.

Raw passwords, private keys, bearer secrets and raw biometric material MUST NOT be persisted here.

### POST /beataccess/operations

Create an access operation request.

Required:

- request ID
- principal
- authorization ID
- action type
- target
- access point
- credential/device presentation reference
- idempotency key

The request is not yet an access command.

### POST /beataccess/operations/:id/validate

Validate the authorization binding and access conditions immediately before command issuance.

The validator MUST re-check:

- authorization decision
- expiry/revocation
- principal
- action
- target
- access point scope
- required conditions
- credential binding
- replay/consumption state
- execution deadline

### POST /beataccess/operations/:id/execute

Issue a command to the declared access adapter only after successful validation.

Possible command states:

- COMMAND_ACCEPTED
- COMMAND_REJECTED
- CONTROLLER_UNAVAILABLE
- PROVIDER_UNAVAILABLE
- TIMEOUT
- FAILED

This endpoint MUST NOT itself create authorization.

### POST /beataccess/operations/:id/reconcile

Reconcile an operation whose physical result was not immediately known.

It may consume controller/provider evidence and resolve:

- ACCESS_GRANTED
- ACCESS_DENIED
- UNKNOWN
- FAULT

Reconciliation MUST NOT rewrite the original command response.

### POST /beataccess/operations/:id/revoke

Stop a pending/eligible access operation when supported.

Revocation cannot rewrite a completed physical event.

### POST /beataccess/access-points/:id/state

Record declared/observed controller and access-point state.

Truth state must remain explicit.

## Queries

### GET /beataccess/access-points/:id

Return access-point metadata and bounded operational state.

### GET /beataccess/access-points/:id/operations

Return access operations subject to scope.

### GET /beataccess/operations/:id

Return the operation, authorization binding and physical result state.

### GET /beataccess/operations/:id/timeline

Return immutable operation history.

### GET /beataccess/access-points/:id/diagnostics

Return safe diagnostics without exposing secrets.

### POST /beataccess/evaluate

Resolve whether a principal's existing authorization can be applied to a named access point at a specified time.

This is an enforcement preflight, not an authorization grant.

## Adapter contract

Each provider/controller adapter MUST expose a normalized contract:

- provider ID
- controller ID
- access point ID
- supported operation
- request correlation ID
- idempotency/command ID
- accepted/rejected state
- provider timestamp
- provider reference
- physical result where available
- failure code

Adapters MUST NOT translate provider availability into authorization.

## Credential contract

A credential presentation is valid only when:

1. credential reference is known;
2. credential lifecycle permits presentation;
3. credential is bound to the principal where required;
4. presentation is valid for the operation;
5. anti-replay rules pass;
6. authorization independently allows the operation.

Credential validity cannot substitute for authorization.

## Command idempotency

A consequential access command MUST have a unique command/idempotency key.

Retry behavior MUST be provider-aware.

If the provider cannot guarantee safe retry semantics, BEATACCESS MUST NOT blindly resend an unknown command.

The operation remains UNKNOWN/PENDING until reconciled.

## Controller failure

Examples:

- provider unavailable
- controller offline
- reader offline
- lock fault
- network timeout
- malformed provider response
- credential rejected
- access point disabled

Each becomes an explicit state.

No failure may be converted into ACCESS_GRANTED.

## Fail-closed

If authorization binding cannot be established, command issuance is rejected.

If a mandatory security condition is UNKNOWN, command issuance is rejected unless an explicit emergency policy permits a bounded alternate path.

## Physical result semantics

```
AUTHORIZATION ALLOW
      ↓
COMMAND ACCEPTED
      ↓
      ├── ACCESS GRANTED
      ├── ACCESS DENIED
      ├── TIMEOUT
      ├── FAULT
      └── UNKNOWN
```

COMMAND_ACCEPTED is not ACCESS_GRANTED.

## Event/evidence boundary

BEATACCESS produces references for downstream EVENT/EVIDENCE recording.

It must preserve:

- request ID
- authorization ID
- operation ID
- command ID
- provider/controller reference
- timestamps
- result
- failure code
- evidence reference

History is append-oriented and must not be silently rewritten.

## Security

No client field may:

- force execution
- replace authorization ID with an arbitrary ALLOW
- change the authorized target
- expand access scope
- disable replay protection
- suppress audit evidence
- select an untrusted provider

## Canonical invariant

NO AUTHORIZATION → NO ACCESS COMMAND.
