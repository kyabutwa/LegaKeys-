# LEGAKEYS — WORLD VERIFICATION MATRIX

Status: Canonical verification matrix.
Scope: WORLD -> ENTITY -> PLACE -> PHYSICAL ENTITY -> RESOURCE -> RELATIONSHIP -> STATE -> OBSERVATION.

## 1. Verification standard

World is conformant only when:
- Every governed object resolves to a stable Entity ID.
- Place, Physical Entity, Resource, Relationship, State and Observation remain distinct.
- Relationships preserve subject/object, context, cardinality and temporal validity.
- Truth state cannot be silently upgraded.
- Current state never destroys historical evidence.
- Provenance survives ingestion, projection and presentation.
- UNKNOWN and unavailable information remain explicit.
- UI projections cannot become canonical truth.
- World cannot grant authority or execute consequential actions.
- Idempotency prevents duplicate canonical writes.
- Scope and sensitive-location controls are enforced.

## 2. Test levels

- L0 Contract: schema, types, service contract and invariants agree.
- L1 Persistence: constraints, foreign keys, temporal windows and bounds.
- L2 Service: commands, queries, idempotency and provenance.
- L3 Truth: observed, verified, inferred, proposed and unknown remain distinct.
- L4 Security: World cannot become authorization or consequential execution.
- L5 Temporal: history remains reconstructable.
- L6 Projection: UI/Digital Twin remain derived.
- L7 Adversarial: malformed, conflicting, stale, duplicate and fabricated inputs fail safely.

## 3. Verification matrix

