# LEGAKEYS — CANONICAL PLATFORM MODEL

**Status:** CANONICAL  
**Version:** 1.2.0  
**Effective:** 2026-10-06  
**Definition:** Multi-context, identity-centric operational ecosystem

This document is the authoritative product/architecture tree for LegaKeys. Implementation, database schema, API contracts, authorization, workflows, and UI must converge on this model. Existing domain documents remain useful implementation references, but where terminology conflicts, this document wins.

## 1. Core definition

LegaKeys is a **multi-context, identity-centric operational ecosystem**.

It is not a collection of dashboards. It is a shared platform core through which one identity can operate across multiple contexts, relationships, places, capabilities, services, and workflows without duplicating the underlying identity.

### Canonical statement

> **One identity. Many contexts. Explicit relationships. Governed capabilities. Authorized operations. Verifiable outcomes.**

## 2. Canonical platform tree

```
LEGAKEYS
│
├── 00 PLATFORM FOUNDATION
│   ├── Product Model
│   ├── Architecture
│   ├── Tenancy
│   ├── Lifecycle
│   ├── Governance
│   └── Canonical Invariants
│
├── 01 IDENTITY
│   ├── Entity Identity
│   ├── Person Identity
│   ├── Community Identity
│   ├── Organization Identity
│   ├── Provider Identity
│   ├── Place Identity
│   ├── Service Identity
│   ├── Identity Verification
│   ├── Account
│   ├── Credential
│   ├── Session
│   └── Participant
│
├── 02 CONTEXT
│   ├── Personal
│   ├── Community
│   ├── Provider
│   ├── Platform
│   ├── Workspace
│   ├── Team
│   ├── Place
│   ├── Service
│   ├── Operational
│   ├── Temporal
│   └── Emergency
│
├── 03 RELATIONSHIPS
│   ├── Membership
│   ├── Resident
│   ├── Owner
│   ├── Tenant
│   ├── Worker
│   ├── Provider
│   ├── Administrator
│   ├── Operator
│   └── Delegated Relationships
│
├── 04 COMMUNITIES
│   ├── Community Entity
│   ├── Community Lifecycle
│   ├── Community Operating Workspace
│   ├── Community Roster
│   ├── Invitations
│   ├── Community Governance
│   └── Community Configuration
│
├── 05 WORLD & PLACES
│   ├── World
│   ├── Country
│   ├── City
│   ├── Community
│   ├── Phase
│   ├── Building
│   ├── Floor
│   ├── Unit
│   ├── Common Area
│   ├── Facility
│   ├── Workspace
│   └── Access Point
│
├── 06 RESOURCES
│   ├── Physical Resources
│   ├── Digital Resources
│   ├── Assets
│   ├── Equipment
│   ├── Documents
│   └── Resource Ownership / Stewardship
│
├── 07 CAPABILITIES
│   ├── Platform Capabilities
│   ├── Service Capabilities
│   ├── Provider Capabilities
│   ├── Community Capabilities
│   ├── Resource Capabilities
│   └── Capability Conditions
│
├── 08 AUTHORITY & AUTHORIZATION
│   ├── Roles
│   ├── Permissions
│   ├── Authority
│   ├── Policies
│   ├── Scope
│   ├── Conditions
│   ├── Delegation
│   ├── Approval Chains
│   ├── Authorization Decisions
│   ├── Revocation
│   └── Execution Gates
│
├── 09 WORKFLOWS & OPERATIONS
│   ├── Request
│   ├── Intent
│   ├── Proposal
│   ├── Review
│   ├── Approval
│   ├── Assignment
│   ├── Action
│   ├── Action Execution
│   ├── Event
│   ├── Outcome
│   └── Evidence
│
├── 10 SERVICES
│   ├── Access
│   ├── Home
│   ├── Community
│   ├── Maintenance
│   ├── Facilities
│   ├── Utilities
│   ├── Payments
│   ├── Mobility
│   ├── Work
│   ├── Commerce
│   ├── Delivery
│   ├── Visitor
│   ├── Education
│   ├── Health
│   └── Future Declared Capabilities
│
├── 11 PROVIDERS
│   ├── Provider Identity
│   ├── Provider Organization
│   ├── Provider Membership
│   ├── Provider Capabilities
│   ├── Provider Services
│   ├── Provider Invitations
│   ├── Provider Relationships
│   └── Provider Operations
│
├── 12 WORKSPACES & APPLICATIONS
│   ├── Personal
│   ├── Community Operating
│   ├── Provider Operating
│   ├── LegaKeys Operating
│   ├── Service Operating
│   ├── Team
│   ├── Project
│   ├── Incident
│   └── Review
│
├── 13 INTEGRATIONS
│   ├── Payment Adapters
│   ├── Access Adapters
│   ├── Identity Adapters
│   ├── Communication Adapters
│   ├── External Service Adapters
│   └── Public / Partner APIs
│
├── 14 INTELLIGENCE
│   ├── GENESIS
│   ├── Context
│   ├── Observation
│   ├── Reasoning
│   ├── Recommendation
│   ├── Proposal
│   └── Explainability
│
├── 15 ECONOMY
│   ├── Accounts
│   ├── Payments
│   ├── Transactions
│   ├── Pricing
│   ├── Billing
│   └── Settlement
│
├── 16 DIGITAL TWIN & WORLD STATE
│   ├── Entities
│   ├── Places
│   ├── Resources
│   ├── Operational State
│   ├── Observations
│   ├── Provenance
│   ├── Truth States
│   └── Historical State
│
├── 17 GOVERNANCE & TRUST
│   ├── Security
│   ├── Privacy
│   ├── Audit
│   ├── Compliance
│   ├── Data Governance
│   ├── Retention
│   ├── Evidence
│   └── Incident Governance
│
├── 18 PLATFORM OPERATIONS
│   ├── Source Control
│   ├── Build
│   ├── Database
│   ├── Runtime
│   ├── Deployment
│   ├── Configuration
│   ├── Observability
│   ├── Health
│   └── Recovery
│
└── 19 EXPERIENCE
    ├── Landing
    ├── Authentication
    ├── Onboarding
    ├── Home
    ├── Context Selection
    ├── Navigation
    ├── Workspaces
    ├── Services
    ├── Activity
    ├── Notifications
    ├── Settings
    └── Mobile / Desktop Experience
```

