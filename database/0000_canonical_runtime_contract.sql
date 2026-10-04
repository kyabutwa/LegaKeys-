-- LegaKeys canonical database cutover contract.
-- This migration establishes the new LegaKeys namespace as the authoritative
-- application boundary without deleting or mutating legacy/public objects.
-- Legacy objects remain outside the runtime path until an audited migration
-- explicitly maps or retires them.

BEGIN;

CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.runtime_contract (
  contract_id integer PRIMARY KEY,
  product_name text NOT NULL,
  contract_version text NOT NULL,
  canonical_schema text NOT NULL,
  legacy_runtime_allowed boolean NOT NULL DEFAULT false,
  consequential_writes_enabled boolean NOT NULL DEFAULT false,
  installed_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO legakeys.runtime_contract (
  contract_id,
  product_name,
  contract_version,
  canonical_schema,
  legacy_runtime_allowed,
  consequential_writes_enabled
)
VALUES (1, 'LegaKeys', '1.0.0', 'legakeys', false, false)
ON CONFLICT (contract_id) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  contract_version = EXCLUDED.contract_version,
  canonical_schema = EXCLUDED.canonical_schema,
  legacy_runtime_allowed = EXCLUDED.legacy_runtime_allowed,
  consequential_writes_enabled = EXCLUDED.consequential_writes_enabled,
  updated_at = now();

COMMENT ON TABLE legakeys.runtime_contract IS
  'Canonical LegaKeys runtime boundary. Legacy/public objects are not authoritative.';

COMMIT;
