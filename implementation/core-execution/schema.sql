-- LegaKeys CORE EXECUTION MODEL
-- Production safety contract: execution remains disabled until the canonical
-- runtime contract explicitly enables consequential writes.
--
-- Reference architecture synthesized from public engineering practices across
-- large-scale platform, payments, marketplace, workflow, event-driven and
-- operational systems. See 17-core-execution-model/REFERENCE-ARCHITECTURE-2026-10-05.md

BEGIN;

CREATE SCHEMA IF NOT EXISTS legakeys;

-- Authorization is the explicit decision boundary between capability/intent
-- and consequential execution. Authority and capability remain descriptive
-- inputs; this table is the executable decision record.
CREATE TABLE IF NOT EXISTS legakeys.authorization_decisions (
  authorization_id UUID PRIMARY KEY,
  principal_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  capability_id UUID REFERENCES legakeys.capabilities(capability_id),
  context_id UUID,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  action_class TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('APPROVED','DENIED','REVOKED','EXPIRED','PENDING')),
  policy_version TEXT,
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  effective_from TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decided_by TEXT NOT NULL,
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  provenance_reference TEXT
);

CREATE INDEX IF NOT EXISTS authorization_decisions_principal_idx
  ON legakeys.authorization_decisions(principal_entity_id);

CREATE INDEX IF NOT EXISTS authorization_decisions_target_idx
  ON legakeys.authorization_decisions(target_type, target_id);

CREATE INDEX IF NOT EXISTS authorization_decisions_action_idx
  ON legakeys.authorization_decisions(action_class, decision);

-- Bind the action record to the canonical authorization decision.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'actions_authorization_decision_fkey'
      AND conrelid = 'legakeys.actions'::regclass
  ) THEN
    ALTER TABLE legakeys.actions
      ADD CONSTRAINT actions_authorization_decision_fkey
      FOREIGN KEY (authorization_id)
      REFERENCES legakeys.authorization_decisions(authorization_id);
  END IF;
END $$;

-- A consequential execution attempt is permitted only when:
-- 1) the canonical runtime is explicitly enabled;
-- 2) the action has an APPROVED, non-expired authorization;
-- 3) the authorization principal matches the action principal;
-- 4) the target/action class matches the authorization.
CREATE OR REPLACE FUNCTION legakeys.assert_consequential_execution(p_action_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  a RECORD;
  z RECORD;
  now_ts TIMESTAMPTZ := now();
BEGIN
  SELECT * INTO a
  FROM legakeys.actions
  WHERE id = p_action_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'LEGAKEYS_ACTION_NOT_FOUND';
  END IF;

  SELECT * INTO z
  FROM legakeys.runtime_contract
  WHERE contract_id = 1
  FOR SHARE;

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

  IF NOT FOUND THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_NOT_FOUND';
  END IF;

  IF z.decision <> 'APPROVED' THEN
    RAISE EXCEPTION 'LEGAKEYS_AUTHORIZATION_NOT_APPROVED';
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
END;
$$;

-- Database-level execution gate. Application code must still perform the
-- authorization recheck immediately before external side effects.
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
BEFORE INSERT OR UPDATE OF execution_state
ON legakeys.action_executions
FOR EACH ROW
EXECUTE FUNCTION legakeys.guard_action_execution();

-- Execution attempts are append-only. A new attempt represents a retry;
-- existing attempts are never rewritten into a different historical attempt.
CREATE OR REPLACE FUNCTION legakeys.reject_execution_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'LEGAKEYS_EXECUTION_IMMUTABLE';
END;
$$;

CREATE OR REPLACE FUNCTION legakeys.guard_execution_attempt_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $func$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_IMMUTABLE';
  END IF;
  IF NEW.action_id <> OLD.action_id OR NEW.attempt_number <> OLD.attempt_number OR NEW.started_at <> OLD.started_at THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_IDENTITY_IMMUTABLE';
  END IF;
  IF OLD.execution_state IN ('COMPLETED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT') AND NEW.execution_state <> OLD.execution_state THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_TERMINAL_STATE_IMMUTABLE';
  END IF;
  IF OLD.execution_state = 'STARTED' AND NEW.execution_state NOT IN ('STARTED','ACCEPTED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT') THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_INVALID_TRANSITION';
  END IF;
  IF OLD.execution_state = 'ACCEPTED' AND NEW.execution_state NOT IN ('ACCEPTED','COMPLETED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT') THEN
    RAISE EXCEPTION 'LEGAKEYS_EXECUTION_INVALID_TRANSITION';
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
