# LegaKeys Workspaces

## Purpose

A Workspace is a governed operational environment for a defined purpose, scope and set of participants. It organizes context, information, tools, workflows and views without becoming an authority by itself.

LegaKeys has distinct workspace classes: LEGAKEYS_OPERATING, COMMUNITY_OPERATING, SERVICE_OPERATING, TEAM, PERSONAL, INCIDENT, PROJECT and REVIEW.

## Critical distinction

WORKSPACE ≠ AUTHORITY.

Membership, visibility, role assignment, dashboard access or workspace ownership never automatically grants consequential authority. Every consequential operation still crosses Capability → Authority → Authorization → Action Runtime.

## Canonical model

PARTICIPANT → WORKSPACE MEMBERSHIP → WORKSPACE ROLE → SCOPED CAPABILITIES → CONTEXT → AUTHORIZATION → ACTION → EVENT → EVIDENCE

A workspace provides operational context and controlled collaboration. It does not replace Identity, Participant, Context, Capability or Authority.

## Design benchmark

Modern workspace systems commonly combine purpose-built experiences with role/scoped access. ServiceNow describes configurable workspaces as targeted, purpose-built environments; Microsoft documents differentiated administrator roles and scoped administrative units; Atlassian separates global, space and item permissions and uses reusable permission schemes and space roles. LegaKeys adopts these patterns while preserving its stronger separation between visibility, capability and authorization. citeturn0search1turn0search2turn0search3

## Workspace layers

1. Identity — workspace identity and version.
2. Purpose — why the workspace exists.
3. Scope — community, organization, service, project, incident or personal boundary.
4. Membership — participant-to-workspace relationship.
5. Roles — workspace-specific functional roles.
6. Capabilities — operations available to a role, subject to authorization.
7. Views — dashboards, queues, maps, records and tools.
8. Work items — tasks, requests, cases, proposals and reviews.
9. Policy — workspace configuration and governing references.
10. Audit — membership, configuration and operational history.

## Workspace types

### LegaKeys Operating Workspace
Internal environment where authorized LegaKeys workers build, operate, review and govern LegaKeys.

### Community Operating Workspace
Operational environment for an authorized participating community. It coordinates the community context but does not own LegaKeys core services or override LegaKeys platform policy.

### Service Operating Workspace
Operational environment for managing a Beat service's declared workflows, requests, fulfillment and outcomes.

### Team / Project / Incident / Review
Purpose-specific collaboration environments with explicit scope and lifecycle.

### Personal Workspace
A participant's private operational surface. Personal visibility does not create authority over other participants or community resources.

## Membership

Membership is explicit, scoped and temporal. A participant may hold multiple workspace memberships and roles. Removing membership immediately removes workspace access according to policy, but does not silently rewrite historical events.

## Roles and permissions

Workspace roles are functional assignments such as Administrator, Operator, Reviewer, Contributor, Analyst or Viewer. A role maps to declared capabilities, not automatic authorization. The Authorization domain evaluates the actual action, target, context, authority, conditions and policy at execution time.

## Delegation

Delegation is explicit, scoped, time-bounded and auditable. A workspace cannot delegate more authority than its governing authority permits.

## Views and tools

A view may expose data or prepare an action. A tool may be read-only or consequential. Consequential tools must return through Authorization → Action Runtime. UI visibility never equals permission to execute.

## Cross-workspace boundaries

Cross-community, cross-organization and sensitive-data joins require explicit policy scope. A user being a member of two workspaces does not automatically authorize data or action across them.

## AI boundary

GENESIS and CONSTANTYNA may read permitted workspace context, summarize, explain, identify missing information and prepare proposals. They cannot create membership authority, grant authorization or execute consequential operations directly.

## Truth and audit

Workspace state distinguishes CURRENT, UNKNOWN, UNAVAILABLE, PENDING, DENIED, FAILED, EXPIRED, REVOKED and COMPLETED where applicable. Configuration and membership changes are attributable and temporal. Historical audit records remain immutable.

**NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**

This module is the canonical workspace domain foundation. Runtime UI, live policy evaluation, production migrations and external integrations require separate verified execution work.
