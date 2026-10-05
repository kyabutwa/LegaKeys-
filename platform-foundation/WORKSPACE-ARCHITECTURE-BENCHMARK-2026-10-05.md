# LegaKeys Workspace Architecture Benchmark — 2026-10-05

## Scope

This benchmark informs the Community Operating Workspace and LegaKeys Operations Workspace. It uses publicly documented architecture/security patterns where available; proprietary internal architecture is not assumed.

## 30-company pattern synthesis

| Benchmark | Public pattern to learn | LegaKeys adaptation |
|---|---|---|
| Apple | Shared records, explicit collaboration scope, owner/participant permissions | Workspace scope + explicit membership; shared context never becomes global authority |
| Microsoft Entra | Tenant boundaries, delegated administration, lifecycle governance | Community scope and LegaKeys scope remain separate operating boundaries |
| Microsoft Dataverse | Roles + teams + business/security units + least privilege | Workspace role + scope + declared capability, then separate authorization |
| ServiceNow | Purpose-built workspaces, common data model, workflow governance | Operational workspace modules share canonical entities and workflow lineage |
| Salesforce | Object/relationship model and scoped access patterns | Relationship-first workspace context; no hidden permission semantics |
| Atlassian | Reusable permission schemes and space/item boundaries | Workspace roles and scope references; cross-workspace joins require explicit policy |
| GitHub | Organizations, teams, repository-scoped permissions and auditability | Community teams and workspace memberships are scoped and auditable |
| Stripe | Platform/account separation and explicit capability states | Beat services expose declared capability/connection/authorization separately |
| Shopify | Admin surfaces organized around operational resources and delegated staff access | Community dashboard organizes places, services and work without owning platform services |
| Okta | Identity lifecycle, groups and delegated administration | BeatIdentity/account/session remains distinct from workspace membership and authority |
| Google Workspace | Admin roles, organizational grouping and audit | LegaKeys operations roles are scoped; governance changes remain attributable |
| AWS | Hierarchical organizations, delegated administration, policy boundaries | Community context can delegate only within governing authority |
| Snowflake | Role hierarchy and explicit object privileges | Capability is explicit; authorization remains action/resource/context specific |
| Datadog | Organization/team/service views and operational observability | Workspace modules surface operational state without manufacturing authority |
| PagerDuty | Team/service/on-call operational boundaries | Community responsibilities, shifts and assignments remain scoped records |
| Twilio | Account/subaccount isolation and credential scoping | Service/provider boundaries never collapse into participant authority |
| Uber | Role/context separation across rider/driver/merchant operational surfaces | Community and service workspaces coordinate contexts without becoming one authority domain |
| Grab | Multi-sided service roles and operational context | People, providers and community operations remain distinct participants/contexts |
| Gojek | Multi-service operational model | Beat services remain platform-managed capabilities, not community-owned modules |
| Revolut | Account/team permissions and financial operation controls | BeatPay actions require independent authorization and evidence |
| Adyen | Platform/account-holder capability states | Provider connection state remains truthful and separate from service availability |
| Visa | Network/provider separation | LegaKeys is not a payment network; adapters remain external boundaries |
| Mastercard | Network roles and controlled transaction lifecycle | Payment intent → authorization → execution → event → evidence |
| Palantir | Ontology/context-driven operational model | Digital Twin/context may inform workspaces but never grant authority |
| Siemens | Asset/operations/service-oriented industrial modeling | Places, facilities, resources and maintenance are first-class operational objects |
| Airbnb | Host/guest/resource context and controlled sharing | Community participation and place relationships remain explicit and bounded |
| Block | Account/payment/platform primitives | Payment capability is explicit and execution is independently governed |
| Slack | Workspace/team/channel collaboration scopes | Team and workspace visibility are collaboration constructs, not authority |
| Notion | Workspace/space/page hierarchy and granular sharing | Hierarchical workspace views do not create consequential permissions |
| Linear | Issue/project/team/workflow organization | Work items remain traceable and can reference proposal/authorization/action lineage |
| Figma | Team/project/file collaboration boundaries | Workspace collaboration is explicit and auditable |

## Cross-company principles adopted

1. One canonical data model underneath purpose-built workspaces.
2. Explicit organizational/context boundaries.
3. Least privilege and scoped roles.
4. Membership and visibility are not authority.
5. Lifecycle and deprovisioning are first-class.
6. Audit history is attributable and immutable.
7. Operational work is organized as explicit work items.
8. AI can summarize/recommend/prepare, but cannot manufacture authority.
9. External provider state is explicit and truthful.
10. Cross-boundary operations require an explicit policy/authorization reference.

## LegaKeys differentiator

The strongest benchmark pattern is combined with the LegaKeys invariant:

**NO AUTHORIZATION → NO CONSEQUENTIAL ACTION**

Therefore:

**Participant → Workspace Membership → Workspace Role → Scoped Capability → Context → Authorization → Action → Event → Evidence**

A dashboard can expose a capability, prepare a proposal, or explain a decision. It cannot silently become the source of authority.

## Sources

The implementation was cross-checked against current public Microsoft Entra tenant/lifecycle guidance, Microsoft Dataverse security documentation, Apple CloudKit shared-record documentation, and current ServiceNow architecture material. These sources reinforce explicit boundaries, scoped administration, lifecycle governance, collaboration scope, workflow/data-model consistency and auditability.
