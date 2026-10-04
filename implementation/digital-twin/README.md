# LegaKeys Digital Twin

## Purpose

The LegaKeys Digital Twin is the governed, derived representation of the known world and its changing state. It represents people, places, physical entities, resources, devices, services, relationships, operational conditions and relevant digital entities without becoming the source of authority.

It is not a 3D model and it is not limited to buildings. It is a state-and-relationship system that can expose current state, historical state, provenance, uncertainty and temporal change.

## Canonical position

WORLD
→ DIGITAL TWIN REPRESENTATION
→ STATE / RELATIONSHIP / PROVENANCE
→ KNOWLEDGE
→ GENESIS / CONSTANTYNA
→ PROPOSAL
→ AUTHORIZATION
→ ACTION
→ EVENT
→ EVIDENCE
→ DIGITAL TWIN UPDATE

The twin is downstream of governed facts and upstream of intelligence. It never crosses the authorization boundary.

## Benchmark alignment

The design is informed by ISO/IEC 30188:2026 digital-twin reference architecture, ISO 23247 principles and composition, AWS IoT TwinMaker entity/component/relationship patterns, Azure Digital Twins graph/state/event patterns, and NIST trust, security, verification, validation and uncertainty guidance. These references inform interoperability and trust patterns; LegaKeys retains its own canonical semantics.

## Canonical model

DIGITAL TWIN
- twin identity
- subject/entity reference
- model/type
- topology and relationships
- properties/state
- temporal validity
- source/provenance
- truth state
- confidence/quality
- freshness
- lifecycle
- governance/privacy scope
- historical snapshots
- synchronization metadata
- derived views

## Twin layers

1. **Identity layer** — stable reference to the real/digital subject.
2. **Model layer** — canonical type and semantic schema.
3. **Graph layer** — entities and directional relationships.
4. **State layer** — current known properties and operational state.
5. **Observation layer** — incoming observations and measurements.
6. **History layer** — immutable events/evidence and state transitions.
7. **Provenance layer** — source, method, timestamps, lineage and quality.
8. **Trust layer** — VERIFIED, DECLARED, OBSERVED, INFERRED, PROPOSED, UNKNOWN.
9. **Governance layer** — scope, privacy, retention, stewardship and audit.
10. **Projection layer** — maps, cards, dashboards, search, 3D/visual views and analytics.

## State discipline

The twin may say:
- VERIFIED: independently established under the applicable verification rule.
- DECLARED: explicitly declared by an authorized source but not independently verified.
- OBSERVED: directly observed/received from a source.
- INFERRED: derived by a governed inference process.
- PROPOSED: suggested future state, not actual state.
- UNKNOWN: not sufficiently established.

UNKNOWN is a valid state. Stale data is not silently treated as current.

## Current versus history

Current twin state is a materialized projection for efficient access. Historical events and evidence remain authoritative for what happened. A state correction must append provenance and transition history; it must not rewrite immutable history.

## Twin graph

Nodes represent governed entities. Edges represent explicit relationships with:
- relationship type
- source/target
- scope
- temporal validity
- truth state
- provenance
- confidence/quality
- created/updated timestamps

Containment, location, association or visualization never implies authority.

## Synchronization

Sources can include:
- LegaKeys World
- BeatIdentity / participant references
- declared community data
- devices and sensors
- Beat services
- external provider integrations
- World Intelligence
- Action/Event/Evidence
- governed human/system observations

Every synchronization carries source identity, source version where available, acquisition time, received time, correlation ID, provenance and truth state.

Provider connectivity is never invented. A missing source becomes UNKNOWN or DEGRADED according to policy.

## Twin update contract

OBSERVATION / EVENT / EVIDENCE
→ VALIDATE
→ RESOLVE SUBJECT
→ CHECK SCOPE
→ CHECK PROVENANCE
→ CLASSIFY TRUTH
→ APPLY TEMPORAL RULES
→ UPDATE CURRENT PROJECTION
→ APPEND TWIN HISTORY
→ EMIT CHANGE EVENT
→ DOWNSTREAM KNOWLEDGE

No twin update can grant authority.

## Simulation and prediction

A simulation, forecast or what-if scenario is a derived scenario and must never overwrite observed/current state. Scenario state is explicitly labeled PROPOSED or SIMULATED and carries model/version, assumptions and validity window.

## Security boundary

The Digital Twin:
- cannot authenticate a person
- cannot create a Participant
- cannot create Capability
- cannot grant Authority
- cannot create Authorization
- cannot unlock a door
- cannot move money
- cannot execute a consequential service
- cannot convert an inference into verified fact
- cannot rewrite immutable Event/Evidence history

**NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**

## Production boundary

This module defines the canonical domain, persistence foundation, contracts, types and verification cases. Provider adapters, live sensor feeds, 3D rendering, streaming infrastructure and production migrations are separate implementation layers and must be explicitly verified before being claimed as live.
