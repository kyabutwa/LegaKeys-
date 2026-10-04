# 17 CORE EXECUTION MODEL

## Living graph

```
PERSON
  ↓
BEATIDENTITY
  ↓
PARTICIPATION
  ↓
PARTICIPANT
  ├── Relationship
  └── Context
         ↓
       PLACE
         ↓
    CAPABILITY
         ↓
   AUTHORIZATION
         ↓
 BEATACCESS / SERVICE
         ↓
      ACTION
         ↓
      EVENT
         ↓
     EVIDENCE
         ↓
    KNOWLEDGE
         ↓
     GENESIS
         ↓
    PROPOSAL
         ↓
 AUTHORITY AGAIN
```

## Execution
Intent → Proposal → Authorization → Action → Event → Evidence → Outcome.

## Intelligence loop
Observe → Understand → Contextualize → Detect → Reason → Propose → Authorize → Execute → Measure → Learn → Observe Again.

## Invariants
Identity ≠ Account; Account ≠ Participant; Participant ≠ Role; Role ≠ Authority; Authentication ≠ Authorization; Relationship ≠ Authorization; Capability ≠ Authorization; Team Membership ≠ Authorization; Biometric Recognition ≠ Authorization; Digital Twin ≠ Authority; Workspace Visibility ≠ Authority; Understanding LegaKeys ≠ Controlling LegaKeys.

**No Authorization → No Consequential Action.**


## Implementation

The production persistence and execution gate are implemented in:

`implementation/core-execution/schema.sql`

The canonical migration runner applies this module after Action/Event/Evidence persistence and before intelligence modules.

## Research reference

The comparative architecture study for 30 major U.S. and Singapore reference organizations is:

`17-core-execution-model/REFERENCE-ARCHITECTURE-2026-10-05.md`

The study informs the LegaKeys execution kernel without copying any company's implementation.

## Production safety

The Core Execution Model is deployable while consequential writes remain disabled:

```
legacy_runtime_allowed = false
consequential_writes_enabled = false
```

The database execution gate rejects consequential execution until the runtime contract is explicitly enabled and a matching, approved, non-expired authorization exists.

