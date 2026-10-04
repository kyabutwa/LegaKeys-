-- LegaKeys Core Execution hardening
-- Safe while consequential writes remain disabled.

BEGIN;

ALTER TABLE legakeys.authorization_decisions
  ADD COLUMN IF NOT EXISTS policy_version TEXT,
  ADD COLUMN IF NOT EXISTS decision_reason TEXT,
  ADD COLUMN IF NOT EXISTS decision_fingerprint TEXT,
  ADD COLUMN IF NOT EXISTS supersedes_authorization_id UUID;

UPDATE legakeys.authorization_decisions
SET policy_version = COALESCE(policy_version, 'legacy-1'),
    decision_fingerprint = COALESCE(decision_fingerprint, authorization_id::text)
WHERE policy_version IS NULL OR decision_fingerprint IS NULL;

ALTER TABLE legakeys.authorization_decisions
  ALTER COLUMN policy_version SET NOT NULL,
  ALTER COLUMN decision_fingerprint SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS authorization_decision_fingerprint_uq
  ON legakeys.authorization_decisions(decision_fingerprint);

CREATE INDEX IF NOT EXISTS authorization_decisions_capability_idx
  ON legakeys.authorization_decisions(capability_id);

CREATE INDEX IF NOT EXISTS authorization_decisions_effective_idx
  ON legakeys.authorization_decisions(decision, effective_from, expires_at);

CREATE TABLE IF NOT EXISTS legakeys.authorization_decision_history (
  history_id UUID PRIMARY KEY,
  authorization_id UUID NOT NULL REFERENCES legakeys.authorization_decisions(authorization_id),
  event_type TEXT NOT NULL CHECK (event_type IN ('CREATED','SUPERSEDED','REVOKED','EXPIRED')),
  previous_decision TEXT,
  new_decision TEXT,
  reason TEXT,
  actor_reference TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS authorization_history_authorization_idx
  ON legakeys.authorization_decision_history(authorization_id, occurred_at);

CREATE OR REPLACE FUNCTION legakeys.reject_authorization_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $func$
BEGIN
  RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_IMMUTABLE';
END;
$func$;

DROP TRIGGER IF EXISTS authorization_decisions_no_update ON legakeys.authorization_decisions;
CREATE TRIGGER authorization_decisions_no_update
BEFORE UPDATE OR DELETE ON legakeys.authorization_decisions
FOR EACH ROW EXECUTE FUNCTION legakeys.reject_authorization_mutation();

DO $func$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'actions_idempotency_key_nonempty'
      AND conrelid = 'legakeys.actions'::regclass
  ) THEN
    ALTER TABLE legakeys.actions
      ADD CONSTRAINT actions_idempotency_key_nonempty
      CHECK (length(btrim(idempotency_key)) >= 16);
  END IF;
END;
$func$;

CREATE INDEX IF NOT EXISTS action_executions_action_state_idx
  ON legakeys.action_executions(action_id, execution_state);

