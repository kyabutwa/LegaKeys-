-- LegaKeys Identity & Account hardening.
-- Database-enforced invariants for the canonical Identity -> Account ->
-- Credential/Session -> Participation -> Participant spine.
BEGIN;

CREATE OR REPLACE FUNCTION legakeys.enforce_account_primary_credential()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE credential_account uuid;
BEGIN
  IF NEW.primary_credential_id IS NULL THEN RETURN NEW; END IF;
  SELECT account_id INTO credential_account
  FROM legakeys.credentials
  WHERE credential_id = NEW.primary_credential_id;
  IF credential_account IS NULL THEN
    RAISE EXCEPTION 'LEGAKEYS_PRIMARY_CREDENTIAL_NOT_FOUND';
  END IF;
  IF credential_account <> NEW.account_id THEN
    RAISE EXCEPTION 'LEGAKEYS_PRIMARY_CREDENTIAL_ACCOUNT_MISMATCH';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS account_primary_credential_consistency ON legakeys.accounts;
CREATE TRIGGER account_primary_credential_consistency
BEFORE INSERT OR UPDATE OF primary_credential_id ON legakeys.accounts
FOR EACH ROW EXECUTE FUNCTION legakeys.enforce_account_primary_credential();

CREATE OR REPLACE FUNCTION legakeys.enforce_active_session_account()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE account_state text; identity_state text;
BEGIN
  IF NEW.state <> 'ACTIVE' THEN RETURN NEW; END IF;
  SELECT a.state, i.state INTO account_state, identity_state
  FROM legakeys.accounts a
  JOIN legakeys.identities i ON i.identity_id=a.identity_id
  WHERE a.account_id=NEW.account_id;
  IF account_state IS DISTINCT FROM 'ACTIVE' THEN
    RAISE EXCEPTION 'LEGAKEYS_ACTIVE_SESSION_ACCOUNT_NOT_ACTIVE';
  END IF;
  IF identity_state IS DISTINCT FROM 'ACTIVE' THEN
    RAISE EXCEPTION 'LEGAKEYS_ACTIVE_SESSION_IDENTITY_NOT_ACTIVE';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS active_session_account_consistency ON legakeys.sessions;
CREATE TRIGGER active_session_account_consistency
BEFORE INSERT OR UPDATE OF account_id,state ON legakeys.sessions
FOR EACH ROW EXECUTE FUNCTION legakeys.enforce_active_session_account();

CREATE OR REPLACE FUNCTION legakeys.enforce_active_participant()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE participation_identity uuid; participation_state text; identity_state text;
BEGIN
  IF NEW.state <> 'ACTIVE' THEN RETURN NEW; END IF;
  SELECT pa.identity_id, pa.state INTO participation_identity, participation_state
  FROM legakeys.participations pa
  WHERE pa.participation_id=NEW.participation_id;
  SELECT i.state INTO identity_state
  FROM legakeys.identities i
  WHERE i.identity_id=NEW.identity_id;
  IF participation_identity IS NULL THEN
    RAISE EXCEPTION 'LEGAKEYS_PARTICIPATION_NOT_FOUND';
  END IF;
  IF participation_identity <> NEW.identity_id THEN
    RAISE EXCEPTION 'LEGAKEYS_PARTICIPANT_IDENTITY_MISMATCH';
  END IF;
  IF participation_state IS DISTINCT FROM 'ACTIVE' THEN
    RAISE EXCEPTION 'LEGAKEYS_ACTIVE_PARTICIPATION_REQUIRED';
  END IF;
  IF identity_state IS DISTINCT FROM 'ACTIVE' THEN
    RAISE EXCEPTION 'LEGAKEYS_ACTIVE_PARTICIPANT_IDENTITY_REQUIRED';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS active_participant_consistency ON legakeys.participants;
CREATE TRIGGER active_participant_consistency
BEFORE INSERT OR UPDATE OF participation_id,identity_id,state
ON legakeys.participants
FOR EACH ROW EXECUTE FUNCTION legakeys.enforce_active_participant();

CREATE INDEX IF NOT EXISTS credentials_account_state_idx
  ON legakeys.credentials(account_id,state);
CREATE INDEX IF NOT EXISTS accounts_identity_state_idx
  ON legakeys.accounts(identity_id,state);

CREATE TABLE IF NOT EXISTS legakeys.schema_migrations (
  migration_id bigserial PRIMARY KEY,
  filename text NOT NULL UNIQUE,
  checksum text NOT NULL,
  state text NOT NULL DEFAULT 'APPLIED'
    CHECK (state IN ('APPLIED','FAILED','ROLLED_BACK')),
  applied_at timestamptz NOT NULL DEFAULT now(),
  applied_by text NOT NULL DEFAULT current_user
);

INSERT INTO legakeys.schema_migrations(filename,checksum)
VALUES ('0004_identity_account_hardening.sql','identity-account-hardening-v1')
ON CONFLICT (filename) DO UPDATE SET checksum=EXCLUDED.checksum,state='APPLIED';

COMMIT;
