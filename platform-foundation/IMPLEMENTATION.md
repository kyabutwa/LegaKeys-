# LEGAKEYS — PLATFORM FOUNDATION IMPLEMENTATION CONTRACT

## Objective

Translate the canonical architecture into implementation boundaries without prematurely coupling the platform to a single vendor, service provider or user interface.

## Core modules

```
platform/
├── identity/
├── account/
├── participant/
├── context/
├── relationship/
├── capability/
├── authority/
├── policy/
├── place/
├── service/
├── request/
├── action/
├── event/
├── evidence/
├── twin/
├── knowledge/
├── intelligence/
│   ├── constantyna/
│   └── genesis/
├── workspace/
│   ├── legakeys/
│   └── community/
├── access/
├── notification/
├── search/
└── integration/
```

## Dependency direction

Lower layers must not depend on UI features.

```
EXPERIENCE
   ↓
APPLICATION / ORCHESTRATION
   ↓
DOMAIN
   ↓
GOVERNANCE
   ↓
PERSISTENCE / INTEGRATION
```

A UI component must never become an authorization engine.

## Integration boundary

External providers are adapters.

```
LEGAKEYS DOMAIN
      ↓
INTEGRATION CONTRACT
      ↓
PROVIDER ADAPTER
      ↓
EXTERNAL SYSTEM
```

Provider availability is explicit.

An adapter may report:

- CONNECTED
- DEGRADED
- DISCONNECTED
- UNAVAILABLE
- UNKNOWN

The platform must never synthesize CONNECTED from configuration alone.

## Event boundary

Every consequential command should produce a durable event only after the action actually occurs.

```
COMMAND
 ↓
AUTHORIZATION
 ↓
EXECUTION
 ↓
EVENT
 ↓
EVIDENCE
```

If execution fails, the failure is an event/evidence state. Do not create a successful event.

## Idempotency

Consequential commands should carry an idempotency key.

Examples:

- payment execution
- access grant
- visitor invitation
- booking
- work-order creation
- utility operation

Duplicate requests must not create duplicate consequential effects.

## Auditability

Every authorization decision should be explainable through:

- subject
- context
- capability
- policy
- scope
- conditions
- decision
- timestamp
- expiration/revocation state
- decision provenance

## Privacy boundary

The foundation should minimize sensitive data.

Biometric interfaces may produce verification signals without requiring LegaKeys to store raw biometric material.

The platform should prefer references, proofs and device-bound verification results over centralized raw biometric stores.

## Failure model

The platform must distinguish:

- unknown
- unavailable
- denied
- rejected
- failed
- expired
- revoked
- pending

These are not interchangeable.

## Delivery sequence

### Foundation 1
Identity → Account → Session → Participant

### Foundation 2
Relationship → Context → Capability → Authority

### Foundation 3
Place → Service → Request → Action → Event → Evidence

### Foundation 4
Digital Twin → Knowledge → GENESIS → CONSTANTYNA

### Foundation 5
Workspace → Community Operations → LegaKeys Operations

### Foundation 6
Provider adapters → Beat services → real-world execution

### Foundation 7
Advanced intelligence → forecasting → optimization → urban intelligence

## Definition of done

The Platform Foundation is mature when a feature can be added without creating:

- a second identity system
- a second authorization system
- a second event model
- a second place model
- a second notification model
- a second service state model
- a second Digital Twin
- a second intelligence authority path

## Non-negotiable

```
ONE PLATFORM
ONE GOVERNANCE MODEL
ONE WORLD MODEL
ONE HISTORY
ONE AUTHORIZATION BOUNDARY
```
