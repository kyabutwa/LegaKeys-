# LEGAKEYS — CORE CONTRACT

**Status:** Canonical  
**Scope:** Platform-wide  
**Owner:** United of Balega  
**Governance:** Supreme Executive Council 9  
**Purpose:** Non-negotiable behavioral, architectural, security, truth, authority and execution contract for every LegaKeys capability, service, workspace, intelligence layer and interface.

---

## 1. Purpose

LegaKeys is an **Intelligent Living Infrastructure for Participating People and Communities**.

Its canonical promise is:

> **Who you are. Where you Belong. One ecosystem.**

LegaKeys connects the represented world, identity, participation, context, capability, authority, access, services, actions, events, evidence and intelligence into one governed ecosystem.

This contract defines the boundaries that implementations must preserve regardless of technology, interface, service, provider, device, workspace or future expansion.

A feature is not compliant merely because it works technically. It must also preserve identity separation, authority boundaries, truthfulness, provenance, auditability and the execution model defined here.

---

## 2. Canonical Execution Chain

The platform must preserve the following conceptual chain:

```
PERSON
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
REQUESTED ACTION
  ↓
RESOURCE / PLACE / SERVICE
  ↓
POLICY
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
  ↓
DIGITAL TWIN UPDATE
  ↓
KNOWLEDGE
  ↓
GENESIS
  ↓
PROPOSAL
  ↓
AUTHORITY
```

The chain may be presented more simply in user interfaces, but implementation semantics must not silently remove its governing boundaries.

---

## 3. Primary Security Invariant

```
NO AUTHORIZATION
        ↓
NO CONSEQUENTIAL ACTION
```

A consequential action includes, but is not limited to:

- opening or granting access;
- changing access state;
- executing a payment;
- creating or modifying a binding operational record;
- changing a governed resource state;
- assigning or delegating authority;
- executing a service action with real-world consequences;
- performing an emergency or safety action outside its governed emergency policy.

Authentication, recognition, conversation, capability, subscription, relationship, team membership or interface access must never be treated as authorization by implication.

---

## 4. Identity and Participation Contract

The following distinctions are mandatory:

```
Identity ≠ Account
Account ≠ Participant
Participant ≠ Role
Role ≠ Authority
Authentication ≠ Authorization
Relationship ≠ Authorization
Capability ≠ Authorization
Subscription ≠ Authorization
Team Membership ≠ Authorization
Team Capability ≠ Team Authority
Biometric Recognition ≠ Authorization
Interface ≠ Authority
Digital Twin ≠ Authority
Workspace Visibility ≠ Authority
```

### 4.1 BeatIdentity

BeatIdentity establishes identity for represented entities.

It may represent:

- people;
- communities;
- organizations;
- providers;
- places;
- phases;
- buildings;
- floors;
- units;
- common areas;
- facilities;
- services;
- assets;
- equipment;
- access points;
- workspaces;
- workspace teams;
- other physical entities.

Identity must preserve provenance, lifecycle and verification state.

### 4.2 Participant

A Participant is a **participation construct**, not a human category.

Canonical transformation:

```
ENTITY
  ↓
BEATIDENTITY
  ↓
PARTICIPATION
  ↓
PARTICIPANT
```

One underlying identity may participate in multiple contexts without creating duplicate core identities.

---

## 5. Account and Authentication Contract

An Account provides controlled access to LegaKeys.

Authentication establishes that an account or credential has successfully authenticated according to the applicable authentication method.

Authentication does **not** independently establish:

- community membership;
- place access;
- service access;
- operational responsibility;
- authority;
- payment authorization;
- administrative authority.

A canonical LegaKeys session must have explicit lifecycle, expiration and revocation semantics.

---

## 6. Context Contract

Context determines:

- where;
- when;
- under what circumstances;
- for what purpose;
- within what scope.

Supported context dimensions include:

- Personal;
- Community;
- Workspace;
- Team;
- Place;
- Service;
- Temporal;
- Operational;
- Emergency;
- Cross-context relationships.

