# LegaKeys Workspaces — Service Contract

## 1. Create Workspace

Input: workspaceId, type, name, purpose, ownerScope, governanceRef, lifecycle, correlationId.

Rules: scope is mandatory; purpose is mandatory; duplicate creation is idempotent; creation creates no consequential authority.

## 2. Add Membership

Input: participantRef, workspaceRef, membershipRole, scope, validFrom, validUntil, basisRef.

Rules: participant must resolve; role is workspace-scoped; temporal validity is explicit; membership does not itself authorize consequential actions.

## 3. Remove / Revoke Membership

Rules: future workspace access is blocked according to policy; historical actions remain auditable; revocation does not erase history.

## 4. Assign Workspace Role

A role binds a participant to a workspace function. Role → capability mapping is explicit. Role assignment is not an authorization decision.

## 5. Configure Workspace Capability

Defines which declared capabilities may be surfaced or requested in a workspace. It cannot grant authority beyond the governing policy.

## 6. Create Work Item

Work items may be tasks, requests, cases, proposals, reviews, incidents or operational records. Consequential work items must carry context and authorization references before execution.

## 7. Execute Workspace Action

WORKSPACE CONTEXT → CAPABILITY → AUTHORITY → AUTHORIZATION → ACTION RUNTIME → EVENT → EVIDENCE.

A workspace must never directly execute a consequential command.

## 8. Delegate

Delegation requires delegator, delegatee, scope, capability, validity window, conditions, policy reference and audit trail. Delegation cannot exceed delegator authority.

## 9. Cross-workspace Access

Requires explicit source scope, target scope, purpose and policy evaluation. Membership in both workspaces is not sufficient.

## 10. Workspace Views

Views may be PERSONAL, ROLE, TEAM, COMMUNITY, SERVICE, INCIDENT, PROJECT or SYSTEM. A view is a projection, not an authority object.

## 11. Workspace Lifecycle

PROPOSED → CONFIGURING → ACTIVE → DEGRADED → SUSPENDED → ARCHIVED.

Suspension blocks new operations according to policy while preserving history.

## 12. Audit

Audit records membership, role, configuration, delegation, access decisions and workspace lifecycle changes with actor, time, scope, correlation and provenance.

## 13. APIs

POST /workspaces
POST /workspaces/:id/memberships
POST /workspaces/:id/roles
POST /workspaces/:id/capabilities
POST /workspaces/:id/delegations
POST /workspaces/:id/work-items
POST /workspaces/:id/access-evaluate
POST /workspaces/:id/suspend
POST /workspaces/:id/archive
GET /workspaces/:id
GET /workspaces/:id/memberships
GET /workspaces/:id/roles
GET /workspaces/:id/work-items
GET /workspaces/:id/audit
