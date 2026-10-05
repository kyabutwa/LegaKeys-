create schema if not exists legakeys;

create table if not exists legakeys.identity_evidence (
  evidence_id uuid primary key default gen_random_uuid(),
  identity_id uuid not null references legakeys.identities(identity_id),
  evidence_type text not null check (evidence_type in ('PASSPORT','NATIONAL_ID','RESIDENCE_PERMIT','DRIVER_LICENCE','BIRTH_CERTIFICATE','ORGANIZATIONAL_CREDENTIAL','OTHER')),
  submission_state text not null default 'SUBMITTED' check (submission_state in ('SUBMITTED','CAPTURED','QUALITY_CHECK','OCR_COMPLETE','FIELDS_EXTRACTED','DOCUMENT_REVIEW','AUTHENTICITY_CHECK','IDENTITY_MATCH','VERIFIED','REJECTED','EXPIRED','WITHDRAWN')),
  capture_method text not null default 'PLATFORM_UPLOAD' check (capture_method in ('PLATFORM_UPLOAD','CAMERA','SCANNER','PROVIDER','MANUAL')),
  document_side text check (document_side in ('FRONT','BACK','FULL','PDF','OTHER')),
  mime_type text,
  file_size_bytes bigint,
  content_hash text,
  storage_reference text,
  storage_state text not null default 'METADATA_ONLY' check (storage_state in ('METADATA_ONLY','ENCRYPTED_EXTERNAL','ENCRYPTED_OBJECT','NOT_AVAILABLE')),
  extracted_fields jsonb not null default '{}'::jsonb,
  truth_state text not null default 'SUBMITTED' check (truth_state in ('DECLARED','OBSERVED','VERIFIED','REJECTED','UNKNOWN')),
  provenance_reference text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.identity_verifications (
  verification_id uuid primary key default gen_random_uuid(),
  identity_id uuid not null references legakeys.identities(identity_id),
  evidence_id uuid references legakeys.identity_evidence(evidence_id),
  verification_type text not null check (verification_type in ('DOCUMENT_OCR','DOCUMENT_AUTHENTICITY','IDENTITY_MATCH','FACE','LIVENESS','FINGERPRINT','PALM_HAND','EXTERNAL_IDENTITY','MANUAL_REVIEW')),
  state text not null default 'PENDING' check (state in ('PENDING','IN_PROGRESS','PASSED','FAILED','REVIEW_REQUIRED','NOT_SUPPORTED','EXPIRED','REVOKED')),
  assurance_level text not null default 'L0' check (assurance_level in ('L0','L1','L2','L3','L4')),
  provider_reference text,
  method_reference text,
  result_summary text,
  consent_reference text,
  presentation_attack_detection_state text check (presentation_attack_detection_state in ('NOT_APPLICABLE','NOT_RUN','PASSED','FAILED','UNKNOWN')),
  verified_at timestamptz,
  expires_at timestamptz,
  provenance_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.biometric_enrollments (
  biometric_id uuid primary key default gen_random_uuid(),
  identity_id uuid not null references legakeys.identities(identity_id),
  modality text not null check (modality in ('FACE','FINGERPRINT','PALM_HAND','IRIS','DEVICE_BIOMETRIC')),
  state text not null default 'NOT_ENROLLED' check (state in ('AVAILABLE','SUPPORTED','PENDING_CONSENT','ENROLLED','VERIFIED','SUSPENDED','REVOKED','NOT_SUPPORTED')),
  assurance_level text not null default 'L0' check (assurance_level in ('L0','L1','L2','L3','L4')),
  representation_reference text,
  provider_reference text,
  device_reference text,
  consent_state text not null default 'NOT_GRANTED' check (consent_state in ('NOT_GRANTED','GRANTED','WITHDRAWN')),
  retention_policy text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(identity_id, modality)
);

create table if not exists legakeys.device_authenticators (
  authenticator_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references legakeys.accounts(account_id),
  authenticator_type text not null check (authenticator_type in ('DEVICE_BIOMETRIC','PIN','OTP','HARDWARE_TOKEN','OTHER')),
  platform text,
  device_reference text,
  state text not null default 'ACTIVE' check (state in ('PENDING','ACTIVE','SUSPENDED','REVOKED')),
  biometric_data_received boolean not null default false,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_identity_evidence_identity on legakeys.identity_evidence(identity_id, created_at desc);
create index if not exists idx_identity_verifications_identity on legakeys.identity_verifications(identity_id, created_at desc);
create index if not exists idx_biometric_enrollments_identity on legakeys.biometric_enrollments(identity_id);
create index if not exists idx_device_authenticators_account on legakeys.device_authenticators(account_id);

-- Raw biometric material is intentionally absent.
-- Device biometrics are authentication signals; Face/Fingerprint/Palm-HAND proofing is represented by verification metadata.
