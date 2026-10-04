-- BeatVisitor canonical persistence.
-- Depends on canonical LegaKeys identity/world/authorization/access schemas.

CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.visitor_invitations (
  invitation_id UUID PRIMARY KEY,
  inviter_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  visitor_entity_id UUID REFERENCES legakeys.entities(entity_id),
  visitor_contact_ref TEXT,
  destination_place_id UUID REFERENCES legakeys.places(place_id),
  state TEXT NOT NULL CHECK (state IN (
    'DRAFT','SENT','ACCEPTED','VERIFICATION_PENDING','VERIFIED',
    'ACTIVE','ENDED','EXPIRED','REVOKED'
  )),
  entry_policy TEXT NOT NULL CHECK (entry_policy IN (
    'SINGLE_ENTRY','MULTI_ENTRY','REENTRY_ALLOWED','END_ON_DEPARTURE'
  )),
  verification_policy TEXT NOT NULL,
  access_scope JSONB NOT NULL DEFAULT '{}'::jsonb,
  purpose TEXT,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  ended_by_entity_id UUID REFERENCES legakeys.entities(entity_id),
  revocation_reason TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (valid_until > valid_from)
);

CREATE INDEX IF NOT EXISTS idx_visitor_inviter
  ON legakeys.visitor_invitations(inviter_entity_id);
CREATE INDEX IF NOT EXISTS idx_visitor_state_window
  ON legakeys.visitor_invitations(state, valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_visitor_entity
  ON legakeys.visitor_invitations(visitor_entity_id);

CREATE TABLE IF NOT EXISTS legakeys.visitor_identity_evidence (
  evidence_id UUID PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES legakeys.visitor_invitations(invitation_id),
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('PASSPORT','NATIONAL_ID','OTHER_ID')),
  storage_reference TEXT,
  document_number_ref TEXT,
  issuer TEXT,
  document_valid_from DATE,
  document_valid_until DATE,
  capture_method TEXT NOT NULL,
  truth_state TEXT NOT NULL CHECK (truth_state IN (
    'DECLARED','OBSERVED','VERIFIED','UNKNOWN','REJECTED'
  )),
  provider_id TEXT,
  provider_reference TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  verified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS legakeys.visitor_ocr_extractions (
  extraction_id UUID PRIMARY KEY,
  evidence_id UUID NOT NULL REFERENCES legakeys.visitor_identity_evidence(evidence_id),
  field_name TEXT NOT NULL,
  field_value TEXT,
  confidence NUMERIC(6,5),
  extraction_state TEXT NOT NULL CHECK (extraction_state IN (
    'EXTRACTED','REVIEWED','VERIFIED','REJECTED','UNKNOWN'
  )),
  provider_id TEXT,
  provider_reference TEXT,
  extracted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS legakeys.visitor_verifications (
  verification_id UUID PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES legakeys.visitor_invitations(invitation_id),
  verification_type TEXT NOT NULL CHECK (verification_type IN (
    'DOCUMENT','OCR','FACE_LIVENESS','FINGERPRINT','PALM',
    'DEVICE_BIOMETRIC','IDENTITY_MATCH','MANUAL_REVIEW'
  )),
  modality TEXT,
  result TEXT NOT NULL CHECK (result IN (
    'VERIFIED','FAILED','DENIED','PENDING','UNKNOWN','UNAVAILABLE','EXPIRED'
  )),
  assurance_level TEXT,
  provider_id TEXT,
  provider_reference TEXT,
  purpose TEXT NOT NULL,
  legal_basis_reference TEXT,
  device_binding_ref TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS legakeys.visitor_access_sessions (
  visitor_session_id UUID PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES legakeys.visitor_invitations(invitation_id),
  authorization_id UUID,
  access_credential_ref TEXT,
  state TEXT NOT NULL CHECK (state IN (
    'ELIGIBLE','ARRIVED','INSIDE','DEPARTED','BLOCKED','UNKNOWN'
  )),
  first_arrived_at TIMESTAMPTZ,
  last_arrived_at TIMESTAMPTZ,
  last_departed_at TIMESTAMPTZ,
  reentry_count INTEGER NOT NULL DEFAULT 0 CHECK (reentry_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.visitor_access_attempts (
  attempt_id UUID PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES legakeys.visitor_invitations(invitation_id),
  authorization_id UUID,
  access_operation_id UUID,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('ARRIVAL','REENTRY','DEPARTURE')),
  result TEXT NOT NULL CHECK (result IN ('PENDING','ALLOWED','DENIED','UNKNOWN','FAILED')),
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  correlation_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS legakeys.visitor_lifecycle_events (
  event_id UUID PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES legakeys.visitor_invitations(invitation_id),
  event_type TEXT NOT NULL,
  actor_entity_id UUID REFERENCES legakeys.entities(entity_id),
  previous_state TEXT,
  new_state TEXT,
  reason TEXT,
  correlation_id TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  evidence_reference TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_visitor_events_invitation
  ON legakeys.visitor_lifecycle_events(invitation_id, occurred_at);

-- Raw biometric templates/images are intentionally absent.
-- Device biometric assertions are represented by verification references only.
