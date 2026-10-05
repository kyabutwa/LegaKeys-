CREATE SCHEMA IF NOT EXISTS legakeys;

CREATE TABLE IF NOT EXISTS legakeys.workspaces (
  id uuid PRIMARY KEY,
  workspace_type text NOT NULL CHECK (workspace_type IN ('LEGAKEYS_OPERATING','COMMUNITY_OPERATING','SERVICE_OPERATING','TEAM','PERSONAL','INCIDENT','PROJECT','REVIEW')),
  name text NOT NULL,
  purpose text NOT NULL,
  scope_ref uuid NOT NULL,
  lifecycle text NOT NULL CHECK (lifecycle IN ('PROPOSED','CONFIGURING','ACTIVE','DEGRADED','SUSPENDED','ARCHIVED')),
  governance_ref uuid NOT NULL,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS legakeys.workspace_memberships (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES legakeys.workspaces(id),
  participant_ref uuid NOT NULL,
  role text NOT NULL,
  status text NOT NULL CHECK (status IN ('INVITED','ACTIVE','SUSPENDED','REVOKED','EXPIRED')),
  scope_ref uuid NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz,
  basis_ref uuid,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL,
  UNIQUE (workspace_id, participant_ref, valid_from)
);

CREATE TABLE IF NOT EXISTS legakeys.workspace_capabilities (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES legakeys.workspaces(id),
  capability_ref uuid NOT NULL,
  role text NOT NULL,
  scope_ref uuid NOT NULL,
  policy_ref uuid NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  UNIQUE (workspace_id, capability_ref, role, scope_ref)
);

CREATE TABLE IF NOT EXISTS legakeys.workspace_delegations (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES legakeys.workspaces(id),
  delegator_participant_ref uuid NOT NULL,
  delegatee_participant_ref uuid NOT NULL,
  capability_ref uuid NOT NULL,
  scope_ref uuid NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,
  conditions jsonb NOT NULL DEFAULT '{}'::jsonb,
  authority_ref uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('ACTIVE','EXPIRED','REVOKED'))
);

