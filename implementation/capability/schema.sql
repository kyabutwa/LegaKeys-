-- LegaKeys CAPABILITY persistence contract.
-- Capability describes ability. It never grants authority or executes actions.

CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.capabilities (
  capability_id UUID PRIMARY KEY,
  subject_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  capability_type TEXT NOT NULL,
  capability_code TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  lifecycle_state TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (lifecycle_state IN ('PENDING','ACTIVE','SUSPENDED','EXPIRED','REVOKED','CLOSED')),
  truth_state TEXT NOT NULL
    CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  source_type TEXT NOT NULL,
  source_reference TEXT,
  provenance_reference TEXT,
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  sensitivity_level TEXT NOT NULL DEFAULT 'STANDARD'
    CHECK (sensitivity_level IN ('STANDARD','SENSITIVE','HIGHLY_SENSITIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (subject_entity_id, capability_code, effective_from)
);

CREATE TABLE IF NOT EXISTS legakeys.capability_scopes (
  capability_scope_id UUID PRIMARY KEY,
  capability_id UUID NOT NULL REFERENCES legakeys.capabilities(capability_id),
  scope_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  scope_type TEXT NOT NULL,
  applicability_state TEXT NOT NULL DEFAULT 'ACTIVE'
    CHECK (applicability_state IN ('PENDING','ACTIVE','SUSPENDED','EXPIRED','REVOKED')),
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  source_reference TEXT,
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.capability_conditions (
  condition_id UUID PRIMARY KEY,
  capability_id UUID NOT NULL REFERENCES legakeys.capabilities(capability_id),
  condition_type TEXT NOT NULL,
  condition_value JSONB NOT NULL,
  truth_state TEXT NOT NULL
    CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  source_reference TEXT,
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.capability_evidence (
  capability_evidence_id UUID PRIMARY KEY,
  capability_id UUID NOT NULL REFERENCES legakeys.capabilities(capability_id),
  evidence_reference TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  verification_state TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (verification_state IN ('PENDING','VERIFIED','REJECTED','EXPIRED')),
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  issuer_reference TEXT,
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.capability_history (
  capability_history_id UUID PRIMARY KEY,
  capability_id UUID NOT NULL REFERENCES legakeys.capabilities(capability_id),
  event_type TEXT NOT NULL,
  previous_lifecycle_state TEXT,
  new_lifecycle_state TEXT,
  previous_truth_state TEXT,
  new_truth_state TEXT,
  reason TEXT,
  evidence_reference TEXT,
  source_reference TEXT,
  provenance_reference TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_capabilities_subject
  ON legakeys.capabilities(subject_entity_id);

CREATE INDEX IF NOT EXISTS idx_capabilities_type
  ON legakeys.capabilities(capability_type, capability_code);

CREATE INDEX IF NOT EXISTS idx_capabilities_truth
  ON legakeys.capabilities(truth_state);

CREATE INDEX IF NOT EXISTS idx_capabilities_lifecycle
  ON legakeys.capabilities(lifecycle_state);

CREATE INDEX IF NOT EXISTS idx_capability_scopes_capability
  ON legakeys.capability_scopes(capability_id);

CREATE INDEX IF NOT EXISTS idx_capability_scopes_entity
  ON legakeys.capability_scopes(scope_entity_id);

CREATE INDEX IF NOT EXISTS idx_capability_conditions_capability
  ON legakeys.capability_conditions(capability_id);

CREATE INDEX IF NOT EXISTS idx_capability_evidence_capability
  ON legakeys.capability_evidence(capability_id);

CREATE INDEX IF NOT EXISTS idx_capability_history_capability
  ON legakeys.capability_history(capability_id, occurred_at);

-- Security boundary:
-- Capability records are descriptive.
-- Authorization and consequential execution belong to later governed modules.
-- NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
