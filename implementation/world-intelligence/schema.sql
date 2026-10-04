CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.spatial_observations (
  id uuid PRIMARY KEY,
  subject_id uuid,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  altitude_meters double precision,
  accuracy_meters double precision,
  speed_mps double precision,
  heading_degrees double precision,
  coordinate_reference_system text NOT NULL DEFAULT 'WGS84',
  observed_at timestamptz NOT NULL,
  received_at timestamptz NOT NULL,
  freshness_seconds integer NOT NULL,
  source_kind text NOT NULL,
  truth_state text NOT NULL,
  quality text NOT NULL,
  privacy_scope text NOT NULL,
  provenance jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS spatial_observations_subject_time
  ON legakeys.spatial_observations(subject_id, observed_at DESC);

CREATE TABLE IF NOT EXISTS legakeys.map_features (
  id uuid PRIMARY KEY,
  geometry_type text NOT NULL,
  geometry jsonb NOT NULL,
  coordinate_reference_system text NOT NULL,
  semantic_type text NOT NULL,
  valid_from timestamptz,
  valid_to timestamptz,
  truth_state text NOT NULL,
  provenance jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.weather_observations (
  id uuid PRIMARY KEY,
  area_ref text NOT NULL,
  variable text NOT NULL,
  value double precision NOT NULL,
  unit text NOT NULL,
  observed_at timestamptz NOT NULL,
  issued_at timestamptz NOT NULL,
  forecast_horizon_seconds integer,
  uncertainty double precision,
  source_kind text NOT NULL,
  truth_state text NOT NULL,
  provenance jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.earth_system_observations (
  id uuid PRIMARY KEY,
  sphere text NOT NULL CHECK (
    sphere IN ('ATMOSPHERE','HYDROSPHERE','BIOSPHERE','CRYOSPHERE','GEOSPHERE')
  ),
  variable text NOT NULL,
  value double precision NOT NULL,
  unit text NOT NULL,
  region_ref text NOT NULL,
  observed_at timestamptz NOT NULL,
  source_kind text NOT NULL,
  uncertainty double precision,
  truth_state text NOT NULL,
  provenance jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.climate_indicators (
  id uuid PRIMARY KEY,
  region_ref text NOT NULL,
  variable text NOT NULL,
  baseline_period text NOT NULL,
  analysis_period text NOT NULL,
  statistic text NOT NULL,
  value double precision NOT NULL,
  unit text NOT NULL,
  uncertainty double precision,
  method_ref text NOT NULL,
  source_kind text NOT NULL,
  truth_state text NOT NULL,
  provenance jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.human_understandings (
  id uuid PRIMARY KEY,
  actor_id uuid,
  conversation_id uuid,
  explicit_content text NOT NULL,
  language text,
  intent text,
  needs jsonb NOT NULL DEFAULT '[]',
  referenced_entities jsonb NOT NULL DEFAULT '[]',
  inferred_interpretations jsonb NOT NULL DEFAULT '[]',
  ambiguity text NOT NULL,
  context_refs jsonb NOT NULL DEFAULT '[]',
  truth_state text NOT NULL,
  provenance jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.contextual_understandings (
  id uuid PRIMARY KEY,
  actor_id uuid,
  subject_refs jsonb NOT NULL DEFAULT '[]',
  place_refs jsonb NOT NULL DEFAULT '[]',
  time_window jsonb NOT NULL,
  relationship_refs jsonb NOT NULL DEFAULT '[]',
  capability_refs jsonb NOT NULL DEFAULT '[]',
  authority_refs jsonb NOT NULL DEFAULT '[]',
  environmental_refs jsonb NOT NULL DEFAULT '[]',
  human_understanding_refs jsonb NOT NULL DEFAULT '[]',
  relevant_facts jsonb NOT NULL DEFAULT '[]',
  assumptions jsonb NOT NULL DEFAULT '[]',
  uncertainties jsonb NOT NULL DEFAULT '[]',
  truth_state text NOT NULL,
  generated_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.world_intelligence_quarantine (
  id uuid PRIMARY KEY,
  source_refs jsonb NOT NULL,
  state text NOT NULL,
  reason text NOT NULL,
  payload jsonb NOT NULL,
  entered_at timestamptz NOT NULL,
  released_at timestamptz,
  release_refs jsonb
);

CREATE TABLE IF NOT EXISTS legakeys.world_intelligence_fibonacci_policies (
  id uuid PRIMARY KEY,
  purpose text NOT NULL,
  seed_intervals jsonb NOT NULL,
  minimum_interval double precision NOT NULL,
  maximum_interval double precision NOT NULL,
  reset_condition text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS weather_area_time
  ON legakeys.weather_observations(area_ref, observed_at DESC);

CREATE INDEX IF NOT EXISTS earth_region_time
  ON legakeys.earth_system_observations(region_ref, observed_at DESC);

CREATE INDEX IF NOT EXISTS climate_region_period
  ON legakeys.climate_indicators(region_ref, analysis_period);

-- Historical intelligence records are append-oriented.
-- UPDATE/DELETE protection should be applied by the production migration layer
-- consistently with Action/Event/Evidence and Genesis immutable-history policy.
