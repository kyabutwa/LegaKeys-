# LegaKeys Core Execution Model — Reference Architecture Research
## 2026-10-05

### Scope

This reference maps LegaKeys Core Execution against publicly documented architecture practices from 30 major technology, financial, infrastructure and platform organizations, with emphasis on the United States and Singapore.

This is a comparative architecture study, not a claim that LegaKeys should copy any company's implementation.

## Reference set

### United States — 22
1. Google — SRE, reliability, production ownership, incident response
2. Amazon / AWS — state-machine workflows, distributed systems, operational safety
3. Microsoft — event-driven architecture, durable messaging, workflow patterns
4. Apple — platform security, privacy boundaries, controlled capabilities
5. Meta — large-scale distributed systems and event processing
6. Netflix — service isolation, resilient distributed architecture
7. Uber — state machines, marketplace execution, fulfillment, real-time events
8. Airbnb — service/domain boundaries and marketplace workflows
9. Stripe — payment execution, idempotency and safe retries
10. PayPal — payment authorization and transaction processing
11. Block — payment infrastructure and financial event processing
12. Salesforce — enterprise platform and event-driven capabilities
13. ServiceNow — workflow-centric enterprise execution
14. Palantir — ontology, operational objects, actions, workflows and human+AI execution
15. Cloudflare — edge execution, isolation and distributed request processing
16. OpenAI — model/tool/agent boundaries and governed tool execution
17. Coinbase — exchange/payment state and financial transaction integrity
18. Visa — networked payment authorization and transaction processing
19. Mastercard — payment network authorization and transaction processing
20. JPMorgan Chase — financial controls, authorization, audit and resilient transaction systems
21. Capital One — cloud-native financial platform engineering
22. Datadog — observability, telemetry and operational feedback

### Singapore — 8
23. Grab — real-time marketplace, fulfillment and AI-agent platform execution
24. Sea Limited — multi-product digital platform architecture
25. DBS — API-first banking platform and controlled integrations
26. OCBC — digital banking and service integration architecture
27. UOB — digital banking/platform architecture
28. ST Engineering — operational systems and infrastructure engineering
29. NCS — large-scale digital government/enterprise systems
30. GovTech Singapore — government digital platforms, identity, security and service integration

## What consistently matters

Across the reference set, the strongest recurring execution patterns are:

1. **Explicit state** — consequential workflows are represented as state machines or explicit lifecycle transitions.
2. **Strong authorization boundary** — authentication, capability, role, identity and AI intent do not independently grant execution rights.
3. **Idempotency** — retries must not duplicate a consequential operation.
4. **Durable event record** — execution produces an immutable or append-only historical record.
5. **Evidence / observability** — a system distinguishes requested, accepted, executed, failed and actually observed outcomes.
6. **Workflow orchestration** — multi-step operations need explicit coordination rather than hidden chains of side effects.
7. **Failure isolation** — external systems can fail without corrupting the canonical state.
8. **Auditability** — decisions, actors, policies, versions, timing and provenance must be reconstructable.
9. **Human + machine governance** — intelligent systems may recommend or initiate a governed request, but the execution boundary remains policy-controlled.
10. **Operational feedback** — events and outcomes feed monitoring, learning and future decisions.
11. **Truth-state separation** — inferred/proposed state must not become verified historical fact.
12. **Progressive autonomy** — safe systems enable autonomy only after deterministic controls are established.

## Architecture mapping into LegaKeys

### A. Decision plane

Reference pattern:
- Palantir: data + logic + actions + security policies
- AWS: state machines + tasks
- Uber: statecharts + transaction coordination
- Stripe: idempotency and request replay safety

LegaKeys mapping:

```
OBSERVATION / HUMAN INTENT
        ↓
CONTEXT
        ↓
CAPABILITY
        ↓
PROPOSAL
        ↓
AUTHORIZATION DECISION
```

The decision plane must never execute a consequential side effect merely because an intent, capability or recommendation exists.

### B. Execution plane

```
AUTHORIZED ACTION
        ↓
EXECUTION ATTEMPT
        ↓
ADAPTER / PROVIDER
        ↓
OBSERVED RESULT
        ↓
EVENT
        ↓
EVIDENCE
        ↓
OUTCOME
```

The execution plane is where external side effects occur.

