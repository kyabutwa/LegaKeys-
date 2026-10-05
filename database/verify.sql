-- LegaKeys canonical Neon production verification.
-- Read-only. This script does not create, alter, or delete data.

select current_database() as database_name,
       current_schema() as current_schema,
       current_user as database_user,
       now() as checked_at;

with expected(table_name) as (
  values
    ('runtime_contract'),('entities'),('identities'),('persons'),('accounts'),('credentials'),('sessions'),
    ('participations'),('participants'),('identity_evidence'),('identity_verifications'),
    ('biometric_enrollments'),('device_authenticators'),('places'),('services'),('service_versions'),
    ('service_offerings'),('service_capabilities'),('service_requests'),('service_executions'),
    ('service_outcomes'),('actions'),('action_executions'),('authorization_requests'),
    ('authorization_decisions'),('authorization_scopes'),('authorization_conditions'),
    ('authorization_reasons'),('authorization_evidence'),('events'),('event_outbox'),
    ('event_consumptions'),('evidence'),('action_outcomes'),('access_points'),('access_credentials'),
    ('access_operations'),('access_validation_results'),('access_provider_results'),('access_events'),
    ('access_history'),('workspaces'),('workspace_memberships'),('workspace_capabilities'),
    ('workspace_delegations'),('workspace_work_items'),('workspace_audit'),('community_profiles'),
    ('community_roster'),('community_provider_links'),('community_service_config'),
    ('community_work_orders'),('community_plans'),('community_plan_items'),('genesis_runs'),
    ('digital_twins'),('spatial_observations'),('map_features'),('weather_observations'),
    ('earth_system_observations'),('climate_indicators'),('human_understandings'),
    ('contextual_understandings'),('world_intelligence_quarantine'),
    ('world_intelligence_fibonacci_policies'),('runtime_resilience_policies'),('runtime_integrity_snapshots')
)
select e.table_name, case when c.table_name is null then 'MISSING' else 'PRESENT' end as state
from expected e
left join information_schema.tables c
  on c.table_schema='legakeys' and c.table_name=e.table_name
order by e.table_name;

do $$
declare
  missing_count integer;
  bad_fk_count integer;
  good_fk_count integer;
  bad_trigger_count integer;
  bad_policy_count integer;
  decision_columns_missing integer;
begin
  select count(*) into missing_count
  from (select table_name from (values
    ('runtime_contract'),('entities'),('identities'),('persons'),('accounts'),('credentials'),('sessions'),
    ('participations'),('participants'),('identity_evidence'),('identity_verifications'),
    ('biometric_enrollments'),('device_authenticators'),('places'),('services'),('service_versions'),
    ('service_offerings'),('service_capabilities'),('service_requests'),('service_executions'),
    ('service_outcomes'),('actions'),('action_executions'),('authorization_requests'),
    ('authorization_decisions'),('events'),('event_outbox'),('event_consumptions'),('evidence'),
    ('action_outcomes'),('access_points'),('access_credentials'),('access_operations'),
    ('access_validation_results'),('access_provider_results'),('access_events'),('access_history'),
    ('workspaces'),('workspace_memberships'),('workspace_capabilities'),('workspace_delegations'),
    ('workspace_work_items'),('workspace_audit'),('community_profiles'),('community_roster'),
    ('community_provider_links'),('community_service_config'),('community_work_orders'),
    ('community_plans'),('community_plan_items'),('genesis_runs'),('digital_twins'),
    ('spatial_observations'),('map_features'),('weather_observations'),('earth_system_observations'),
    ('climate_indicators'),('human_understandings'),('contextual_understandings'),
    ('world_intelligence_quarantine'),('world_intelligence_fibonacci_policies'),
    ('runtime_resilience_policies'),('runtime_integrity_snapshots')
  ) as x(table_name)
  where not exists (
    select 1 from information_schema.tables t
    where t.table_schema='legakeys' and t.table_name=x.table_name
  )) missing;

  select count(*) into bad_fk_count
  from pg_constraint c
  join pg_class child on child.oid=c.conrelid
  join pg_namespace cn on cn.oid=child.relnamespace
  join pg_class parent on parent.oid=c.confrelid
  join pg_namespace pn on pn.oid=parent.relnamespace
  where cn.nspname='legakeys' and c.contype='f'
    and child.relname='actions' and parent.relname='authorization_decisions';

  select count(*) into good_fk_count
  from pg_constraint c
  join pg_class child on child.oid=c.conrelid
  join pg_namespace cn on cn.oid=child.relnamespace
  join pg_class parent on parent.oid=c.confrelid
  where cn.nspname='legakeys' and c.contype='f'
    and child.relname='actions'
    and parent.relname='authorization_requests'
    and c.conname='actions_authorization_request_fkey';

  select count(*) into bad_trigger_count
  from pg_trigger tg
  join pg_class c on c.oid=tg.tgrelid
  join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='legakeys' and c.relname='action_executions'
    and tg.tgname='action_execution_authorization_gate' and tg.tgisinternal=false;

  select count(*) into bad_policy_count
  from legakeys.runtime_resilience_policies
  where active=true and policy_version='FIB-1.0'
    and sequence='[0,1,1,2,3,5,8,13,21]'::jsonb
    and max_retries=5 and max_delay_ms=3000;

  select count(*) into decision_columns_missing
  from (values
    ('authorization_id'),('decision_id'),('decision_version'),('decision'),
    ('effective_from'),('expires_at'),('evaluated_at'),('policy_version'),('decision_fingerprint')
  ) as required(column_name)
  where not exists (
    select 1 from information_schema.columns c
    where c.table_schema='legakeys' and c.table_name='authorization_decisions'
      and c.column_name=required.column_name
  );

  if missing_count > 0 then
    raise exception 'LEGAKEYS_SCHEMA_INCOMPLETE: % expected tables are missing', missing_count;
  end if;
  if bad_fk_count > 0 or good_fk_count <> 1 then
    raise exception 'LEGAKEYS_AUTHORIZATION_FK_INVALID: actions must reference authorization_requests exactly once';
  end if;
  if bad_trigger_count <> 1 then
    raise exception 'LEGAKEYS_EXECUTION_GATE_INVALID: expected one authorization gate trigger';
  end if;
  if bad_policy_count < 1 then
    raise exception 'LEGAKEYS_FIBONACCI_POLICY_MISSING';
  end if;
  if decision_columns_missing > 0 then
    raise exception 'LEGAKEYS_AUTHORIZATION_SCHEMA_INVALID: % required decision columns missing', decision_columns_missing;
  end if;
