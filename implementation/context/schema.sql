create extension if not exists pgcrypto;
create schema if not exists legakeys;

create table if not exists legakeys.contexts (
  context_id uuid primary key default gen_random_uuid(),
  context_type text not null,
  actor_entity_id uuid references legakeys.entities(entity_id),
  subject_entity_id uuid references legakeys.entities(entity_id),
  scope_entity_id uuid references legakeys.entities(entity_id),
  purpose_code text,
  lifecycle_state text not null default 'ACTIVE',
  effective_from timestamptz,
  effective_to timestamptz,
  sensitivity_level text not null default 'STANDARD',
  provenance_reference uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint context_window_chk check (
    effective_to is null or effective_from is null or effective_to > effective_from
  )
);

create table if not exists legakeys.context_references (
  context_reference_id uuid primary key default gen_random_uuid(),
  context_id uuid not null references legakeys.contexts(context_id) on delete restrict,
  reference_type text not null,
  referenced_entity_id uuid not null references legakeys.entities(entity_id),
  relationship_type text,
  truth_state text not null default 'VERIFIED',
  source_reference text,
  provenance_reference uuid,
  effective_from timestamptz,
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  constraint context_reference_window_chk check (
    effective_to is null or effective_from is null or effective_to > effective_from
  )
);

create table if not exists legakeys.context_conditions (
  condition_id uuid primary key default gen_random_uuid(),
  context_id uuid not null references legakeys.contexts(context_id) on delete restrict,
  condition_type text not null,
  condition_value jsonb not null,
  truth_state text not null default 'UNKNOWN',
  observed_at timestamptz,
  effective_from timestamptz,
  effective_to timestamptz,
  source_reference text,
  provenance_reference uuid,
  created_at timestamptz not null default now(),
  constraint context_condition_window_chk check (
    effective_to is null or effective_from is null or effective_to > effective_from
  )
);

create table if not exists legakeys.context_scope_refs (
  context_scope_ref_id uuid primary key default gen_random_uuid(),
  context_id uuid not null references legakeys.contexts(context_id) on delete restrict,
  scope_entity_id uuid not null references legakeys.entities(entity_id),
  scope_type text not null,
  access_visibility text not null default 'CONTEXT_SCOPED',
  effective_from timestamptz,
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  constraint context_scope_window_chk check (
    effective_to is null or effective_from is null or effective_to > effective_from
  )
);

create index if not exists contexts_actor_idx on legakeys.contexts(actor_entity_id);
create index if not exists contexts_subject_idx on legakeys.contexts(subject_entity_id);
create index if not exists contexts_scope_idx on legakeys.contexts(scope_entity_id);
create index if not exists contexts_type_idx on legakeys.contexts(context_type);
create index if not exists context_refs_context_idx on legakeys.context_references(context_id);
create index if not exists context_refs_entity_idx on legakeys.context_references(referenced_entity_id);
create index if not exists context_conditions_context_idx on legakeys.context_conditions(context_id);
create index if not exists context_scopes_context_idx on legakeys.context_scope_refs(context_id);
create index if not exists context_scopes_scope_idx on legakeys.context_scope_refs(scope_entity_id);

-- Context describes a situation. It never grants authority.
-- NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