**Context never creates authority by itself.**

---

## 7. Capability Contract

A Capability describes what an entity, team, service or system can do or provide.

Capability may be:

- defined;
- discovered;
- owned;
- available;
- conditional;
- historical;
- governed.

**Capability ≠ Authorization.**

A capability may exist while the current participant is not authorized to exercise it.

---

## 8. Authority and Authorization Contract

Authorization is contextual, scoped and governed.

Where applicable it must represent:

- subject;
- capability;
- resource;
- place;
- service;
- action;
- context;
- policy;
- conditions;
- scope;
- effective time;
- expiration;
- delegation;
- approval chain;
- revocation;
- constraints.

Canonical authorization states:

```
PROPOSED
APPROVED
REJECTED
REVOKED
EXPIRED
```

Authorization must be evaluated before a consequential action is executed.

No service, workspace, assistant, biometric interface, device or intelligence layer may manufacture authority outside the governed authorization model.

---

## 9. BeatAccess Contract

BeatAccess is the governed access layer.

Access decisions must be derived from the applicable combination of:

```
IDENTITY
+
PARTICIPANT
+
CONTEXT
+
CAPABILITY
+
RESOURCE
+
PLACE
+
SERVICE
+
POLICY
+
CONDITIONS
+
EFFECTIVE TIME
+
EXPIRATION
+
REVOCATION
```

Interfaces such as:

- Face ID;
- fingerprint;
- palm;
- QR;
- NFC;
- PIN/code;
- trusted device;
- phase identification;
- assisted verification

produce authentication, verification, recognition or credential signals.

They do not independently grant authority.

Examples:

- Face recognized ≠ authorized to open a door.
- Fingerprint verified ≠ authorized to enter a facility.
- Palm recognized ≠ authorized to make a payment.

---

## 10. Service Contract

Every LegaKeys service must expose truthful capability and state.

Canonical service path:

```
DECLARED CAPABILITY
        ↓
AVAILABLE CONNECTION
        ↓
AUTHORIZED CONTEXT
        ↓
AUTHORIZED ACTION
        ↓
REAL EVENT
        ↓
EVIDENCE
```

Services must never invent:

- providers;
- availability;
- transactions;
- integrations;
- live operational state;
- service completion;
- delivery;
- payment success;
- bookings;
- operational evidence.

If a provider or integration is unavailable, the system must represent that limitation truthfully.

---

## 11. Truth and State Contract

LegaKeys must distinguish at minimum:

```
VERIFIED
DECLARED
OBSERVED
INFERRED
PROPOSED
UNKNOWN
```

The user-facing state model must also distinguish:

```
LOADING
UNKNOWN
UNAVAILABLE
PENDING
DENIED
FAILED
EXPIRED
REVOKED
COMPLETED
```

These states are not interchangeable.

**Unknown is not false.  
Unavailable is not completed.  
Pending is not successful.  
Proposed is not authorized.  
Inferred is not verified.**

The interface must not transform uncertainty into certainty merely to appear intelligent.

---

## 12. Digital Twin Contract

The LegaKeys Digital Twin represents the known world and its state.

It must:

- preserve provenance;
- preserve uncertainty;
- preserve historical state;
- distinguish current state from historical events;
- support explicit UNKNOWN state;
- track source and freshness;
- preserve data governance;
- support auditability.

The Digital Twin may represent:

- known;
- unknown;
- observed;
- declared;
- inferred;
- proposed.

The Digital Twin:

- does not create authority;
- does not rewrite history;
- does not convert inference into fact;
- does not manufacture live state.

Historical events and evidence remain historical truth.

```
EVENT
  ↓
EVIDENCE
  ↓
HISTORICAL RECORD
```

Current operational state may change; historical truth cannot be rewritten.

---

## 13. Intelligence Contract

### GENESIS

GENESIS is Community / World Intelligence.

GENESIS may:

- observe;
- understand;
- contextualize;
- detect;
- reason;
- measure;
- propose;
- explain.

GENESIS may not:

