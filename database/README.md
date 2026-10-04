# LegaKeys — Neon production database

Production path:

Production UI → Cloudflare Worker → Hyperdrive → Neon Postgres

Cloudflare recommends Hyperdrive for Workers-to-Postgres/Neon connections. The Worker intentionally returns NOT_CONFIGURED until the real Neon binding exists; it never fabricates connected state.

## Canonical schema bootstrap

Apply the existing module schemas to a Neon development branch in dependency order:

1. implementation/identity/schema.sql
2. implementation/world/schema.sql
3. implementation/context/schema.sql
4. implementation/capability/schema.sql
5. implementation/authority/schema.sql
6. implementation/beataccess/schema.sql
7. implementation/beatvisitor/schema.sql
8. implementation/services/schema.sql
9. implementation/action-event-evidence/schema.sql
10. implementation/genesis/schema.sql
11. implementation/digital-twin/schema.sql
12. implementation/workspaces/schema.sql
13. implementation/world-intelligence/schema.sql
14. implementation/constantyna/schema.sql

Validate on a development branch before applying the same migration set to production.

## API

GET /api/health — real Neon connectivity check.
GET /api/services — reads canonical services.
GET /api/places — reads canonical places.
GET /api/activity — reads immutable events.
GET /api/workspaces — reads workspace records.
GET /api/identity — reads identity/account/person projections.
GET /api/me — AUTH_REQUIRED until canonical session validation is connected.
POST /api/service-requests — AUTH_REQUIRED until canonical session + authorization are connected.

No identity is inferred from an unauthenticated browser. No consequential write bypasses authorization.

## Cloudflare

After creating the Neon project, create a Hyperdrive configuration for its PostgreSQL connection string and add:

[[hyperdrive]]
binding = "HYPERDRIVE"
id = "<NEON_HYPERDRIVE_ID>"

Keep all database credentials out of GitHub.
