-- LegaKeys canonical database integrity hardening.
-- Adds an auditable migration ledger and records the repository-ordered
-- canonical migrations. This migration is idempotent.
BEGIN;

CREATE TABLE IF NOT EXISTS legakeys.schema_migrations (
  migration_id bigserial PRIMARY KEY,
  filename text NOT NULL UNIQUE,
  checksum text NOT NULL,
  state text NOT NULL DEFAULT 'APPLIED'
    CHECK (state IN ('APPLIED','FAILED','ROLLED_BACK')),
  applied_at timestamptz NOT NULL DEFAULT now(),
  applied_by text NOT NULL DEFAULT current_user
);

CREATE INDEX IF NOT EXISTS schema_migrations_state_idx
  ON legakeys.schema_migrations(state, applied_at DESC);

-- These checks make the canonical identity spine explicit at the database
-- boundary. They are NOT NULL/FK checks where safe; semantic authorization
-- remains in the authorization/execution layer.
ALTER TABLE legakeys.participants
  DROP CONSTRAINT IF EXISTS participants_identity_participation_consistency;

CREATE OR REPLACE FUNCTION legakeys.enforce_participant_identity_consistency()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE participation_identity uuid;
BEGIN
  SELECT identity_id INTO participation_identity
  FROM legakeys.participations
  WHERE participation_id = NEW.participation_id;

  IF participation_identity IS NULL THEN
    RAISE EXCEPTION 'LEGAKEYS_PARTICIPATION_NOT_FOUND';
  END IF;

  IF NEW.identity_id <> participation_identity THEN
    RAISE EXCEPTION 'LEGAKEYS_PARTICIPANT_IDENTITY_MISMATCH';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS participant_identity_consistency ON legakeys.participants;
CREATE TRIGGER participant_identity_consistency
BEFORE INSERT OR UPDATE OF participation_id, identity_id
ON legakeys.participants
FOR EACH ROW EXECUTE FUNCTION legakeys.enforce_participant_identity_consistency();

-- Canonical migration ledger. Checksums are fixed identifiers for the exact
-- repository migration files in this release.
INSERT INTO legakeys.schema_migrations(filename, checksum)
VALUES
 ('0000_canonical_runtime_contract.sql','80b481173ee64e67e7c22067b2910cf98e61cb34'),
 ('0001_runtime_resilience.sql','09e4bf27816589682fc5d6701cbc39994f89c14d'),
 ('0002_v1_1_0_governance.sql','e3cbfdbbd666a95f4e45a52839ae032073a4a53e'),
 ('0003_canonical_integrity_hardening.sql','integrity-hardening-v1')
ON CONFLICT (filename) DO UPDATE
SET checksum=EXCLUDED.checksum, state='APPLIED';

COMMIT;