end $$;

select 'LEGAKEYS_DATABASE_VERIFICATION=GREEN' as result;

-- Migration ledger: the canonical database must be able to prove which
-- repository migrations were applied and when.
do $
declare
  missing_migrations integer;
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema='legakeys' and table_name='schema_migrations'
  ) then
    raise exception 'LEGAKEYS_MIGRATION_LEDGER_MISSING';
  end if;

  select count(*) into missing_migrations
  from (values
    ('0000_canonical_runtime_contract.sql'),
    ('0001_runtime_resilience.sql'),
    ('0002_v1_1_0_governance.sql'),
    ('0003_canonical_integrity_hardening.sql')
  ) expected(filename)
  where not exists (
    select 1 from legakeys.schema_migrations m
    where m.filename = expected.filename and m.state = 'APPLIED'
  );

  if missing_migrations > 0 then
    raise exception 'LEGAKEYS_MIGRATION_LEDGER_INCOMPLETE: % migrations missing', missing_migrations;
  end if;
end $;

-- Foundational relationship integrity: every participant must resolve to the
-- same identity through its participation; every account must resolve to one
-- canonical identity; every active session must resolve to an active account.
do $
declare
  orphan_participants integer;
  identity_mismatch integer;
  active_session_mismatch integer;
begin
  select count(*) into orphan_participants
  from legakeys.participants p
  left join legakeys.participations pp on pp.participation_id = p.participation_id
  where pp.participation_id is null;

  select count(*) into identity_mismatch
  from legakeys.participants p
  join legakeys.participations pp on pp.participation_id = p.participation_id
  where p.identity_id <> pp.identity_id;

  select count(*) into active_session_mismatch
  from legakeys.sessions s
  join legakeys.accounts a on a.account_id = s.account_id
  where s.state = 'ACTIVE' and a.state in ('REVOKED','SUSPENDED','CLOSED');

  if orphan_participants > 0 then
    raise exception 'LEGAKEYS_PARTICIPANT_ORPHANS: %', orphan_participants;
  end if;
  if identity_mismatch > 0 then
    raise exception 'LEGAKEYS_PARTICIPANT_IDENTITY_MISMATCH: %', identity_mismatch;
  end if;
  if active_session_mismatch > 0 then
    raise exception 'LEGAKEYS_ACTIVE_SESSION_ACCOUNT_MISMATCH: %', active_session_mismatch;
  end if;
end $;

-- Lifecycle window integrity across the temporal foundation.
do $
declare
  bad_windows integer;
begin
  select count(*) into bad_windows
  from (
    select effective_from, effective_to from legakeys.participations
    union all
    select effective_from, effective_to from legakeys.contexts
    union all
    select effective_from, effective_to from legakeys.context_references
    union all
    select effective_from, effective_to from legakeys.context_scope_refs
    union all
    select effective_from, effective_to from legakeys.capabilities
    union all
    select effective_from, effective_to from legakeys.capability_scopes
    union all
    select effective_from, effective_to from legakeys.capability_conditions
  ) windows
  where effective_from is not null
    and effective_to is not null
    and effective_to <= effective_from;

  if bad_windows > 0 then
    raise exception 'LEGAKEYS_INVALID_LIFECYCLE_WINDOWS: %', bad_windows;
  end if;
end $;

-- Required canonical indexes. These are operational integrity guarantees,
-- not performance-only conveniences.
do $
declare
  missing_indexes integer;
begin
  select count(*) into missing_indexes
  from (values
    ('sessions_account_idx'),
    ('sessions_expiry_idx'),
    ('participation_identity_idx'),
    ('participation_context_idx'),
    ('participant_identity_idx'),
    ('contexts_actor_idx'),
    ('contexts_subject_idx'),
    ('contexts_scope_idx'),
    ('capabilities_subject'),
    ('idx_capabilities_lifecycle'),
    ('idx_community_roster_community'),
    ('idx_community_roster_participant')
  ) expected(index_name)
  where not exists (
    select 1
    from pg_indexes i
    where i.schemaname='legakeys' and i.indexname=expected.index_name
  );

  if missing_indexes > 0 then
    raise exception 'LEGAKEYS_CANONICAL_INDEX_SET_INCOMPLETE: % indexes missing', missing_indexes;
  end if;
end $;

select 'LEGAKEYS_CANONICAL_DATABASE_INTEGRITY=GREEN' as result;
