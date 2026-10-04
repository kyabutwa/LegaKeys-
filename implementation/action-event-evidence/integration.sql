-- LegaKeys Action / Event / Evidence runtime integration
BEGIN;

CREATE OR REPLACE FUNCTION legakeys.next_action_event_sequence(p_action_id UUID)
RETURNS BIGINT LANGUAGE plpgsql AS $$
DECLARE next_sequence BIGINT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(p_action_id::text, 0));
  SELECT COALESCE(MAX(sequence), 0) + 1 INTO next_sequence
  FROM legakeys.events WHERE action_id = p_action_id;
  RETURN next_sequence;
END;
$$;

CREATE OR REPLACE FUNCTION legakeys.record_execution_event()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  action_row RECORD;
  event_id UUID := gen_random_uuid();
  event_sequence BIGINT;
  event_type TEXT;
  terminal BOOLEAN;
  outcome_state TEXT;
  outcome_truth TEXT;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.execution_state = OLD.execution_state THEN RETURN NEW; END IF;

  SELECT * INTO action_row FROM legakeys.actions WHERE id = NEW.action_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'LEGAKEYS_ACTION_NOT_FOUND'; END IF;

  event_sequence := legakeys.next_action_event_sequence(NEW.action_id);
  terminal := NEW.execution_state IN ('COMPLETED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT');
  event_type := 'ACTION_EXECUTION_' || NEW.execution_state;

  INSERT INTO legakeys.events (
    id,event_source,event_version,event_type,action_id,execution_id,actor_id,
    principal_id,subject_type,subject_id,occurred_at,correlation_id,causation_id,
    truth_state,source_type,source_reference,payload,payload_hash,
    previous_event_hash,immutable_marker
  ) VALUES (
    event_id,'legakeys.action_execution','1',event_type,NEW.action_id,NEW.id,
    action_row.principal_id,action_row.principal_id,action_row.target_type,
    action_row.target_id,COALESCE(NEW.finished_at,NEW.started_at,now()),
    action_row.correlation_id,action_row.causation_id,
    CASE WHEN terminal AND NEW.execution_state='COMPLETED' THEN 'VERIFIED' ELSE 'OBSERVED' END,
    COALESCE(NEW.adapter_type,'internal'),
    COALESCE(NEW.adapter_reference,NEW.response_reference),
    jsonb_build_object(
      'execution_state',NEW.execution_state,'attempt_number',NEW.attempt_number,
      'adapter_type',NEW.adapter_type,'adapter_reference',NEW.adapter_reference,
      'response_reference',NEW.response_reference,'response_hash',NEW.response_hash,
      'error_code',NEW.error_code
    ),NEW.response_hash,NULL,TRUE
  );

  INSERT INTO legakeys.event_outbox (id,event_id,destination,payload,state)
  VALUES (
    gen_random_uuid(),event_id,'legakeys.internal',
    jsonb_build_object('event_id',event_id,'action_id',NEW.action_id,
      'execution_id',NEW.id,'event_type',event_type,
      'execution_state',NEW.execution_state),'PENDING'
  );

  IF terminal THEN
    INSERT INTO legakeys.evidence (
      id,action_id,event_id,evidence_type,truth_state,source_type,source_reference,
      captured_at,content_reference,content_hash,provenance,integrity,protected_payload
    ) VALUES (
      gen_random_uuid(),NEW.action_id,event_id,
      CASE WHEN NEW.execution_state='COMPLETED' THEN 'EXECUTION_RESULT' ELSE 'EXECUTION_FAILURE' END,
      CASE WHEN NEW.execution_state='COMPLETED' THEN 'VERIFIED' ELSE 'OBSERVED' END,
      COALESCE(NEW.adapter_type,'internal'),
      COALESCE(NEW.adapter_reference,NEW.response_reference),
      COALESCE(NEW.finished_at,now()),NEW.response_reference,NEW.response_hash,
      jsonb_build_object('execution_id',NEW.id,'attempt_number',NEW.attempt_number,
        'error_code',NEW.error_code),
      jsonb_build_object('response_hash_present',NEW.response_hash IS NOT NULL,
        'event_id',event_id,'immutable_event',TRUE),FALSE
    );

    outcome_state := CASE NEW.execution_state
      WHEN 'COMPLETED' THEN 'COMPLETED' WHEN 'FAILED' THEN 'FAILED'
      WHEN 'CANCELLED' THEN 'CANCELLED' ELSE 'UNKNOWN' END;
    outcome_truth := CASE NEW.execution_state WHEN 'COMPLETED' THEN 'VERIFIED' ELSE 'OBSERVED' END;

    INSERT INTO legakeys.action_outcomes (
      id,action_id,requested_result,observed_result,normalized_result,state,
      truth_state,evidence_sufficient,reconciliation_state
    ) VALUES (
      gen_random_uuid(),NEW.action_id,action_row.parameters,
      jsonb_build_object('execution_state',NEW.execution_state,
        'response_reference',NEW.response_reference,'response_hash',NEW.response_hash,
        'error_code',NEW.error_code),
      jsonb_build_object('execution_id',NEW.id,'attempt_number',NEW.attempt_number,
        'result_state',outcome_state),
      outcome_state,outcome_truth,
      NEW.execution_state='COMPLETED' AND NEW.response_hash IS NOT NULL,
      CASE WHEN NEW.execution_state='COMPLETED' THEN 'NOT_REQUIRED' ELSE 'PENDING' END
    )
    ON CONFLICT (action_id) DO UPDATE SET
      observed_result=EXCLUDED.observed_result,normalized_result=EXCLUDED.normalized_result,
      state=EXCLUDED.state,truth_state=EXCLUDED.truth_state,
      evidence_sufficient=EXCLUDED.evidence_sufficient,
      reconciliation_state=EXCLUDED.reconciliation_state,updated_at=now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS action_execution_event_evidence_integration ON legakeys.action_executions;
CREATE TRIGGER action_execution_event_evidence_integration
AFTER INSERT OR UPDATE OF execution_state ON legakeys.action_executions
FOR EACH ROW EXECUTE FUNCTION legakeys.record_execution_event();

CREATE INDEX IF NOT EXISTS evidence_integrity_hash_idx
ON legakeys.evidence(content_hash) WHERE content_hash IS NOT NULL;

COMMIT;