- grant itself authority;
- override policy;
- invent providers;
- invent live state;
- rewrite history;
- execute unauthorized consequential actions.

### CONSTANTYNA

CONSTANTYNA is Human Intelligence.

CONSTANTYNA may:

- understand language;
- understand greetings;
- understand questions;
- understand requests;
- understand complaints;
- identify needs and intent;
- maintain conversation;
- clarify;
- explain;
- guide;
- recommend;
- assist;
- escalate or hand off to humans where appropriate.

CONSTANTYNA may not:

- grant authority;
- bypass authorization;
- invent facts;
- invent providers;
- execute consequential actions without governed authorization.

A conversational command is still subject to the same authorization model as a graphical interaction.

---

## 14. Action and Evidence Contract

All consequential execution must follow:

```
INTENT
  ↓
PROPOSAL
  ↓
AUTHORIZATION
  ↓
ACTION
  ↓
EVENT
  ↓
EVIDENCE
  ↓
OUTCOME
```

An action must not be represented as completed until the relevant real event has occurred and the applicable evidence has been recorded.

Evidence must retain appropriate provenance.

---

## 15. Workspace Contract

LegaKeys contains two distinct operating environments.

### LegaKeys Workspace

Operates LegaKeys itself:

- Product;
- Engineering;
- Intelligence;
- Identity;
- Access;
- Services;
- Infrastructure;
- Finance;
- Legal / Compliance;
- Research;
- Design;
- Partnerships;
- Governance;
- Operations.

### Community Operating Workspace

Operates participating communities:

- people;
- participants;
- places;
- community teams;
- services;
- requests;
- work;
- access operations;
- maintenance;
- security;
- facilities;
- governance;
- evidence;
- operational intelligence.

They are not the same workspace.

Information visibility across workspaces does not create authority.

Connections between them must use:

```
BeatIdentity
  ↓
Relationship
  ↓
Context
  ↓
Capability
  ↓
Authorization
```

Never implicit authority.

---

## 16. Community Governance Contract

A participating community may govern its authorized community context, including:

- community policies;
- community rules;
- community responsibilities;
- community approvals;
- community delegations;
- community resources;
- community operations.

A community does not thereby:

- own LegaKeys;
- control the LegaKeys core;
- grant system-wide authority;
- bypass authorization;
- override global security invariants;
- invent provider connections;
- rewrite historical evidence.

Community authority is represented through the common LegaKeys authority model.

---

## 17. Data Governance Contract

Data must remain associated with its applicable ownership, stewardship, purpose, scope and governance.

Canonical ownership principles:

- Participant controls participant data;
- Community controls community data;
- Organization controls organization data;
- Provider controls provider data;
- LegaKeys governs infrastructure processing according to authorization, purpose, scope and applicable governance.

The platform must minimize unnecessary data exposure and preserve provenance and auditability.

---

## 18. Biometric and Payment Contract

Biometric or recognition interfaces are credential/identity signals, not authority.

For BeatPay:

```
PARTICIPANT
  ↓
PAYMENT INTENT
  ↓
PROVIDER / MERCHANT
  ↓
CREDENTIAL / PAYMENT INTERFACE
  ↓
LIVENESS / RECOGNITION / VERIFICATION
  ↓
IDENTITY / PARTICIPANT REFERENCE
  ↓
BEATPAY AUTHORIZATION GATE
  ↓
PAYMENT EXECUTION
  ↓
PAYMENT EVENT
  ↓
EVIDENCE
  ↓
RECONCILIATION
```

The authorization gate must consider the applicable participant, intent, service, provider/merchant, capability, context, authorization state, effective time, expiration, revocation, amount and currency.

Phone-camera palm recognition must not claim specialized biometric-hardware assurance.

BeatPay must not use raw palm images, raw biometric templates or raw biometric embeddings as payment credentials.

---

## 19. User Experience Contract

The interface must expose the complexity of LegaKeys progressively rather than forcing participants to understand its internal graph.

Canonical primary navigation:

