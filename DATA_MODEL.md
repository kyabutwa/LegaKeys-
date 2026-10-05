# LEGAKEYS — CANONICAL DATA MODEL

## v1.1.0 community identity correction

Community is a first-class entity and BeatIdentity. Person identity is never duplicated when a person joins multiple communities. Community creation creates a COMMUNITY identity/account/workspace independently; person participation is represented only when a person explicitly joins or is otherwise authorized to participate.

**Status:** Canonical  
**Version:** 1.0  
**Owner:** United of Balega  
**Governance:** Supreme Executive Council 9

## 1. Purpose

LegaKeys requires one canonical semantic data model underneath every service, workspace, intelligence capability and interface.

The model is relationship-first, provenance-aware, temporal, extensible and authorization-aware. It draws from the strongest benchmark patterns: ServiceNow's common service vocabulary and cross-workflow consistency; Salesforce and Microsoft Dataverse's explicit objects, relationships and cardinality; and Apple CloudKit's durable record identity, references and bounded atomic record operations. These patterns are adapted to LegaKeys rather than copied. citeturn0search0turn0search3turn0search1turn0search6

## 2. Canonical backbone

~~~text
WORLD
  ↓
ENTITY
  ↓
BEATIDENTITY
  ↓
PARTICIPATION
  ↓
PARTICIPANT
  ↓
RELATIONSHIP
  ↓
CONTEXT
  ↓
CAPABILITY
  ↓
POLICY
  ↓
AUTHORIZATION
  ↓
BEATACCESS / SERVICE
  ↓
INTENT → PROPOSAL → ACTION
  ↓
EVENT
  ↓
EVIDENCE
  ↓
OUTCOME
  ↓
DIGITAL TWIN
  ↓
KNOWLEDGE
  ↓
GENESIS / CONSTANTYNA
~~~

The UI may hide this complexity. The data model must not.

## 3. Entity foundation

Every represented real-world or governed conceptual object has a stable Entity ID.

Core attributes:
- Entity ID
- Entity Type
- Canonical Name
- Display Name
- Description
- Lifecycle State
- Created At
- Updated At
- Effective From
- Effective To
- Source Reference
- Provenance Reference

Canonical entity types:
- Person
- Community
- Organization
- Provider
- Place
- Service
- Resource
- Physical Entity
- Workspace
- Team

Subtype semantics remain explicit. A generic Entity reference never erases domain meaning.

## 4. BeatIdentity

~~~text
ENTITY
  ↓
BEATIDENTITY
  ↓
IDENTITY STATE + VERIFICATION + PROVENANCE
~~~

Identity contains:
- Identity ID
- Entity ID
- Identity Type
- State
- Lifecycle
- Verification State
- Provenance
- Created At
- Updated At

Legal identity, operational identity and verification evidence are separate concerns.

Supported references include government ID, passport, driving licence, organization identifier, provider identifier and place identifier.

Sensitive source documents, credentials and biometric material are referenced through protected verification systems rather than duplicated in ordinary domain tables.

## 5. Person, participation and participant

A Person is a human entity.

A Participant is a participation construct.

~~~text
PERSON
  ↓
BEATIDENTITY
  ↓
PARTICIPATION
  ↓
PARTICIPANT
~~~

Participation contains:
- Participation ID
- Identity ID
- Context ID
- Participant ID
- State
- Scope
- Effective From
- Effective To
- Provenance

Participant contains:
- Participant ID
- Identity ID
- State
- Lifecycle
- Created At

One underlying identity may have many valid participation contexts without duplicate core identities.

## 6. Account, credential and session

~~~text
IDENTITY
  ↓
ACCOUNT
  ├── CREDENTIAL
  ├── AUTHENTICATION EVENT
  └── CANONICAL SESSION
~~~

Account contains identity reference, state and lifecycle.

Credential contains type, state, verification, expiration and revocation information.

Session contains account reference, canonical-session state, creation time, expiration, revocation and last-seen state.

Authentication establishes authenticated access. It does not establish authorization.

## 7. First-class relationships

Relationships are explicit records rather than meanings hidden inside arbitrary foreign keys.

