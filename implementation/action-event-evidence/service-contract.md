# Action / Event / Evidence Runtime Contract

## Canonical command
POST /actions

Required: principal, action type, target/resource, context, capability, authorization reference, idempotency key, parameters and execution deadline.

## Runtime boundary
The runtime is split into short database transactions around a potentially slow executor:

1. Lock/load the canonical Action.
2. Validate idempotency and terminal state.
3. Revalidate authorization, scope, target, conditions and deadline.
4. Atomically claim the execution slot.
5. Commit the claim.
6. Execute the declared Service or BeatAccess adapter outside the DB transaction.
7. Atomically persist execution result + Event(s) + Evidence + Outcome + Outbox record.
8. Publish asynchronously from the Outbox with idempotent consumers.

A provider/controller call MUST NOT hold the relational transaction open.

## Runtime endpoints
POST /actions/:id/validate
POST /actions/:id/execute
POST /actions/:id/cancel
POST /actions/:id/reconcile
GET /actions/:id
GET /actions/:id/timeline
GET /actions/:id/events
GET /actions/:id/evidence
GET /actions/:id/outcome
POST /events
POST /evidence

## Action
An Action records the governed attempt and binds:
principal + authorization + capability + context + target + purpose + deadline + idempotency + correlation.

ACCEPTED means the executor accepted the command.
SUCCEEDED means LegaKeys has established the operation completed according to its declared completion policy.
UNKNOWN means completion cannot safely be established.

## Event
Every material occurrence has:
- event ID
- event source
- event type/version
- subject
- action/request/execution references
- occurred_at and recorded_at
- correlation/causation
- truth state
- source
- payload/reference
- sequence
- integrity metadata

The envelope aligns conceptually with modern event metadata such as CloudEvents id/source/type/subject/time while remaining canonical to LegaKeys. Event history is append-only.

## Evidence
Evidence supports a claim about an action/event/outcome and contains:
evidence ID, type, truth state, source/issuer, capture/receipt time, content/reference hash where applicable, provenance, integrity and retention classification.

Sensitive payloads use protected references.

## Transactional outbox
The canonical Event and its Outbox record are committed atomically with the corresponding runtime state change. Consumers must tolerate at-least-once delivery and deduplicate by source + event ID.

The broker is transport, not canonical history.

## Reconciliation
UNKNOWN/TIMEOUT/DEGRADED states are resolved by new evidence and new events. Reconciliation never rewrites the original action/event history and must not blindly repeat a consequential operation.

## Outcome
Outcome separates:
requested result
→ observed result
→ normalized result
→ evidence sufficiency
→ reconciliation state.

Outcome truth cannot exceed supporting evidence.

## Failure
DENIED, EXPIRED, REVOKED, FAILED, UNKNOWN and UNAVAILABLE are first-class. A provider response is provenance-tagged input, not automatic canonical truth.

Authorization decides.
Action records the attempt.
Service/BeatAccess performs.
Event records occurrence.
Evidence supports claims.
Outcome interprets governed facts.

NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.
