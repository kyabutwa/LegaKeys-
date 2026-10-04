# LegaKeys Services Service Contract

## Catalog

POST /services
Create a LegaKeys-owned service definition.

POST /services/:id/versions
Create a version.

POST /services/:id/offerings
Create a service offering.

POST /services/:id/capabilities
Attach declared service capabilities.

POST /services/:id/areas
Declare service availability areas.

POST /services/:id/provider-connections
Register a provider/integration connection.

POST /services/:id/availability
Record service operational availability.

## Discovery

GET /services
GET /services/:id
GET /services/:id/offerings
GET /services/:id/capabilities
GET /services/:id/areas
GET /services/:id/providers
GET /services/:id/availability

## Request and execution

POST /services/:id/requests
Create a service request. A request is not authorization.

POST /services/requests/:id/evaluate
Prepare context and authorization inputs.

POST /services/requests/:id/execute
Execute only after a current ALLOW and execution-gate validation.

POST /services/requests/:id/cancel
Cancel where policy permits.

POST /services/requests/:id/reconcile
Reconcile provider/service outcome without rewriting history.

GET /services/requests/:id
GET /services/requests/:id/timeline
GET /services/requests/:id/evidence
GET /services/requests/:id/outcome

## Provider connection contract

A provider connection includes:
- service ID
- provider ID
- adapter ID/version
- supported capability
- provider endpoint/reference
- operational state
- credential reference
- contract/version
- provenance
- health state

Provider connections cannot:
- change Beat service ownership
- grant participant authority
- expand service scope
- rewrite LegaKeys history
- invent availability
- bypass Authorization

## Request model

A service request binds:
- request ID
- participant/principal
- service ID/version
- offering
- capability
- target/place
- context
- intent/purpose
- parameters
- authorization ID
- idempotency key
- execution deadline
- provider connection when required.

## Execution states

REQUESTED → EVALUATING → AUTHORIZED → EXECUTING → ACCEPTED → COMPLETED.

Alternative states:
DENIED, PENDING, UNKNOWN, FAILED, CANCELLED, EXPIRED, REVOKED, DEGRADED.

ACCEPTED is not COMPLETED.
Provider response is not automatically the LegaKeys outcome.
UNKNOWN remains UNKNOWN.

## Provider-independent service

A Beat service can be ACTIVE with zero provider connections when its declared capability is internal/native.

A provider-dependent capability must expose provider availability explicitly.

## Outcome

Outcome records:
- requested result
- actual result
- status
- actor/system responsible
- provider response reference
- evidence
- timestamps
- provenance
- reconciliation state.

## Security invariant

NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.