A Relationship contains:
- Relationship ID
- Subject Entity
- Relationship Type
- Object Entity
- Context
- State
- Effective From
- Effective To
- Source
- Provenance

Initial controlled vocabulary:
- IS_A
- PART_OF
- CONTAINS
- LOCATED_AT
- RESIDES_IN
- MEMBER_OF
- PARTICIPATES_IN
- WORKS_FOR
- WORKS_WITH
- OPERATES
- MANAGES
- PROVIDES
- USES
- OFFERS
- AVAILABLE_AT
- SERVES
- ASSIGNED_TO
- RESPONSIBLE_FOR
- AUTHORIZED_FOR
- DELEGATED_TO
- CONNECTED_TO
- DEPENDS_ON
- HOSTS
- OCCURRED_AT
- GENERATED
- SUPPORTED_BY
- DERIVED_FROM

Every relationship type must define permitted subject/object types, cardinality, lifecycle and whether it can carry authority semantics.

This follows the mature enterprise principle that relationships have explicit meaning and cardinality. citeturn0search3turn0search1turn0search11

## 8. Place model

Place is first-class.

~~~text
WORLD
 ↓
COUNTRY
 ↓
CITY
 ↓
COMMUNITY
 ↓
PHASE
 ↓
BUILDING
 ↓
FLOOR
 ↓
UNIT
~~~

Additional place types:
- Common Area
- Facility
- Workspace
- Access Point
- Parking Area
- Rooftop
- Shared Space

Place relationships support containment, hosting, adjacency, access and service availability without conflating location with authority.

## 9. Physical Entity and Resource

Physical Entity represents infrastructure, assets, equipment, devices, vehicles, utilities and other physical objects.

Resource represents something that may be allocated, consumed, reserved, accessed or otherwise governed.

A Physical Entity and a Resource may be related but are not interchangeable.

Physical state may include location, stewardship, lifecycle, operational state, telemetry, connectivity and maintenance state.

## 10. Context

Context is first-class.

A Context can reference:
- subject
- place
- community
- service
- workspace
- team
- purpose
- temporal scope
- operational state
- provenance

Context answers:

~~~text
WHERE
WHEN
UNDER WHAT CIRCUMSTANCES
FOR WHAT PURPOSE
WITHIN WHAT SCOPE
~~~

Context never creates authority by itself.

## 11. Capability

Capability describes what an entity, team, service or system can do or provide.

Objects:
- Capability Definition
- Capability Offering
- Capability Assignment
- Capability Availability
- Capability Condition
- Capability History

Capability contains owner, type, definition, availability, conditions, effective interval and provenance.

Examples:
- security team can respond to incidents;
- facility can accept reservations;
- provider can deliver food;
- participant can request maintenance;
- connected provider can execute a payment.

**Capability ≠ Authorization.**

## 12. Policy and authorization

Policy is first-class because authorization must never depend on undocumented application logic.

Policy objects:
- Policy
- Policy Version
- Policy Rule
- Policy Condition
- Policy Scope
- Policy Decision

Authorization contains:
- Authorization ID
- Subject
- Capability
- Resource
- Place
- Service
- Action Type
- Context
- Policy
- Policy Version
- Scope
- Conditions
- State
- Effective From
- Expiration
- Delegated From
- Approved By
- Revoked At
- Provenance

Authorization states:
- PROPOSED
- APPROVED
- REJECTED
- REVOKED
- EXPIRED

Authorization must be reproducible from subject, capability, resource, context, policy, conditions and time.

## 13. BeatAccess

Access is a governed decision, not a credential lookup.

~~~text
ACCESS REQUEST
      ↓
CREDENTIAL / RECOGNITION SIGNAL
      ↓
ACCESS EVALUATION
      ↓
AUTHORIZATION
      ↓
ACCESS DECISION
      ↓
ACCESS EVENT
~~~

Signals may originate from:
- trusted device
- Face ID
- fingerprint
- palm interface
- QR
- NFC
- PIN/code
- phase identification
- assisted verification

Permanent distinction:

~~~text
RECOGNITION / VERIFICATION
        ≠