The database-level execution gate is intentionally positioned immediately before an execution attempt.

### C. State machine

The canonical LegaKeys action lifecycle is:

```
REQUESTED
   ↓
VALIDATING
   ↓
AUTHORIZED
   ↓
EXECUTING
   ├── SUCCEEDED
   ├── FAILED
   ├── UNKNOWN
   ├── CANCELLED
   ├── EXPIRED
   └── REVOKED
```

Execution attempts have their own lifecycle:

```
STARTED → ACCEPTED → COMPLETED
       ↘ FAILED
       ↘ UNKNOWN
       ↘ CANCELLED
       ↘ TIMED_OUT
```

A retry is a new execution attempt, never a rewrite of a historical attempt.

### D. Event plane

```
ACTION
  ↓
EVENT
  ↓
OUTBOX
  ↓
CONSUMERS
  ↓
DIGITAL TWIN / KNOWLEDGE / ANALYTICS
```

Events represent facts about what happened. Consumers may independently derive state, but they must not mutate historical events.

### E. Evidence plane

```
EVENT
  ↓
EVIDENCE
  ├── source
  ├── source reference
  ├── capture time
  ├── provenance
  ├── integrity
  └── content reference/hash
```

Completion is not equivalent to evidence. The system must be able to represent UNKNOWN or insufficient evidence.

### F. Intelligence plane

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

GENESIS and CONSTANTYNA operate above the authorization boundary. They can create intent/proposals and assist decision-making, but neither is a source of self-issued authority.

## LegaKeys canonical control plane

The resulting architecture is:

```
                    LEGAKEYS
                       │
          ┌────────────┴────────────┐
          │                         │
      DECISION PLANE            EXECUTION PLANE
          │                         │
 Context / Capability          Authorized Action
          │                         │
       Proposal                Execution Attempt
          │                         │
 Authorization Decision        Adapter / Provider
          │                         │
          └────────────┬────────────┘
                       ↓
                     EVENT
                       ↓
                   EVIDENCE
                       ↓
                    OUTCOME
                       ↓
              DIGITAL TWIN / KNOWLEDGE
                       ↓
               GENESIS / ANALYTICS
                       ↓
                    PROPOSAL
```

## Security boundary

The single non-negotiable invariant remains:

```
NO AUTHORIZATION
        ↓
NO CONSEQUENTIAL ACTION
```

The implementation now enforces this at the database execution boundary as well as the application architecture boundary.

The runtime contract also keeps:

```
consequential_writes_enabled = false
```

until the production verification gate explicitly enables consequential writes.

## Why this is the right synthesis for LegaKeys

LegaKeys is not simply a microservice system, a workflow engine, an event bus, a marketplace, an AI agent or an access-control system.

Its distinctive requirement is to join:

- a world model;
- identity;
- participation;
- context;
- capabilities;
- authority;
- services;
- physical/digital access;
- consequential actions;
- evidence;
- intelligence;
- human and community operations.

The architecture therefore uses a **governed execution kernel** rather than copying any one company's architecture.

### Kernel responsibilities

The Core Execution Model owns:

- action lifecycle;
- authorization binding;
- execution gate;
- idempotency identity;
- execution attempts;
- event emission contract;
- evidence linkage;
- outcome representation;
- provenance;
- immutable history;
- retry semantics;
- failure/unknown semantics;
- observability hooks.

It does not own domain-specific business logic.

## Pre-deployment acceptance criteria

Before consequential production execution is enabled:

- canonical schema exists;
- authorization decisions exist;
- actions bind to authorization;
- execution attempts are gated by authorization;
- runtime contract is canonical;
- legacy runtime remains disabled;
- consequential writes remain disabled during migration;
- events are append-only;
- execution attempts are append-only;
- idempotency constraints exist;
- event outbox exists;
- evidence can be linked to action/event;
- outcomes can represent UNKNOWN;
- Worker health reports Core Execution verification;
- application authorization recheck exists immediately before external side effects;
- production end-to-end tests prove denial, approval, retry, timeout and unknown-result paths.

## Research conclusion

The strongest common lesson from the 30-company reference set is not "use microservices."

It is:

**Make the important state explicit, make authority explicit, make execution explicit, make retries safe, make events durable, make evidence reconstructable, and make failure truthful.**

That is the Core Execution Model LegaKeys should implement.
