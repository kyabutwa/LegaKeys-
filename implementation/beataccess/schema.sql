CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.access_points (
  access_point_id UUID PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  place_id UUID REFERENCES legakeys.places(place_id),
  access_point_type TEXT NOT NULL CHECK (
    access_point_type IN (
      'DOOR','GATE','TURNSTILE','ELEVATOR','BARRIER',
      'FACILITY_ENTRY','BUILDING_ENTRY','UNIT_ENTRY','COMMON_AREA_ENTRY','OTHER'
    )
  ),
  controller_provider_id TEXT,
  controller_reference TEXT,
  lifecycle_state TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (
    lifecycle_state IN ('PENDING','ACTIVE','SUSPENDED','INACTIVE','RETIRED','UNKNOWN')
  ),
  truth_state TEXT NOT NULL DEFAULT 'DECLARED' CHECK (
    truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')
  ),
  operational_state TEXT NOT NULL DEFAULT 'UNKNOWN' CHECK (
    operational_state IN ('ONLINE','OFFLINE','DEGRADED','FAULT','UNKNOWN')
  ),
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.access_credentials (
  access_credential_id UUID PRIMARY KEY,
  principal_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  credential_type TEXT NOT NULL CHECK (
    credential_type IN ('MOBILE','NFC','CARD','TOKEN','PIN','BIOMETRIC_REFERENCE','DEVICE','OTHER')
  ),
  external_credential_reference TEXT,
  lifecycle_state TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (
    lifecycle_state IN ('PENDING','ACTIVE','SUSPENDED','EXPIRED','REVOKED','CLOSED')
  ),
  provider_reference TEXT,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  provenance_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.access_operations (
  operation_id UUID PRIMARY KEY,
  request_id UUID NOT NULL,
  authorization_id UUID NOT NULL,
  principal_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  action_type TEXT NOT NULL,
  target_entity_id UUID REFERENCES legakeys.entities(entity_id),
  access_point_id UUID NOT NULL REFERENCES legakeys.access_points(access_point_id),
  access_credential_id UUID REFERENCES legakeys.access_credentials(access_credential_id),
  operation_state TEXT NOT NULL CHECK (
    operation_state IN (
      'RECEIVED','VALIDATING','AUTHORIZED_FOR_EXECUTION',
      'COMMAND_ISSUED','COMMAND_ACCEPTED','COMMAND_REJECTED',
      'ACCESS_GRANTED','ACCESS_DENIED','TIMEOUT','UNKNOWN',
      'CONTROLLER_UNAVAILABLE','PROVIDER_UNAVAILABLE','FAULT','RECONCILING',
      'CANCELLED','EXPIRED','CONSUMED'
    )
  ),
  execution_deadline TIMESTAMPTZ,
  command_id TEXT,
  idempotency_key TEXT NOT NULL,
  provider_reference TEXT,
  controller_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (request_id, idempotency_key),
  UNIQUE (command_id)
);

CREATE TABLE IF NOT EXISTS legakeys.access_validation_results (
  validation_id UUID PRIMARY KEY,
  operation_id UUID NOT NULL REFERENCES legakeys.access_operations(operation_id),
  authorization_valid BOOLEAN NOT NULL,
  principal_match BOOLEAN NOT NULL,
  action_match BOOLEAN NOT NULL,
  target_match BOOLEAN NOT NULL,
  scope_match BOOLEAN NOT NULL,
  credential_valid BOOLEAN,
  conditions_satisfied BOOLEAN NOT NULL,
  replay_check_passed BOOLEAN NOT NULL,
  execution_deadline_valid BOOLEAN NOT NULL,
  result TEXT NOT NULL CHECK (
    result IN ('VALID','REJECTED','UNKNOWN')
  ),
  reason_code TEXT,
  authorization_decision_version INTEGER,
  policy_version TEXT,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.access_provider_results (
  provider_result_id UUID PRIMARY KEY,
  operation_id UUID NOT NULL REFERENCES legakeys.access_operations(operation_id),
  provider_id TEXT NOT NULL,
  controller_id TEXT,
  provider_command_reference TEXT,
  provider_state TEXT NOT NULL CHECK (
    provider_state IN (
      'ACCEPTED','REJECTED','GRANTED','DENIED','TIMEOUT',
      'UNAVAILABLE','FAULT','UNKNOWN'
    )
  ),
  provider_code TEXT,
  provider_message TEXT,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provenance_reference TEXT
);

CREATE TABLE IF NOT EXISTS legakeys.access_events (
  access_event_id UUID PRIMARY KEY,
  operation_id UUID NOT NULL REFERENCES legakeys.access_operations(operation_id),
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'ACCESS_REQUESTED','AUTHORIZATION_VALIDATED','COMMAND_ISSUED',
      'COMMAND_ACCEPTED','COMMAND_REJECTED','ACCESS_GRANTED',
      'ACCESS_DENIED','TIMEOUT','FAULT','UNKNOWN','RECONCILED'
    )
  ),
  result_state TEXT NOT NULL,
  event_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provider_reference TEXT,
  evidence_reference TEXT,
  correlation_id UUID
);

CREATE TABLE IF NOT EXISTS legakeys.access_history (
  history_id UUID PRIMARY KEY,
  operation_id UUID NOT NULL REFERENCES legakeys.access_operations(operation_id),
  event_type TEXT NOT NULL,
  previous_state TEXT,
  new_state TEXT,
  actor_entity_id UUID REFERENCES legakeys.entities(entity_id),
  correlation_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_access_points_place
  ON legakeys.access_points(place_id);

CREATE INDEX IF NOT EXISTS idx_access_points_operational
  ON legakeys.access_points(operational_state, lifecycle_state);

CREATE INDEX IF NOT EXISTS idx_access_credentials_principal
  ON legakeys.access_credentials(principal_entity_id);

CREATE INDEX IF NOT EXISTS idx_access_operations_authorization
  ON legakeys.access_operations(authorization_id);

CREATE INDEX IF NOT EXISTS idx_access_operations_principal
  ON legakeys.access_operations(principal_entity_id);

CREATE INDEX IF NOT EXISTS idx_access_operations_point
  ON legakeys.access_operations(access_point_id);

CREATE INDEX IF NOT EXISTS idx_access_operations_state
  ON legakeys.access_operations(operation_state);

CREATE INDEX IF NOT EXISTS idx_access_provider_results_operation
  ON legakeys.access_provider_results(operation_id, observed_at);

CREATE INDEX IF NOT EXISTS idx_access_events_operation
  ON legakeys.access_events(operation_id, event_at);

-- BEATACCESS enforces an existing authorization.
-- It MUST NOT create authorization.
-- NO AUTHORIZATION -> NO ACCESS COMMAND.
