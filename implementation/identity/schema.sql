create extension if not exists pgcrypto;
create schema if not exists legakeys;

create table if not exists legakeys.entities (
  entity_id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  canonical_name text,
  display_name text,
  lifecycle_state text not null default 'PENDING',
  effective_from timestamptz,
  effective_to timestamptz,
  source_reference text,
  provenance_reference uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.identities (
  identity_id uuid primary key default gen_random_uuid(),
  entity_id uuid not null unique references legakeys.entities(entity_id),
  identity_type text not null,
  state text not null default 'PENDING',
  verification_state text not null default 'UNVERIFIED',
  provenance_reference uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.persons (
  person_id uuid primary key default gen_random_uuid(),
  entity_id uuid not null unique references legakeys.entities(entity_id),
  legal_name text,
  display_name text,
  date_of_birth date,
  country_of_residence text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.accounts (
  account_id uuid primary key default gen_random_uuid(),
  identity_id uuid not null unique references legakeys.identities(identity_id),
  state text not null default 'PENDING',
  primary_credential_id uuid,
  last_authenticated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.credentials (
  credential_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references legakeys.accounts(account_id),
  credential_type text not null,
  state text not null default 'PENDING',
  subject_reference text,
  verification_state text not null default 'UNVERIFIED',
  secret_reference text,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (account_id, credential_type, subject_reference)
);

DO 'BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = ''accounts_primary_credential_fk''
      AND conrelid = ''legakeys.accounts''::regclass
  ) THEN
    ALTER TABLE legakeys.accounts
      ADD CONSTRAINT accounts_primary_credential_fk
      FOREIGN KEY (primary_credential_id)
      REFERENCES legakeys.credentials(credential_id)
      DEFERRABLE INITIALLY DEFERRED;
  END IF;
END';
create table if not exists legakeys.sessions (
  session_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references legakeys.accounts(account_id),
  state text not null default 'ACTIVE',
  session_secret_reference text not null unique,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz,
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create table if not exists legakeys.participations (
  participation_id uuid primary key default gen_random_uuid(),
  identity_id uuid not null references legakeys.identities(identity_id),
  context_entity_id uuid references legakeys.entities(entity_id),
  state text not null default 'PROPOSED',
  scope jsonb not null default '{}'::jsonb,
  effective_from timestamptz,
  effective_to timestamptz,
  provenance_reference uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.participants (
  participant_id uuid primary key default gen_random_uuid(),
  participation_id uuid not null unique references legakeys.participations(participation_id),
  identity_id uuid not null references legakeys.identities(identity_id),
  state text not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sessions_account_idx on legakeys.sessions(account_id);
create index if not exists sessions_expiry_idx on legakeys.sessions(expires_at);
create index if not exists participation_identity_idx on legakeys.participations(identity_id);
create index if not exists participation_context_idx on legakeys.participations(context_entity_id);
create index if not exists participant_identity_idx on legakeys.participants(identity_id);

-- Authorization is intentionally outside this schema.
-- Secrets are represented by protected references, never ordinary plaintext fields.


-- Account settings and password recovery are canonical account-control data.
create table if not exists legakeys.account_settings (
  account_settings_id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references legakeys.accounts(account_id) on delete cascade,
  language text not null default 'en',
  appearance text not null default 'system',
  compact_mode boolean not null default false,
  notifications jsonb not null default '{"security":true,"account":true,"participation":true,"services":true,"community":true}'::jsonb,
  privacy jsonb not null default '{"activity_visibility":"private","evidence_visibility":"restricted"}'::jsonb,
  profile_photo_data text,
  profile_photo_mime text,
  profile_photo_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.account_recovery_challenges (
  recovery_challenge_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references legakeys.accounts(account_id) on delete cascade,
  token_hash text not null unique,
  state text not null default 'ACTIVE',
  expires_at timestamptz not null,
  consumed_at timestamptz,
  requested_at timestamptz not null default now(),
  requested_from text,
  updated_at timestamptz not null default now()
);

create index if not exists account_recovery_account_idx on legakeys.account_recovery_challenges(account_id, state);
create index if not exists account_recovery_expiry_idx on legakeys.account_recovery_challenges(expires_at);


-- Existing installations may already have account_settings; keep the photo columns additive and idempotent.
alter table if exists legakeys.account_settings add column if not exists profile_photo_data text;
alter table if exists legakeys.account_settings add column if not exists profile_photo_mime text;
alter table if exists legakeys.account_settings add column if not exists profile_photo_updated_at timestamptz;


alter table if exists legakeys.account_settings add column if not exists profile_photo_data text;
alter table if exists legakeys.account_settings add column if not exists profile_photo_mime text;
alter table if exists legakeys.account_settings add column if not exists profile_photo_updated_at timestamptz;
\n-- Session lifecycle indexes for canonical account/session enforcement.\ncreate index if not exists sessions_account_state_idx on legakeys.sessions(account_id,state);\ncreate index if not exists sessions_last_seen_idx on legakeys.sessions(last_seen_at);\n