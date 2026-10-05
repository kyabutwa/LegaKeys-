-- LegaKeys Services / Beat-family canonical persistence
CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.services (
  service_id UUID PRIMARY KEY,
  beat_code TEXT NOT NULL UNIQUE,
  canonical_name TEXT NOT NULL,
  description TEXT,
  owner_domain TEXT NOT NULL DEFAULT 'LEGAKEYS',
  lifecycle_state TEXT NOT NULL CHECK (lifecycle_state IN ('PROPOSED','DESIGNED','CONFIGURED','ACTIVE','DEGRADED','SUSPENDED','RETIRED')),
  truth_state TEXT NOT NULL CHECK (truth_state IN ('VERIFIED','DECLARED','OBSERVED','INFERRED','PROPOSED','UNKNOWN')),
  native_or_provider_mode TEXT NOT NULL CHECK (native_or_provider_mode IN ('NATIVE','PROVIDER_DEPENDENT','HYBRID')),
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.service_versions (
  service_version_id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES legakeys.services(service_id),
  version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('DRAFT','PUBLISHED','DEPRECATED','RETIRED')),
  contract JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  UNIQUE(service_id, version)
);

CREATE TABLE IF NOT EXISTS legakeys.service_offerings (
  offering_id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES legakeys.services(service_id),
  service_version_id UUID REFERENCES legakeys.service_versions(service_version_id),
  name TEXT NOT NULL,
  description TEXT,
  eligibility JSONB NOT NULL DEFAULT '{}'::jsonb,
  pricing JSONB NOT NULL DEFAULT '{}'::jsonb,
  commitments JSONB NOT NULL DEFAULT '{}'::jsonb,
  lifecycle_state TEXT NOT NULL,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE(service_id, name)
);

CREATE TABLE IF NOT EXISTS legakeys.service_capabilities (
  service_capability_id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES legakeys.services(service_id),
  capability_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  capability_contract JSONB NOT NULL DEFAULT '{}'::jsonb,
  lifecycle_state TEXT NOT NULL,
  UNIQUE(service_id, capability_code)
);

