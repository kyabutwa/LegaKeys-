CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.digital_twins (
  id uuid PRIMARY KEY,
  subject_ref uuid NOT NULL,
  model_ref uuid NOT NULL,
  model_version text NOT NULL,
  lifecycle text NOT NULL CHECK (lifecycle IN ('PROPOSED','ACTIVE','DEGRADED','SUSPENDED','RETIRED')),
  scope_ref uuid NOT NULL,
  truth_state text NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS legakeys.digital_twin_properties (
  id uuid PRIMARY KEY,
  twin_id uuid NOT NULL REFERENCES legakeys.digital_twins(id),
  property_path text NOT NULL,
  value_json jsonb NOT NULL,
  unit text,
  truth_state text NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  status text NOT NULL CHECK (status IN ('CURRENT','STALE','EXPIRED','UNKNOWN','CONFLICTED')),
  effective_at timestamptz NOT NULL,
  observed_at timestamptz,
  expires_at timestamptz,
  source_ref uuid NOT NULL,
  evidence_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  quality numeric,
  provenance jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (twin_id, property_path)
);

CREATE TABLE IF NOT EXISTS legakeys.digital_twin_observations (
  id uuid PRIMARY KEY,
  twin_id uuid REFERENCES legakeys.digital_twins(id),
  subject_ref uuid NOT NULL,
  source_ref uuid NOT NULL,
  observed_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL,
  payload_json jsonb NOT NULL,
  truth_state text NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  quality numeric,
  provenance jsonb NOT NULL,
  quarantined boolean NOT NULL DEFAULT false,
  correlation_id uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS legakeys.digital_twin_relationships (
  id uuid PRIMARY KEY,
  source_twin_id uuid NOT NULL REFERENCES legakeys.digital_twins(id),
  target_twin_id uuid NOT NULL REFERENCES legakeys.digital_twins(id),
  relationship_kind text NOT NULL,
  truth_state text NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  valid_from timestamptz,
  valid_until timestamptz,
  provenance jsonb NOT NULL,
  UNIQUE (source_twin_id, target_twin_id, relationship_kind, valid_from)
);

CREATE TABLE IF NOT EXISTS legakeys.digital_twin_transitions (
  id uuid PRIMARY KEY,
  twin_id uuid NOT NULL REFERENCES legakeys.digital_twins(id),
  property_path text,
  prior_value_json jsonb,
  next_value_json jsonb,
  prior_status text,
  next_status text NOT NULL,
  effective_at timestamptz NOT NULL,
  recorded_at timestamptz NOT NULL,
  event_ref uuid,
  evidence_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  reason text,
  provenance jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS legakeys.digital_twin_scenarios (
  id uuid PRIMARY KEY,
  twin_id uuid NOT NULL REFERENCES legakeys.digital_twins(id),
  base_state_at timestamptz NOT NULL,
  assumptions_json jsonb NOT NULL,
  model_ref uuid NOT NULL,
  model_version text NOT NULL,
  output_json jsonb NOT NULL,
  truth_state text NOT NULL CHECK (truth_state IN ('PROPOSED','UNKNOWN')),
  created_at timestamptz NOT NULL,
  valid_until timestamptz
);

CREATE INDEX IF NOT EXISTS idx_dt_subject ON legakeys.digital_twins(subject_ref);
CREATE INDEX IF NOT EXISTS idx_dt_scope ON legakeys.digital_twins(scope_ref);
CREATE INDEX IF NOT EXISTS idx_dt_property_twin ON legakeys.digital_twin_properties(twin_id);
CREATE INDEX IF NOT EXISTS idx_dt_observation_subject_time ON legakeys.digital_twin_observations(subject_ref, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_dt_transition_twin_time ON legakeys.digital_twin_transitions(twin_id, effective_at DESC);
CREATE INDEX IF NOT EXISTS idx_dt_relationship_source ON legakeys.digital_twin_relationships(source_twin_id);
CREATE INDEX IF NOT EXISTS idx_dt_relationship_target ON legakeys.digital_twin_relationships(target_twin_id);

CREATE OR REPLACE FUNCTION legakeys.prevent_digital_twin_transition_mutation()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'digital_twin_transitions are immutable';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_dt_transition_no_update ON legakeys.digital_twin_transitions;
CREATE TRIGGER trg_dt_transition_no_update
BEFORE UPDATE OR DELETE ON legakeys.digital_twin_transitions
FOR EACH ROW EXECUTE FUNCTION legakeys.prevent_digital_twin_transition_mutation();
