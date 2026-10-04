-- LegaKeys Neon production verification
-- Read-only. This script does not create, alter, or delete data.

select current_database() as database_name,
       current_schema() as current_schema,
       current_user as database_user,
       now() as checked_at;

with expected(table_name) as (
  values
    ('entities'),('identities'),('persons'),('accounts'),('credentials'),('sessions'),
    ('participations'),('participants'),('places'),('physical_entities'),('resources'),
    ('world_relationships'),('world_states'),('world_observations'),
    ('services'),('service_versions'),('service_offerings'),('service_capabilities'),
    ('service_areas'),('service_provider_connections'),('service_availability'),
    ('service_requests'),('service_executions'),('service_outcomes'),('service_events'),
    ('actions'),('action_executions'),('events'),('event_outbox'),('event_consumptions'),
    ('evidence'),('action_outcomes'),('workspaces'),('workspace_memberships'),
    ('workspace_capabilities'),('workspace_delegations'),('workspace_work_items'),
    ('workspace_audit')
)
select e.table_name,
       case when c.table_name is null then 'MISSING' else 'PRESENT' end as state
from expected e
left join information_schema.tables c
  on c.table_schema='legakeys' and c.table_name=e.table_name
order by e.table_name;

-- Hard failure signal for migration validation:
do $$
declare
  missing_count integer;
begin
  select count(*) into missing_count
  from (
    select table_name
    from (values
      ('entities'),('identities'),('persons'),('accounts'),('credentials'),('sessions'),
      ('participations'),('participants'),('places'),('physical_entities'),('resources'),
      ('world_relationships'),('world_states'),('world_observations'),
      ('services'),('service_versions'),('service_offerings'),('service_capabilities'),
      ('service_areas'),('service_provider_connections'),('service_availability'),
      ('service_requests'),('service_executions'),('service_outcomes'),('service_events'),
      ('actions'),('action_executions'),('events'),('event_outbox'),('event_consumptions'),
      ('evidence'),('action_outcomes'),('workspaces'),('workspace_memberships'),
      ('workspace_capabilities'),('workspace_delegations'),('workspace_work_items'),
      ('workspace_audit')
    ) as expected(table_name)
    where not exists (
      select 1 from information_schema.tables t
      where t.table_schema='legakeys' and t.table_name=expected.table_name
    )
  ) missing;

  if missing_count > 0 then
    raise exception 'LEGAKEYS_SCHEMA_INCOMPLETE: % expected tables are missing', missing_count;
  end if;
end $$;
