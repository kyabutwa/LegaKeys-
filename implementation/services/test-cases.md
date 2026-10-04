# LegaKeys Services Verification Matrix

## Service ownership and catalog
SV-001 stable LegaKeys service identity
SV-002 Beat code unique
SV-003 owner domain is LEGAKEYS
SV-004 participant cannot claim ownership
SV-005 community cannot claim ownership
SV-006 provider cannot claim ownership
SV-007 service can exist without provider
SV-008 service lifecycle explicit
SV-009 service truth explicit
SV-010 service version lineage preserved

## Offerings and capabilities
SV-011 offering belongs to service
SV-012 capability belongs to service
SV-013 offering does not become authorization
SV-014 capability does not become authorization
SV-015 eligibility is explicit
SV-016 pricing is versioned when applicable
SV-017 service commitments are explicit
SV-018 service area is temporal
SV-019 service availability is temporal
SV-020 retired service blocks new requests unless policy allows

## Provider integration
SV-021 provider connection is explicit
SV-022 provider is never fabricated
SV-023 provider credentials are isolated
SV-024 provider availability is explicit
SV-025 provider failure is explicit
SV-026 provider timeout is not success
SV-027 provider cannot expand scope
SV-028 provider cannot change ownership
SV-029 provider cannot rewrite LegaKeys history
SV-030 provider substitution is auditable

## Request and authorization
SV-031 request has principal
SV-032 request binds service version
SV-033 request binds capability when applicable
SV-034 request binds context
SV-035 request binds target when applicable
SV-036 request has idempotency key
SV-037 request has correlation ID
SV-038 request does not authorize itself
SV-039 current authorization required for consequential execution
SV-040 authorization principal must match request principal
SV-041 authorization scope must cover target
SV-042 authorization time must be valid
SV-043 denied authorization creates no consequential execution
SV-044 UI cannot force execution
SV-045 AI cannot force execution

## Execution and outcomes
SV-046 execution has authorization reference
SV-047 execution deadline enforced
SV-048 duplicate requests cannot duplicate consequential execution
SV-049 accepted is not completed
SV-050 provider response is not automatically outcome
SV-051 outcome preserves requested vs actual result
SV-052 evidence reference retained
SV-053 reconciliation preserves original history
SV-054 UNKNOWN remains UNKNOWN
SV-055 failed provider operation remains failed
SV-056 cancellation is explicit

## Cross-service and platform
SV-057 cross-service correlation preserved
SV-058 service dependencies explicit
SV-059 BeatAccess remains physical access execution boundary
SV-060 BeatPay remains payment execution boundary
SV-061 BeatVisitor remains visitor-domain boundary
SV-062 Identity remains identity boundary
SV-063 Context remains context boundary
SV-064 Capability remains capability boundary
SV-065 Authority remains authority boundary
SV-066 Authorization remains decision boundary
SV-067 Digital Twin cannot authorize
SV-068 GENESIS cannot authorize
SV-069 CONSTANTYNA cannot authorize
SV-070 UI cannot authorize

## Truth, privacy, resilience
SV-071 availability never fabricated
SV-072 evidence provenance retained
SV-073 sensitive provider credentials isolated
SV-074 sensitive identity/biometric data isolated
SV-075 payment secrets isolated
SV-076 degraded state is explicit
SV-077 suspended service fails closed for consequential execution
SV-078 provider disconnect does not erase history
SV-079 offline mode is governed
SV-080 retry is idempotent

## Modern representation
SV-081 catalog card exposes service outcome
SV-082 service detail separates capability, availability and provider
SV-083 provider shown as fulfillment/integration, not owner
SV-084 request flow is progressive
SV-085 authorization step is visible when required
SV-086 execution status distinguishes accepted/completed
SV-087 outcome shows evidence/provenance
SV-088 UNKNOWN is visible
SV-089 service version is traceable
SV-090 service area is visible

## Release gates
SV-091 no service request executes without current authorization when consequential
SV-092 no provider connection creates ownership
SV-093 no participant/community/provider can redefine canonical Beat identity
SV-094 native, provider-dependent and hybrid modes are distinguishable
SV-095 every consequential service action has event/evidence lineage
SV-096 provider truth is never silently promoted to LegaKeys truth
SV-097 service retirement is safe
SV-098 concurrency is safe
SV-099 cross-service boundaries remain intact
SV-100 NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION
