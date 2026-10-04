# LegaKeys Digital Twin — Service Contract

## 1. Commands

### Register Twin
Input:
- twinId
- subjectRef
- modelRef
- scope
- purpose
- provenance
- correlationId

Rules:
- subject must resolve to a governed entity reference
- duplicate registration is idempotent
- registration creates no authority

### Ingest Observation
Input:
- observationId
- twinId / subjectRef
- observedAt
- receivedAt
- sourceRef
- payload
- truthState
- provenance
- quality
- correlationId

Rules:
- original observation is preserved
- source and acquisition times are distinct
- malformed or untrusted data is quarantined
- observation does not automatically become VERIFIED

### Apply State Update
Input:
- twinId
- property/path
- value
- effectiveAt
- truthState
- sourceRef
- evidenceRefs
- correlationId

Rules:
- temporal validity is evaluated
- stale updates cannot silently overwrite fresher state
- UNKNOWN may replace stale knowledge when policy requires it
- history is append-only

### Upsert Relationship
Input:
- sourceTwinId
- targetTwinId
- relationshipType
- validity
- truthState
- provenance

Rules:
- both endpoints must resolve
- relationship scope must be valid
- relationship never creates authorization

### Record Transition
Input:
- twinId
- prior state reference
- new state
- effectiveAt
- eventRef
- evidenceRefs
- reason
- provenance

Rules:
- immutable transition record
- prior state remains traceable
- correction creates a new transition

### Reconcile
Input:
- twinId
- sourceRefs
- policyRef
- correlationId

Output:
- reconciled state
- conflicts
- UNKNOWN fields
- provenance
- reconciliation status

Conflicting sources must not be silently merged into false certainty.

## 2. Queries

### Get Twin
Returns:
- identity
- model
- current state
- freshness
- truth labels
- governance scope
- provenance summary

### Get Twin Graph
Returns:
- nodes
- edges
- temporal validity
- truth state
- provenance summary

### Get History
Returns immutable transitions/events/evidence references.

### Get State As Of
Returns the state projection valid for a specified time.

### Get Provenance
Returns source and lineage chain for a property or state claim.

### Get Unknowns
Returns fields whose current status is UNKNOWN, STALE, CONFLICTED or otherwise insufficiently established.

### Get Scenario
Returns simulated/proposed state separately from observed/current state.

## 3. Freshness

Freshness is explicit. A source update may be:
CURRENT, STALE, EXPIRED, UNKNOWN or CONFLICTED.

The system never infers continued presence merely because an earlier observation existed.

## 4. Conflict resolution

Preferred order is policy-driven, not hard-coded as “newest always wins.”

A reconciliation policy may consider:
1. source trust classification
2. scope
3. observation method
4. timestamp quality
5. freshness
6. verification status
7. evidence quality
8. consistency with known constraints

Unresolved material conflict remains CONFLICTED/UNKNOWN.

## 5. Provenance

Every externally sourced or derived claim should be traceable to:
source → acquisition → transformation → state claim → downstream projection.

Derived claims include model/version and input references.

## 6. Scenario boundary

Simulation/forecast/what-if data must include:
- scenarioId
- base state reference
- assumptions
- model/version
- createdAt
- validUntil
- output truth state
- provenance

Scenario output cannot overwrite current state.

## 7. External integrations

Adapter contract:
- provider/source identity
- adapter version
- supported entity types
- supported properties
- read/write classification
- freshness
- provenance
- failure behavior
- scope
- credential reference outside twin payload

No adapter may fabricate a provider response or authorization.

## 8. Authorization boundary

Reads are subject to data scope and privacy policy. Consequential writes outside the twin domain require the normal Authorization → Action Runtime path.

The Digital Twin can prepare context for authorization but cannot make the authorization decision.

## 9. Failure states

Supported states:
LOADING, UNKNOWN, UNAVAILABLE, STALE, CONFLICTED, PENDING, DEGRADED, FAILED, COMPLETED.

Failure to synchronize does not equal physical failure.

## 10. Idempotency

Ingestion and state application use source/event IDs and idempotency keys where applicable. Replayed observations must not create duplicate logical transitions.

## 11. Canonical APIs

POST /digital-twins
POST /digital-twins/:id/observations
POST /digital-twins/:id/state
POST /digital-twins/:id/relationships
POST /digital-twins/:id/reconcile
GET /digital-twins/:id
GET /digital-twins/:id/graph
GET /digital-twins/:id/history
GET /digital-twins/:id/provenance
GET /digital-twins/:id/unknowns
GET /digital-twins/:id/as-of/:timestamp