## 3. Canonical dependency chain

```
IDENTITY
  ↓
ACCOUNT
  ↓
SESSION
  ↓
PARTICIPANT
  ↓
CONTEXT
  ↓
RELATIONSHIP
  ↓
PLACE / RESOURCE
  ↓
CAPABILITY
  ↓
POLICY / AUTHORITY
  ↓
AUTHORIZATION
  ↓
INTENT
  ↓
PROPOSAL
  ↓
ACTION
  ↓
EVENT
  ↓
OUTCOME
  ↓
EVIDENCE
```

This is the primary conceptual dependency chain. Not every read operation traverses every node, but every consequential operation must respect the relevant chain.

## 4. Identity model

One human identity remains one identity across the ecosystem.

```
PERSON / ENTITY
      ↓
  IDENTITY
      ↓
   ACCOUNT
      ↓
   SESSION
      ↓
 PARTICIPANT
      ↓
   CONTEXTS
      ├── PERSONAL
      ├── COMMUNITY A
      ├── COMMUNITY B
      ├── PROVIDER
      └── PLATFORM
```

A person joining a community does not receive a second person identity.

A provider relationship does not create another person.

A role does not create an identity.

A workspace does not create an identity.

## 5. Community model

A community is an independent first-class entity.

```
COMMUNITY
├── Identity
├── Account (where applicable)
├── Operating Workspace
├── Places
├── Members / Participants
├── Relationships
├── Services
├── Providers
├── Policies
└── Operations
```

Community creation must not silently create a person participant or duplicate person identity.

People and communities therefore remain separate entities connected through explicit relationships.

## 6. Context model

Context changes what the platform presents and resolves.

```
CONTEXT ≠ AUTHORIZATION
RELATIONSHIP ≠ AUTHORIZATION
MEMBERSHIP ≠ AUTHORIZATION
CAPABILITY ≠ AUTHORIZATION
VISIBILITY ≠ AUTHORIZATION
```

Context answers:

- Where am I operating?
- For what purpose?
- With which entity?
- Against which place/resource?
- During what time?
- Under which operational conditions?

Authorization answers:

- Is this specific operation permitted?

## 7. Capability and authorization

