# LEGAKEYS — PLATFORM FOUNDATION MODEL

## 1. Canonical platform object model

Every platform object should belong to one of these object families.

### Identity objects

- Identity
- Account
- Credential
- Session
- Participant
- Verification

### World objects

- Person
- Community
- Organization
- Provider
- Place
- Asset
- Device
- Service
- Resource
- Environment

### Relationship objects

- Relationship
- Membership
- Assignment
- Affiliation
- Occupancy
- Ownership reference
- Provider relationship
- Participation

### Context objects

- Personal Context
- Community Context
- Workspace Context
- Team Context
- Place Context
- Service Context
- Temporal Context
- Operational Context
- Emergency Context

### Governance objects

- Capability
- Authority
- Policy
- Condition
- Delegation
- Approval
- Revocation
- Scope

### Work objects

- Request
- Intent
- Proposal
- Task
- Work Order
- Assignment
- Incident
- Inspection
- Reservation

### Execution objects

- Authorization Decision
- Action
- Event
- Evidence
- Outcome

### Intelligence objects

- Observation
- Knowledge
- Insight
- Recommendation
- Proposal
- Forecast
- Scenario

### Twin objects

- Entity State
- Operational State
- Availability
- Capacity
- Health
- Utilization
- Provenance
- Truth State
- Historical Record

## 2. Platform state machine

A consequential operation follows:

```
DISCOVER
   ↓
UNDERSTAND
   ↓
REQUEST
   ↓
PROPOSE
   ↓
AUTHORIZE
   ↓
EXECUTE
   ↓
RECORD
   ↓
MEASURE
   ↓
LEARN
```

The UI must never imply that a proposal, authorization or execution has happened when it has not.

## 3. Truth-state model

Every dynamic or externally sourced platform statement should be classifiable as:

- VERIFIED
- DECLARED
- OBSERVED
- INFERRED
- PROPOSED
- UNKNOWN

The UI should expose truth state where it materially changes a user's decision.

Examples:

- **Verified** — identity verified against approved evidence
- **Declared** — provider declares a service capability
- **Observed** — device or system reported a state
- **Inferred** — platform derives a likely condition
- **Proposed** — intelligence recommends an action
- **Unknown** — platform does not have sufficient evidence

## 4. Authorization decision model

A consequential authorization decision should resolve:

```
SUBJECT
+ PARTICIPANT
+ CAPABILITY
+ RESOURCE / PLACE / SERVICE
+ ACTION
+ CONTEXT
+ POLICY
+ CONDITIONS
+ SCOPE
+ EFFECTIVE TIME
+ EXPIRATION
+ REVOCATION
+ APPROVAL CHAIN
= AUTHORIZATION DECISION
```

Decision states:

- PROPOSED
- APPROVED
- REJECTED
- REVOKED
- EXPIRED

## 5. Experience model

The shell should have:

```
TOP
├── Brand
├── Active Context
├── Search
└── Notifications / Account

MAIN
├── Home
├── Places
├── Services
├── Activity
└── Workspaces

GLOBAL
├── Assistant
├── Search
├── Create / Request
└── Identity

ADVANCED
├── Governance
├── Access
├── Integrations
├── Evidence
├── Digital Twin
└── Administration
```

The platform should progressively disclose complexity.

A resident should not need to understand authority graphs to request maintenance.

A community operator should not need to understand database tables to assign a work order.

An engineer should be able to reach the deeper model when needed.

## 6. Home model

The default home is not a dashboard full of charts.

It is a prioritized operational surface:

```
GOOD MORNING / GOOD EVENING
ACTIVE CONTEXT
│
├── What needs your attention?
├── What can you do now?
├── What changed?
├── What is scheduled?
├── What is happening nearby?
└── Ask LegaKeys
```

Cards should be generated from real state and should disappear when their underlying state no longer exists.

## 7. Service model

Every service page follows:

```
SERVICE IDENTITY
↓
DECLARED CAPABILITIES
↓
CURRENT CONNECTION STATE
↓
ELIGIBILITY / AUTHORIZATION
↓
REQUEST / ACTION
↓
EVENT
↓
EVIDENCE
↓
OUTCOME
```

If a provider is unavailable, the interface must say so.

If availability is unknown, the interface must say so.

If execution is pending, the interface must not say completed.

## 8. Place model

