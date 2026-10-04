# World Service Contract

## Commands

POST /world/entities — register a governed world entity.
POST /world/places — create or update a Place after entity resolution.
POST /world/relationships — create a typed relationship with explicit subject/object semantics.
POST /world/observations — record an observation without silently promoting it to verified truth.
POST /world/states — project current world state from governed evidence.
GET /world/entities/:id — retrieve canonical entity and world representation.
GET /world/places/:id/tree — retrieve containment hierarchy.
GET /world/places/:id/relationships — retrieve first-class relationships.
GET /world/places/:id/state — retrieve current state plus provenance.

## Place hierarchy

COUNTRY -> REGION -> CITY -> COMMUNITY -> PHASE -> BUILDING -> FLOOR -> UNIT

Additional types: COMMON_AREA, FACILITY, WORKSPACE, ACCESS_POINT, PARKING_AREA, ROOFTOP, SHARED_SPACE.

## Relationship rules

Every relationship declares subject, type, object, context, state, temporal validity, source, provenance and cardinality where relevant. Mature enterprise models make relationship meaning and cardinality explicit. citeturn0search3turn0search0

## Truth boundary

OBSERVED is not VERIFIED.
INFERRED is not VERIFIED.
PROPOSED is not ACTIVE.
UNKNOWN is not FALSE.

## Authorization boundary

World establishes what is known about the world. It cannot grant access, approve consequential actions, or infer authorization from location, ownership, management, containment, or relationship alone.

## Idempotency

Create/update commands use request IDs and idempotency keys. External observations are deduplicated using source identity where available.

## Failure behavior

Provider or sensor absence produces UNKNOWN or UNAVAILABLE. It never produces fabricated live state.