```
HOME · PLACES · SERVICES · ACTIVITY · WORKSPACES
```

Global surfaces:

```
SEARCH + CONSTANTYNA + IDENTITY
```

UX principles:

- one meaningful question or decision per card;
- one obvious primary action;
- progressive disclosure;
- structured titles;
- concise metadata;
- clear truth states;
- fullscreen only when a workflow genuinely requires it;
- no fake activity;
- no misleading completion states;
- no hidden consequential action.

Internal complexity may be hidden from the participant, but its governance must never be removed from execution.

---

## 20. Architecture Contract

The platform architecture is organized around:

```
WORLD
BEATIDENTITY
IDENTITY & ACCOUNT
CONTEXT
CAPABILITY
AUTHORITY
LEGAKEYS OPERATING SYSTEM
COMMUNITY OPERATING SYSTEM
LEGAKEYS DIGITAL TWIN
LIVING INFRASTRUCTURE
BEATACCESS
SERVICES
OUTCOMES
COMMUNITY INTELLIGENCE
HUMAN INTELLIGENCE
URBAN INTELLIGENCE
CORE EXECUTION MODEL
```

New domains must not silently duplicate an existing canonical responsibility.

New services must use the common identity, context, capability, authority, access, action, event and evidence model.

---

## 21. Failure and Safety Contract

A failed dependency must not be represented as success.

A missing provider must not be represented as connected.

A missing data source must not be represented as live data.

A denied authorization must not be represented as an executed action.

A stale state must not be represented as current without appropriate qualification.

An uncertain inference must not be represented as verified fact.

When a consequential action cannot be safely authorized or verified, the default is to stop, preserve the relevant state/evidence, and surface the actual reason.

---

## 22. Non-Negotiable Invariants

The following are platform invariants:

1. Identity ≠ Account.
2. Account ≠ Participant.
3. Participant ≠ Role.
4. Role ≠ Authority.
5. Authentication ≠ Authorization.
6. Relationship ≠ Authorization.
7. Capability ≠ Authorization.
8. Subscription ≠ Authorization.
9. Team Membership ≠ Authorization.
10. Team Capability ≠ Team Authority.
11. Biometric Recognition ≠ Authorization.
12. Interface ≠ Authority.
13. Digital Twin ≠ Authority.
14. Workspace Visibility ≠ Authority.
15. Understanding LegaKeys ≠ Controlling LegaKeys.
16. Historical truth cannot be rewritten.
17. Unknown state must remain explicitly representable.
18. Unavailable integrations must remain explicitly unavailable.
19. GENESIS cannot grant itself authority.
20. CONSTANTYNA cannot grant authority or bypass authorization.
21. Services cannot invent providers or operational state.
22. Communities cannot bypass the common authority model.
23. LegaKeys Workspace and Community Operating Workspace remain distinct.
24. Consequential execution requires governed authorization.

---

## 23. Canonical System Loop

The complete LegaKeys execution loop is:

```
OBSERVE
   ↓
UNDERSTAND
   ↓
CONTEXTUALIZE
   ↓
DETECT
   ↓
REASON
   ↓
PROPOSE
   ↓
AUTHORIZE
   ↓
EXECUTE
   ↓
MEASURE
   ↓
LEARN
   ↓
OBSERVE AGAIN
```

This loop is governed by the core invariant:

```
NO AUTHORIZATION
        ↓
NO CONSEQUENTIAL ACTION
```

---

## 24. Final Contract

LegaKeys must always preserve the relationship between people, places, needs, capabilities, authority, access, resources, context, intelligence, services and outcomes.

```
PEOPLE
+
PLACES
+
NEEDS
+
CAPABILITIES
+
AUTHORITY
+
ACCESS
+
RESOURCES
+
CONTEXT
+
INTELLIGENCE
+
SERVICES
=
OUTCOMES
```

The interface may evolve.

The services may evolve.

The providers may evolve.

The devices may evolve.

The intelligence may evolve.

The implementation technology may evolve.

**The governing contract does not change without explicit architectural governance.**
