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
    ('biometric_enrollments'),('device_authenticators'),
    ('places'),('services'),('service_versions'),('service_offerings'),('service_capabilities'),
    ('service_requests'),('service_executions'),('service_outcomes'),
    ('actions'),('action_executions'),('authorization_requests'),('authorization_decisions'),
    ('authorization_scopes'),('authorization_conditions'),('authorization_reasons'),
    ('authorization_evidence'),('events'),('event_outbox'),('event_consumptions'),('evidence'),
    ('action_outcomes'),
    ('access_points'),('access_credentials'),('access_operations'),('access_validation_results'),
    ('access_provider_results'),('access_events'),('access_history'),
    ('workspaces'),('workspace_memberships'),('workspace_capabilities'),('workspace_delegations'),
    ('workspace_work_items'),('workspace_audit'),
    ('community_profiles'),('community_roster'),('community_provider_links'),
    ('community_service_config'),('community_work_orders'),('community_plans'),('community_plan_items'),
    ('genesis_runs'),('digital_twins'),
    ('spatial_observations'),('map_features'),('weather_observations'),('earth_system_observations'),
    ('climate_indicators'),('human_understandings'),('contextual_understandings'),
    ('world_intelligence_quarantine'),('world_intelligence_fibonacci_policies'),
    ('runtime_resilience_policies'),('runtime_integrity_snapshots')
)
select e.table_name,
       case when c.table_name is null then 'MISSING' else 'PRESENT' end as state
from expected e
left join information_schema.tables c
  on c.table_schema='legakeys' and c.table_name=e.table_name
order by e.table_name;

do $$
declare
  missing_count integer;
  bad_fk_count integer;
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
  where cn.nspname='legakeys'
    and c.contype='f'
    and child.relname='actions'
    and parent.relname='authorization_decisions';

  select count(*) into bad_trigger_count
  from pg_trigger tg
  join pg_class c on c.oid=tg.tgrelid
  join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='legakeys'
    and c.relname='action_executions'
    and tg.tgname='action_execution_authorization_gate'
    and tg.tgisinternal=false;

  select count(*) into bad_policy_count
  from legakeys.runtime_resilience_policies
  where active=true
    and policy_version='FIB-1.0'
    and sequence='[0,1,1,2,3,5,8,13,21]'::jsonb
    and max_retries=5
    and max_delay_ms=3000;

  select count(*) into decision_columns_missing
  from (values
    ('authorization_id'),('decision_id'),('decision_version'),('decision'),
    ('effective_from'),('expires_at'),('evaluated_at'),('policy_version'),
    ('decision_fingerprint')
  ) as required(column_name)
  where not exists (
    select 1 from information_schema.columns c
    where c.table_schema='legakeys'
      and c.table_name='authorization_decisions'
      and c.column_name=required.column_name
  );

  if missing_count > 0 then
    raise exception 'LEGAKEYS_SCHEMA_INCOMPLETE: % expected tables are missing', missing_count;
  end if;
  if bad_fk_count > 0 then
    raise exception 'LEGAKEYS_AUTHORIZATION_FK_INVALID: actions must reference authorization_requests, not versioned decisions';
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