```
CAPABILITY
   ↓
POLICY
   ↓
CONTEXT
   ↓
AUTHORITY
   ↓
AUTHORIZATION DECISION
   ↓
EXECUTION GATE
   ↓
ACTION
```

A declared service capability is not proof of a provider connection.

A provider connection is not authorization.

A membership is not authorization.

A UI approval button is not authorization unless the canonical authorization domain records and enforces the decision.

## 8. Operational lifecycle

```
REQUEST
  ↓
INTENT
  ↓
PROPOSAL
  ↓
REVIEW
  ↓
AUTHORIZATION
  ↓
ACTION
  ↓
EVENT
  ↓
OUTCOME
  ↓
EVIDENCE
```

The system must preserve attributable state transitions rather than merely changing UI labels.

## 9. Intelligence boundary

```
DATA
 ↓
CONTEXT
 ↓
OBSERVATION
 ↓
REASONING
 ↓
RECOMMENDATION / PROPOSAL
 ↓
HUMAN OR POLICY AUTHORIZATION
 ↓
ACTION
 ↓
EVENT
 ↓
EVIDENCE
```

GENESIS can observe, reason, recommend and propose.

GENESIS does not become the authority merely because it produced a recommendation.

## 10. Truth and provenance

Every important state should distinguish, where applicable:

- VERIFIED
- DECLARED
- OBSERVED
- INFERRED
- PROPOSED
- UNKNOWN

The platform must never convert an inferred or declared state into verified truth without the governing evidence/verification process.

External providers must never be represented as connected unless a real integration exists.

## 11. Canonical security invariants

1. **No Authorization → No Consequential Action.**
2. Authentication never substitutes for authorization.
3. Identity never substitutes for authority.
4. Participant never substitutes for role.
5. Role never substitutes for authorization.
6. Context never grants authority by itself.
7. Membership never grants system-wide authority.
8. Workspace membership never grants consequential authority.
9. Capability never grants consequential execution.
10. Discovery never authorizes use.
11. Eligibility never authorizes consequential execution.
12. A proposal is not an authorization.
13. An approval UI is not an authorization unless backed by the authorization domain.
14. Revocation is first-class.
15. Scope is explicit.
16. Time bounds are explicit where required.
17. Consequential actions are attributable.
18. Events are append-oriented evidence of what happened.
19. Historical truth is not silently rewritten.
20. Client-supplied authority/scope is never trusted without server-side derivation and authorization.
21. External integrations are truthful: connected means actually connected.
22. Community authority is scoped to the community context.
23. Community creation does not duplicate person identity.
24. Joining a community does not duplicate person identity.
25. One underlying identity may participate in many contexts.

## 12. Canonical technical source of truth

```
GITHUB
  ↓
SOURCE TREE / CODE / CONTRACTS
  ↓
CI BUILD + TESTS
  ↓
NEON POSTGRESQL
  ↓
CANONICAL PERSISTED STATE
  ↓
CLOUDFLARE WORKER
  ↓
PRODUCTION RUNTIME
  ↓
EXPERIENCE
```

The UI is an experience of canonical state. It is not a second source of truth.

## 13. Canonical production gate

A change is not called production-green until the relevant delivery proves:

```
SOURCE
 ↓
BUILD
 ↓
API / ROUTE PARITY
 ↓
CANONICAL NEON SCHEMA
 ↓
DATABASE RUNTIME SMOKE
 ↓
CLOUDFLARE DEPLOYMENT
 ↓
PRODUCTION HTTP SMOKE
 ↓
DEPLOYED RUNTIME VERIFICATION
 ↓
AUTHENTICATED / OPERATIONAL SURFACE
```

Skipped gates are not green.

Pending gates are not green.

A UI that renders without canonical persistence is not green.

A database migration that passes without production runtime verification is not green.

## 14. Implementation rule

When implementing a new feature, classify it before creating tables, APIs or UI:

1. Which canonical domain owns it?
2. Which identity/entity does it operate on?
3. Which context scopes it?
4. Which relationship connects the actor to the target?
5. Which capability is involved?
6. Which authorization decision is required?
7. What consequential action occurs?
8. What event records the action?
9. What evidence/outcome proves the result?
10. Which integration, if any, is real?

If those answers cannot be established, the feature is not ready for canonical implementation.

---

**Canonical status rule:** this file defines the platform model; implementation documents may decompose it, but may not redefine its foundational semantics.