| ID | Area | Scenario | Expected result | Level |
|---|---|---|---|---|
| W-001 | Entity | Create governed world object | Stable Entity ID persists | L1/L2 |
| W-002 | Entity | Unknown Entity ID | Foreign-key validation rejects write | L1 |
| W-003 | Place | Create valid Place | Place persists as first-class object | L1/L2 |
| W-004 | Place | Missing Place type | Request rejected | L1/L2 |
| W-005 | Place | Valid parent-child Place | Containment persists | L1/L2 |
| W-006 | Place | Nonexistent parent | Request rejected | L1/L2 |
| W-007 | Place | Place is its own parent | Request rejected | L2/L7 |
| W-008 | Place | Containment cycle | Service validation rejects cycle | L2/L7 |
| W-009 | Place | Move Place to new parent | Change is temporalized; history retained | L5 |
| W-010 | Place | Retire Place | Historical references remain queryable | L5 |
| W-011 | Coordinates | Latitude without longitude | Request rejected | L1 |
| W-012 | Coordinates | Longitude without latitude | Request rejected | L1 |
| W-013 | Coordinates | Sensitive coordinates without precision semantics | Policy requires precision handling | L2/L4 |
| W-014 | Coordinates | Invalid coordinate range | Request rejected | L1/L7 |
| W-015 | Physical Entity | Register entity at Place | Link persists without authority | L1/L2 |
| W-016 | Physical Entity | Register without Place | Allowed when location is genuinely unknown | L2 |
| W-017 | Physical Entity | Retire physical entity | Retired state preserves history | L5 |
| W-018 | Resource | Register resource at Place | Resource remains distinct | L1/L2 |
| W-019 | Resource | Invalid quantity | Request rejected where policy forbids it | L1/L7 |
| W-020 | Resource | Change allocation | State changes without authorization grant | L2/L4 |
| W-021 | Relationship | Create typed relationship | Subject/type/object/context explicit | L1/L2 |
| W-022 | Relationship | Unknown subject | Rejected | L1 |
| W-023 | Relationship | Unknown object | Rejected | L1 |
| W-024 | Relationship | Subject equals object | Rejected by constraint | L1 |
| W-025 | Relationship | Invalid temporal window | Rejected | L1 |
| W-026 | Relationship | Relationship expires | Historical relationship remains queryable | L5 |
| W-027 | Relationship | N:N relationship | Multiple explicit relationship records supported | L2 |
| W-028 | Relationship | Missing required cardinality | Service rejects request | L2 |
| W-029 | Idempotency | Same write and idempotency key twice | One canonical write | L2/L7 |
| W-030 | Truth | Record OBSERVED | Remains OBSERVED | L3 |
| W-031 | Truth | Record VERIFIED with valid evidence | Accepted only with required provenance | L3/L7 |
| W-032 | Truth | INFERRED promoted without evidence | Promotion rejected | L3/L7 |
| W-033 | Truth | Record PROPOSED | Remains non-active/non-authoritative | L3/L4 |
| W-034 | Truth | Record UNKNOWN | UNKNOWN remains explicit | L3 |
| W-035 | Truth | Provider/sensor unavailable | UNKNOWN/UNAVAILABLE, never fabricated | L3/L7 |
| W-036 | Observation | Source and timestamp supplied | Observation retains both | L1/L3 |
| W-037 | Observation | Confidence outside 0..1 | Rejected | L1 |
| W-038 | Observation | Conflicting observations | Both remain traceable | L3/L5 |
| W-039 | Observation | Stale observation | Cannot silently represent fresh state | L3/L5 |
| W-040 | Provenance | State derived from observation | Source chain remains discoverable | L3/L6 |
| W-041 | Provenance | Projection changes | Canonical source remains identifiable | L6 |
| W-042 | History | Current state changes | Prior observations remain intact | L5 |
| W-043 | History | Place retired/deleted from active view | Evidence remains reconstructable | L5 |
| W-044 | Scope | Community data queried globally | Scope prevents unauthorized disclosure | L4 |
| W-045 | Privacy | Sensitive location requested outside scope | Reduced precision or denial | L4 |
| W-046 | Authorization | Participant is inside Place | Location grants no access | L4/L7 |
| W-047 | Authorization | Entity related to Community | Relationship grants no authority | L4/L7 |
| W-048 | Authorization | Entity associated with Place | Association cannot bypass Authorization | L4/L7 |
| W-049 | Authorization | World endpoint receives access grant | Rejected/routed to Authority layer | L4 |
| W-050 | Execution | World receives consequential action | No consequential execution | L4/L7 |
| W-051 | Digital Twin | Twin proposes world update | Proposal remains derived/non-authoritative | L6/L7 |
| W-052 | UI | Map displays inferred location | Truth state is visible; no promotion | L3/L6 |
| W-053 | UI | Client edits canonical state directly | Ungoverned mutation rejected | L4/L6 |
| W-054 | Integration | Provider returns no data | UNKNOWN/UNAVAILABLE | L3/L7 |
| W-055 | Integration | Untrusted external data claims verified truth | Not promoted to VERIFIED | L3/L7 |
| W-056 | Integration | Duplicate provider event | Duplicate canonical observation prevented | L2/L7 |
| W-057 | Concurrency | Concurrent updates | No silent lost update | L1/L2 |
| W-058 | Temporal | Relationship expires during query | Temporal validity applied | L5 |
| W-059 | Query | Retrieve Place tree | Only governed containment returned | L2 |
| W-060 | Query | Retrieve relationships | Relationships and provenance returned | L2/L3 |
| W-061 | Query | Retrieve current state | Current projection separated from history | L3/L5 |
| W-062 | Query | Query unknown state | UNKNOWN returned explicitly | L3 |
| W-063 | Failure | Database write fails midway | Transaction prevents partial mutation | L1/L7 |
| W-064 | Failure | Invalid provenance reference | Rejected or explicitly unverified; never trusted | L3/L7 |
| W-065 | Failure | Malformed relationship type | Rejected | L2/L7 |
| W-066 | Failure | Unauthorized scope access | Denied without protected-data leakage | L4 |
| W-067 | Security | Client changes INFERRED to VERIFIED | Server rejects promotion | L4/L7 |
| W-068 | Security | Client supplies another participant scope | Server derives/enforces authorized scope | L4 |
| W-069 | Security | Injection in names/state values | Safely validated/parameterized | L1/L7 |
| W-070 | Security | World used as access-control bypass | Authorization remains mandatory | L4/L7 |
| W-071 | Contract | TypeScript allows DB-forbidden value | Contract test detects mismatch | L0 |
| W-072 | Contract | Endpoint promises unsupported operation | Contract test fails | L0/L2 |
| W-073 | Contract | Invariant has no test | Verification gate fails | L0 |
| W-074 | Regression | Schema changes | Existing invariant suite remains green | L0/L1 |
| W-075 | Regression | Identity Entity IDs change | FK/integration tests fail safely | L1/L2 |
| W-076 | Regression | Context introduced | World remains descriptive | L0/L4 |
| W-077 | Regression | Capability introduced | World remains separate from capability | L0/L4 |
| W-078 | Regression | BeatAccess introduced | Location cannot become implicit access grant | L4 |
| W-079 | Architecture | Digital Twin consumes World | Twin remains derived and traceable | L6 |
| W-080 | Architecture | GENESIS consumes World | Reasoning/proposals cannot grant authority | L4/L6 |
| W-081 | Architecture | CONSTANTYNA uses World | Answers preserve truth/provenance | L3/L6 |
| W-082 | Architecture | Service consumes Place | Service uses canonical World data | L2/L6 |
| W-083 | Audit | World mutation occurs | Actor/request/source/time metadata is auditable | L2/L5 |
| W-084 | Audit | External observation arrives | Source identity and observed time retained | L3/L5 |
| W-085 | Audit | Historical state reconstructed | Evidence chain explains representation | L3/L5 |
| W-086 | Safety | No provider integration | No fake provider state | L3/L7 |
| W-087 | Safety | No facility availability feed | Availability remains UNKNOWN/UNAVAILABLE | L3/L7 |
| W-088 | Safety | No geocoding/map source | Location is not fabricated | L3/L7 |
| W-089 | Safety | Community claims system-wide control | Community scope cannot escalate authority | L4 |
| W-090 | Core invariant | Consequential action without Authorization | Blocked: NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION | L4/L7 |

