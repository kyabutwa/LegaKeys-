-- LegaKeys Action / Event / Evidence runtime persistence
CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.actions (
  id UUID PRIMARY KEY,
  action_type TEXT NOT NULL,
  principal_id UUID NOT NULL,
  authorization_id UUID NOT NULL,
  capability_id UUID,
  context_id UUID,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  purpose TEXT,
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  state TEXT NOT NULL CHECK (state IN ('REQUESTED','VALIDATING','AUTHORIZED','EXECUTING','SUCCEEDED','FAILED','UNKNOWN','CANCELLED','EXPIRED','REVOKED')),
  truth_state TEXT NOT NULL DEFAULT 'DECLARED' CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  idempotency_key TEXT NOT NULL,
  execution_deadline TIMESTAMPTZ,
  correlation_id UUID NOT NULL,
  causation_id UUID,
  execution_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE (principal_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS actions_authorization_idx ON legakeys.actions(authorization_id);
CREATE INDEX IF NOT EXISTS actions_target_idx ON legakeys.actions(target_type, target_id);
CREATE INDEX IF NOT EXISTS actions_correlation_idx ON legakeys.actions(correlation_id);

CREATE TABLE IF NOT EXISTS legakeys.action_executions (
  id UUID PRIMARY KEY,
  action_id UUID NOT NULL REFERENCES legakeys.actions(id),
  attempt_number INTEGER NOT NULL,
  execution_state TEXT NOT NULL CHECK (execution_state IN ('STARTED','ACCEPTED','COMPLETED','FAILED','UNKNOWN','CANCELLED','TIMED_OUT')),
  adapter_type TEXT,
  adapter_reference TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  response_reference TEXT,
  response_hash TEXT,
  error_code TEXT,
  UNIQUE (action_id, attempt_number)
);

CREATE TABLE IF NOT EXISTS legakeys.events (
  id UUID PRIMARY KEY,
  action_id UUID REFERENCES legakeys.actions(id),
  execution_id UUID REFERENCES legakeys.action_executions(id),
  event_type TEXT NOT NULL,
  actor_id UUID,
  principal_id UUID,
  occurred_at TIMESTAMPTZ NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sequence BIGINT,
  correlation_id UUID NOT NULL,
  causation_id UUID,
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  source_type TEXT NOT NULL,
  source_reference TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  payload_hash TEXT,
  immutable_marker BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (action_id, sequence)
);

CREATE INDEX IF NOT EXISTS events_correlation_idx ON legakeys.events(correlation_id);
CREATE INDEX IF NOT EXISTS events_action_time_idx ON legakeys.events(action_id, occurred_at);

CREATE TABLE IF NOT EXISTS legakeys.evidence (
  id UUID PRIMARY KEY,
  action_id UUID REFERENCES legakeys.actions(id),
  event_id UUID REFERENCES legakeys.events(id),
  evidence_type TEXT NOT NULL,
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  source_type TEXT NOT NULL,
  source_reference TEXT,
  captured_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  content_reference TEXT,
  content_hash TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  integrity JSONB NOT NULL DEFAULT '{}'::jsonb,
  retention_class TEXT,
  protected_payload BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS evidence_action_idx ON legakeys.evidence(action_id);
CREATE INDEX IF NOT EXISTS evidence_event_idx ON legakeys.evidence(event_id);

CREATE TABLE IF NOT EXISTS legakeys.action_outcomes (
  id UUID PRIMARY KEY,
  action_id UUID NOT NULL UNIQUE REFERENCES legakeys.actions(id),
  requested_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  observed_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  normalized_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  state TEXT NOT NULL CHECK (state IN ('PENDING','COMPLETED','FAILED','UNKNOWN','DEGRADED','CANCELLED')),
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  evidence_sufficient BOOLEAN NOT NULL DEFAULT FALSE,
  reconciliation_state TEXT NOT NULL DEFAULT 'NOT_REQUIRED' CHECK (reconciliation_state IN ('NOT_REQUIRED','PENDING','RECONCILED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Application/runtime enforcement remains mandatory for authorization recheck,
-- immutable event APIs, protected evidence, idempotent execution and completion proof.