CREATE TABLE IF NOT EXISTS legakeys.workspace_work_items (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES legakeys.workspaces(id),
  work_item_type text NOT NULL,
  title text NOT NULL,
  subject_ref uuid,
  context_ref uuid,
  proposal_ref uuid,
  authorization_ref uuid,
  status text NOT NULL,
  created_by_participant_ref uuid NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS legakeys.workspace_audit (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES legakeys.workspaces(id),
  actor_participant_ref uuid,
  action text NOT NULL,
  target_ref uuid,
  before_json jsonb,
  after_json jsonb,
  occurred_at timestamptz NOT NULL,
  recorded_at timestamptz NOT NULL,
  correlation_id uuid NOT NULL,
  provenance jsonb NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workspace_scope ON legakeys.workspaces(scope_ref);
CREATE INDEX IF NOT EXISTS idx_workspace_members_participant ON legakeys.workspace_memberships(participant_ref, status);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON legakeys.workspace_memberships(workspace_id, status);
CREATE INDEX IF NOT EXISTS idx_workspace_items_workspace ON legakeys.workspace_work_items(workspace_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_workspace_audit_workspace ON legakeys.workspace_audit(workspace_id, occurred_at DESC);


-- Community Operating System extension.
-- This layer coordinates community operations without turning membership into unrestricted authority.
CREATE TABLE IF NOT EXISTS legakeys.community_profiles (
  community_entity_id uuid PRIMARY KEY REFERENCES legakeys.entities(entity_id),
  workspace_id uuid NOT NULL UNIQUE REFERENCES legakeys.workspaces(id),
  operator_entity_id uuid REFERENCES legakeys.entities(entity_id),
  operator_type text NOT NULL DEFAULT 'COMMUNITY'
    CHECK (operator_type IN ('COMMUNITY','ORGANIZATION')),
  onboarding_state text NOT NULL DEFAULT 'CONFIGURING'
    CHECK (onboarding_state IN ('CONFIGURING','ACTIVE','DEGRADED','SUSPENDED','ARCHIVED')),
  plan_code text NOT NULL DEFAULT 'COMMUNITY',
  plan_version text NOT NULL DEFAULT '1.0',
  plan_state text NOT NULL DEFAULT 'DRAFT'
    CHECK (plan_state IN ('DRAFT','ACTIVE','PAUSED','COMPLETED','ARCHIVED')),
  governance_mode text NOT NULL DEFAULT 'EXPLICIT_AUTHORIZATION',
  service_policy jsonb NOT NULL DEFAULT '{"platform_controlled":true,"community_can_configure":true,"community_can_disable_platform_service":false}'::jsonb,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.community_roster (
  id uuid PRIMARY KEY,
  community_entity_id uuid NOT NULL REFERENCES legakeys.community_profiles(community_entity_id),
  participant_ref uuid NOT NULL,
  relationship_type text NOT NULL
    CHECK (relationship_type IN ('RESIDENT','OWNER','TENANT','WORKER','MANAGER','VISITOR','MEMBER','GUEST','STUDENT','CONTRACTOR','OTHER')),
  state text NOT NULL DEFAULT 'ACTIVE'
    CHECK (state IN ('INVITED','ACTIVE','SUSPENDED','ENDED','REVOKED')),
  scope_ref uuid,
  source_reference text,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_entity_id, participant_ref, relationship_type, effective_from)
);

CREATE TABLE IF NOT EXISTS legakeys.community_provider_links (
  id uuid PRIMARY KEY,
  community_entity_id uuid NOT NULL REFERENCES legakeys.community_profiles(community_entity_id),
  provider_entity_id uuid NOT NULL REFERENCES legakeys.entities(entity_id),
  provider_participant_ref uuid,
  verification_state text NOT NULL DEFAULT 'PENDING'
    CHECK (verification_state IN ('PENDING','VERIFIED','REJECTED','EXPIRED')),
  state text NOT NULL DEFAULT 'PROPOSED'
    CHECK (state IN ('PROPOSED','ACTIVE','SUSPENDED','ENDED')),
  service_scope jsonb NOT NULL DEFAULT '{}'::jsonb,
  contract_reference text,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_entity_id, provider_entity_id)
);

CREATE TABLE IF NOT EXISTS legakeys.community_service_config (
  id uuid PRIMARY KEY,
  community_entity_id uuid NOT NULL REFERENCES legakeys.community_profiles(community_entity_id),
  service_id uuid NOT NULL REFERENCES legakeys.services(service_id),
  state text NOT NULL DEFAULT 'PENDING'
    CHECK (state IN ('PENDING','AVAILABLE','DEGRADED','UNKNOWN')),
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  community_control text NOT NULL DEFAULT 'CONFIGURE_ONLY'
    CHECK (community_control = 'CONFIGURE_ONLY'),
  last_verified_at timestamptz,
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_entity_id, service_id)
);

CREATE TABLE IF NOT EXISTS legakeys.community_work_orders (
  id uuid PRIMARY KEY,
  community_entity_id uuid NOT NULL REFERENCES legakeys.community_profiles(community_entity_id),
  workspace_id uuid NOT NULL REFERENCES legakeys.workspaces(id),
  service_request_id uuid REFERENCES legakeys.service_requests(request_id),
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'NORMAL'
    CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')),
  state text NOT NULL DEFAULT 'OPEN'
    CHECK (state IN ('OPEN','TRIAGED','ASSIGNED','IN_PROGRESS','BLOCKED','COMPLETED','CANCELLED')),
  target_ref uuid,
  assigned_provider_ref uuid,
  assigned_worker_ref uuid,
  due_at timestamptz,
  authorization_ref uuid,
  evidence_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by_participant_ref uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.community_plans (
  id uuid PRIMARY KEY,
  community_entity_id uuid NOT NULL REFERENCES legakeys.community_profiles(community_entity_id),
  name text NOT NULL,
  objective text NOT NULL,
  horizon_start date,
  horizon_end date,
  state text NOT NULL DEFAULT 'DRAFT'
    CHECK (state IN ('DRAFT','ACTIVE','PAUSED','COMPLETED','ARCHIVED')),
  budget_model jsonb NOT NULL DEFAULT '{}'::jsonb,
  measures jsonb NOT NULL DEFAULT '[]'::jsonb,
  assumptions jsonb NOT NULL DEFAULT '[]'::jsonb,
  risks jsonb NOT NULL DEFAULT '[]'::jsonb,
  authorization_ref uuid,
  created_by_participant_ref uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legakeys.community_plan_items (
  id uuid PRIMARY KEY,
  plan_id uuid NOT NULL REFERENCES legakeys.community_plans(id),
  title text NOT NULL,
  item_type text NOT NULL
    CHECK (item_type IN ('GOAL','INITIATIVE','MILESTONE','PROJECT','SERVICE','MAINTENANCE','RISK','MEASURE')),
  state text NOT NULL DEFAULT 'PLANNED'
    CHECK (state IN ('PLANNED','PROPOSED','AUTHORIZED','IN_PROGRESS','BLOCKED','COMPLETED','CANCELLED')),
  owner_participant_ref uuid,
  target_ref uuid,
  due_at timestamptz,
  proposal_ref uuid,
  authorization_ref uuid,
  evidence_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_roster_community ON legakeys.community_roster(community_entity_id,state);
CREATE INDEX IF NOT EXISTS idx_community_roster_participant ON legakeys.community_roster(participant_ref,state);
CREATE INDEX IF NOT EXISTS idx_community_provider_links_community ON legakeys.community_provider_links(community_entity_id,state);
CREATE INDEX IF NOT EXISTS idx_community_service_config_community ON legakeys.community_service_config(community_entity_id,state);
CREATE INDEX IF NOT EXISTS idx_community_work_orders_community ON legakeys.community_work_orders(community_entity_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_plans_community ON legakeys.community_plans(community_entity_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_plan_items_plan ON legakeys.community_plan_items(plan_id,updated_at DESC);

-- Community control boundary:
-- roster/workflow/planning data may be configured inside an explicit workspace scope.
-- platform service ownership remains LegaKeys-controlled.
-- consequential execution still requires canonical authorization and evidence.