CREATE TABLE IF NOT EXISTS legakeys.service_areas (
  service_area_id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES legakeys.services(service_id),
  place_id UUID REFERENCES legakeys.places(place_id),
  availability_state TEXT NOT NULL CHECK (availability_state IN ('AVAILABLE','UNAVAILABLE','UNKNOWN','DEGRADED','PENDING')),
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS legakeys.service_provider_connections (
  connection_id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES legakeys.services(service_id),
  provider_id TEXT NOT NULL,
  adapter_id TEXT NOT NULL,
  adapter_version TEXT NOT NULL,
  capability_code TEXT,
  provider_reference TEXT,
  state TEXT NOT NULL CHECK (state IN ('CONNECTED','DEGRADED','UNAVAILABLE','SUSPENDED','DISCONNECTED','UNKNOWN')),
  credential_reference TEXT,
  contract_version TEXT,
  health JSONB NOT NULL DEFAULT '{}'::jsonb,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.service_availability (
  availability_id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES legakeys.services(service_id),
  state TEXT NOT NULL CHECK (state IN ('AVAILABLE','UNAVAILABLE','UNKNOWN','DEGRADED','PENDING')),
  scope JSONB NOT NULL DEFAULT '{}'::jsonb,
  effective_from TIMESTAMPTZ NOT NULL,
  effective_until TIMESTAMPTZ,
  source_type TEXT NOT NULL,
  source_reference TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS legakeys.service_requests (
  request_id UUID PRIMARY KEY,
  principal_entity_id UUID NOT NULL REFERENCES legakeys.entities(entity_id),
  service_id UUID NOT NULL REFERENCES legakeys.services(service_id),
  service_version_id UUID REFERENCES legakeys.service_versions(service_version_id),
  offering_id UUID REFERENCES legakeys.service_offerings(offering_id),
  capability_code TEXT,
  target_entity_id UUID REFERENCES legakeys.entities(entity_id),
  place_id UUID REFERENCES legakeys.places(place_id),
  context_id UUID,
  authorization_id UUID,
  intent JSONB NOT NULL DEFAULT '{}'::jsonb,
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  state TEXT NOT NULL CHECK (state IN ('REQUESTED','EVALUATING','AUTHORIZED','EXECUTING','ACCEPTED','COMPLETED','DENIED','PENDING','UNKNOWN','FAILED','CANCELLED','EXPIRED','REVOKED','DEGRADED')),
  idempotency_key TEXT NOT NULL UNIQUE,
  execution_deadline TIMESTAMPTZ,
  correlation_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.service_executions (
  execution_id UUID PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES legakeys.service_requests(request_id),
  authorization_id UUID,
  connection_id UUID REFERENCES legakeys.service_provider_connections(connection_id),
  execution_state TEXT NOT NULL CHECK (execution_state IN ('STARTED','ACCEPTED','COMPLETED','FAILED','TIMEOUT','UNKNOWN','CANCELLED','RECONCILED')),
  provider_command_reference TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS legakeys.service_outcomes (
  outcome_id UUID PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES legakeys.service_requests(request_id),
  execution_id UUID REFERENCES legakeys.service_executions(execution_id),
  status TEXT NOT NULL CHECK (status IN ('SUCCESS','PARTIAL','FAILED','DENIED','UNKNOWN','CANCELLED')),
  requested_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  actual_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  provider_response_reference TEXT,
  evidence_reference TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.service_events (
  event_id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES legakeys.services(service_id),
  request_id UUID REFERENCES legakeys.service_requests(request_id),
  execution_id UUID REFERENCES legakeys.service_executions(execution_id),
  event_type TEXT NOT NULL,
  event_state TEXT NOT NULL,
  actor_entity_id UUID REFERENCES legakeys.entities(entity_id),
  correlation_id TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  evidence_reference TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_services_beat ON legakeys.services(beat_code);
CREATE INDEX IF NOT EXISTS idx_service_versions_service ON legakeys.service_versions(service_id);
CREATE INDEX IF NOT EXISTS idx_service_offerings_service ON legakeys.service_offerings(service_id);
CREATE INDEX IF NOT EXISTS idx_service_capabilities_service ON legakeys.service_capabilities(service_id);
CREATE INDEX IF NOT EXISTS idx_service_connections_service ON legakeys.service_provider_connections(service_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_principal ON legakeys.service_requests(principal_entity_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_service ON legakeys.service_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_service_events_request ON legakeys.service_events(request_id, occurred_at);


-- Canonical Beat-family catalog.
-- These rows are DECLARED platform capabilities, not claims of provider availability.
-- Provider connections, availability and execution remain separate governed states.
INSERT INTO legakeys.services
  (service_id, beat_code, canonical_name, description, owner_domain, lifecycle_state, truth_state, native_or_provider_mode, provenance)
VALUES
  (gen_random_uuid(), 'BEATACCESS', 'BeatAccess', 'Governed physical and digital access', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATHOME', 'BeatHome', 'Home, household, unit and home operations', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATUTILITIES', 'BeatUtilities', 'Water, electricity, gas, internet and waste', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATMAINTENANCE', 'BeatMaintenance', 'Maintenance requests, work orders, inspections, repairs and evidence', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATFACILITY', 'BeatFacility', 'Facilities, reservations, availability and operations', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATCOMMUNITY', 'BeatCommunity', 'Community life, requests, activities and operations', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'NATIVE', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATVISITOR', 'BeatVisitor', 'Visitor invitations, guest verification and access windows', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATDELIVERY', 'BeatDelivery', 'Delivery verification, access and events', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATRIDE', 'BeatRide', 'Mobility discovery, booking and ride events', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'PROVIDER_DEPENDENT', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATPAY', 'BeatPay', 'Payment intent, authorization, execution and reconciliation', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'PROVIDER_DEPENDENT', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATMARKET', 'BeatMarket', 'Products, services, sellers, buyers, orders and fulfillment', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATFOOD', 'BeatFood', 'Food discovery, menus, orders, delivery and payment', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'PROVIDER_DEPENDENT', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATBNB', 'BeatBnB', 'Listings, availability, bookings, stays and payment', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'PROVIDER_DEPENDENT', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATHEALTH', 'BeatHealth', 'Health service discovery, requests and appointments', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'PROVIDER_DEPENDENT', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATGENZI', 'BeatGenzi', 'Learning, skills, education and development', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATWORK', 'BeatWork', 'Work discovery, opportunities, tasks and relationships', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}'),
  (gen_random_uuid(), 'BEATGUARDIAN', 'BeatGuardian', 'Safety, assistance, incidents, escalation and handoff', 'LEGAKEYS', 'ACTIVE', 'DECLARED', 'HYBRID', '{"source":"canonical-service-catalog","state":"DECLARED"}')
ON CONFLICT (beat_code) DO NOTHING;