CREATE OR REPLACE FUNCTION legakeys.assert_consequential_execution(p_action_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $func$
DECLARE
  a RECORD;
  z RECORD;
  c RECORD;
  now_ts TIMESTAMPTZ := now();
BEGIN
  SELECT * INTO a FROM legakeys.actions WHERE id = p_action_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_NOT_FOUND'; END IF;
  IF a.authorization_id IS NULL THEN RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_REQUIRED'; END IF;
  IF a.state NOT IN ('AUTHORIZED','EXECUTING') THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_NOT_EXECUTABLE'; END IF;

  SELECT * INTO z FROM legakeys.runtime_contract WHERE contract_id = 1 FOR SHARE;
  IF NOT FOUND OR z.canonical_schema <> 'legakeys' OR z.legacy_runtime_allowed THEN
    RAISE EXCEPTION 'LEGAKEYS_CANONICAL_RUNTIME_INVALID';
  END IF;
  IF NOT z.consequential_writes_enabled THEN
    RAISE EXCEPTION 'LEGAKEYS_CONSEQUENTIAL_WRITES_DISABLED';
  END IF;

  SELECT * INTO z
  FROM legakeys.authorization_decisions
  WHERE authorization_id = a.authorization_id
  FOR SHARE;

  IF NOT FOUND THEN RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_NOT_FOUND'; END IF;
  IF z.decision <> 'APPROVED' THEN RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_NOT_APPROVED'; END IF;
  IF z.truth_state NOT IN ('VERIFIED','DECLARED') THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_TRUTH_STATE_INVALID';
  END IF;
  IF z.principal_entity_id <> a.principal_id THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_PRINCIPAL_MISMATCH';
  END IF;
  IF z.target_type <> a.target_type OR z.target_id <> a.target_id THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_TARGET_MISMATCH';
  END IF;
  IF z.action_class <> a.action_type THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_ACTION_MISMATCH';
  END IF;
  IF z.effective_from IS NOT NULL AND now_ts < z.effective_from THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_NOT_YET_EFFECTIVE';
  END IF;
  IF z.expires_at IS NOT NULL AND now_ts >= z.expires_at THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_EXPIRED';
  END IF;
  IF a.execution_deadline IS NOT NULL AND now_ts >= a.execution_deadline THEN
    RAISE EXCEPTION 'LEGAKEYS_ACTION_EXECUTION_DEADLINE_EXPIRED';
  END IF;

  IF z.capability_id IS NOT NULL THEN
    SELECT * INTO c FROM legakeys.capabilities WHERE capability_id = z.capability_id FOR SHARE;
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
$func$;

CREATE OR REPLACE FUNCTION legakeys.guard_execution_attempt_mutation()
RETURNS trigger
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

CREATE OR REPLACE FUNCTION legakeys.guard_action_state_transition()
RETURNS trigger
LANGUAGE plpgsql
AS $func$
BEGIN
  IF NEW.state <> OLD.state THEN
    IF OLD.state = 'REQUESTED' AND NEW.state NOT IN ('REQUESTED','VALIDATING','CANCELLED','EXPIRED') THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_INVALID_TRANSITION'; END IF;
    IF OLD.state = 'VALIDATING' AND NEW.state NOT IN ('VALIDATING','AUTHORIZED','FAILED','CANCELLED','EXPIRED') THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_INVALID_TRANSITION'; END IF;
    IF OLD.state = 'AUTHORIZED' AND NEW.state NOT IN ('AUTHORIZED','EXECUTING','REVOKED','EXPIRED','CANCELLED') THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_INVALID_TRANSITION'; END IF;
    IF OLD.state = 'EXECUTING' AND NEW.state NOT IN ('EXECUTING','SUCCEEDED','FAILED','UNKNOWN','CANCELLED') THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_INVALID_TRANSITION'; END IF;
    IF OLD.state IN ('SUCCEEDED','FAILED','UNKNOWN','CANCELLED','EXPIRED','REVOKED') THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_TERMINAL_STATE_IMMUTABLE'; END IF;
  END IF;
  IF NEW.state IN ('AUTHORIZED','EXECUTING') AND NEW.authorization_id IS NULL THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_REQUIRED';
  END IF;
  RETURN NEW;
END;
$func$;

DROP TRIGGER IF EXISTS actions_state_transition_guard ON legakeys.actions;
CREATE TRIGGER actions_state_transition_guard
BEFORE UPDATE OF state ON legakeys.actions
FOR EACH ROW EXECUTE FUNCTION legakeys.guard_action_state_transition();

CREATE OR REPLACE FUNCTION legakeys.sync_action_from_execution()
RETURNS trigger
LANGUAGE plpgsql
AS $func$
BEGIN
  UPDATE legakeys.actions
  SET state = CASE NEW.execution_state
    WHEN 'STARTED' THEN 'EXECUTING'
    WHEN 'ACCEPTED' THEN 'EXECUTING'
    WHEN 'COMPLETED' THEN 'SUCCEEDED'
    WHEN 'FAILED' THEN 'FAILED'
    WHEN 'UNKNOWN' THEN 'UNKNOWN'
    WHEN 'CANCELLED' THEN 'CANCELLED'
    WHEN 'TIMED_OUT' THEN 'UNKNOWN'
  END,
  execution_count = GREATEST(execution_count, NEW.attempt_number),
  updated_at = now(),
  completed_at = CASE
    WHEN NEW.execution_state IN ('COMPLETED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT')
      THEN COALESCE(NEW.finished_at, now())
    ELSE completed_at
  END
  WHERE id = NEW.action_id;
  RETURN NEW;
END;
$func$;

DROP TRIGGER IF EXISTS action_execution_action_state_sync ON legakeys.action_executions;
CREATE TRIGGER action_execution_action_state_sync
AFTER INSERT OR UPDATE OF execution_state ON legakeys.action_executions
FOR EACH ROW EXECUTE FUNCTION legakeys.sync_action_from_execution();

COMMIT;
