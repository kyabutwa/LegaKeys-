# LegaKeys Services — Beat-family

## Purpose

LegaKeys Services is a first-class platform layer owned, designed, governed and operated by LegaKeys.

A Beat-family service is a LegaKeys capability/service product exposed to participants, communities and authorized actors. Participants and communities consume, configure permitted context, request and use services; they do not own the underlying LegaKeys service.

External providers are integrations/adapters only. A provider connection never transfers ownership of a Beat service.

## Modern service representation

A service is represented as:

SERVICE
→ SERVICE VERSION
→ SERVICE OFFERING
→ CAPABILITIES
→ SERVICE AREAS / PLACES
→ ELIGIBILITY
→ PROVIDER CONNECTIONS (optional)
→ AVAILABILITY
→ REQUEST
→ AUTHORIZATION
→ EXECUTION
→ EVENT
→ EVIDENCE
→ OUTCOME

This separates the catalog representation from the operational reality.

## Ownership model

LegaKeys owns:
- service identity and canonical service definition
- Beat-family brand/domain
- service versions and lifecycle
- service capabilities
- service offerings and commercial/eligibility rules
- service orchestration
- provider integration contracts
- request and outcome model
- service truth and provenance
- authorization boundary
- service-level evidence and audit
- service UX representation

Providers may supply infrastructure, goods, human fulfillment, payment rails, mobility fleets, food merchants, utilities or other external capability only through declared integrations.

Providers do NOT own the Beat service, its canonical identity, authorization policy, participant relationship, or service history.

Participants do NOT own the service.

Communities do NOT own the Beat service. A community may govern participation/context-specific use where LegaKeys explicitly delegates that scope.

## Service is not provider

A Beat service can exist before any provider connection.

SERVICE DEFINITION != PROVIDER
SERVICE CAPABILITY != PROVIDER CAPABILITY
SERVICE AVAILABILITY != PROVIDER AVAILABILITY
SERVICE REQUEST != PROVIDER REQUEST
SERVICE AUTHORIZATION != PROVIDER AUTHORIZATION
SERVICE EXECUTION != PROVIDER EXECUTION
SERVICE OUTCOME != PROVIDER RESPONSE

No provider is fabricated. UNKNOWN remains UNKNOWN.

## Beat-family examples

BeatIdentity — identity services
BeatAccess — governed physical/digital access
BeatVisitor — visitor invitations and verification
BeatPay — payment orchestration
BeatRide — mobility
BeatFood — food/meal services
BeatHealth — health-related service coordination
BeatGenzi — intelligent assistance/services
BeatWork — work and task services
BeatGuardian — safety/security coordination
BeatHome — home services
BeatUtilities — utilities
BeatMaintenance — maintenance/work orders
BeatFacility — facility services
BeatCommunity — community services
BeatDelivery — delivery services
BeatMarket — commerce/market services
BeatBnB — lodging/stay services

Each Beat is a LegaKeys service domain, not a separate owner.

## Service lifecycle

PROPOSED → DESIGNED → CONFIGURED → ACTIVE → DEGRADED → SUSPENDED → RETIRED.

A provider may be unavailable while the Beat service remains active. A Beat service becomes UNAVAILABLE only when the service's declared operational conditions make it unavailable.

## Service truth

Every important operational statement has explicit state/provenance:
VERIFIED, DECLARED, OBSERVED, INFERRED, PROPOSED, UNKNOWN.

Availability is never invented.

## Authorization boundary

Service discovery does not authorize service use.
Service eligibility does not authorize consequential execution.
Provider connection does not authorize a participant.
A request does not authorize itself.

Consequential flow:

Participant + Context + Capability + Authority
→ Authorization
→ Service Request
→ Execution Gate
→ Beat Service
→ Provider Adapter when required
→ Event
→ Evidence
→ Outcome.

NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.

## Modern UI representation

A service card should answer:
- What is it?
- What outcome does it provide?
- Where is it available?
- Is it available now?
- What can I do?
- What is required?
- Who/what fulfills it?
- What happened?

Use progressive disclosure:
Catalog card → service detail → offering → request → authorization → execution → outcome.

Providers are shown as fulfillment/integration details, not as the service identity.

## Release gate

The Services layer is GREEN only when every Beat service can be represented independently of providers, every provider connection is explicit, every consequential request follows Authorization + execution gates, truth/provenance are preserved, and no participant/community/provider can claim ownership of a LegaKeys Beat service.
