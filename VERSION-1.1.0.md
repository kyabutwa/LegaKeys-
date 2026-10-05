# LegaKeys v1.1.0 — Foundation-to-Product Update

**Release objective:** turn the existing 17-domain foundation into a coherent, truthful product architecture without collapsing identity, participation, community governance, authorization or service ownership into one concept.

## Locked v1.1.0 principles

1. **One canonical identity fabric.** People, communities, organizations, places, services and other entities use the same BeatIdentity model. A person does not receive a new identity when joining a community.
2. **Independent community identity.** A community is an entity in its own right. Creating a community does **not** require a participant account, does not create a participant membership for the creator, and does not make the creator the owner of the LegaKeys platform.
3. **Participation is contextual.** A person can participate in many communities through explicit participation records. Community creation and person participation are separate flows.
4. **Authority is never implied.** Creation, authentication, membership, capability, interface visibility and recognition do not grant consequential authority.
5. **Community scope is independent.** A community coordinates its own people, places, plans and operational records. LegaKeys remains the platform and service-governance boundary.
6. **Truth before appearance.** DECLARED, VERIFIED, OBSERVED, INFERRED, PROPOSED and UNKNOWN states remain explicit. No provider connection is invented.
7. **Execution remains gated.** No authorization → no consequential action.
8. **Law is an architecture input.** Kenyan privacy, cybersecurity, consumer and sector requirements are represented as versioned policy objects with provenance and review/update state.
9. **Intelligence remains subordinate.** GENESIS and CONSTANTYNA can understand, reason, explain and propose; neither self-authorizes.
10. **One product surface.** Landing, identity, communities, services, access, workspaces, intelligence, legal/compliance and founder/research narrative are parts of one LegaKeys experience.

## Canonical v1.1.0 tree

WORLD → BEATIDENTITY → ACCOUNT → PARTICIPATION → CONTEXT → CAPABILITY → AUTHORITY → AUTHORIZATION → ACTION → EVENT → EVIDENCE → OUTCOME

Cross-cutting foundations:
- Community Operating System
- LegaKeys Operating System
- Digital Twin
- BeatAccess
- Services
- GENESIS
- CONSTANTYNA
- Urban/World Intelligence
- Governance & Compliance
- Research & Founder narrative

## Community creation contract

POST /api/community/create creates:
- a COMMUNITY entity;
- a COMMUNITY BeatIdentity;
- a community operating workspace;
- a community profile;
- an independent community account/credential for its declared operator contact;
- a canonical LegaKeys session for that community account.

It does **not**:
- require a participant session;
- create a participant;
- create a community membership for a person;
- silently grant operational authority;
- make community services privately owned;
- override LegaKeys platform governance.

A person may later join the community through the normal participant participation flow. Their person identity remains the same identity across all communities.

## Release gate

v1.1.0 is complete only when:
- build passes;
- canonical Neon schema is connected;
- community creation works without participant authentication;
- community account session works;
- participant signup/login/recovery works;
- community join still requires participant authentication;
- community operations are scoped and authorization-gated;
- no stale participant-session gate remains on community creation;
- legal/compliance registry is present and versioned;
- founder/research surface exists;
- landing and lower-page/footer surfaces are complete;
- deployed runtime smoke passes.
