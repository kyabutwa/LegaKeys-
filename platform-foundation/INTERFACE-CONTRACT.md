# LEGAKEYS — EXTERNAL INTERFACE CONTRACT

Status: Canonical boundary

## Purpose
LegaKeys is an ecosystem, not a closed UI. Any approved client, community system, provider adapter, partner or future application must interface through explicit contracts.

## Interface classes

| Interface | Principal | Authentication | Authorization |
|---|---|---|---|
| Participant UI | Participant account | Canonical session | Participant/context policy |
| Community UI | Community operator | Canonical session | Community-scoped authorization |
| LegaKeys Workspace | LegaKeys operator | Canonical session + step-up | Platform workspace authorization |
| Provider adapter | Provider integration | OAuth/OIDC/client credential as appropriate | Provider capability + service authorization |
| Partner API | Integration principal | OAuth 2.0/OIDC | Audience + scopes + policy |
| Lifecycle integration | Organization | SCIM/OIDC/OAuth | Provisioning policy |
| Event consumer | Integration principal | Authenticated subscription | Event subscription scope |

## Machine-interface rules

- Never accept a raw database connection from an external application.
- Never equate an API key with a participant identity.
- Every token is audience-restricted and minimally scoped.
- Tokens are short-lived where practical.
- Refresh tokens use rotation or sender-constraining where applicable.
- Revocation is first-class.
- Every consequential request carries correlation and idempotency identifiers.
- Consequential results create Event/Evidence only after actual execution.
- Unknown provider state remains UNKNOWN.
- Integration connectivity does not imply user authority.

## OAuth/OIDC

Use Authorization Code + PKCE for public clients and transaction-specific state/nonce. Token privileges are least-privilege and audience-restricted. Federated identity never bypasses LegaKeys authorization.

## SCIM

SCIM may provision/deprovision organization identities or accounts where an organization is authorized to manage them. SCIM lifecycle operations never bypass LegaKeys policy or historical evidence.

## Event boundary

External consumers receive events through authenticated subscriptions. Event delivery is not an authority grant. Consumers must safely retry using event IDs and idempotency semantics.

## Canonical separation

Authentication → Session → Participant → Context → Capability → Authorization → Action

Never: Authentication → automatic authority