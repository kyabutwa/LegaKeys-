# LEGAKEYS — WORLD IMPLEMENTATION

Status: Canonical implementation foundation.
Scope: World -> Entity -> Place -> Physical Entity -> Resource -> World Relationships.

The World layer is the governed representation of what exists, where it exists, how it is related, and what state is known. It does not grant authority.

Benchmark principle: use a shared vocabulary and explicit relationship model so services and workflows consume the same world representation. ServiceNow's CSDM emphasizes a standardized, extensible data foundation across workflows; Salesforce and Dataverse make relationship meaning and cardinality explicit; CloudKit uses durable record identity and references for related records. citeturn0search1turn0search3turn0search0turn0search2

## Canonical world hierarchy

WORLD
  -> COUNTRY
  -> REGION
  -> CITY
  -> COMMUNITY
  -> PHASE
  -> BUILDING
  -> FLOOR
  -> UNIT

The hierarchy is extensible. Common areas, facilities, access points, parking areas, rooftops and shared spaces are Places, not special authority objects.

## World object families

- Entity
- Place
- Physical Entity
- Resource
- World Relationship
- World State
- World Observation
- Provenance Reference

## Boundary

World can answer:
- What exists?
- Where is it?
- What contains it?
- What is it related to?
- What state is known?
- What source supports that state?

World cannot by itself answer:
- Who is authorized?
- Who may access?
- Who may execute an action?

Those belong to Context, Capability, Policy and Authorization.

## Truth

World state supports VERIFIED, DECLARED, OBSERVED, INFERRED, PROPOSED and UNKNOWN.

No inferred location becomes verified merely because an interface displays it.

## Lifecycle

World objects use explicit lifecycle and temporal validity. Historical observations are retained; current state is a projection.

## Safety

- No fabricated places.
- No fabricated provider locations.
- No inferred ownership treated as ownership.
- No location relationship treated as authorization.
- No community containment treated as system-wide control.
- No UI map/card state becomes canonical state.
- No consequential action is executed by the World layer.

NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
