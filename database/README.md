# LegaKeys — canonical Neon cutover

## Objective

The existing Neon project remains the database. We do **not** create a second project.

The new LegaKeys architecture is installed as the canonical application boundary under the PostgreSQL schema:

`legakeys`

Legacy/public objects are not automatically deleted. They are outside the LegaKeys runtime path until an audited migration maps their data into the canonical model.

This is deliberate: the new system **supersedes the old runtime contract without destroying potentially recoverable data**.

## Cutover rule

```
LEGACY / PUBLIC OBJECTS
        │
        │  preserved, not authoritative
        ▼
┌──────────────────────────┐
│  LEGAKEYS CANONICAL      │
│  PostgreSQL schema       │
│  `legakeys`             │
└──────────────────────────┘
        │
        ▼
CLOUDFLARE WORKER
        │
        ▼
PRODUCTION UI
```

The Worker uses fully-qualified `legakeys.*` tables. It does not fall back to legacy tables.

## Migration order

Run from a controlled environment with the existing Neon project connection:

1. `database/0000_canonical_runtime_contract.sql`
2. `implementation/identity/schema.sql`
3. `implementation/world/schema.sql`
4. `implementation/context/schema.sql`
5. `implementation/capability/schema.sql`
6. `implementation/authority/schema.sql`
7. `implementation/beataccess/schema.sql`
8. `implementation/beatvisitor/schema.sql`
9. `implementation/services/schema.sql`
10. `implementation/action-event-evidence/schema.sql`
11. `implementation/genesis/schema.sql`
12. `implementation/digital-twin/schema.sql`
13. `implementation/workspaces/schema.sql`
14. `implementation/world-intelligence/schema.sql`
15. `implementation/constantyna/schema.sql`

Use `database/apply-canonical-schema.sh` for deterministic application with `ON_ERROR_STOP=1`.

## Safety boundary

The cutover contract initially sets:

- `legacy_runtime_allowed = false`
- `consequential_writes_enabled = false`

That means the new architecture can be installed and validated without accidentally turning an old data path into an execution path.

Only after:

- schema verification,
- data-quality validation,
- identity/session validation,
- authorization validation,
- Action/Event/Evidence validation,
- production API verification,

should consequential writes be enabled.

## Neon workflow

Use a Neon branch for migration validation before changing the production branch. Neon branches are isolated environments designed for testing schema/data changes without affecting the parent branch. citeturn0search1turn0search3

Production should be treated as the final promotion target, not the place where schema experimentation happens. citeturn0search3

## Cloudflare

Production path:

`Production UI → Cloudflare Worker → Hyperdrive → existing Neon Postgres project`

Do not commit `DATABASE_URL`, passwords, API keys, or Hyperdrive credentials.

## Important

This repository change prepares and defines the canonical cutover. It does **not** claim that the user's Neon database has been modified until the actual Neon database connection is available and the migration returns successful verification output.
