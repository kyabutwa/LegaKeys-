# LEGAKEYS — ACCOUNT + PARTICIPANT OPERATING MODEL

Status: Canonical design for implementation
Date: 2026-10-05

## 1. Benchmark synthesis

The model was benchmarked against 30 relevant leaders across the USA, Singapore, Saudi Arabia and France. The benchmark set mixes consumer platforms, identity providers, financial infrastructure, smart-city/real-estate operators, enterprise workflow platforms and national digital-identity systems.

| Region | Reference | Primary pattern extracted |
|---|---|---|
| USA | Apple | account-centric settings, trusted-device/session visibility, clear user control |
| USA | Google | security center, sessions/devices, recovery and step-up authentication |
| USA | Microsoft | identity/account/security separation and enterprise lifecycle |
| USA | AWS | composable infrastructure and explicit service boundaries |
| USA | Stripe | API-first account and integration primitives |
| USA | Salesforce | account/org/context separation and delegated administration |
| USA | ServiceNow | lifecycle, workflow, audit and operational state as first-class objects |
| USA | Okta | policy-driven authentication, lifecycle management, least privilege |
| Singapore | GovTech / Singpass | national-scale identity federation, strong authentication, consented data sharing |
| Singapore | Grab | one participant identity spanning multiple everyday services |
| Singapore | Sea | shared identity/commerce/payment platform patterns |
| Singapore | JTC | district-scale operating layer and digital-twin coordination |
| Singapore | ST Engineering | physical infrastructure + security + operations |
| Singapore | Singtel | connectivity as a platform capability |
| Singapore | SP Group | utility/service infrastructure as governed digital operations |
| Saudi Arabia | SDAIA / Nafath | centralized digital identity, verification and account suspension controls |
| Saudi Arabia | stc | identity + telecom + digital-service ecosystem |
| Saudi Arabia | Elm | government digital-service integration and identity-linked workflows |
| Saudi Arabia | Absher | unified identity-backed service access and account controls |
| Saudi Arabia | Jahez | marketplace/service orchestration with operational status |
| Saudi Arabia | HungerStation | location-aware service fulfillment and service-state separation |
| Saudi Arabia | ROSHN | large-scale community/place operating model |
| France | FranceConnect / DINUM | federated identity and traceable authentication across partners |
| France | Orange | identity, connectivity and digital-service infrastructure |
| France | AXA | regulated identity, risk and account lifecycle |
| France | BNP Paribas | high-assurance account security and transaction controls |
| France | Schneider Electric | connected infrastructure and energy operations |
| France | Thales | identity, security and trusted infrastructure |
| France | Dassault Systèmes | digital twins and lifecycle models |
| France | BlaBlaCar | participant identity, trust and service transactions |

## 2. Core separation

PERSON → BEATIDENTITY → ACCOUNT → AUTHENTICATION → SESSION → PARTICIPANT → CONTEXT → AUTHORIZATION

- Identity is who/what the entity is.
- Account is the application relationship used to authenticate.
- Credential is an authentication mechanism attached to an account.
- Session is a time-bounded authenticated interaction.
- Participant is the person's active participation in a context.
- Membership is a relationship, not authority.
- Capability describes what can be done/provided.
- Authorization is the decision that permits a consequential action.
- Role is a governance abstraction; role alone never executes anything.
- Community membership never becomes system-wide authority.

## 3. New pattern: Participant Control Plane

The participant gets one stable control surface: Identity, Account, Sessions & devices, Participation, Access, Services, Authority, Privacy, Security, Notifications, Appearance, Integrations and Close account.

## 4. Account lifecycle

Canonical states: PENDING → ACTIVE → SUSPENDED → CLOSED. Security may temporarily use LOCKED.

- PENDING: onboarding incomplete.
- ACTIVE: normal authenticated use.
- LOCKED: authentication temporarily blocked by a security control.
- SUSPENDED: intentionally disabled; active sessions revoked.
- CLOSED: permanently closed; authentication cannot resume.

## 5. Suspend vs close

Suspension is reversible: re-authenticate where appropriate, confirm, revoke sessions, disable credentials, preserve history, set SUSPENDED, record the security event, permit governed reactivation.

Closure is controlled and potentially irreversible: confirm identity, check obligations, explain retention exceptions, revoke sessions/credentials, end participations as policy requires, close account, delete/de-identify data no longer required, preserve legally required/integrity-critical records, record closure.

## 6. Canonical session

The browser receives one canonical HttpOnly + Secure + SameSite session cookie. Provider cookies, access tokens, API keys and UI flags are never treated as the LegaKeys canonical session.

Each session is independently revocable. The participant sees current device/session, creation time, last seen, expiry and state, with revoke-one and revoke-all controls.

## 7. Credential and recovery

Credentials are typed, stateful, verifiable, expirable and revocable. The architecture supports password, verified email, verified phone, federated identity and future device credentials without making any one mechanism foundational.

Passwords are never stored in plaintext. The Cloudflare Worker implementation may use PBKDF2-HMAC-SHA-256 as an adaptive runtime-compatible fallback when Argon2id/scrypt is not available; the credential format is versioned for future migration.

Recovery is an authentication process, not a UI shortcut. It must not reveal account existence, must be short-lived and single-use, require a verified recovery path or stronger identity proof, revoke sessions when policy requires, and create a security event.

## 8. Participant vs account

One account authenticates one canonical identity. One identity may have many participation contexts: personal, resident, worker, visitor or community. These do not create duplicate accounts.

## 9. Community Operating System boundary

The Community Operating System manages community participants, teams, responsibilities, schedules, requests, work orders, facilities, policies and operations.

It cannot own a LegaKeys account, change global authentication, read credentials, create global authority, bypass LegaKeys authorization, or disable LegaKeys services.

A community can suspend a community participation without suspending the person's LegaKeys account.

## 10. LegaKeys Operating System boundary

The LegaKeys Operating System governs platform accounts, global identity/security policy, platform services, provider integrations, global safety controls, compliance, infrastructure and developer/integration access. It does not silently become a community's operational authority.

## 11. External interface boundary

Every approved external client, community system, provider adapter, partner or future application enters through an explicit interface contract.

Interface classes: participant UI, community UI, LegaKeys workspace, provider adapter, partner API, OAuth/OIDC client, SCIM lifecycle integration and authenticated event consumer.

Every machine interface has client identity + audience + scope + authorization + expiry + revocation + audit. No integration receives a database connection as a substitute for the authorization boundary.

## 12. Settings architecture

Settings are organized around control: Account; Identity; Security; Sessions & devices; Privacy & data; Participation; Notifications; Appearance & accessibility; Integrations; Community contexts; Close account.

## Golden rule

The participant controls the account.
The identity describes the participant.
The community governs its context.
LegaKeys governs the platform.
Authorization governs consequential action.
No layer may impersonate another layer.