AUTHORIZATION
        ≠
ACCESS EXECUTION
~~~

## 14. Service model

ServiceNow's CSDM shows why a shared service vocabulary is valuable across products and workflows. LegaKeys extends the same principle to living infrastructure, community operations, commerce, mobility and human services. citeturn0search0turn0search5

Canonical service objects:
- Service
- Service Capability
- Service Offering
- Service Provider
- Service Place
- Service Availability
- Service Connection
- Service Request
- Service Execution

Critical distinctions:

**Service definition ≠ provider connection ≠ availability ≠ request ≠ execution.**

A service may exist while provider connection is unavailable or current availability is unknown.

No service record may imply a live provider integration.

## 15. Intent, proposal and action

Intent represents what a participant or system is trying to accomplish.

Proposal represents a suggested or requested path.

Action represents an executable operation after authorization.

~~~text
INTENT
  ↓
PROPOSAL
  ↓
AUTHORIZATION
  ↓
ACTION
~~~

AI proposal is not action. Conversational request is not authorization.

## 16. Event and evidence

Events are historical records.

Event contains:
- Event ID
- Event Type
- Actor
- Subject
- Action
- Context
- Occurred At
- Recorded At
- Source
- Provenance
- Correlation ID

Evidence contains:
- Evidence ID
- Evidence Type
- Subject
- Event
- Source
- Observed At
- Recorded At
- Integrity Reference
- Confidence
- Verification State
- Provenance

Evidence is not automatically verified merely because it exists.

Historical events and evidence cannot be rewritten to make current state appear better.

## 17. Truth and operational state

Truth states:

~~~text
VERIFIED
DECLARED
OBSERVED
INFERRED
PROPOSED
UNKNOWN
~~~

User-facing states:

~~~text
LOADING
UNKNOWN
UNAVAILABLE
PENDING
DENIED
FAILED
EXPIRED
REVOKED
COMPLETED
~~~

**Unknown is not false.  
Unavailable is not completed.  
Pending is not successful.  
Proposed is not authorized.  
Inferred is not verified.**

## 18. Provenance and lineage

~~~text
SOURCE
  ↓
OBSERVATION / DECLARATION / EVENT
  ↓
EVIDENCE
  ↓
STATE / KNOWLEDGE
  ↓
DECISION / PROPOSAL
~~~

Provenance contains:
- Provenance ID
- Source Type
- Source Reference
- Observed At
- Received At
- Recorded At
- Transformation
- Parent Provenance
- Confidence
- Verification State

No silent transformation from UNKNOWN to VERIFIED.

## 19. Temporal model

LegaKeys distinguishes:
- Effective From
- Effective To
- Occurred At
- Observed At
- Recorded At
- Updated At
- Expires At
- Revoked At

Canonical rule:

~~~text
CURRENT STATE = latest valid projection
HISTORY       = immutable events + evidence
~~~

Current state can change. Historical truth cannot.

## 20. Digital Twin

The LegaKeys Digital Twin is a governed representation of the known world.

Objects:
- Twin Entity
- Twin Relationship
- Twin State
- Observation
- Telemetry
- State Transition
- Provenance

Twin state carries value, truth state, source, observed time, update time, confidence, freshness and provenance.

The Digital Twin can represent known, unknown, observed, declared, inferred and proposed state.

It never creates authority.

## 21. Knowledge and intelligence

~~~text
EVIDENCE
  ↓
EVENT / OBSERVATION
  ↓
KNOWLEDGE
  ↓
GENESIS REASONING
  ↓
PROPOSAL
~~~

Knowledge retains claim, sources, derivation, confidence, freshness, validity interval, truth state and provenance.

GENESIS and CONSTANTYNA consume structured governed data rather than hidden application state.

AI outputs are typed as:
- Answer
- Guidance
- Classification
- Inference
- Recommendation
- Proposal
- Escalation

AI output becomes executable only through the same authorization and action pipeline as every other consequential operation.

## 22. Outcome

Outcome represents measured results, not attempted actions.

Outcome contains:
- Outcome ID
- Objective
- Action
- Event
- Measurement
- Metric
- Value
- Unit
- Observed At
- Evidence
- State

