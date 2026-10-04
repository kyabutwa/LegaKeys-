# LegaKeys Core Domains Contract

## Production scope

This gate treats the five advanced Core Domains as one production integration boundary: Workspaces, Digital Twin, CONSTANTYNA, GENESIS, and World Intelligence.

Schema presence alone is not sufficient. Production verification checks both domain persistence and the cross-domain references required for governed operation.

## Canonical chain

WORLD / OBSERVATION → CONTEXT → DIGITAL TWIN → KNOWLEDGE / INTELLIGENCE → CONSTANTYNA / GENESIS → PROPOSAL → AUTHORIZATION → ACTION → EVENT → EVIDENCE → OUTCOME → DIGITAL TWIN UPDATE

## Domain boundaries

- Workspaces organize operational context and collaboration; membership, role and visibility never become authority.
- Digital Twin is a derived state/relationship representation; it never grants authority and preserves historical transitions.
- CONSTANTYNA understands human input and context; memory, conversation and recommendations never grant authority.
- GENESIS observes, reasons and proposes; consequential tool use requires authorization/action references.
- World Intelligence provides spatial, environmental and contextual signals with provenance and uncertainty; it never creates authority.

## Structural contract

Production verification requires all five domain table sets plus these lineage references:
- workspace work items → authorization_ref
- Digital Twin transitions → event_ref + evidence_refs
- CONSTANTYNA runs → session_id
- GENESIS proposals → authorization_id
- GENESIS tool invocations → authorization_id + action_id
- spatial observations → provenance
- contextual understanding → authority/capability/human-understanding references

## Truth boundary

These checks prove structural integration only. They do not claim live external providers, live sensors, model availability, authenticated user sessions, or consequential execution.

## Release rule

**Core Domains = GREEN only when the production endpoint reports VERIFIED for all five domains and all linkage checks.**

Passing this gate leaves the separate authenticated-user and consequential-action gate open.