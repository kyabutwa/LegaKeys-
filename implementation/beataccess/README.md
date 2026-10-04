# BEATACCESS

## Purpose

BEATACCESS is LegaKeys' governed access-enforcement boundary between an already-authorized decision and a real access operation.

It converts a valid, bounded AUTHORIZATION decision into an access request against a declared access point, using a recognized credential or device path, then records the physical/system result as EVENT/EVIDENCE.

BEATACCESS does not decide who is authorized.

```
IDENTITY
   ↓
PARTICIPANT
   ↓
CONTEXT
   ↓
CAPABILITY
   ↓
AUTHORITY
   ↓
AUTHORIZATION
   ↓
BEATACCESS
   ↓
ACCESS POINT / CONTROLLER / READER
   ↓
ACCESS EVENT
   ↓
EVIDENCE
```

## Canonical question

AUTHORIZATION answers:

> May this principal perform this action on this target now?

BEATACCESS answers:

> Given that authorization, can this governed access operation be safely bound to this access point and credential path, and what actually happened?

## What BEATACCESS owns

- access points and access-point references
- access zones
- reader/controller/lock integration references
- credential/device presentation references
- access operation requests
- authorization binding
- execution-gate validation
- access command issuance
- controller/provider response normalization
- anti-replay and idempotency controls
- temporary access operation state
- access result/event references
- failure and degraded-mode state
- access audit/evidence references
- emergency-mode access execution under explicit authorization

## What BEATACCESS does NOT own

- identity proofing
- account authentication
- participant creation
- capability definition
- authority creation
- authorization policy decisions
- service-provider invention
- arbitrary door/controller configuration
- consequential action policy outside access
- payment authorization
- autonomous permission creation

## Access object model

An access point may represent:

- pedestrian door
- vehicle gate
- turnstile
- elevator access point
- barrier
- controlled common-area entry
- facility entry
- building entry
- unit entry
- controlled shared-space entry
- another explicitly declared access-controlled endpoint

An access point is not itself an authorization.

A place containing an access point is not authorization.

Current physical location is not authorization.

## Access operation

Every consequential access operation binds:

```
PRINCIPAL
+
AUTHORIZATION
+
ACTION
+
TARGET
+
ACCESS POINT
+
CREDENTIAL / DEVICE PRESENTATION
+
TIME
+
REQUEST ID
+
IDEMPOTENCY KEY
+
POLICY / EXECUTION BINDING
```

before a command can be issued.

## Credential separation

A credential is a mechanism for presenting an access claim.

Examples may include:

- mobile credential
- NFC credential
- card credential
- token
- PIN
- approved biometric presentation
- approved device credential

Credential possession is NOT authorization.

Recognition is NOT authorization.

A valid credential presented at the wrong access point or outside its authorized scope MUST fail.

BEATACCESS must never manufacture a credential or silently convert identity recognition into access permission.

## Authorization binding

Before command issuance BEATACCESS MUST verify that:

1. authorization exists;
2. authorization decision is ALLOW;
3. authorization is active;
4. authorization has not expired or been revoked;
5. principal matches;
6. action matches;
7. target matches;
8. access point is within authorized scope;
9. required conditions remain satisfied;
10. execution deadline has not passed;
11. one-time/replay constraints are satisfied;
12. the operation has not already been consumed;
13. the request/action binding is intact.

Failure means:

```
NO VALID AUTHORIZATION → NO ACCESS COMMAND
```

## Physical-world truth

A successful authorization does NOT mean the door opened.

The system MUST distinguish:

- AUTHORIZED
- COMMAND_ACCEPTED
- COMMAND_REJECTED
- ACCESS_GRANTED
- ACCESS_DENIED
- ACCESS_TIMEOUT
- CONTROLLER_UNAVAILABLE
- READER_UNAVAILABLE
- LOCK_FAULT
- UNKNOWN

For example:

```
AUTHORIZATION = ALLOW
COMMAND = ACCEPTED
PHYSICAL RESULT = UNKNOWN
```

must remain UNKNOWN until reliable evidence exists.

Never report “door opened” merely because an authorization or command was accepted.

## Controller boundary

BEATACCESS may integrate with existing access-control infrastructure through explicit adapters.

```
LegaKeys
   ↓
BeatAccess Adapter
   ↓
Declared Provider / Controller
   ↓
Reader / Lock / Gate
   ↓
Physical Result
```

Provider availability is not permission.

Provider success is not authorization.

Provider failure must remain explicit.

No provider connection may be fabricated.

## Offline / degraded operation

Offline operation is permitted only where an explicitly governed integration supports it.

An offline credential cache MUST have:

- bounded scope
- bounded lifetime
- credential status
- revocation/update strategy
- replay protection appropriate to the integration
- controller-local audit
- reconciliation after reconnect

BEATACCESS MUST NOT invent an offline authorization when the integration has no valid cached authorization.

If required authorization state cannot be safely established:

```
FAIL CLOSED
```

unless an explicitly defined emergency policy authorizes a bounded alternate path.

## Anti-passback and replay

Where supported by the access system, BEATACCESS must preserve:

- nonce/token uniqueness
- credential presentation identity
- one-time-use semantics
- anti-passback state
- operation consumption
- controller sequence information

A repeated request MUST NOT create repeated consequential access beyond the authorization's permitted semantics.

## Temporary access

Temporary access is first-class.

Every temporary operation has:

- activation time
- expiration time
- scope
- authorization binding
- credential reference
- reason/purpose where required
- revocation state

Expired temporary access cannot be executed.

## Emergency access

Emergency access is not a bypass.

Emergency operation MUST reference:

- emergency policy
- authorized initiating principal
- affected scope
- reason
- time window
- required approvals where policy requires them
- evidence
- post-event review requirements

Emergency mode cannot silently become permanent authority.

## Privacy

BEATACCESS should minimize sensitive access data.

Store references to credentials or biometric systems rather than raw secret/biometric material.

Access logs must be scoped according to privacy and governance policy.

## AI boundary

GENESIS and CONSTANTYNA may:

- explain access status
- identify missing authorization information
- guide a participant
- propose a governed access request
- surface anomalies

They may NOT:

- unlock a door by themselves
- create authorization
- extend authorization scope
- bypass the execution gate
- convert UNKNOWN into GRANTED
- fabricate controller state

## Final invariant

```
AUTHORIZATION DECIDES.
BEATACCESS ENFORCES.
THE CONTROLLER EXECUTES.
EVENT/EVIDENCE RECORDS WHAT HAPPENED.

NO AUTHORIZATION → NO ACCESS COMMAND.
```
