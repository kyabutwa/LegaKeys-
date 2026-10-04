CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.genesis_runs (
  id UUID PRIMARY KEY,
  initiator_id UUID NOT NULL,
  purpose TEXT NOT NULL,
  context_id UUID,
  mode TEXT NOT NULL CHECK (mode IN ('OBSERVATION_ONLY','ANALYSIS','ASSISTED','GOVERNED_AUTOMATION','DEGRADED','PAUSED')),
  policy_version TEXT NOT NULL,
  model_provider TEXT NOT NULL,
  model_version TEXT,
  correlation_id UUID NOT NULL,
  state TEXT NOT NULL CHECK (state IN ('CREATED','RUNNING','PAUSED','COMPLETED','FAILED','CANCELLED','DEGRADED')),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS legakeys.genesis_inputs (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES legakeys.genesis_runs(id),
  source_type TEXT NOT NULL,
  source_reference TEXT NOT NULL,
  observed_at TIMESTAMPTZ,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  scope JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS legakeys.genesis_findings (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES legakeys.genesis_runs(id),
  finding_type TEXT NOT NULL CHECK (finding_type IN ('FINDING','ANOMALY','INFERENCE','FORECAST')),
  subject_type TEXT,
  subject_id UUID,
  statement TEXT NOT NULL,
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  confidence NUMERIC CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  explanation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.genesis_proposals (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES legakeys.genesis_runs(id),
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  expected_outcome TEXT,
  assumptions JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW','MODERATE','HIGH','CRITICAL')),
  required_capability UUID,
  required_authority UUID,
  authorization_id UUID,
  state TEXT NOT NULL CHECK (state IN ('PROPOSED','REVIEW_REQUIRED','APPROVED','REJECTED','EXPIRED','EXECUTED')),
  expires_at TIMESTAMPTZ,
  evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.genesis_outputs (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES legakeys.genesis_runs(id),
  output_type TEXT NOT NULL,
  content JSONB NOT NULL,
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  confidence NUMERIC CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1)),
  evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  policy_version TEXT NOT NULL,
  model_version TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.genesis_tool_invocations (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES legakeys.genesis_runs(id),
  tool_id UUID NOT NULL,
  tool_version TEXT NOT NULL,
  side_effect TEXT NOT NULL,
  input_reference TEXT,
  output_reference TEXT,
  authorization_id UUID,
  action_id UUID,
  state TEXT NOT NULL CHECK (state IN ('REQUESTED','ALLOWED','DENIED','EXECUTING','COMPLETED','FAILED','UNKNOWN')),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS legakeys.genesis_evaluations (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES legakeys.genesis_runs(id),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  evaluation_type TEXT NOT NULL,
  score NUMERIC,
  result TEXT NOT NULL CHECK (result IN ('PASS','FAIL','UNKNOWN','REVIEW_REQUIRED')),
  evaluator_reference TEXT,
  evidence_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS genesis_runs_correlation_idx ON legakeys.genesis_runs(correlation_id);
CREATE INDEX IF NOT EXISTS genesis_inputs_run_idx ON legakeys.genesis_inputs(run_id);
CREATE INDEX IF NOT EXISTS genesis_findings_run_idx ON legakeys.genesis_findings(run_id);
CREATE INDEX IF NOT EXISTS genesis_proposals_run_idx ON legakeys.genesis_proposals(run_id);
CREATE INDEX IF NOT EXISTS genesis_tools_run_idx ON legakeys.genesis_tool_invocations(run_id);

CREATE OR REPLACE FUNCTION legakeys.reject_genesis_history_mutation()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'LEGAKEYS_GENESIS_HISTORY_IMMUTABLE';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS genesis_inputs_no_update ON legakeys.genesis_inputs;
CREATE TRIGGER genesis_inputs_no_update BEFORE UPDATE OR DELETE ON legakeys.genesis_inputs
FOR EACH ROW EXECUTE FUNCTION legakeys.reject_genesis_history_mutation();

-- GENESIS never stores raw model/provider secrets or raw biometric material.
-- Consequential tool calls bind authorization_id + action_id.
-- NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
