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
