CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.constantyna_runs (
  id uuid PRIMARY KEY,
  actor_id uuid NOT NULL,
  session_id uuid,
  purpose text NOT NULL,
  input_ref uuid NOT NULL,
  context_refs jsonb NOT NULL DEFAULT '[]',
  data_scope text NOT NULL,
  policy_profile text NOT NULL,
  model_ref text NOT NULL,
  state text NOT NULL,
  started_at timestamptz NOT NULL,
  completed_at timestamptz,
  correlation_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.constantyna_inputs (
  id uuid PRIMARY KEY,
  actor_id uuid NOT NULL,
  conversation_id uuid,
  content text NOT NULL,
  language text,
  source text NOT NULL,
  provenance jsonb NOT NULL DEFAULT '[]',
  received_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.constantyna_intents (
  id uuid PRIMARY KEY,
  run_id uuid NOT NULL REFERENCES legakeys.constantyna_runs(id),
  label text NOT NULL,
  evidence_refs jsonb NOT NULL DEFAULT '[]',
  confidence double precision NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  ambiguity text NOT NULL,
  alternatives jsonb NOT NULL DEFAULT '[]',
  clarification_required boolean NOT NULL DEFAULT false,
  truth_state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.constantyna_needs (
  id uuid PRIMARY KEY,
  run_id uuid NOT NULL REFERENCES legakeys.constantyna_runs(id),
  label text NOT NULL,
  source text NOT NULL CHECK (source IN ('EXPLICIT','INFERRED')),
  evidence_refs jsonb NOT NULL DEFAULT '[]',
  confidence double precision NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  truth_state text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.constantyna_context_snapshots (
  id uuid PRIMARY KEY,
  actor_id uuid NOT NULL,
  place_refs jsonb NOT NULL DEFAULT '[]',
  time_window jsonb NOT NULL,
  relationship_refs jsonb NOT NULL DEFAULT '[]',
  capability_refs jsonb NOT NULL DEFAULT '[]',
  authority_refs jsonb NOT NULL DEFAULT '[]',
  service_refs jsonb NOT NULL DEFAULT '[]',
  environment_refs jsonb NOT NULL DEFAULT '[]',
  event_refs jsonb NOT NULL DEFAULT '[]',
  source_refs jsonb NOT NULL DEFAULT '[]',
  assumptions jsonb NOT NULL DEFAULT '[]',
  uncertainties jsonb NOT NULL DEFAULT '[]',
  generated_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.constantyna_responses (
  id uuid PRIMARY KEY,
  run_id uuid NOT NULL REFERENCES legakeys.constantyna_runs(id),
  type text NOT NULL,
  content text NOT NULL,
  truth_state text NOT NULL,
  evidence_refs jsonb NOT NULL DEFAULT '[]',
  uncertainty jsonb NOT NULL DEFAULT '[]',
  next_step text,
  requires_human_review boolean NOT NULL DEFAULT false,
  risk_level text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.constantyna_memory (
  id uuid PRIMARY KEY,
  owner_actor_id uuid NOT NULL,
  type text NOT NULL,
  content text NOT NULL,
  source_refs jsonb NOT NULL DEFAULT '[]',
  truth_state text NOT NULL,
  scope text NOT NULL,
  retention_until timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.constantyna_handoffs (
  id uuid PRIMARY KEY,
  run_id uuid NOT NULL REFERENCES legakeys.constantyna_runs(id),
  reason text NOT NULL,
  risk_level text NOT NULL,
  context_refs jsonb NOT NULL DEFAULT '[]',
  evidence_refs jsonb NOT NULL DEFAULT '[]',
  proposed_next_step text,
  required_role text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS constantyna_runs_actor_time
  ON legakeys.constantyna_runs(actor_id, started_at DESC);

CREATE INDEX IF NOT EXISTS constantyna_memory_owner
  ON legakeys.constantyna_memory(owner_actor_id, created_at DESC);

-- Immutable human input and response lineage should be enforced by production
-- migrations consistently with the Action/Event/Evidence history contract.
