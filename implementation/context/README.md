# LEGAKEYS — CONTEXT IMPLEMENTATION

Status: Canonical implementation foundation.
Scope: Context -> scope -> place -> participant -> relationship -> purpose -> conditions -> time.

Context is the governed description of a situation in which an actor, subject, resource, capability or service is being considered. It gives meaning to relationships and decisions without becoming authority.

## Design benchmark

ServiceNow CSDM emphasizes a shared data foundation and explicit relationships across workflows. Dataverse treats organizational/security boundaries as explicit scope constructs. Salesforce models relationships with named semantics and cardinality. Apple CloudKit groups related records into explicit zones and uses durable references. LegaKeys applies the same maturity principle while keeping Context strictly separate from Authorization. citeturn0search1turn0search3turn0search8turn0search0

## Canonical context model

CONTEXT
  -> ACTOR
  -> SUBJECT
  -> PARTICIPATION
  -> PLACE / WORLD SCOPE
  -> RELATIONSHIPS
  -> PURPOSE
  -> TIME WINDOW
  -> CONDITIONS
  -> RESOURCES
  -> APPLICABLE POLICY REFERENCES
  -> PROVENANCE

A Context may be:
- personal
- household
- residential
- workplace
- community
- service
- visitor
- delivery
- maintenance
- incident
- transaction
- operational
- emergency
- system

These are context types, not authority levels.

## Boundary

Context answers:
- What situation are we in?
- Who/what is involved?
- What scope applies?
- Where and when does it apply?
- Why is the interaction happening?
- What relationships and conditions are relevant?

Context does not answer:
- Who is authorized?
- What consequential action may occur?
- Whether a capability may be exercised.

Those belong to Capability, Policy and Authority.

## Non-negotiable distinctions

Context != Identity
Context != Role
Context != Capability
Context != Authorization
Context != Access
Context != Action

A person being in a place, having a relationship, holding a role, belonging to a community, or being associated with a service never becomes authorization merely because Context records it.

## Truth

Context references World facts and participation facts by stable IDs. It does not duplicate or fabricate them. Context conditions may be DECLARED, OBSERVED, INFERRED, PROPOSED or UNKNOWN and retain provenance.

## Scope

Context scope is explicit and composable. Cross-community or cross-organization context requires explicit scope references and must not imply global visibility.

## Temporal behavior

Every active context has a defined temporal meaning. Context can be scheduled, active, expired, suspended or closed. Historical context remains auditable.

## Core invariant

NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
