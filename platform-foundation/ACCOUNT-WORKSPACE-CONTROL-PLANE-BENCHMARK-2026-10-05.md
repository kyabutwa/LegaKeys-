# LEGAKEYS — ACCOUNT, WORKSPACE & CONTROL-PLANE BENCHMARK
Date: 2026-10-05
Status: Canonical product architecture input

CI verification: production gate must be green before release.

## Benchmark set
USA: Apple, Google, Microsoft, GitHub, Slack, Notion, Linear, Atlassian, Salesforce, ServiceNow, Stripe, AWS, Okta, 1Password, Uber.

Singapore: GovTech Singapore, Singpass, Grab, Sea, DBS, OCBC, UOB, Singtel, ST Engineering, NCS, JTC, CapitaLand, Keppel, SP Group, Certis.

Publicly documented patterns are used where available; proprietary internal architecture is not assumed.

## Patterns adopted
| Pattern | Benchmark signal | LegaKeys adaptation |
|---|---|---|
| One durable identity | Apple, Google, Microsoft, Singpass | PERSON identity is canonical; contexts do not duplicate identity |
| Account ≠ identity | Microsoft, Okta, Atlassian | Account authenticates; identity describes |
| Sessions are first-class | Apple, Google, Notion, 1Password | Independently revocable canonical sessions |
| Recovery is a security workflow | Google, Microsoft, 1Password | Recovery key/reset, session revocation, security events |
| Personal vs shared administration | Slack, Notion, Linear, Atlassian | Personal Account Center is separate from Community/Workspace administration |
| Context switching | Slack, Notion, Linear | Active context changes relevance/scope, never identity |
| Scoped administration | Microsoft, Okta, AWS, Atlassian | Roles/capabilities are scoped; authorization is separately evaluated |
| Auditability | GitHub, Atlassian, Okta | Administrative/security actions produce attributable events |
| Lifecycle management | Okta, Microsoft, Atlassian | Pending/active/locked/suspended/closed states are explicit |
| Least privilege | Okta, AWS, GitHub | No role, membership, capability or visibility silently grants consequential authority |
| Shared platform primitives | GovTech SGTS, Microsoft, AWS | Common identity/context/event/evidence primitives underneath purpose-built workspaces |
| Physical + digital operations | JTC, ST Engineering, Certis, SP Group | Places, access, services and work are governed objects |
| Mobile simplification | Apple, Notion, Slack | One task/decision at a time; desktop adds density, not a new object model |
| Truthful state | Stripe, AWS, GovTech | Unknown/pending/unavailable/denied/failed/completed remain distinct |
| AI boundary | ServiceNow, Microsoft, Okta | AI explains/proposes/prepares; it never creates authority |

## Canonical control-plane model
### Personal Control Plane
Account, Identity, Sign-in & Security, Sessions & Devices, Recovery, Privacy & Data, Appearance & Accessibility, Notifications, Integrations, Participation and Account Lifecycle.

### Context Control Plane
Community, Place, Team, Work, Service, Access Point, Visitor and Project. Context changes relevance, never identity.

### Community Operating Plane
Community profile, people/participation, workers/teams, places/facilities, providers, access inventory, services, visitors, work, incidents, governance and evidence.

A community cannot suspend a person's global account, read credentials, create global authority, bypass LegaKeys authorization or disable platform services.

### LegaKeys Platform Plane
Global identity/security policy, authorization, BeatAccess, service registry, provider adapters, infrastructure, governance/compliance, observability and developer/integration controls.

## Canonical interaction pipeline
```
IDENTITY → ACCOUNT → AUTHENTICATION → CANONICAL SESSION
→ ACTIVE CONTEXT → RELATIONSHIP/MEMBERSHIP → ROLE
→ CAPABILITY → POLICY + CONDITIONS → AUTHORIZATION
→ ACTION → EVENT → EVIDENCE → OUTCOME
```
**NO AUTHORIZATION → NO CONSEQUENTIAL ACTION**

## Workspace rule
A workspace is a purpose-built operating surface over canonical objects, not a second identity system.
- One person can use multiple contexts with one identity/account.
- A community operator can have an independent community identity/account.
- Membership does not equal authority.
- Role does not equal authorization.
- Visibility does not equal authorization.
- AI output does not equal authorization.
- Provider connection does not equal authorization.

## Mobile / desktop rule
The data model is identical across phone, tablet and desktop.

Phone: active context, attention, one primary task, compact navigation, sheets and focused surfaces.
Tablet: split views and contextual panels.
Desktop: persistent navigation, multi-column work, dense evidence/audit inspection, advanced governance and spatial surfaces.

## Settings rule
Settings are never one undifferentiated page.

Personal: Account → Identity → Security → Sessions → Privacy → Preferences.
Context: Participation → Community contexts → Access → Services → Notifications.
Administration: Workspace → People → Roles → Policies → Integrations → Audit → Governance.

Only settings permitted by the current scope and authority are actionable.

## Security rule
The canonical browser session is the LegaKeys session cookie. Provider cookies, API tokens, UI flags and third-party sessions are not substitutes.

Security Center exposes account state, credential state, recovery readiness, current/other sessions, revoke-one/revoke-all, security events and identity assurance.

Password recovery is short-lived, single-use and non-enumerating.

## Governance rule
Every consequential administrative mutation is attributable:
**actor + action + target + scope + time + authorization + result + evidence**

Historical events are immutable.

## Product quality gate
A mature feature requires:
1. canonical object
2. explicit scope
3. lifecycle
4. permission/capability model
5. authorization decision
6. execution boundary
7. event
8. evidence
9. audit visibility
10. mobile + desktop behavior
11. truthful failure/unknown state
12. recovery/revocation path where security-sensitive

## Research references
GovTech Singapore documents shared infrastructure covering identity, payments, notifications, cloud and API exchange, plus citizen-centric digital-service standards. citeturn0search2turn0search4

Slack separates organization administration from workspace administration and supports workspace switching on desktop and mobile. citeturn0search7turn2search0

Notion uses a workspace switcher and deliberately reduces advanced administration on mobile while preserving context navigation. citeturn2search1turn2search8

Linear separates workspace membership/roles from workspace administration and integrations. citeturn2search2

Atlassian separates organization, site, user-access and app administration roles. citeturn1search2

GitHub exposes scoped roles and attributable organization audit logs. citeturn1search9turn1search6

Okta combines lifecycle management, access requests, entitlements and access review. citeturn2search14turn2search5

1Password treats recovery as a controlled security process with multiple recovery-capable administrators. citeturn2search12turn2search15

## Final LegaKeys pattern
**One identity. One account. Many contexts. Scoped workspaces. Explicit capabilities. Policy-based authorization. Observable execution. Immutable evidence.**