Canonical path:

~~~text
REQUEST
 ↓
AUTHORIZATION
 ↓
WORK / SERVICE ACTION
 ↓
EVENT
 ↓
EVIDENCE
 ↓
MEASURED OUTCOME
~~~

## 23. Workspace model

LegaKeys Workspace operates LegaKeys itself.

Community Operating Workspace operates participating communities.

~~~text
LEGAKEYS WORKSPACE
  ORGANIZATION
      ↓
  WORKSPACE
      ↓
  WORKSPACE TEAM
      ↓
  PROJECT / PRODUCT / OPERATION
      ↓
  TASK / REQUEST / WORK ORDER / ISSUE

COMMUNITY OPERATING WORKSPACE
  COMMUNITY
      ↓
  OPERATING WORKSPACE
      ↓
  COMMUNITY TEAM
      ↓
  RESPONSIBILITY / ASSIGNMENT
      ↓
  REQUEST / WORK ORDER / INCIDENT / OPERATION
~~~

Membership is a relationship, not authority.

Cross-workspace interaction must be mediated through:

~~~text
BEATIDENTITY
 ↓
RELATIONSHIP
 ↓
CONTEXT
 ↓
CAPABILITY
 ↓
AUTHORIZATION
~~~

## 24. Data ownership and scope

Canonical ownership:
- participant controls participant data;
- community controls community data;
- organization controls organization data;
- provider controls provider data;
- LegaKeys governs infrastructure processing according to authorization, purpose, scope and applicable governance.

Supported scopes:
- global
- organization
- community
- workspace
- team
- place
- service
- participant

Scope does not itself create authority.

## 25. Identity resolution

Rules:
1. Do not duplicate core identity because context differs.
2. Do not merge identities solely because names appear similar.
3. Do not treat inferred matching as verified legal identity.
4. Preserve merge/split history.
5. Preserve source references.
6. Require governed evidence for high-impact identity merges.

~~~text
ONE UNDERLYING IDENTITY
        ↓
MANY VALID PARTICIPATION CONTEXTS
~~~

## 26. External integration model

~~~text
EXTERNAL SYSTEM
      ↓
INTEGRATION
      ↓
CONNECTION
      ↓
CAPABILITY
      ↓
PROVIDER / SERVICE
~~~

A connection records system, connector, capability, environment, state, last successful interaction, failure state, credential reference and provenance.

Declared integration is not connected integration.

## 27. Transaction and idempotency model

Consequential operations require:
- Request ID
- Authorization ID
- Action ID
- Event ID
- Correlation ID
- Idempotency Key

Retries must not duplicate payments, access grants, bookings, work orders or other consequential actions.

Where atomicity is available, related writes should commit as one governed unit. Where distributed systems prevent atomicity, explicit state transitions, idempotency and reconciliation are mandatory.

CloudKit's record-zone model illustrates the value of bounded atomic record operations; LegaKeys adopts the transaction principle without adopting CloudKit as its storage model. citeturn0search2turn0search6

## 28. Physical persistence strategy

~~~text
                 LEGAKEYS DATA PLATFORM
                         │
       ┌─────────────────┼──────────────────┐
       ▼                 ▼                  ▼
SYSTEM OF RECORD    EVENT / EVIDENCE    SEARCH / INDEX
       │                 │                  │
 relational core    append-oriented     derived discovery
       │                 │                  │
       └────────────────┼──────────────────┘
                        ▼
                   DIGITAL TWIN
                        │
                        ▼
                   KNOWLEDGE /
                   INTELLIGENCE
~~~

The relational core is authoritative for governed transactional entities and authorization.

Event/evidence storage preserves historical integrity.

Search indexes are derived projections.

Digital Twin and intelligence are derived representations.

No search index, cache, AI context or UI state becomes the system of record merely because it is convenient.

## 29. Canonical object families

**Identity:** Entity, Identity, Person, Account, Credential, Session, Participant, Participation, Verification

**World:** Community, Organization, Provider, Place, Physical Entity, Resource

**Relationship:** Relationship, Context, Membership, Assignment

