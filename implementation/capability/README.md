# CAPABILITY

## Purpose

CAPABILITY defines what an entity, participant, resource, service, organization, device, or system is able to do or is designed/equipped to do.

Capability is a descriptive and evaluative layer between CONTEXT and AUTHORITY.

```
WORLD
  ↓
IDENTITY / PARTICIPATION
  ↓
CONTEXT
  ↓
CAPABILITY
  ↓
AUTHORITY / AUTHORIZATION
  ↓
BEATACCESS / SERVICE
  ↓
ACTION
```

Capability answers:

- What can this subject potentially do?
- What is this subject equipped, trained, licensed, configured, or otherwise able to perform?
- What capability does a resource or service provide?
- Under what conditions, scope, time, evidence, and provenance is that capability represented?
- Is the capability VERIFIED, DECLARED, OBSERVED, INFERRED, PROPOSED, or UNKNOWN?

Capability does **not** answer:

- Who is authorized?
- Which policy permits an action?
- Whether access should be granted now?
- Whether a consequential action may execute?
- Whether a service provider is currently available?
- Whether an action has happened?

## Canonical distinctions

```
CAPABILITY ≠ IDENTITY
CAPABILITY ≠ ACCOUNT
CAPABILITY ≠ PARTICIPATION
CAPABILITY ≠ ROLE
CAPABILITY ≠ RELATIONSHIP
CAPABILITY ≠ CONTEXT
CAPABILITY ≠ AUTHORITY
CAPABILITY ≠ AUTHORIZATION
CAPABILITY ≠ BEATACCESS
CAPABILITY ≠ ACTION
CAPABILITY ≠ PROVIDER AVAILABILITY
```

A person may possess a capability without being authorized to exercise it in a context.

A role may reference expected capabilities without creating them.

A relationship may explain why a capability is relevant without granting it.

A context may constrain or qualify a capability without changing the underlying capability.

Authorization remains a separate governed decision.

## Capability classes

The platform may represent capabilities such as:

- physical capability
- professional capability
- licensed capability
- trained capability
- operational capability
- technical capability
- service capability
- device capability
- resource capability
- organizational capability
- communication capability
- financial capability
- mobility capability
- facility capability
- emergency capability
- administrative capability
- AI/system capability

These are classifications, not authority levels.

## Capability representation

Every capability has:

- stable identifier
- subject
- capability type
- definition
- state
- truth state
- source/provenance
- effective period
- optional expiry
- optional scope
- optional context
- optional evidence reference
- conditions/constraints
- lifecycle history

A capability must never silently become authoritative merely because it is present, verified, assigned, or displayed.

## Verification model

```
DECLARED → VERIFIED
OBSERVED  → VERIFIED
INFERRED  → VERIFIED
PROPOSED  → VERIFIED
UNKNOWN   → remains UNKNOWN
```

Transitions require explicit evidence and governed verification. No UI, AI output, Digital Twin representation, or external provider response may silently upgrade truth.

## Examples

### Person

A maintenance worker may have:

```
CAPABILITY = perform_electrical_maintenance
TRUTH = VERIFIED
SCOPE = designated facilities
```

This still does not authorize the worker to enter a restricted electrical room.

### Device

A door controller may have:

```
CAPABILITY = execute_access_command
TRUTH = VERIFIED
```

The device capability does not authorize any person or action.

### Service

BeatPay may have:

```
CAPABILITY = initiate_payment_request
TRUTH = DECLARED / VERIFIED
```

A capability does not prove that a payment provider is connected, available, or that a participant is authorized to pay.

## Resolution

Capability resolution may combine:

```
SUBJECT
+ CONTEXT
+ CAPABILITY
+ SCOPE
+ TIME
+ CONDITIONS
+ EVIDENCE
+ PROVENANCE
```

and returns an explicit result such as:

```
RESOLVED
PARTIAL
UNKNOWN
UNAVAILABLE
CONFLICTED
EXPIRED
```

Resolution is input to authorization. It is never authorization itself.

## Security boundary

Capability services MUST NOT:

- grant authority
- create authorization
- execute consequential actions
- unlock access
- initiate payments
- change ownership
- change policy
- impersonate a participant
- fabricate provider capability
- convert UNKNOWN into FALSE
- convert inferred capability into verified capability without evidence

The platform invariant remains:

> **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**