## 4. Invariant coverage gate

| Invariant | Verification |
|---|---|
| 1 Stable Entity ID | W-001/W-002 |
| 2 Place first-class | W-003 |
| 3 Containment is not authority | W-005/W-046 |
| 4 Location is not authorization | W-046 |
| 5 Community is not parent authority | W-089 |
| 6 Place type explicit | W-004 |
| 7 Physical Entity differs from Resource | W-015/W-018 |
| 8 Relationships first-class | W-021 |
| 9 Subject/object validated | W-022/W-023 |
| 10 Cardinality explicit | W-027/W-028 |
| 11 Relationship temporal | W-025/W-026 |
| 12 State provenance | W-040 |
| 13 Observation source/time | W-036 |
| 14 UNKNOWN representable | W-034/W-062 |
| 15 INFERRED never silently VERIFIED | W-032/W-067 |
| 16 Current state never destroys history | W-042/W-043 |
| 17 UI is derived | W-052/W-053 |
| 18 Digital Twin non-authority | W-051/W-079 |
| 19 No fabricated world data | W-086/W-087/W-088 |
| 20 External integration explicit | W-054/W-055 |
| 21 Coordinate precision | W-013 |
| 22 Sensitive location privacy | W-045 |
| 23 Historical evidence retention | W-010/W-043 |
| 24 Stable cross-world references | W-001/W-075 |
| 25 Consequential operations outside World | W-049/W-050 |
| 26 Relationship-first | W-021/W-027 |
| 27 Temporal validity explicit | W-009/W-025/W-058 |
| 28 Provenance survives derivation | W-040/W-041 |
| 29 Community scope is not global | W-044/W-089 |
| 30 Core authorization invariant | W-090 |

## 5. Release gate

World is GREEN only when:
1. L0-L7 suites pass.
2. All 30 invariants have passing tests.
3. No truth-state promotion occurs without governed evidence.
4. No location, containment, relationship or community membership grants authority.
5. No World endpoint executes a consequential action.
6. Duplicate external observations are idempotent.
7. Historical observations survive current-state changes.
8. Provenance is traceable from derived state to source.
9. UNKNOWN/UNAVAILABLE remain explicit.
10. Scope/privacy tests pass.
11. Failure/rollback tests pass.
12. Identity integration remains referentially safe.
13. Future Context, Capability, Authority and BeatAccess cannot weaken the World boundary.

## 6. CI execution contract

Recommended stages:
1. world:lint
2. world:typecheck
3. world:schema
4. world:unit
5. world:integration
6. world:truth
7. world:provenance
8. world:temporal
9. world:security
10. world:authorization-boundary
11. world:regression
12. world:release-gate

Any canonical invariant failure blocks promotion.

## 7. Final principle

WORLD DESCRIBES THE WORLD. AUTHORITY GOVERNS CONSEQUENCES.

The World layer must reliably answer what exists, where it is, how it is related, what is known, what is observed, what is verified, what is inferred, what is unknown, what evidence supports the state, and what was true at a previous time.

It must never decide whether an actor may perform a consequential action.

NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
