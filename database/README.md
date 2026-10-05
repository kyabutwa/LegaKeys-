# LegaKeys — canonical Neon cutover

## Objective

The existing Neon project remains the database. We do **not** create a second project.

The LegaKeys architecture is installed as the canonical application boundary under PostgreSQL schema `legakeys`.

Legacy/public objects are preserved but are not authoritative runtime objects until an audited migration maps them into the canonical model.

## Runtime cutover

```
LEGACY / PUBLIC OBJECTS
        │ preserved, not authoritative
        ▼
LEGAKEYS CANONICAL POSTGRES SCHEMA
        │
        ▼
CLOUDFLARE WORKER
        │
        ▼
PRODUCTION UI
```

The Worker uses fully-qualified `legakeys.*` tables and does not fall back to legacy tables.

## Canonical migration order

`database/apply-canonical-schema.sh` is the only supported ordered application path:

1. `database/0000_canonical_runtime_contract.sql`
2. Identity and identity-evidence schemas
3. World, Context, Capability and Authority schemas
4. BeatAccess and BeatVisitor schemas
5. Services schema
6. Action/Event/Evidence schema + integration
7. Core Execution schema + hardening
8. Genesis and Digital Twin schemas
9. Workspace and Community Operating schema
10. World Intelligence schema
11. Constantyna schema
12. `database/0001_runtime_resilience.sql`
13. `database/verify.sql` — mandatory hard gate

The migration runner uses `ON_ERROR_STOP=1`, and verification must finish with `LEGAKEYS_DATABASE_VERIFICATION=GREEN`.

## Authorization schema invariant

There is exactly one canonical relationship:

`authorization_requests (authorization identity) → authorization_decisions (versioned decision) → actions → action_executions → events → evidence → outcomes`

Core Execution must never redefine `authorization_decisions`. Actions reference `authorization_requests`, because a versioned decision row is not the stable authorization identity.

## Fibonacci resilience contract

LegaKeys canonizes a bounded Fibonacci recovery schedule:

`0, 1, 1, 2, 3, 5, 8, 13, 21`

The policy is stored in `runtime_resilience_policies`, with a maximum of 5 retries, a 3000 ms delay cap, and jitter. It is used only for explicitly transient failures. Schema errors, constraint violations, authentication/authorization failures, invalid input, and missing tables fail fast.

Fibonacci is a recovery algorithm, not a security primitive. It does not replace constraints, authorization, transactions, backups, observability or deployment verification.

## Safety boundary

The cutover contract initially sets:

- `legacy_runtime_allowed = false`
- `consequential_writes_enabled = false`

Consequential writes remain disabled until schema, data, identity/session, authorization, Action/Event/Evidence and production API verification are green.

## Important

Repository changes define and harden the canonical cutover. They do **not** claim that a user's Neon database has been modified until the controlled migration actually runs against that database and returns successful verification output.
