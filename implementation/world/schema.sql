create extension if not exists pgcrypto;
create schema if not exists legakeys;

create table if not exists legakeys.places (
  place_id uuid primary key default gen_random_uuid(),
  entity_id uuid not null unique references legakeys.entities(entity_id),
  place_type text not null,
  parent_place_id uuid references legakeys.places(place_id),
  canonical_name text not null,
  display_name text,
  description text,
  address_line text,
  country_code text,
  region_code text,
  city_name text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  location_precision_m integer,
  lifecycle_state text not null default 'ACTIVE',
  effective_from timestamptz,
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint place_window_chk check (effective_to is null or effective_from is null or effective_to > effective_from),
  constraint place_coordinates_pair_chk check ((latitude is null and longitude is null) or (latitude is not null and longitude is not null))
);

create table if not exists legakeys.physical_entities (
  physical_entity_id uuid primary key default gen_random_uuid(),
  entity_id uuid not null unique references legakeys.entities(entity_id),
  physical_type text not null,
  place_id uuid references legakeys.places(place_id),
  lifecycle_state text not null default 'ACTIVE',
  operational_state text not null default 'UNKNOWN',
  manufacturer_reference text,
  serial_reference text,
  installed_at timestamptz,
  retired_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.resources (
  resource_id uuid primary key default gen_random_uuid(),
  entity_id uuid not null unique references legakeys.entities(entity_id),
  resource_type text not null,
  place_id uuid references legakeys.places(place_id),
  allocation_state text not null default 'AVAILABLE',
  lifecycle_state text not null default 'ACTIVE',
  quantity numeric,
  unit text,
  effective_from timestamptz,
  effective_to timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists legakeys.world_relationships (
  relationship_id uuid primary key default gen_random_uuid(),
  subject_entity_id uuid not null references legakeys.entities(entity_id),
  relationship_type text not null,
  object_entity_id uuid not null references legakeys.entities(entity_id),
  context_entity_id uuid references legakeys.entities(entity_id),
  state text not null default 'ACTIVE',
  cardinality text,
  effective_from timestamptz,
  effective_to timestamptz,
  source_reference text,
  provenance_reference uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint relationship_self_chk check (subject_entity_id <> object_entity_id)
);

create table if not exists legakeys.world_states (
  world_state_id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references legakeys.entities(entity_id),
  state_key text not null,
  state_value jsonb not null,
  truth_state text not null default 'UNKNOWN',
  observed_at timestamptz,
  effective_from timestamptz,
  effective_to timestamptz,
  source_reference text,
  provenance_reference uuid,
  created_at timestamptz not null default now()
);

create table if not exists legakeys.world_observations (
  observation_id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references legakeys.entities(entity_id),
  observation_type text not null,
  observed_value jsonb not null,
  truth_state text not null default 'OBSERVED',
  observed_at timestamptz not null default now(),
  source_reference text,
  confidence numeric(5,4),
  provenance_reference uuid,
  created_at timestamptz not null default now(),
  constraint observation_confidence_chk check (confidence is null or (confidence >= 0 and confidence <= 1))
);

create index if not exists places_parent_idx on legakeys.places(parent_place_id);
create index if not exists places_type_idx on legakeys.places(place_type);
create index if not exists physical_entities_place_idx on legakeys.physical_entities(place_id);
create index if not exists resources_place_idx on legakeys.resources(place_id);
create index if not exists world_rel_subject_idx on legakeys.world_relationships(subject_entity_id);
create index if not exists world_rel_object_idx on legakeys.world_relationships(object_entity_id);
create index if not exists world_rel_type_idx on legakeys.world_relationships(relationship_type);
create index if not exists world_state_entity_idx on legakeys.world_states(entity_id);
create index if not exists world_observation_entity_idx on legakeys.world_observations(entity_id);

-- Location is not authorization. World state is not permission.
