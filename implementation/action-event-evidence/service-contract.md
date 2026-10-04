# Action / Event / Evidence Runtime Contract

## Canonical command
POST /actions

Required: principal, action type, target/resource, context, capability, authorization reference, idempotency key, parameters and execution deadline.

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

## Execution contract
execute must:
1. resolve the canonical action;
2. verify idempotency;
3. revalidate authorization, scope, target, conditions and deadline;
4. enter the execution boundary;
5. execute once from LegaKeys perspective;
6. append resulting event(s);
7. persist evidence references;
8. derive the outcome;
9. release the execution boundary.

A provider timeout cannot become success.

## Event contract
Every material transition has event_id, action_id, event_type, principal, occurred_at, recorded_at, correlation_id, causation_id, truth_state, source, payload/reference and sequence. Events are immutable.

## Evidence contract
Evidence contains evidence_id, action/event reference, type, truth_state, source, source_reference, capture/receipt times, content/reference hash, provenance, integrity and retention classification. Sensitive payloads use protected references.

## Outcome
Separates requested result, observed result, normalized result, truth state, evidence sufficiency and reconciliation state. COMPLETED requires sufficient action-specific evidence.

## Failure
DENIED, EXPIRED, REVOKED, FAILED, UNKNOWN and UNAVAILABLE are first-class. Reconciliation appends facts rather than rewriting history.

Authorization decides. Action records the attempt. Service/BeatAccess performs. Event records. Evidence supports. Outcome interprets.
