-- LegaKeys CORE EXECUTION MODEL
-- Canonical rule: authorization_requests owns authorization identity.
-- authorization_decisions stores immutable, versioned decisions for that request.
-- This file MUST NOT redefine authorization_decisions with a competing schema.
-- Consequential execution remains disabled until runtime_contract enables it.

BEGIN;

CREATE SCHEMA IF NOT EXISTS legakeys;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'actions_authorization_request_fkey'
      AND conrelid = 'legakeys.actions'::regclass
  ) THEN
    ALTER TABLE legakeys.actions
      ADD CONSTRAINT actions_authorization_request_fkey
      FOREIGN KEY (authorization_id)
      REFERENCES legakeys.authorization_requests(authorization_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS authorization_requests_principal_idx
  ON legakeys.authorization_requests(principal_entity_id);

CREATE INDEX IF NOT EXISTS authorization_requests_action_idx
  ON legakeys.authorization_requests(action_type, request_state);

CREATE OR REPLACE FUNCTION legakeys.assert_consequential_execution(p_action_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  a RECORD;
  r RECORD;
  d RECORD;
  c RECORD;
  now_ts TIMESTAMPTZ := now();
BEGIN
  SELECT * INTO a FROM legakeys.actions WHERE id = p_action_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_NOT_FOUND'; END IF;
  IF a.authorization_id IS NULL THEN RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_REQUIRED'; END IF;

  SELECT * INTO r
  FROM legakeys.authorization_requests
  WHERE authorization_id = a.authorization_id
  FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_NOT_FOUND'; END IF;

  SELECT * INTO d
  FROM legakeys.authorization_decisions
  WHERE authorization_id = r.authorization_id
  ORDER BY decision_version DESC
  LIMIT 1
  FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_DECISION_NOT_FOUND'; END IF;

  SELECT * INTO c FROM legakeys.runtime_contract WHERE contract_id = 1 FOR SHARE;
  IF NOT FOUND OR c.canonical_schema <> 'legakeys' OR c.legacy_runtime_allowed THEN
    RAISE EXCEPTION 'LEGAKEYS_CANONICAL_RUNTIME_INVALID';
  END IF;
  IF NOT c.consequential_writes_enabled THEN
    RAISE EXCEPTION 'LEGAKEYS_CONSEQUENTIAL_WRITES_DISABLED';
  END IF;

  IF r.request_state NOT IN ('DECIDED','CONSUMED') THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_REQUEST_NOT_DECIDED';
  END IF;
  IF d.decision <> 'ALLOW' THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_NOT_ALLOWED';
  END IF;
  IF r.principal_entity_id <> a.principal_id THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_PRINCIPAL_MISMATCH';
  END IF;
  IF r.target_entity_id IS NOT NULL
     AND (a.target_type <> 'ENTITY' OR r.target_entity_id <> a.target_id) THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_TARGET_MISMATCH';
  END IF;
  IF r.action_type <> a.action_type THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_ACTION_MISMATCH';
  END IF;
  IF d.effective_from IS NOT NULL AND now_ts < d.effective_from THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_NOT_YET_EFFECTIVE';
  END IF;
  IF d.expires_at IS NOT NULL AND now_ts >= d.expires_at THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_EXPIRED';
  END IF;
  IF a.execution_deadline IS NOT NULL AND now_ts >= a.execution_deadline THEN
    RAISE EXCEPTION 'LEGAKEYS_ACTION_EXECUTION_DEADLINE_EXPIRED';
  END IF;

  IF r.capability_id IS NOT NULL THEN
    SELECT * INTO c FROM legakeys.capabilities
    WHERE capability_id = r.capability_id FOR SHARE;
    IF NOT FOUND OR c.lifecycle_state <> 'ACTIVE' THEN
      RAISE EXCEPTION 'LEGAKEYS_CAPABILITY_NOT_ACTIVE';
    END IF;
    IF c.effective_from IS NOT NULL AND now_ts < c.effective_from THEN
      RAISE EXCEPTION 'LEGAKEYS_CAPABILITY_NOT_YET_EFFECTIVE';
    END IF;
    IF c.effective_to IS NOT NULL AND now_ts >= c.effective_to THEN
      RAISE EXCEPTION 'LEGAKEYS_CAPABILITY_EXPIRED';
    END IF;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION legakeys.guard_action_execution()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.execution_state IN ('STARTED','ACCEPTED') THEN
    PERFORM legakeys.assert_consequential_execution(NEW.action_id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS action_execution_authorization_gate ON legakeys.action_executions;
CREATE TRIGGER action_execution_authorization_gate
BEFORE INSERT OR UPDATE OF execution_state ON legakeys.action_executions
FOR EACH ROW EXECUTE FUNCTION legakeys.guard_action_execution();

CREATE OR REPLACE FUNCTION legakeys.guard_execution_attempt_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'LEGAKEYS_EXECUTION_IMMUTABLE'; END IF;
  IF NEW.action_id <> OLD.action_id
     OR NEW.attempt_number <> OLD.attempt_number
     OR NEW.started_at <> OLD.started_at THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_IDENTITY_IMMUTABLE';
  END IF;
  IF OLD.execution_state IN ('COMPLETED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT')
     AND NEW.execution_state <> OLD.execution_state THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_TERMINAL_STATE_IMMUTABLE';
  END IF;
  IF OLD.execution_state = 'STARTED'
     AND NEW.execution_state NOT IN ('STARTED','ACCEPTED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT') THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_INVALID_TRANSITION';
  END IF;
  IF OLD.execution_state = 'ACCEPTED'
     AND NEW.execution_state NOT IN ('ACCEPTED','COMPLETED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT') THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_INVALID_TRANSITION';
  END IF;
  IF NEW.execution_state = 'COMPLETED' AND NEW.finished_at IS NULL THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_COMPLETION_TIME_REQUIRED';
  END IF;
  RETURN NEW;
END;
$func$;

DROP TRIGGER IF EXISTS action_executions_no_update ON legakeys.action_executions;
DROP TRIGGER IF EXISTS action_executions_mutation_guard ON legakeys.action_executions;
CREATE TRIGGER action_executions_mutation_guard
BEFORE UPDATE OR DELETE ON legakeys.action_executions
FOR EACH ROW EXECUTE FUNCTION legakeys.guard_execution_attempt_mutation();

COMMIT;