**Capability & Authority:** Capability, Capability Offering, Policy, Policy Version, Authorization, Delegation

**Access:** Access Request, Credential Signal, Access Evaluation, Access Decision, Access Event

**Services:** Service, Service Capability, Service Offering, Service Provider, Service Connection, Service Request, Service Execution

**Execution:** Intent, Proposal, Action, Event, Evidence, Outcome

**Intelligence:** Observation, State, Knowledge, Inference, Recommendation

**Digital Twin:** Twin Entity, Twin Relationship, Twin State, State Transition, Telemetry

**Operations:** Workspace, Team, Project, Task, Work Order, Incident, Assignment

## 30. Cardinality

The model supports:
- one-to-one
- one-to-many
- many-to-one
- many-to-many
- temporal relationships

Examples:

~~~text
Community   1 ─── N Place
Person      1 ─── N Participation
Provider    N ─── N Service
Participant N ─── N Context
Team        N ─── N Capability
~~~

Cardinality is explicit in schema metadata rather than inferred from UI behavior. Salesforce and Dataverse use explicit relationship semantics and cardinality as core modeling concepts. citeturn0search3turn0search1

## 31. Security boundary

Sensitive credentials, authentication secrets and biometric material are isolated from ordinary domain records.

Preferred pattern:

~~~text
PERSON
  ↓
IDENTITY
  ↓
VERIFICATION REFERENCE
  ↓
PROTECTED VERIFICATION SYSTEM
~~~

Never store raw biometric material as an ordinary payment or access attribute.

## 32. Non-negotiable data invariants

1. Every governed entity has stable identity.
2. Identity ≠ Account.
3. Account ≠ Participant.
4. Participant ≠ Role.
5. Role ≠ Authority.
6. Participation is contextual.
7. Relationships have explicit semantics.
8. Context never creates authority.
9. Capability never creates authorization.
10. Authorization is first-class data.
11. Access decisions reference authorization.
12. Service definition, provider, connection, availability, request and execution remain distinct.
13. Events preserve historical truth.
14. Evidence preserves provenance.
15. Current state does not overwrite history.
16. Digital Twin does not create authority.
17. Search indexes are not systems of record.
18. AI output is not authorization.
19. AI proposal is not action.
20. UNKNOWN remains representable.
21. UNAVAILABLE remains representable.
22. External connections are explicit and truthful.
23. Consequential operations are idempotent or reconciliable.
24. Policy versions are auditable.
25. Sensitive credentials and biometric material are isolated.
26. Community scope does not imply system-wide authority.
27. Workspace membership does not imply authority.
28. Historical records cannot be silently rewritten.
29. Data lineage survives derived transformations.
30. **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**

## 33. Final canonical model

~~~text
                         LEGAKEYS
                            │
                          WORLD
                            │
                         ENTITY
                            │
                       BEATIDENTITY
                            │
                      PARTICIPATION
                            │
                       PARTICIPANT
                            │
                       RELATIONSHIP
                            │
                         CONTEXT
                            │
                       CAPABILITY
                            │
                          POLICY
                            │
                      AUTHORIZATION
                       /          \
                 BEATACCESS      SERVICES
                                 /
                          ACTION
                            │
                          EVENT
                            │
                         EVIDENCE
                            │
                       DIGITAL TWIN
                            │
                        KNOWLEDGE
                       /         \
                CONSTANTYNA     GENESIS
                                /
                         PROPOSAL
                            │
                         OUTCOME
~~~

## 34. Final principle

**Simple surface. Rigorous substrate.**

A participant may see:

~~~text
Maintenance request
Water issue · Building 2
Requires review
Review →
~~~

while LegaKeys preserves the complete governed chain underneath:

~~~text
PARTICIPANT
→ CONTEXT
→ PLACE
→ SERVICE
→ INTENT
→ PROPOSAL
→ POLICY
→ AUTHORIZATION
→ ACTION
→ EVENT
→ EVIDENCE
→ OUTCOME
~~~

The data model is canonical when every new feature can map cleanly to these objects, relationships, states, provenance rules and authorization boundaries without inventing a parallel model.