Places are first-class platform entities.

```
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
 ↓
COMMON AREA / FACILITY / ACCESS POINT
```

Each place can expose:

- identity
- relationships
- capabilities
- access rules
- services
- assets
- current state
- historical events
- evidence
- intelligence

## 9. Workspace model

### LegaKeys Workspace

Optimized for building and operating LegaKeys.

Primary views:

- Overview
- Work
- Projects
- Teams
- Services
- Incidents
- Intelligence
- Evidence
- Governance
- Infrastructure

### Community Operating Workspace

Optimized for operating a participating community.

Primary views:

- Community Overview
- People
- Places
- Requests
- Work Orders
- Teams
- Access
- Visitors
- Deliveries
- Facilities
- Maintenance
- Incidents
- Services
- Governance
- Evidence

They share platform primitives but never share implicit authority.

## 10. Intelligence model

### CONSTANTYNA

Human-facing intelligence:

```
LANGUAGE
→ MEANING
→ CONVERSATION
→ INTENT
→ NEED
→ CONTEXT
→ RESPONSE / REQUEST
```

### GENESIS

World-facing intelligence:

```
OBSERVATION
→ WORLD MODEL
→ CONTEXT
→ REASONING
→ PROPOSAL
→ MEASUREMENT
→ LEARNING
```

### Combined

```
PERSON
 ↓
CONSTANTYNA
 ↓
REQUEST / INTENT
 ↓
GENESIS
 ↓
WORLD / DIGITAL TWIN
 ↓
PROPOSAL
 ↓
AUTHORIZATION
 ↓
ACTION
```

Neither intelligence system bypasses authority.

## 11. Notification model

Notifications are event-driven, not attention spam.

Types:

- Required action
- Approval needed
- Security
- Service update
- Schedule
- Incident
- Payment
- Delivery
- Visitor
- Maintenance
- Intelligence recommendation
- Community update

Each notification has:

- source
- event
- context
- urgency
- recipient
- truth state
- actionability
- expiration
- evidence reference

## 12. Search model

Universal search resolves:

- people
- places
- services
- providers
- work
- documents
- events
- evidence
- policies
- teams
- requests
- assets

Search should return context-aware results without granting access.

**Search visibility ≠ authorization.**

## 13. Platform navigation principle

Navigation should remain stable while the platform grows.

Preferred primary navigation:

**Home · Places · Services · Activity · Workspaces**

Assistant and Search are global capabilities.

Profile/Identity remains persistent.

Advanced governance remains discoverable but does not dominate the consumer experience.

## 14. Design language

### Visual hierarchy

- deep navy as the primary system foundation
- white for primary text on dark surfaces
- dark navy for primary text on light surfaces
- green for titles, orientation, positive states and LegaKeys identity accents
- restrained neutral surfaces
- minimal decorative noise
- high contrast
- generous spacing
- clear typography
- layered cards rather than card grids everywhere

### Interaction principles

- one obvious primary action
- progressive disclosure
- clear current context
- explicit state
- reversible actions where possible
- confirmation for consequential actions
- immediate feedback after actions
- no hidden loading state
- no invisible text
- no content cut off on mobile
- touch targets suitable for iPhone
- keyboard and screen-reader accessibility

## 15. Platform maturity checklist

Before calling a foundation production-ready:

### Identity
- canonical identity
- account separation
- participant model
- session lifecycle
- verification state

### Governance
- explicit authorization
- policy evaluation
- scope
- expiration
- revocation
- audit

### Data
- truth state
- provenance
- freshness
- ownership
- retention
- history

### Operations
- request
- work
- assignment
- incident
- event
- evidence

### Intelligence
- context-aware conversation
- world model
- uncertainty
- proposals
- human review
- authority boundary

### Experience
- mobile-first
- responsive
- accessible
- fast
- coherent
- calm
- progressive disclosure

### Integration
- explicit provider state
- adapter boundaries
- no fake connection
- no fake success
- idempotent consequential actions
- reconciliation where transactions exist

## Final platform equation

```
IDENTITY
+
PARTICIPATION
+
CONTEXT
+
CAPABILITY
+
AUTHORITY
+
PLACE
+
SERVICE
+
ACTION
+
EVENT
+
EVIDENCE
+
INTELLIGENCE
=
TRUSTED LIVING PLATFORM
```
