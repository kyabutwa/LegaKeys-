-- Rollback-only canonical runtime smoke test.
-- This must exercise the same relational path used by production onboarding.
BEGIN;

CREATE TEMP TABLE legakeys_smoke_ids (
  entity_id uuid,
  identity_id uuid,
  person_id uuid,
  account_id uuid,
  credential_id uuid,
  participation_id uuid,
  participant_id uuid,
  workspace_id uuid,
  community_entity_id uuid,
  membership_id uuid,
  roster_id uuid
) ON COMMIT DROP;

WITH e AS (
  INSERT INTO legakeys.entities(entity_id,entity_type,canonical_name,display_name,lifecycle_state)
  VALUES (gen_random_uuid(),'PERSON','__SMOKE__','__SMOKE__','ACTIVE')
  RETURNING entity_id
), i AS (
  INSERT INTO legakeys.identities(entity_id,identity_type,state,verification_state)
  SELECT entity_id,'PERSON','ACTIVE','UNVERIFIED' FROM e
  RETURNING identity_id,entity_id
), p AS (
  INSERT INTO legakeys.persons(entity_id,legal_name,display_name,country_of_residence)
  SELECT entity_id,'__SMOKE__','__SMOKE__','KE' FROM i
  RETURNING person_id,entity_id
), a AS (
  INSERT INTO legakeys.accounts(identity_id,state)
  SELECT identity_id,'ACTIVE' FROM i
  RETURNING account_id,identity_id
), c AS (
  INSERT INTO legakeys.credentials(account_id,credential_type,state,subject_reference,verification_state,secret_reference)
  SELECT account_id,'EMAIL_PASSWORD','ACTIVE','__smoke__@invalid.legakeys','UNVERIFIED','__SMOKE_SECRET__' FROM a
  RETURNING credential_id,account_id
), u AS (
  UPDATE legakeys.accounts a
  SET primary_credential_id=c.credential_id,updated_at=now()
  FROM c WHERE a.account_id=c.account_id
  RETURNING a.account_id,a.identity_id
), pa AS (
  INSERT INTO legakeys.participations(identity_id,state,scope)
  SELECT identity_id,'ACTIVE','{}'::jsonb FROM i
  RETURNING participation_id,identity_id
), pt AS (
  INSERT INTO legakeys.participants(participation_id,identity_id,state)
  SELECT participation_id,identity_id,'ACTIVE' FROM pa
  RETURNING participant_id,participation_id,identity_id
), ce AS (
  INSERT INTO legakeys.entities(entity_id,entity_type,canonical_name,display_name,lifecycle_state)
  SELECT gen_random_uuid(),'COMMUNITY','__SMOKE_COMMUNITY__','__SMOKE_COMMUNITY__','ACTIVE'
  RETURNING entity_id
), w AS (
  INSERT INTO legakeys.workspaces(id,workspace_type,name,purpose,scope_ref,lifecycle,governance_ref,version,created_at,updated_at)
  SELECT gen_random_uuid(),'COMMUNITY_OPERATING','__SMOKE_COMMUNITY__','__SMOKE_PURPOSE__',entity_id,'ACTIVE',entity_id,1,now(),now()
  FROM ce
  RETURNING id,scope_ref
), m AS (
  INSERT INTO legakeys.workspace_memberships(id,workspace_id,participant_ref,role,status,scope_ref,valid_from,created_at,updated_at)
  SELECT gen_random_uuid(),w.id,pt.participant_id,'COMMUNITY_INITIATOR','ACTIVE',w.scope_ref,now(),now(),now()
  FROM w CROSS JOIN pt
  RETURNING id,workspace_id,participant_ref
), cp AS (
  INSERT INTO legakeys.community_profiles(community_entity_id,workspace_id,operator_entity_id,operator_type,onboarding_state,plan_code,plan_version,plan_state,governance_mode,service_policy,settings)
  SELECT ce.entity_id,w.id,ce.entity_id,'COMMUNITY','ACTIVE','COMMUNITY','1.0','DRAFT','EXPLICIT_AUTHORIZATION',
         '{"platform_controlled":true,"community_can_configure":true,"community_can_disable_platform_service":false}'::jsonb,
         '{"join_code":"LK-SMOKE"}'::jsonb
  FROM ce CROSS JOIN w
  RETURNING community_entity_id,workspace_id
), cr AS (
  INSERT INTO legakeys.community_roster(id,community_entity_id,participant_ref,relationship_type,state,scope_ref,source_reference)
  SELECT gen_random_uuid(),cp.community_entity_id,pt.participant_id,'MEMBER','ACTIVE',cp.community_entity_id,'runtime-smoke'
  FROM cp CROSS JOIN pt
  RETURNING id
)
INSERT INTO legakeys_smoke_ids
SELECT e.entity_id,i.identity_id,p.person_id,a.account_id,c.credential_id,pa.participation_id,pt.participant_id,
       w.id,ce.entity_id,m.id,cr.id
FROM e,i,p,a,c,pa,pt,w,ce,m,cr;

DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n FROM legakeys_smoke_ids;
  IF n <> 1 THEN
    RAISE EXCEPTION 'LEGAKEYS_SMOKE_INCOMPLETE:%', n;
  END IF;
END $$;

ROLLBACK;
