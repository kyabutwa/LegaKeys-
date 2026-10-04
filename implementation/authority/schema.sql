-- LegaKeys AUTHORITY persistence contract.
-- Authority is a governed decision source, not final authorization or execution.

CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.authority_sources (
  authority_source_id UUID PRIMARY KEY,
  source_type TEXT NOT NULL,
  source_reference TEXT NOT NULL,
  issuing_entity_id UUID REFERENCES legakeys.entities(entity_id),
  title TEXT,
  description TEXT,
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  provenance_reference TEXT,
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  lifecycle_state TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (lifecycle_state IN ('PENDING','ACTIVE','SUSPENDED','EXPIRED','REVOKED','CLOSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.authorities (
  authority_id UUID PRIMARY KEY,
  principal_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  authority_source_id UUID NOT NULL REFERENCES legakeys.authority_sources(authority_source_id),
  authority_type TEXT NOT NULL,
  authority_code TEXT NOT NULL,
  lifecycle_state TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (lifecycle_state IN ('PENDING','ACTIVE','SUSPENDED','EXPIRED','REVOKED','CLOSED')),
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  policy_version TEXT,
  provenance_reference TEXT,
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  sensitivity_level TEXT NOT NULL DEFAULT 'STANDARD' CHECK (sensitivity_level IN ('STANDARD','SENSITIVE','HIGHLY_SENSITIVE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.authority_scopes (
  authority_scope_id UUID PRIMARY KEY,
  authority_id UUID NOT NULL REFERENCES legakeys.authorities(authority_id),
  scope_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  scope_type TEXT NOT NULL,
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.authority_actions (
  authority_action_id UUID PRIMARY KEY,
  authority_id UUID NOT NULL REFERENCES legakeys.authorities(authority_id),
  action_class TEXT NOT NULL,
  decision_type TEXT NOT NULL,
  constraints JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.authority_conditions (
  condition_id UUID PRIMARY KEY,
  authority_id UUID NOT NULL REFERENCES legakeys.authorities(authority_id),
  condition_type TEXT NOT NULL,
  condition_value JSONB NOT NULL,
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.authority_evidence (
  authority_evidence_id UUID PRIMARY KEY,
  authority_id UUID NOT NULL REFERENCES legakeys.authorities(authority_id),
  evidence_reference TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  verification_state TEXT NOT NULL DEFAULT 'PENDING' CHECK (verification_state IN ('PENDING','VERIFIED','REJECTED','EXPIRED')),
  issuer_reference TEXT,
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.authority_delegations (
  delegation_id UUID PRIMARY KEY,
  parent_authority_id UUID NOT NULL REFERENCES legakeys.authorities(authority_id),
  delegatee_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  delegated_authority_id UUID REFERENCES legakeys.authorities(authority_id),
  scope_constraints JSONB NOT NULL,
  action_constraints JSONB NOT NULL,
  conditions JSONB,
  policy_version TEXT,
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  lifecycle_state TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (lifecycle_state IN ('PENDING','ACTIVE','SUSPENDED','EXPIRED','REVOKED','CLOSED')),
  effective_from TIMESTAMPTZ,
  effective_to TIMESTAMPTZ,
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS legakeys.authority_history (
  authority_history_id UUID PRIMARY KEY,
  authority_id UUID NOT NULL REFERENCES legakeys.authorities(authority_id),
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

CREATE INDEX IF NOT EXISTS idx_authority_sources_reference ON legakeys.authority_sources(source_type, source_reference);
CREATE INDEX IF NOT EXISTS idx_authorities_principal ON legakeys.authorities(principal_entity_id);
CREATE INDEX IF NOT EXISTS idx_authorities_source ON legakeys.authorities(authority_source_id);
CREATE INDEX IF NOT EXISTS idx_authorities_type ON legakeys.authorities(authority_type, authority_code);
CREATE INDEX IF NOT EXISTS idx_authorities_state ON legakeys.authorities(lifecycle_state, truth_state);
CREATE INDEX IF NOT EXISTS idx_authority_scopes_authority ON legakeys.authority_scopes(authority_id);
CREATE INDEX IF NOT EXISTS idx_authority_scopes_entity ON legakeys.authority_scopes(scope_entity_id);
CREATE INDEX IF NOT EXISTS idx_authority_actions_authority ON legakeys.authority_actions(authority_id);
CREATE INDEX IF NOT EXISTS idx_authority_conditions_authority ON legakeys.authority_conditions(authority_id);
CREATE INDEX IF NOT EXISTS idx_authority_evidence_authority ON legakeys.authority_evidence(authority_id);
CREATE INDEX IF NOT EXISTS idx_authority_delegations_parent ON legakeys.authority_delegations(parent_authority_id);
CREATE INDEX IF NOT EXISTS idx_authority_delegations_delegatee ON legakeys.authority_delegations(delegatee_entity_id);
CREATE INDEX IF NOT EXISTS idx_authority_history_authority ON legakeys.authority_history(authority_id, occurred_at);

-- NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
