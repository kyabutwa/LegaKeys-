CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.authorization_requests (
  authorization_id UUID PRIMARY KEY,
  request_id UUID NOT NULL,
  principal_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  action_type TEXT NOT NULL,
  target_entity_id UUID REFERENCES legakeys.entities(entity_id),
  context_id UUID,
  capability_id UUID,
  authority_id UUID,
  requested_resource_id UUID,
  requested_service_id UUID,
  request_purpose TEXT,
  request_state TEXT NOT NULL CHECK (
    request_state IN ('RECEIVED','EVALUATING','DECIDED','EXPIRED','REVOKED','CONSUMED')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (request_id)
);

CREATE TABLE IF NOT EXISTS legakeys.authorization_decisions (
  decision_id UUID PRIMARY KEY,
  authorization_id UUID NOT NULL REFERENCES legakeys.authorization_requests(authorization_id),
  decision_version INTEGER NOT NULL,
  decision TEXT NOT NULL CHECK (
    decision IN ('ALLOW','DENY','STEP_UP','PENDING','UNKNOWN','UNAVAILABLE')
  ),
  policy_version TEXT,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  decision_provenance TEXT,
  UNIQUE (authorization_id, decision_version)
);

CREATE TABLE IF NOT EXISTS legakeys.authorization_scopes (
  scope_id UUID PRIMARY KEY,
  authorization_id UUID NOT NULL REFERENCES legakeys.authorization_requests(authorization_id),
  scope_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  scope_type TEXT NOT NULL,
  evaluation_result TEXT NOT NULL CHECK (
    evaluation_result IN ('MATCH','NO_MATCH','UNKNOWN')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.authorization_conditions (
  condition_id UUID PRIMARY KEY,
  authorization_id UUID NOT NULL REFERENCES legakeys.authorization_requests(authorization_id),
  condition_type TEXT NOT NULL,
  expected_value TEXT,
  observed_value TEXT,
  evaluation_result TEXT NOT NULL CHECK (
    evaluation_result IN ('SATISFIED','FAILED','UNKNOWN','NOT_APPLICABLE')
  ),
  source TEXT,
  provenance_reference TEXT,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.authorization_reasons (
  reason_id UUID PRIMARY KEY,
  decision_id UUID,
  reason_code TEXT NOT NULL,
  reason_type TEXT NOT NULL CHECK (
    reason_type IN ('MATCH','MISSING','FAILED','CONFLICT','EXPIRED','REVOKED','STEP_UP','SYSTEM')
  ),
  detail TEXT,
  visibility TEXT NOT NULL DEFAULT 'STANDARD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Production-drift reconciliation: older deployments may already have authorization_reasons
-- without the decision binding introduced by the canonical contract.
ALTER TABLE legakeys.authorization_reasons
  ADD COLUMN IF NOT EXISTS decision_id UUID;

DO $legakeys_auth_reconcile$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname='authorization_reasons_decision_fk'
      AND conrelid='legakeys.authorization_reasons'::regclass
  ) THEN
    ALTER TABLE legakeys.authorization_reasons
      ADD CONSTRAINT authorization_reasons_decision_fk
      FOREIGN KEY (decision_id)
      REFERENCES legakeys.authorization_decisions(decision_id)
      NOT VALID;
  END IF;
END
$legakeys_auth_reconcile$;

CREATE TABLE IF NOT EXISTS legakeys.authorization_evidence (
  evidence_id UUID PRIMARY KEY,
  authorization_id UUID NOT NULL REFERENCES legakeys.authorization_requests(authorization_id),
  evidence_reference TEXT NOT NULL,
  evidence_type TEXT NOT NULL,
  truth_state TEXT NOT NULL CHECK (
    truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')
  ),
  source TEXT,
  provenance_reference TEXT,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.authorization_delegation_refs (
  delegation_ref_id UUID PRIMARY KEY,
  authorization_id UUID NOT NULL REFERENCES legakeys.authorization_requests(authorization_id),
  authority_id UUID NOT NULL,
  delegator_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  delegatee_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  delegation_scope_reference TEXT,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ,
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.authorization_history (
  history_id UUID PRIMARY KEY,
  authorization_id UUID NOT NULL REFERENCES legakeys.authorization_requests(authorization_id),
  event_type TEXT NOT NULL,
  previous_decision TEXT,
  new_decision TEXT,
  actor_entity_id UUID REFERENCES legakeys.entities(entity_id),
  correlation_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auth_request_principal
  ON legakeys.authorization_requests(principal_entity_id);

CREATE INDEX IF NOT EXISTS idx_auth_request_target
  ON legakeys.authorization_requests(target_entity_id);

CREATE INDEX IF NOT EXISTS idx_auth_request_action
  ON legakeys.authorization_requests(action_type);

CREATE INDEX IF NOT EXISTS idx_auth_decision_current
  ON legakeys.authorization_decisions(authorization_id, decision_version DESC);

CREATE INDEX IF NOT EXISTS idx_auth_scope_entity
  ON legakeys.authorization_scopes(scope_entity_id);

CREATE INDEX IF NOT EXISTS idx_auth_conditions
  ON legakeys.authorization_conditions(authorization_id, evaluation_result);

CREATE INDEX IF NOT EXISTS idx_auth_history
  ON legakeys.authorization_history(authorization_id, created_at);

-- Authorization is a decision layer.
-- It MUST NOT execute consequential actions.
-- NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
