import { Client as PgClient } from "pg";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
neonConfig.poolQueryViaFetch = true;

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  HYPERDRIVE?: { connectionString: string };
  DATABASE_URL?: string;
}

type Row = Record<string, unknown>;


// Canonical data reads fail closed without a bound session. Final production boundary verification.
const SESSION_COOKIE="__Host-legakeys_session";
const SESSION_TTL_SECONDS=604800;
const SESSION_IDLE_SECONDS=86400;
function requestOriginAllowed(request:Request){const origin=request.headers.get("Origin");return !origin||origin===new URL(request.url).origin}
function cookieValue(request:Request,name:string){const raw=request.headers.get("Cookie")??"";for(const part of raw.split(";")){const [key,...rest]=part.trim().split("=");if(key===name)return rest.join("=")||null}return null}
function bytesToBase64Url(bytes:Uint8Array){let b="";for(const x of bytes)b+=String.fromCharCode(x);return btoa(b).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function base64UrlToBytes(v:string){const b=atob(v.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((v.length+3)%4));const out=new Uint8Array(b.length);for(let i=0;i<b.length;i++)out[i]=b.charCodeAt(i);return out}
async function sha256(v:string){return bytesToBase64Url(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v))))}
async function derivePassword(password:string,salt:Uint8Array,iterations=100000){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),{name:"PBKDF2"},false,["deriveBits"]);return bytesToBase64Url(new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations,hash:"SHA-256"},key,256)))}
async function passwordRecord(password:string){const salt=crypto.getRandomValues(new Uint8Array(16));const iterations=100000;return "pbkdf2-sha256$v2$"+iterations+"$"+bytesToBase64Url(salt)+"$"+await derivePassword(password,salt,iterations)}
async function verifyPassword(password:string,record:string){const p=record.split("$");if(p.length!==5||p[0]!=="pbkdf2-sha256"||p[1]!=="v1"&&p[1]!=="v2")return false;const n=Number(p[2]);if(!Number.isInteger(n)||n<100000||n>100000)return false;const a=new TextEncoder().encode(await derivePassword(password,base64UrlToBytes(p[3]),n)),b=new TextEncoder().encode(p[4]);if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0}
function sessionCookie(v:string,maxAge=SESSION_TTL_SECONDS){return SESSION_COOKIE+"="+v+"; Max-Age="+maxAge+"; Path=/; Secure; HttpOnly; SameSite=Strict"}
async function canonicalSession(env:Env,request:Request):Promise<Row|null>{const raw=cookieValue(request,SESSION_COOKIE);if(!raw)return null;try{const rows=await query(env,`select s.session_id,s.account_id,s.expires_at,a.state as account_state,a.identity_id,i.entity_id,i.identity_type,i.verification_state,p.person_id,p.legal_name,p.display_name,asx.profile_photo_data,asx.profile_photo_mime,pt.participant_id,pt.state as participant_state,pa.participation_id,pa.context_entity_id,pa.state as participation_state,pa.scope from legakeys.sessions s join legakeys.accounts a on a.account_id=s.account_id join legakeys.identities i on i.identity_id=a.identity_id left join legakeys.persons p on p.entity_id=i.entity_id left join legakeys.account_settings asx on asx.account_id=a.account_id left join legakeys.participants pt on pt.identity_id=i.identity_id and pt.state='ACTIVE' left join legakeys.participations pa on pa.participation_id=pt.participation_id where s.session_secret_reference=$1 and s.state='ACTIVE' and s.expires_at>now() and s.last_seen_at>now()-interval '24 hours' and a.state='ACTIVE' order by pa.created_at desc nulls last limit 1`,[await sha256(raw)]);return rows[0]??null}catch{return null}}
function publicAccount(r:Row){return {account_id:r.account_id,account_state:r.account_state,identity_id:r.identity_id,identity_type:r.identity_type,verification_state:r.verification_state,person:{person_id:r.person_id,legal_name:r.legal_name,display_name:r.display_name},photo:{data:r.profile_photo_data||null,mime:r.profile_photo_mime||null},participant:{participant_id:r.participant_id,state:r.participant_state},participation:{participation_id:r.participation_id,context_entity_id:r.context_entity_id,state:r.participation_state,scope:r.scope}}}

async function communityOperatorScope(env:Env,session:Row,communityId:string,workspaceId=""){
  const rows=await query(env,`select cp.community_entity_id,cp.workspace_id,cp.operator_entity_id,cp.operator_type from legakeys.community_profiles cp join legakeys.workspaces w on w.id=cp.workspace_id and w.lifecycle='ACTIVE' where cp.community_entity_id=$1 and ($2='' or cp.workspace_id=$2) and ((cp.settings->>'created_by_account')=$3 or (cp.operator_entity_id=$4::uuid and cp.operator_type=$5) or exists (select 1 from legakeys.workspace_memberships wm where wm.workspace_id=cp.workspace_id and $6<>'' and wm.participant_ref=nullif($6,'')::uuid and wm.status='ACTIVE' and wm.role in ('COMMUNITY_OPERATOR','COMMUNITY_INITIATOR','COMMUNITY_MANAGER','COMMUNITY_OWNER','COMMUNITY_ADMIN'))) limit 1`,[communityId,workspaceId,String(session.account_id??""),String(session.entity_id??""),String(session.identity_type??""),String(session.participant_id??"")]);
  return rows[0]??null;
}

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function cors(response: Response, request: Request): Response {
  const origin = request.headers.get("Origin");
  if (!origin || origin !== new URL(request.url).origin) return response;
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", origin);
  headers.set("access-control-allow-credentials", "true");
  headers.set("vary", "Origin");
  return new Response(response.body, { status: response.status, headers });
}

async function query(env: Env, sql: string, values: unknown[] = []): Promise<Row[]> {
  const connectionString = env.HYPERDRIVE?.connectionString ?? env.DATABASE_URL;
  if (!connectionString) throw Object.assign(new Error("DATABASE_NOT_CONFIGURED"), { code: "DATABASE_NOT_CONFIGURED" });
  if (env.HYPERDRIVE) {
    const client = new PgClient({ connectionString });
    try {
      await client.connect();
      return (await client.query(sql, values)).rows as Row[];
    } finally {
      await client.end().catch(() => undefined);
    }
  }
  const pool = new NeonPool({ connectionString });
  try {
    return (await pool.query(sql, values)).rows as Row[];
  } finally {
    await pool.end().catch(() => undefined);
  }
}

async function api(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return cors(new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type,authorization",
      "access-control-max-age": "86400"
    }
  }), request);

  if (url.pathname === "/api/health") {
    try {
      const rows = await query(env, "select current_database() as database, current_schema() as schema, now() as server_time, exists (select 1 from information_schema.schemata where schema_name = 'legakeys') as canonical_schema_present, exists (select 1 from information_schema.tables where table_schema = 'legakeys' and table_name = 'runtime_contract') as runtime_contract_table_present");
      const requiredTables = [
        "runtime_contract", "entities", "identities", "persons", "accounts", "credentials", "sessions",
        "participations", "participants", "identity_evidence", "identity_verifications", "biometric_enrollments", "device_authenticators", "places", "services", "service_versions", "service_offerings",
        "service_capabilities", "service_requests", "service_executions", "service_outcomes",
        "actions", "action_executions", "authorization_decisions", "events", "evidence",
        "access_points", "access_credentials", "access_operations", "access_validation_results", "access_provider_results", "access_events", "access_history",
        "workspaces", "genesis_runs",
        "digital_twins", "community_profiles", "community_roster", "community_provider_links", "community_service_config", "community_work_orders", "community_plans", "community_plan_items"
      ];
      if (!rows[0]?.canonical_schema_present || !rows[0]?.runtime_contract_table_present) {
        return cors(json({
          ok: false,
          state: "CANONICAL_MIGRATION_REQUIRED",
          transport: env.HYPERDRIVE?.connectionString ? "cloudflare-hyperdrive" : env.DATABASE_URL ? "cloudflare-database-url" : "unconfigured",
          database: rows[0]?.database,
          schema: rows[0]?.schema,
          server_time: rows[0]?.server_time,
          canonical_schema_present: Boolean(rows[0]?.canonical_schema_present),
          runtime_contract_table_present: Boolean(rows[0]?.runtime_contract_table_present),
          canonical_contract_valid: false,
          required_table_count: requiredTables.length,
          present_table_count: 0,
          missing_tables: requiredTables
        }), request);
      }
      const contractRows = await query(env, "select exists (select 1 from legakeys.runtime_contract where contract_id = 1 and canonical_schema = 'legakeys' and legacy_runtime_allowed = false) as canonical_contract_valid");
      const tableRows = await query(env, "select table_name from information_schema.tables where table_schema = 'legakeys' and table_name = any($1::text[])", [requiredTables]);
      const presentTables = tableRows.map((row) => String(row.table_name));
      const missingTables = requiredTables.filter((table) => !presentTables.includes(table));
      const canonicalContractValid = Boolean(contractRows[0]?.canonical_contract_valid);
      const ready = Boolean(canonicalContractValid && missingTables.length === 0);
      const transport = env.HYPERDRIVE?.connectionString ? "cloudflare-hyperdrive" : env.DATABASE_URL ? "cloudflare-database-url" : "unconfigured";
      return cors(json({
        ok: ready,
        state: ready ? "CONNECTED" : canonicalContractValid ? "CANONICAL_SCHEMA_INCOMPLETE" : "CANONICAL_MIGRATION_REQUIRED",
        transport,
        database: rows[0]?.database,
        schema: rows[0]?.schema,
        server_time: rows[0]?.server_time,
        canonical_schema_present: Boolean(rows[0]?.canonical_schema_present),
        canonical_contract_valid: canonicalContractValid,
        required_table_count: requiredTables.length,
        present_table_count: presentTables.length,
        missing_tables: missingTables
      }), request);
    } catch (e) {
      const code = e instanceof Error && "code" in e ? String((e as Error & {code?: string}).code) : "DATABASE_ERROR";
      return cors(json({ ok: false, state: code === "DATABASE_NOT_CONFIGURED" ? "NOT_CONFIGURED" : "UNAVAILABLE", code }, code === "DATABASE_NOT_CONFIGURED" ? 503 : 502), request);
    }
  }


  try {

    if(request.method!=="GET"&&!requestOriginAllowed(request))return cors(json({ok:false,state:"DENIED",code:"CROSS_ORIGIN_MUTATION_BLOCKED"},403),request);
    if(request.method==="POST"&&url.pathname==="/api/account/signup"){
      const b=await request.json().catch(()=>null) as any,e=String(b?.email??"").trim().toLowerCase(),pw=String(b?.password??""),confirmPw=String(b?.confirmPassword??""),name=String(b?.legalName??"").trim(),display=String(b?.displayName??"").trim()||name,country=String(b?.countryOfResidence??"").trim()||null,invitationId=String(b?.invitationConfirmationId??"").trim();
      if(!/^\S+@\S+\.\S+$/.test(e)||pw.length<12||pw.length>256||name.length<2||pw!==confirmPw)return cors(json({ok:false,state:"INVALID_INPUT",code:pw!==confirmPw?"PASSWORD_CONFIRMATION_MISMATCH":"SIGNUP_INPUT_INVALID"},400),request);
      let invitation:any=null;if(invitationId){if(!/^[0-9a-f-]{36}$/i.test(invitationId))return cors(json({ok:false,state:"INVALID_INPUT",code:"INVITATION_CONFIRMATION_ID_INVALID"},400),request);const ir=await query(env,"select invitation_id,visitor_entity_id,visitor_contact_ref,state from legakeys.visitor_invitations where invitation_id=$1 and state in ('SENT','VERIFICATION_PENDING') and valid_from<=now() and valid_until>now() limit 1",[invitationId]);invitation=ir[0]??null;if(!invitation)return cors(json({ok:false,state:"DENIED",code:"INVITATION_CONFIRMATION_INVALID"},403),request);if(invitation.visitor_contact_ref&&String(invitation.visitor_contact_ref).trim().toLowerCase()!==e)return cors(json({ok:false,state:"DENIED",code:"INVITATION_EMAIL_MISMATCH"},403),request);}
      if((await query(env,"select 1 from legakeys.credentials where credential_type='EMAIL_PASSWORD' and subject_reference=$1 limit 1",[e])).length)return cors(json({ok:false,state:"CONFLICT",code:"ACCOUNT_ALREADY_EXISTS"},409),request);
      const secret=await passwordRecord(pw);
      const rows=await query(env,`with e as(insert into legakeys.entities(entity_type,canonical_name,display_name,lifecycle_state)values('PERSON',$1,$2,'ACTIVE')returning entity_id),i as(insert into legakeys.identities(entity_id,identity_type,state,verification_state)select entity_id,'PERSON','ACTIVE','UNVERIFIED' from e returning identity_id,entity_id),p as(insert into legakeys.persons(entity_id,legal_name,display_name,country_of_residence)select entity_id,$1,$2,$3 from i returning person_id,entity_id),a as(insert into legakeys.accounts(identity_id,state)select identity_id,'ACTIVE' from i returning account_id,identity_id),c as(insert into legakeys.credentials(account_id,credential_type,state,subject_reference,verification_state,secret_reference)select account_id,'EMAIL_PASSWORD','ACTIVE',$4,'UNVERIFIED',$5 from a returning credential_id,account_id),u as(update legakeys.accounts a set primary_credential_id=c.credential_id,updated_at=now()from c where a.account_id=c.account_id returning a.account_id,a.identity_id),pa as(insert into legakeys.participations(identity_id,state,scope)select identity_id,'ACTIVE','{}'::jsonb from i returning participation_id,identity_id),pt as(insert into legakeys.participants(participation_id,identity_id,state)select participation_id,identity_id,'ACTIVE'from pa returning participant_id,participation_id,identity_id)select u.account_id,u.identity_id,p.person_id,pt.participant_id,pt.participation_id,i.entity_id from u join i on i.identity_id=u.identity_id join p on p.entity_id=i.entity_id join pt on pt.identity_id=u.identity_id limit 1`,[name,display,country,e,secret]);
      if(invitation)await query(env,"update legakeys.visitor_invitations set visitor_entity_id=$1,state='ACCEPTED',updated_at=now() where invitation_id=$2 and state in ('SENT','VERIFICATION_PENDING')",[rows[0]?.entity_id,invitationId]);
      return cors(json({ok:true,state:"CREATED",account_id:rows[0]?.account_id,identity_id:rows[0]?.identity_id,participant_id:rows[0]?.participant_id,verification_state:"UNVERIFIED"}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/auth/login"){
      const b=await request.json().catch(()=>null) as any,e=String(b?.email??"").trim().toLowerCase(),pw=String(b?.password??"");
      const r=(await query(env,`select a.account_id,a.state as account_state,c.state as credential_state,c.secret_reference from legakeys.credentials c join legakeys.accounts a on a.account_id=c.account_id where c.credential_type='EMAIL_PASSWORD' and c.subject_reference=$1 limit 1`,[e]))[0];
      if(!r||r.account_state!=="ACTIVE"||r.credential_state!=="ACTIVE"||!r.secret_reference||!(await verifyPassword(pw,String(r.secret_reference))))return cors(json({ok:false,state:"DENIED",code:"INVALID_CREDENTIALS"},401),request);
      const raw=bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32))),secret=await sha256(raw),ss=await query(env,"insert into legakeys.sessions(account_id,state,session_secret_reference,last_seen_at,expires_at)values($1,'ACTIVE',$2,now(),now()+interval '7 days')returning session_id,expires_at",[r.account_id,secret]);
      await query(env,"update legakeys.accounts set last_authenticated_at=now(),updated_at=now()where account_id=$1",[r.account_id]);
      const out=cors(json({ok:true,state:"AUTHENTICATED",expires_at:ss[0].expires_at}),request),h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie(raw));return new Response(out.body,{status:out.status,headers:h});
    }
    if(request.method==="POST"&&url.pathname==="/api/auth/logout"){
      const raw=cookieValue(request,SESSION_COOKIE);if(raw)await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now()where session_secret_reference=$1 and state='ACTIVE'",[await sha256(raw)]);
      const out=cors(json({ok:true,state:"SIGNED_OUT"}),request),h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie("",0));return new Response(out.body,{status:out.status,headers:h});
    }
    if(request.method==="GET"&&url.pathname==="/api/me"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);await query(env,"update legakeys.sessions set last_seen_at=now()where session_id=$1",[r.session_id]);return cors(json({ok:true,state:"AUTHENTICATED",data:publicAccount(r)}),request);
    }
    if(request.method==="GET"&&url.pathname==="/api/account/settings"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const rows=await query(env,"insert into legakeys.account_settings(account_id) values($1) on conflict(account_id) do update set account_id=excluded.account_id returning language,appearance,compact_mode,notifications,privacy,updated_at",[session.account_id]);
      return cors(json({ok:true,state:"AUTHENTICATED",data:rows[0]}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/account/profile-photo"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any;const data=String(b?.data??"").trim(),mime=String(b?.mimeType??"").toLowerCase().trim();
      if(data.length<32||data.length>280000||!mime.startsWith("image/"))return cors(json({ok:false,state:"INVALID_INPUT",code:"PROFILE_PHOTO_INVALID"},400),request);
      await query(env,`insert into legakeys.account_settings(account_id,profile_photo_data,profile_photo_mime,profile_photo_updated_at) values($1,$2,$3,now()) on conflict(account_id) do update set profile_photo_data=excluded.profile_photo_data,profile_photo_mime=excluded.profile_photo_mime,profile_photo_updated_at=now(),updated_at=now()`,[session.account_id,data,mime]);
      return cors(json({ok:true,state:"PROFILE_PHOTO_UPDATED"}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/account/settings"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any;
      const language=String(b?.language??"en").slice(0,16),appearance=String(b?.appearance??"system").toLowerCase(),compactMode=Boolean(b?.compactMode);
      if(!["system","light","dark"].includes(appearance))return cors(json({ok:false,state:"INVALID_INPUT",code:"APPEARANCE_INVALID"},400),request);
      const notifications=typeof b?.notifications==="object"&&b.notifications?JSON.stringify(b.notifications):'{"security":true,"account":true,"participation":true,"services":true,"community":true}';
      const privacy=typeof b?.privacy==="object"&&b.privacy?JSON.stringify(b.privacy):'{"activity_visibility":"private","evidence_visibility":"restricted"}';
      const rows=await query(env,"insert into legakeys.account_settings(account_id,language,appearance,compact_mode,notifications,privacy) values($1,$2,$3,$4,$5::jsonb,$6::jsonb) on conflict(account_id) do update set language=excluded.language,appearance=excluded.appearance,compact_mode=excluded.compact_mode,notifications=excluded.notifications,privacy=excluded.privacy,updated_at=now() returning language,appearance,compact_mode,notifications,privacy,updated_at",[session.account_id,language,appearance,compactMode,notifications,privacy]);
      return cors(json({ok:true,state:"SETTINGS_UPDATED",data:rows[0]}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/account/password/change"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any;
      const current=String(b?.currentPassword??""),next=String(b?.newPassword??""),confirmNext=String(b?.confirmPassword??"");
      if(next.length<12||next.length>256||next!==confirmNext)return cors(json({ok:false,state:"INVALID_INPUT",code:next!==confirmNext?"PASSWORD_CONFIRMATION_MISMATCH":"PASSWORD_POLICY_FAILED"},400),request);
      const credential=(await query(env,"select credential_id,secret_reference,state from legakeys.credentials where account_id=$1 and credential_type='EMAIL_PASSWORD' limit 1",[session.account_id]))[0];
      if(!credential||credential.state!=="ACTIVE"||!credential.secret_reference||!(await verifyPassword(current,String(credential.secret_reference))))return cors(json({ok:false,state:"DENIED",code:"CURRENT_PASSWORD_INVALID"},401),request);
      await query(env,"update legakeys.credentials set secret_reference=$1,updated_at=now() where credential_id=$2",[await passwordRecord(next),credential.credential_id]);
      await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now() where account_id=$1 and session_id<>$2 and state='ACTIVE'",[session.account_id,session.session_id]);
      return cors(json({ok:true,state:"PASSWORD_CHANGED",other_sessions_revoked:true}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/account/recovery-key"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const raw=bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32))),hash=await sha256(raw);
      await query(env,"update legakeys.account_recovery_challenges set state='REVOKED',updated_at=now() where account_id=$1 and state='ACTIVE'",[session.account_id]);
      await query(env,"insert into legakeys.account_recovery_challenges(account_id,token_hash,state,expires_at,requested_from) values($1,$2,'ACTIVE',now()+interval '365 days','SELF_SERVICE')",[session.account_id,hash]);
      return cors(json({ok:true,state:"RECOVERY_KEY_CREATED",recovery_key:raw,expires_in_days:365}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/account/recovery-key/reset"){
      const b=await request.json().catch(()=>null) as any,key=String(b?.recoveryKey??""),next=String(b?.newPassword??""),confirmNext=String(b?.confirmPassword??"");
      if(!key||next.length<12||next.length>256||next!==confirmNext)return cors(json({ok:false,state:"INVALID_INPUT",code:next!==confirmNext?"PASSWORD_CONFIRMATION_MISMATCH":"RECOVERY_KEY_INPUT_INVALID"},400),request);
      const hash=await sha256(key),r=(await query(env,"select recovery_challenge_id,account_id from legakeys.account_recovery_challenges where token_hash=$1 and state='ACTIVE' and expires_at>now() limit 1",[hash]))[0];
      if(!r)return cors(json({ok:false,state:"DENIED",code:"RECOVERY_KEY_INVALID"},401),request);
      await query(env,"update legakeys.credentials set secret_reference=$1,updated_at=now() where account_id=$2 and credential_type='EMAIL_PASSWORD' and state='ACTIVE'",[await passwordRecord(next),r.account_id]);
      await query(env,"update legakeys.account_recovery_challenges set state='CONSUMED',consumed_at=now(),updated_at=now() where recovery_challenge_id=$1",[r.recovery_challenge_id]);
      await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now() where account_id=$1 and state='ACTIVE'",[r.account_id]);
      return cors(json({ok:true,state:"PASSWORD_RESET",sessions_revoked:true}),request);
    }
    if(request.method==="GET"&&url.pathname==="/api/account"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const sessions=await query(env,"select session_id,state,created_at,last_seen_at,expires_at,revoked_at from legakeys.sessions where account_id=$1 order by created_at desc",[r.account_id]),credentials=await query(env,"select credential_id,credential_type,state,verification_state,subject_reference,expires_at,revoked_at,created_at from legakeys.credentials where account_id=$1 order by created_at",[r.account_id]);return cors(json({ok:true,state:"AUTHENTICATED",data:{account:publicAccount(r),sessions,credentials}}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/account/profile"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any,displayName=String(b?.displayName??"").trim();
      if(displayName.length<1||displayName.length>160)return cors(json({ok:false,state:"INVALID_INPUT",code:"DISPLAY_NAME_INVALID"},400),request);
      await query(env,"update legakeys.persons set display_name=$1,updated_at=now() where entity_id=(select entity_id from legakeys.identities where identity_id=$2)",[displayName,session.identity_id]);
      return cors(json({ok:true,state:"PROFILE_UPDATED",display_name:displayName}),request);
    }
    if(request.method==="GET"&&url.pathname==="/api/identity/trust"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const evidence=await query(env,`select evidence_id,evidence_type,submission_state,capture_method,document_side,mime_type,file_size_bytes,content_hash,storage_state,extracted_fields,truth_state,submitted_at,reviewed_at,expires_at from legakeys.identity_evidence where identity_id=$1 order by created_at desc`,[session.identity_id]);
      const verifications=await query(env,`select verification_id,evidence_id,verification_type,state,assurance_level,provider_reference,method_reference,result_summary,consent_reference,presentation_attack_detection_state,verified_at,expires_at from legakeys.identity_verifications where identity_id=$1 order by created_at desc`,[session.identity_id]);
      const biometrics=await query(env,`select biometric_id,modality,state,assurance_level,provider_reference,device_reference,consent_state,last_verified_at from legakeys.biometric_enrollments where identity_id=$1 order by modality`,[session.identity_id]);
      const devices=await query(env,`select authenticator_id,authenticator_type,platform,device_reference,state,biometric_data_received,last_used_at,created_at from legakeys.device_authenticators where account_id=$1 order by created_at desc`,[session.account_id]);
      const highest=(verifications.map(v=>String(v.assurance_level)).sort().pop()||"L0");
      return cors(json({ok:true,state:"VERIFIED",data:{identity:publicAccount(session),assurance_level:highest,evidence,verifications,biometrics,devices},truth:{raw_biometric_material:"not stored in ordinary domain tables",device_biometric:"local authentication signal only",ocr:"extraction is not authenticity proof",authorization:"assurance never creates authorization"}}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/identity/evidence"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any;
      const type=String(b?.evidenceType??"OTHER").toUpperCase(),method=String(b?.captureMethod??"PLATFORM_UPLOAD").toUpperCase(),side=String(b?.documentSide??"OTHER").toUpperCase();
      const allowedTypes=["PASSPORT","NATIONAL_ID","RESIDENCE_PERMIT","DRIVER_LICENCE","BIRTH_CERTIFICATE","ORGANIZATIONAL_CREDENTIAL","OTHER"],allowedMethods=["PLATFORM_UPLOAD","CAMERA","SCANNER","PROVIDER","MANUAL"],allowedSides=["FRONT","BACK","FULL","PDF","OTHER"];
      if(!allowedTypes.includes(type)||!allowedMethods.includes(method)||!allowedSides.includes(side))return cors(json({ok:false,state:"INVALID_INPUT",code:"IDENTITY_EVIDENCE_INPUT_INVALID"},400),request);
      const size=Number(b?.fileSizeBytes??0);if(!Number.isFinite(size)||size<0||size>15000000)return cors(json({ok:false,state:"INVALID_INPUT",code:"IDENTITY_EVIDENCE_SIZE_INVALID"},400),request);
      const hash=String(b?.contentHash??"").trim();if(!/^[a-f0-9]{64}$/i.test(hash))return cors(json({ok:false,state:"INVALID_INPUT",code:"IDENTITY_EVIDENCE_HASH_REQUIRED"},400),request);
      const id=crypto.randomUUID();await query(env,`insert into legakeys.identity_evidence(evidence_id,identity_id,evidence_type,submission_state,capture_method,document_side,mime_type,file_size_bytes,content_hash,storage_state,extracted_fields,truth_state,provenance_reference) values($1,$2,$3,'SUBMITTED',$4,$5,$6,$7,$8,'METADATA_ONLY',$9::jsonb,'SUBMITTED',$10)`,[id,session.identity_id,type,method,side,String(b?.mimeType??"application/octet-stream").slice(0,120),size,hash,JSON.stringify(b?.extractedFields??{}),String(b?.provenanceReference??"platform-intake")]);
      await query(env,`insert into legakeys.identity_verifications(verification_id,identity_id,evidence_id,verification_type,state,assurance_level,result_summary,consent_reference) values($1,$2,$3,'MANUAL_REVIEW','PENDING','L1','Awaiting review; document authenticity is not yet verified.',$4)`,[crypto.randomUUID(),session.identity_id,id,String(b?.consentReference??"not-required")]);
      return cors(json({ok:true,state:"SUBMITTED",evidence_id:id,storage_state:"METADATA_ONLY",next:["QUALITY_CHECK","OCR_COMPLETE","DOCUMENT_REVIEW","AUTHENTICITY_CHECK","IDENTITY_MATCH","VERIFIED"],truth:{document:"submitted",ocr:"not yet performed",authenticity:"not yet verified"}}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/identity/verification"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any;const evidenceId=String(b?.evidenceId??"").trim(),type=String(b?.verificationType??"MANUAL_REVIEW").toUpperCase(),state=String(b?.state??"PENDING").toUpperCase();
      const allowed=["DOCUMENT_OCR","DOCUMENT_AUTHENTICITY","IDENTITY_MATCH","FACE","LIVENESS","FINGERPRINT","PALM_HAND","EXTERNAL_IDENTITY","MANUAL_REVIEW"],states=["PENDING","IN_PROGRESS","PASSED","FAILED","REVIEW_REQUIRED","NOT_SUPPORTED","EXPIRED","REVOKED"];
      if(!evidenceId||!allowed.includes(type)||!states.includes(state))return cors(json({ok:false,state:"INVALID_INPUT",code:"VERIFICATION_INPUT_INVALID"},400),request);
      const owns=await query(env,`select evidence_id from legakeys.identity_evidence where evidence_id=$1 and identity_id=$2 limit 1`,[evidenceId,session.identity_id]);if(!owns.length)return cors(json({ok:false,state:"NOT_FOUND",code:"EVIDENCE_NOT_FOUND"},404),request);
      const id=crypto.randomUUID();const assurance=["FACE","LIVENESS","FINGERPRINT","PALM_HAND","EXTERNAL_IDENTITY"].includes(type)&&state==="PASSED"?"L3":type==="DOCUMENT_AUTHENTICITY"&&state==="PASSED"?"L2":"L1";
      await query(env,`insert into legakeys.identity_verifications(verification_id,identity_id,evidence_id,verification_type,state,assurance_level,provider_reference,method_reference,result_summary,consent_reference,presentation_attack_detection_state,verified_at,provenance_reference) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,[id,session.identity_id,evidenceId,type,state,assurance,String(b?.providerReference??""),String(b?.methodReference??"platform-review"),String(b?.resultSummary??""),String(b?.consentReference??"recorded"),String(b?.padState??"NOT_APPLICABLE"),state==="PASSED"?new Date().toISOString():null,String(b?.provenanceReference??"platform-review")]);
      if(state==="PASSED"&&type==="DOCUMENT_AUTHENTICITY")await query(env,`update legakeys.identity_evidence set submission_state='AUTHENTICITY_CHECK',truth_state='VERIFIED',reviewed_at=now(),updated_at=now() where evidence_id=$1`,[evidenceId]);
      return cors(json({ok:true,state:"RECORDED",verification_id:id,assurance_level:assurance,truth:{verification:state,authorization:"unchanged"}}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/identity/biometric"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any;const modality=String(b?.modality??"").toUpperCase(),state=String(b?.state??"PENDING_CONSENT").toUpperCase();
      const modalities=["FACE","FINGERPRINT","PALM_HAND","IRIS","DEVICE_BIOMETRIC"],states=["AVAILABLE","SUPPORTED","PENDING_CONSENT","ENROLLED","VERIFIED","SUSPENDED","REVOKED","NOT_SUPPORTED"];
      if(!modalities.includes(modality)||!states.includes(state))return cors(json({ok:false,state:"INVALID_INPUT",code:"BIOMETRIC_INPUT_INVALID"},400),request);
      const id=crypto.randomUUID();const deviceRef=String(b?.deviceReference??"").slice(0,200)||null;const providerRef=String(b?.providerReference??"").slice(0,200)||null;
      await query(env,`insert into legakeys.biometric_enrollments(biometric_id,identity_id,modality,state,assurance_level,representation_reference,provider_reference,device_reference,consent_state,retention_policy,last_verified_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) on conflict(identity_id,modality) do update set state=excluded.state,assurance_level=excluded.assurance_level,provider_reference=excluded.provider_reference,device_reference=excluded.device_reference,consent_state=excluded.consent_state,retention_policy=excluded.retention_policy,last_verified_at=excluded.last_verified_at,updated_at=now()`,[id,session.identity_id,modality,state,String(b?.assuranceLevel??"L0"),String(b?.representationReference??"protected-reference"),providerRef,deviceRef,String(b?.consentState??"NOT_GRANTED"),String(b?.retentionPolicy??"governed"),state==="VERIFIED"?new Date().toISOString():null]);
      if(modality==="DEVICE_BIOMETRIC")await query(env,`insert into legakeys.device_authenticators(authenticator_id,account_id,authenticator_type,platform,device_reference,state,biometric_data_received,last_used_at) values($1,$2,'DEVICE_BIOMETRIC',$3,$4,'ACTIVE',false,$5) on conflict do nothing`,[crypto.randomUUID(),session.account_id,String(b?.platform??"web"),deviceRef,new Date().toISOString()]);
      return cors(json({ok:true,state:"RECORDED",modality,biometric_data_received:false,truth:{biometric_material:"not received/stored",device_biometric:"local signal only",authorization:"unchanged"}}),request);
    }
    if(request.method==="GET"&&url.pathname==="/api/beataccess/overview"){
      if(!cookieValue(request, SESSION_COOKIE))return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const session=await canonicalSession(env,request);
      if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const points=await query(env,`select access_point_id,access_point_type,lifecycle_state,truth_state,operational_state,place_id,controller_provider_id,controller_reference,updated_at from legakeys.access_points order by updated_at desc limit 100`);
      const operations=await query(env,`select operation_id,request_id,authorization_id,principal_entity_id,action_type,target_entity_id,access_point_id,access_credential_id,operation_state,execution_deadline,created_at,updated_at from legakeys.access_operations where principal_entity_id=(select entity_id from legakeys.identities where identity_id=$1) order by created_at desc limit 50`,[session.identity_id]);
      const credentials=await query(env,`select ac.access_credential_id,ac.credential_type,ac.lifecycle_state,ac.valid_from,ac.valid_to,ac.provider_reference,ac.created_at from legakeys.access_credentials ac join legakeys.identities i on i.entity_id=ac.principal_entity_id where i.identity_id=$1 order by ac.created_at desc`,[session.identity_id]);
      const counts=await query(env,`select count(*) filter(where lifecycle_state='ACTIVE') as active_points,count(*) filter(where operational_state='ONLINE') as online_points from legakeys.access_points`);
      return cors(json({ok:true,state:"VERIFIED",data:{access_points:points,operations,credentials,metrics:counts[0]??{}},truth:{authorization:"BeatAccess never creates authorization",providers:"only declared references are shown",physical_result:"command accepted is not access granted"}}),request);
    }

    if(request.method==="POST"&&url.pathname==="/api/beataccess/operations"){
      const session=await canonicalSession(env,request);
      if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any;
      const authorizationId=String(b?.authorizationId??"").trim(), accessPointId=String(b?.accessPointId??"").trim();
      const actionType=String(b?.actionType??"OPEN_ACCESS").trim().toUpperCase(), targetEntityId=String(b?.targetEntityId??"").trim()||null;
      const credentialId=String(b?.accessCredentialId??"").trim()||null, idempotencyKey=String(b?.idempotencyKey??"").trim();
      if(!authorizationId||!accessPointId||!idempotencyKey)return cors(json({ok:false,state:"INVALID_INPUT",code:"BEATACCESS_OPERATION_INPUT_REQUIRED"},400),request);
      const principalEntityId=String(session.identity_id??"");
      const principalRows=await query(env,`select entity_id from legakeys.identities where identity_id=$1 limit 1`,[principalEntityId]);
      if(!principalRows[0])return cors(json({ok:false,state:"DENIED",code:"IDENTITY_ENTITY_REQUIRED"},403),request);
      const principal=String(principalRows[0].entity_id);
      const existing=await query(env,`select operation_id,operation_state from legakeys.access_operations where authorization_id=$1 and principal_entity_id=$2 and idempotency_key=$3 limit 1`,[authorizationId,principal,idempotencyKey]);
      if(existing[0])return cors(json({ok:true,state:"IDEMPOTENT_REPLAY",operation_id:existing[0].operation_id,operation_state:existing[0].operation_state}),request);
      const auth=await query(env,`select ar.authorization_id,ar.principal_entity_id,ar.action_type,ar.target_entity_id,ad.decision,ad.decision_version,ad.policy_version,ad.effective_from,ad.expires_at,ad.evaluated_at
        from legakeys.authorization_requests ar
        join lateral (select * from legakeys.authorization_decisions d where d.authorization_id=ar.authorization_id order by d.decision_version desc limit 1) ad on true
        where ar.authorization_id=$1 and ar.principal_entity_id=$2 limit 1`,[authorizationId,principal]);
      const point=await query(env,`select access_point_id,place_id,lifecycle_state,operational_state from legakeys.access_points where access_point_id=$1 limit 1`,[accessPointId]);
      const credential=credentialId?await query(env,`select access_credential_id,principal_entity_id,lifecycle_state,valid_from,valid_to from legakeys.access_credentials where access_credential_id=$1 limit 1`,[credentialId]):[];
      const a=auth[0],p=point[0],c=credential[0];
      const now=Date.now(), expiresAt=a?.expires_at?new Date(String(a.expires_at)).getTime():null;
      const deadlineValid=!expiresAt||expiresAt>now;
      const authValid=Boolean(a&&a.decision==="ALLOW"&&new Date(String(a.effective_from)).getTime()<=now&&deadlineValid);
      const principalMatch=Boolean(a&&String(a.principal_entity_id)===principal);
      const actionMatch=Boolean(a&&String(a.action_type).toUpperCase()===actionType);
      const targetMatch=Boolean(!a?.target_entity_id||!targetEntityId||String(a.target_entity_id)===targetEntityId);
      const pointValid=Boolean(p&&p.lifecycle_state==="ACTIVE");
      const credentialValid=credentialId?Boolean(c&&String(c.principal_entity_id)===principal&&c.lifecycle_state==="ACTIVE"&&(!c.valid_from||new Date(String(c.valid_from)).getTime()<=now)&&(!c.valid_to||new Date(String(c.valid_to)).getTime()>now)):true;
      const valid=Boolean(authValid&&principalMatch&&actionMatch&&targetMatch&&pointValid&&credentialValid);
      const operationId=crypto.randomUUID(),requestId=crypto.randomUUID();
      const state=valid?"AUTHORIZED_FOR_EXECUTION":"CANCELLED";
      await query(env,`insert into legakeys.access_operations(operation_id,request_id,authorization_id,principal_entity_id,action_type,target_entity_id,access_point_id,access_credential_id,operation_state,execution_deadline,idempotency_key,created_at,updated_at)
        values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now(),now())`,[operationId,requestId,authorizationId,principal,actionType,targetEntityId,accessPointId,credentialId,state,a?.expires_at??null,idempotencyKey]);
      await query(env,`insert into legakeys.access_validation_results(validation_id,operation_id,authorization_valid,principal_match,action_match,target_match,scope_match,credential_valid,conditions_satisfied,replay_check_passed,execution_deadline_valid,result,reason_code,authorization_decision_version,policy_version)
        values($1,$2,$3,$4,$5,$6,$7,$8,true,true,$9,$10,$11,$12,$13)`,[crypto.randomUUID(),operationId,authValid,principalMatch,actionMatch,targetMatch,pointValid,credentialId?credentialValid:true,deadlineValid,valid?"VALID":"REJECTED",valid?null:"ACCESS_BINDING_REJECTED",a?.decision_version??null,a?.policy_version??null]);
      return cors(json({ok:valid,state:valid?"AUTHORIZED_FOR_EXECUTION":"REJECTED",operation_id:operationId,request_id:requestId,truth:{authorization:"existing decision only",execution:"not yet attempted",physical_result:"not established"}}),request);
    }

    if(request.method==="POST"&&url.pathname==="/api/beataccess/operations/execute"){
      const session=await canonicalSession(env,request);
      if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const b=await request.json().catch(()=>null) as any,operationId=String(b?.operationId??"").trim();
      if(!operationId)return cors(json({ok:false,state:"INVALID_INPUT",code:"OPERATION_ID_REQUIRED"},400),request);
      const rows=await query(env,`select ao.operation_id,ao.authorization_id,ao.principal_entity_id,ao.access_point_id,ao.access_credential_id,ao.operation_state,ao.execution_deadline,ap.controller_provider_id,ap.controller_reference
        from legakeys.access_operations ao join legakeys.access_points ap on ap.access_point_id=ao.access_point_id
        where ao.operation_id=$1 and ao.principal_entity_id=(select entity_id from legakeys.identities where identity_id=$2) limit 1`,[operationId,session.identity_id]);
      const op=rows[0];
      if(!op)return cors(json({ok:false,state:"NOT_FOUND",code:"ACCESS_OPERATION_NOT_FOUND"},404),request);
      if(op.operation_state!=="AUTHORIZED_FOR_EXECUTION")return cors(json({ok:false,state:"REJECTED",code:"ACCESS_OPERATION_NOT_EXECUTABLE",operation_state:op.operation_state},409),request);
      if(op.execution_deadline&&new Date(String(op.execution_deadline)).getTime()<=Date.now()){
        await query(env,`update legakeys.access_operations set operation_state='EXPIRED',updated_at=now() where operation_id=$1`,[operationId]);
        return cors(json({ok:false,state:"EXPIRED",code:"ACCESS_AUTHORIZATION_EXPIRED"},409),request);
      }
      const provider=String(op.controller_provider_id??"").trim(),controller=String(op.controller_reference??"").trim();
      if(!provider||!controller){
        await query(env,`update legakeys.access_operations set operation_state='PROVIDER_UNAVAILABLE',updated_at=now() where operation_id=$1`,[operationId]);
        await query(env,`insert into legakeys.access_provider_results(provider_result_id,operation_id,provider_id,controller_id,provider_state,provider_code,provider_message,provenance_reference) values($1,$2,$3,$4,'UNAVAILABLE','NO_DECLARED_CONTROLLER','No verified controller/provider connection is declared for this access point.','beataccess-runtime')`,[crypto.randomUUID(),operationId,provider||"UNDECLARED",controller||null]);
        await query(env,`insert into legakeys.access_events(access_event_id,operation_id,event_type,result_state,correlation_id) values($1,$2,'UNKNOWN','PROVIDER_UNAVAILABLE',$3)`,[crypto.randomUUID(),operationId,crypto.randomUUID()]);
        return cors(json({ok:false,state:"PROVIDER_UNAVAILABLE",operation_id:operationId,truth:{authorization:"valid",command:"not issued",physical_result:"UNKNOWN",provider:"not declared"}}),request);
      }
      return cors(json({ok:false,state:"PROVIDER_ADAPTER_REQUIRED",operation_id:operationId,truth:{authorization:"valid",command:"not issued",physical_result:"UNKNOWN"},message:"A declared controller is present, but no executable provider adapter is wired into this runtime."},501),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/account/suspend"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);await query(env,"update legakeys.credentials set state='SUSPENDED',updated_at=now()where account_id=$1 and state='ACTIVE'",[r.account_id]);await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now()where account_id=$1 and state='ACTIVE'",[r.account_id]);await query(env,"update legakeys.accounts set state='SUSPENDED',updated_at=now()where account_id=$1",[r.account_id]);const out=cors(json({ok:true,state:"SUSPENDED"}),request),h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie("",0));return new Response(out.body,{status:out.status,headers:h});
    }
    if(request.method==="POST"&&url.pathname==="/api/account/close"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);await query(env,"update legakeys.credentials set state='REVOKED',revoked_at=now(),updated_at=now()where account_id=$1",[r.account_id]);await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now()where account_id=$1",[r.account_id]);await query(env,"update legakeys.participants set state='SUSPENDED',updated_at=now()where identity_id=$1 and state='ACTIVE'",[r.identity_id]);await query(env,"update legakeys.accounts set state='CLOSED',updated_at=now()where account_id=$1",[r.account_id]);const out=cors(json({ok:true,state:"CLOSED"}),request),h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie("",0));return new Response(out.body,{status:out.status,headers:h});
    }
    if(request.method==="GET"&&url.pathname==="/api/session"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const sessions=await query(env,"select session_id,state,created_at,last_seen_at,expires_at,revoked_at from legakeys.sessions where account_id=$1 order by created_at desc",[session.account_id]);
      return cors(json({ok:true,state:"AUTHENTICATED",data:{current_session_id:session.session_id,sessions}}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/session/revoke-all"){
      const session=await canonicalSession(env,request);if(!session)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now() where account_id=$1 and session_id<>$2 and state='ACTIVE'",[session.account_id,session.session_id]);
      return cors(json({ok:true,state:"OTHER_SESSIONS_REVOKED"}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/session/revoke"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);const b=await request.json().catch(()=>null) as any,id=String(b?.session_id??"");if(!id)return cors(json({ok:false,state:"INVALID_INPUT",code:"SESSION_ID_REQUIRED"},400),request);const revoked=await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now() where session_id=$1 and account_id=$2 and state='ACTIVE' returning session_id",[id,r.account_id]);
      if(!revoked.length)return cors(json({ok:false,state:"NOT_FOUND",code:"SESSION_NOT_ACTIVE"},404),request);
      const out=cors(json({ok:true,state:"REVOKED",session_id:id,current_session:id===r.session_id}),request);
      if(id===r.session_id){const h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie("",0));return new Response(out.body,{status:out.status,headers:h});}
      return out;
    }
    if (request.method === "GET" && url.pathname === "/api/services") {
      const rows = await query(env, "select service_id, beat_code, canonical_name, description, lifecycle_state, truth_state, native_or_provider_mode, provenance, updated_at from legakeys.services order by canonical_name");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/places") {
      if (!cookieValue(request, SESSION_COOKIE)) return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const session = await canonicalSession(env, request); if (!session) return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const rows = await query(env, "select place_id, entity_id, place_type, parent_place_id, canonical_name, display_name, description, address_line, country_code, region_code, city_name, latitude, longitude, location_precision_m, lifecycle_state, effective_from, effective_to, updated_at from legakeys.places where lifecycle_state='ACTIVE' order by canonical_name");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/activity") {
      if (!cookieValue(request, SESSION_COOKIE)) return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const session = await canonicalSession(env, request); if (!session) return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const rows = await query(env, "select id, event_source, event_version, event_type, action_id, execution_id, actor_id, principal_id, subject_type, subject_id, occurred_at, recorded_at, correlation_id, truth_state, source_type, source_reference from legakeys.events where principal_id=$1 or subject_id=$1 order by occurred_at desc limit 50", [session.participant_id]);
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "POST" && url.pathname === "/api/community/create") {
      const body = await request.json().catch(()=>({})) as any;
      const email = String(body?.email ?? "").trim().toLowerCase();
      const password = String(body?.password ?? "");
      const confirmPassword = String(body?.confirmPassword ?? "");
      const name = String(body?.name ?? "").trim();
      const purpose = String(body?.purpose ?? "").trim();
      const operatorType = String(body?.operatorType ?? "COMMUNITY").trim().toUpperCase()==="ORGANIZATION" ? "ORGANIZATION" : "COMMUNITY";
      const organizationName = String(body?.organizationName ?? "").trim();
      if(!/^\S+@\S+\.\S+$/.test(email) || password.length<12 || password.length>256 || password!==confirmPassword)
        return cors(json({ok:false,code:password!==confirmPassword?"PASSWORD_CONFIRMATION_MISMATCH":"COMMUNITY_ACCOUNT_INPUT_INVALID",message:"Use a valid email and a password of at least 12 characters; confirmation must match."},400),request);
      if(name.length<2||name.length>160)return cors(json({ok:false,code:"INVALID_COMMUNITY_NAME",message:"Community name must be between 2 and 160 characters."},400),request);
      if(purpose.length<2||purpose.length>500)return cors(json({ok:false,code:"INVALID_COMMUNITY_PURPOSE",message:"Community purpose must be between 2 and 500 characters."},400),request);
      if(operatorType==="ORGANIZATION"&&(organizationName.length<2||organizationName.length>160))return cors(json({ok:false,code:"INVALID_ORGANIZATION_NAME",message:"Organization name must be between 2 and 160 characters."},400),request);
      if((await query(env,"select 1 from legakeys.credentials where credential_type='EMAIL_PASSWORD' and subject_reference=$1 limit 1",[email])).length)
        return cors(json({ok:false,state:"CONFLICT",code:"ACCOUNT_ALREADY_EXISTS",message:"That email is already registered. Sign in with the existing account instead."},409),request);

      const joinCode=`LK-${crypto.randomUUID().replace(/-/g,"").slice(0,10).toUpperCase()}`;
      const communityEntityId=crypto.randomUUID(),communityIdentityId=crypto.randomUUID(),workspaceId=crypto.randomUUID(),communityAccountId=crypto.randomUUID(),credentialId=crypto.randomUUID();
      const organizationEntityId=operatorType==="ORGANIZATION"?crypto.randomUUID():communityEntityId;
      const organizationIdentityId=operatorType==="ORGANIZATION"?crypto.randomUUID():communityIdentityId;
      const secret=await passwordRecord(password);
      const rows=await query(env,`
        with oe as (
          insert into legakeys.entities(entity_id,entity_type,canonical_name,display_name,lifecycle_state)
          values($1,'COMMUNITY',$2,$2,'ACTIVE') returning entity_id
        ), oi as (
          insert into legakeys.identities(identity_id,entity_id,identity_type,state,verification_state)
          values($3,$1,'COMMUNITY','ACTIVE','DECLARED') returning identity_id,entity_id
        ), org as (
          insert into legakeys.entities(entity_id,entity_type,canonical_name,display_name,lifecycle_state)
          select $4,'ORGANIZATION',$5,$5,'ACTIVE' where $6='ORGANIZATION'
          returning entity_id
        ), orgi as (
          insert into legakeys.identities(identity_id,entity_id,identity_type,state,verification_state)
          select $7,entity_id,'ORGANIZATION','ACTIVE','DECLARED' from org returning identity_id,entity_id
        ), w as (
          insert into legakeys.workspaces(id,workspace_type,name,purpose,scope_ref,lifecycle,governance_ref,version,created_at,updated_at)
          values($8,'COMMUNITY_OPERATING',$2,$9,$1,'ACTIVE',$1,1,now(),now()) returning id
        ), cp as (
          insert into legakeys.community_profiles(community_entity_id,workspace_id,operator_entity_id,operator_type,onboarding_state,plan_code,plan_version,plan_state,governance_mode,service_policy,settings)
          values($1,$8,case when $6='ORGANIZATION' then $4 else $1 end,$6,'ACTIVE','COMMUNITY','1.0','DRAFT','EXPLICIT_AUTHORIZATION',
            '{"platform_controlled":true,"community_can_configure":true,"community_can_disable_platform_service":false}'::jsonb,
            jsonb_build_object('created_by_account',$10::text,'operator_contact',$10::text,'join_code',$11::text))
          returning community_entity_id,workspace_id
        ), a as (
          insert into legakeys.accounts(account_id,identity_id,state) values($12,$3,'ACTIVE') returning account_id
        ), cr as (
          insert into legakeys.credentials(credential_id,account_id,credential_type,state,subject_reference,verification_state,secret_reference)
          values($13,$12,'EMAIL_PASSWORD','ACTIVE',$10,'UNVERIFIED',$14) returning credential_id
        ), pu as (
          update legakeys.accounts set primary_credential_id=$13,updated_at=now() where account_id=$12 returning account_id
        ) select cp.community_entity_id,cp.workspace_id,(select identity_id from oi) as operator_identity_id,
                 (select entity_id from org) as operator_entity_id,$6::text as operator_type,
                 a.account_id
        from cp cross join a limit 1
      `,[communityEntityId,name,communityIdentityId,organizationEntityId,organizationName,operatorType,organizationIdentityId,workspaceId,purpose,email,joinCode,communityAccountId,credentialId,secret]);
      if(!rows[0])return cors(json({ok:false,code:"COMMUNITY_CREATE_FAILED",message:"The community could not be created."},400),request);

      const raw=bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32))),sessionSecret=await sha256(raw);
      const ss=await query(env,"insert into legakeys.sessions(account_id,state,session_secret_reference,last_seen_at,expires_at)values($1,'ACTIVE',$2,now(),now()+interval '7 days')returning session_id,expires_at",[rows[0].account_id,sessionSecret]);
      const out=cors(json({ok:true,state:"CREATED",community_entity_id:rows[0].community_entity_id,operator_entity_id:rows[0].operator_entity_id,operator_type:rows[0].operator_type,workspace_id:rows[0].workspace_id,join_code:joinCode,session_id:ss[0].session_id,expires_at:ss[0].expires_at,role:"COMMUNITY_OPERATOR",truth:{community_space:"created",identity:"canonical COMMUNITY BeatIdentity",authority:"scoped and authorization-gated",membership:"independent from participant membership",platform_services:"LegaKeys-controlled"}}),request);
      const h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie(raw));return new Response(out.body,{status:out.status,headers:h});
    }

    if (request.method === "POST" && url.pathname === "/api/community/join") {
      const session=await canonicalSession(env,request);
      if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED",message:"Join requires a canonical LegaKeys participant account."},401),request);
      const b=await request.json().catch(()=>({})) as any;
      const code=String(b?.inviteCode??"").trim().toUpperCase();
      if(!code)return cors(json({ok:false,code:"INVITATION_CODE_REQUIRED",message:"Enter the community invitation code."},400),request);
      const participantId=String(session.participant_id??"");
      const rows=await query(env,`
        select cp.community_entity_id,cp.workspace_id,w.name,w.purpose,cp.operator_type
        from legakeys.community_profiles cp
        join legakeys.workspaces w on w.id=cp.workspace_id
        where cp.onboarding_state='ACTIVE' and w.lifecycle='ACTIVE'
          and upper(coalesce(cp.settings->>'join_code',''))=$1
        limit 1
      `,[code]);
      if(!rows.length)return cors(json({ok:false,code:"INVALID_INVITATION_CODE",message:"That community invitation code is invalid or no longer active."},404),request);
      const community=rows[0];
      const existing=await query(env,`select id,status from legakeys.workspace_memberships where workspace_id=$1 and participant_ref=$2 and status in ('ACTIVE','INVITED') order by created_at desc limit 1`,[community.workspace_id,participantId]);
      if(existing.length)return cors(json({ok:true,state:"ALREADY_MEMBER",community:{entity_id:community.community_entity_id,workspace_id:community.workspace_id,name:community.name,purpose:community.purpose},membership_status:existing[0].status,truth:{membership:"existing",authority:"not implied"}}),request);
      const membershipId=crypto.randomUUID();
      const rosterId=crypto.randomUUID();
      await query(env,`with m as (
        insert into legakeys.workspace_memberships(id,workspace_id,participant_ref,role,status,scope_ref,valid_from,created_at,updated_at)
        values($1,$2,$3,'COMMUNITY_MEMBER','ACTIVE',$4,now(),now(),now())
        returning workspace_id
      )
      insert into legakeys.community_roster(id,community_entity_id,participant_ref,relationship_type,state,scope_ref,source_reference)
      values($5,$4,$3,'MEMBER','ACTIVE',$4,'participant-community-join')`,[membershipId,community.workspace_id,participantId,community.community_entity_id,rosterId]);
      return cors(json({ok:true,state:"JOINED",community:{entity_id:community.community_entity_id,workspace_id:community.workspace_id,name:community.name,purpose:community.purpose},role:"COMMUNITY_MEMBER",truth:{membership:"active",authority:"not implied",consequential_actions:"authorization required"}}),request);
    }

    if (request.method === "GET" && url.pathname === "/api/community-ops") {
      const session = await canonicalSession(env, request);
      if (!session) return cors(json({ok:false,code:"AUTH_REQUIRED",message:"A canonical LegaKeys session is required."},401),request);
      const participantId = String(session.participant_id ?? "");
      const identityId = String(session.identity_id ?? "");
      const identityEntityId = String(session.entity_id ?? "");
      const identityType = String(session.identity_type ?? "");
      const selectedCommunityId = String(url.searchParams.get("community_entity_id") ?? "").trim();
      const rows = await query(env, `
        select cp.community_entity_id,cp.workspace_id,cp.operator_entity_id,cp.operator_type,cp.onboarding_state,cp.plan_code,cp.plan_version,cp.plan_state,
               w.name,w.purpose,w.lifecycle,w.version,
               (select count(*) from legakeys.community_roster cr where cr.community_entity_id=cp.community_entity_id and cr.state='ACTIVE') as people_count,
               (select count(*) from legakeys.community_roster cr where cr.community_entity_id=cp.community_entity_id and cr.state='ACTIVE' and cr.relationship_type='RESIDENT') as resident_count,
               (select count(*) from legakeys.community_roster cr where cr.community_entity_id=cp.community_entity_id and cr.state='ACTIVE' and cr.relationship_type='WORKER') as worker_count,
               (select count(*) from legakeys.community_provider_links cpl where cpl.community_entity_id=cp.community_entity_id and cpl.state='ACTIVE') as provider_count,
               (select count(*) from legakeys.community_work_orders cwo where cwo.community_entity_id=cp.community_entity_id and cwo.state not in ('COMPLETED','CANCELLED')) as open_work_count,
               (select count(*) from legakeys.community_plans cpln where cpln.community_entity_id=cp.community_entity_id and cpln.state in ('DRAFT','ACTIVE','PAUSED')) as plan_count,
               (select count(*) from legakeys.community_service_config csc where csc.community_entity_id=cp.community_entity_id) as configured_service_count
        from legakeys.community_profiles cp
        join legakeys.workspaces w on w.id=cp.workspace_id
        left join legakeys.workspace_memberships wm on wm.workspace_id=w.id and ($1='' or wm.participant_ref=nullif($1,'')::uuid) and wm.status='ACTIVE'
        where ($5='' or cp.community_entity_id=nullif($5,'')::uuid) and (
          (wm.id is not null and wm.role in ('COMMUNITY_OPERATOR','COMMUNITY_INITIATOR','COMMUNITY_MANAGER','COMMUNITY_OWNER','COMMUNITY_ADMIN'))
          or (cp.operator_entity_id=$3::uuid and cp.operator_type=$2)
          or (cp.settings->>'created_by_account')=$4
        )
        order by cp.updated_at desc
      `,[participantId,identityType,identityEntityId,String(session.account_id ?? ""),selectedCommunityId]);
      const communities=[];
      for(const row of rows){
        const people=await query(env,`select cr.id,cr.participant_ref,cr.relationship_type,cr.state,cr.scope_ref,cr.effective_from,cr.effective_until from legakeys.community_roster cr where cr.community_entity_id=$1 order by cr.updated_at desc limit 50`,[row.community_entity_id]);
        const providers=await query(env,`select id,provider_entity_id,provider_participant_ref,verification_state,state,service_scope,contract_reference,effective_from,effective_until from legakeys.community_provider_links where community_entity_id=$1 order by updated_at desc limit 50`,[row.community_entity_id]);
        const services=await query(env,`select csc.id,csc.service_id,s.beat_code,s.canonical_name,s.description,s.truth_state,s.native_or_provider_mode,csc.state,csc.community_control,csc.last_verified_at from legakeys.community_service_config csc join legakeys.services s on s.service_id=csc.service_id where csc.community_entity_id=$1 order by s.canonical_name`,[row.community_entity_id]);
        const plans=await query(env,`select id,name,objective,horizon_start,horizon_end,state,budget_model,measures,risks,created_at,updated_at from legakeys.community_plans where community_entity_id=$1 order by updated_at desc limit 20`,[row.community_entity_id]);
        const work=await query(env,`select id,title,description,priority,state,target_ref,assigned_provider_ref,assigned_worker_ref,due_at,authorization_ref,evidence_refs,created_at,updated_at from legakeys.community_work_orders where community_entity_id=$1 order by updated_at desc limit 30`,[row.community_entity_id]);
        const accessPoints=await query(env,`select cap.id,cap.access_point_id,cap.name,cap.scope,cap.state,cap.controller_provider_id,cap.controller_reference,cap.notes,ap.access_point_type,ap.lifecycle_state,ap.truth_state,ap.operational_state from legakeys.community_access_points cap join legakeys.access_points ap on ap.access_point_id=cap.access_point_id where cap.community_entity_id=$1 order by cap.updated_at desc limit 50`,[row.community_entity_id]);
        communities.push({community:{entity_id:row.community_entity_id,workspace_id:row.workspace_id,name:row.name,purpose:row.purpose,operator_entity_id:row.operator_entity_id,operator_type:row.operator_type,onboarding_state:row.onboarding_state,plan_code:row.plan_code,plan_version:row.plan_version,plan_state:row.plan_state,lifecycle:row.lifecycle,version:row.version},metrics:{people:Number(row.people_count),residents:Number(row.resident_count),workers:Number(row.worker_count),providers:Number(row.provider_count),open_work:Number(row.open_work_count),plans:Number(row.plan_count),configured_services:Number(row.configured_service_count)},people,providers,services,plans,work,accessPoints});
      }
      return cors(json({ok:true,state:"VERIFIED",selected_community_entity_id:selectedCommunityId||communities[0]?.community?.entity_id||null,data:communities,truth:{source:"canonical community operating tables",operator_scope:"authenticated community/organization identity, creator account, or explicit participant operator delegation",membership:"does not imply operating authority",service_control:"LegaKeys",provider_state:"declared/verified separately",authorization:"operational membership never substitutes for consequential authorization"}}),request);
    }

    if (request.method === "POST" && url.pathname === "/api/community/roster") {
      const session=await canonicalSession(env,request); if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED"},401),request);
      const b=await request.json().catch(()=>({})) as any,communityId=String(b?.communityEntityId??""),participantRef=String(b?.participantRef??""),relationship=String(b?.relationshipType??"MEMBER").toUpperCase();
      if(!communityId||!participantRef)return cors(json({ok:false,code:"COMMUNITY_ROSTER_INPUT_REQUIRED"},400),request);
      const allowed=["RESIDENT","OWNER","TENANT","WORKER","MANAGER","VISITOR","MEMBER","GUEST","STUDENT","CONTRACTOR","OTHER"]; if(!allowed.includes(relationship))return cors(json({ok:false,code:"INVALID_RELATIONSHIP_TYPE"},400),request);
      const operator=await communityOperatorScope(env,session,communityId);
      if(!operator)return cors(json({ok:false,code:"COMMUNITY_OPERATOR_REQUIRED"},403),request);
      const id=crypto.randomUUID(); await query(env,`insert into legakeys.community_roster(id,community_entity_id,participant_ref,relationship_type,state,scope_ref,source_reference) values($1,$2,$3,$4,'ACTIVE',$2,'community-operator') on conflict do nothing`,[id,communityId,participantRef,relationship]);
      return cors(json({ok:true,state:"RECORDED",id,truth:{relationship:"recorded",authorization:"not implied"}}),request);
    }
    if (request.method === "POST" && url.pathname === "/api/community/provider") {
      const session=await canonicalSession(env,request); if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED"},401),request);
      const b=await request.json().catch(()=>({})) as any,communityId=String(b?.communityEntityId??""),providerName=String(b?.providerName??"").trim(),providerParticipantRef=String(b?.providerParticipantRef??"").trim()||null;
      if(!communityId||providerName.length<2)return cors(json({ok:false,code:"PROVIDER_INPUT_REQUIRED"},400),request);
      const operator=await communityOperatorScope(env,session,communityId);
      if(!operator)return cors(json({ok:false,code:"COMMUNITY_OPERATOR_REQUIRED"},403),request);
      const entityId=crypto.randomUUID(),identityId=crypto.randomUUID(),linkId=crypto.randomUUID();
      await query(env,`with e as(insert into legakeys.entities(entity_id,entity_type,canonical_name,display_name,lifecycle_state) values($1,'ORGANIZATION',$2,$2,'ACTIVE') returning entity_id),i as(insert into legakeys.identities(identity_id,entity_id,identity_type,state,verification_state) select $3,entity_id,'ORGANIZATION','ACTIVE','DECLARED' from e) insert into legakeys.community_provider_links(id,community_entity_id,provider_entity_id,provider_participant_ref,verification_state,state,service_scope) values($4,$5,$1,$6,'PENDING','PROPOSED',$7::jsonb)`,[entityId,providerName,identityId,linkId,communityId,providerParticipantRef,JSON.stringify(b?.serviceScope||{})]);
      return cors(json({ok:true,state:"PROPOSED",provider_entity_id:entityId,provider_identity_id:identityId,link_id:linkId,truth:{provider:"DECLARED",verification:"PENDING",authorization:"not implied"}}),request);
    }
    if (request.method === "POST" && url.pathname === "/api/community/access-point") {
      const session=await canonicalSession(env,request); if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED"},401),request);
      const b=await request.json().catch(()=>({})) as any;
      const communityId=String(b?.communityEntityId??""),name=String(b?.name??"").trim(),type=String(b?.accessPointType??"OTHER").toUpperCase();
      if(!communityId||name.length<2)return cors(json({ok:false,code:"ACCESS_POINT_INPUT_REQUIRED"},400),request);
      const allowed=["DOOR","GATE","TURNSTILE","ELEVATOR","BARRIER","FACILITY_ENTRY","BUILDING_ENTRY","UNIT_ENTRY","COMMON_AREA_ENTRY","OTHER"];
      if(!allowed.includes(type))return cors(json({ok:false,code:"INVALID_ACCESS_POINT_TYPE"},400),request);
      const operator=await communityOperatorScope(env,session,communityId);
      if(!operator)return cors(json({ok:false,code:"COMMUNITY_OPERATOR_REQUIRED"},403),request);
      const entityId=crypto.randomUUID(),accessPointId=crypto.randomUUID(),linkId=crypto.randomUUID();
      await query(env,`insert into legakeys.entities(entity_id,entity_type,canonical_name,display_name,lifecycle_state) values($1,'ACCESS_POINT',$2,$2,'ACTIVE')`,[entityId,name]);
      await query(env,`insert into legakeys.access_points(access_point_id,entity_id,access_point_type,controller_provider_id,controller_reference,lifecycle_state,truth_state,operational_state,provenance_reference) values($1,$2,$3,$4,$5,'ACTIVE','DECLARED','UNKNOWN','community-operator')`,[accessPointId,entityId,type,b?.controllerProviderId||null,b?.controllerReference||null]);
      await query(env,`insert into legakeys.community_access_points(id,community_entity_id,access_point_id,name,scope,state,controller_provider_id,controller_reference,notes) values($1,$2,$3,$4,'COMMUNITY','DECLARED',$5,$6,$7)`,[linkId,communityId,accessPointId,name,b?.controllerProviderId||null,b?.controllerReference||null,b?.notes||null]);
      return cors(json({ok:true,state:"DECLARED",access_point_id:accessPointId,truth:{access_point:"declared",provider:"not invented",authorization:"required before any command"}}),request);
    }
    if (request.method === "POST" && url.pathname === "/api/community/roster/status") {
      const session=await canonicalSession(env,request); if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED"},401),request);
      const b=await request.json().catch(()=>({})) as any,communityId=String(b?.communityEntityId??""),id=String(b?.id??""),state=String(b?.state??"").toUpperCase();
      if(!communityId||!id||!["ACTIVE","SUSPENDED","ENDED","REVOKED"].includes(state))return cors(json({ok:false,code:"ROSTER_STATUS_INPUT_INVALID"},400),request);
      const operator=await communityOperatorScope(env,session,communityId);
      if(!operator)return cors(json({ok:false,code:"COMMUNITY_OPERATOR_REQUIRED"},403),request);
      await query(env,`update legakeys.community_roster set state=$3,updated_at=now() where id=$1 and community_entity_id=$2`,[id,communityId,state]);
      return cors(json({ok:true,state:"UPDATED",truth:{membership:"updated",authority:"not implied"}}),request);
    }

    if (request.method === "POST" && url.pathname === "/api/community/provider/status") {
      const session=await canonicalSession(env,request); if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED"},401),request);
      const b=await request.json().catch(()=>({})) as any,communityId=String(b?.communityEntityId??""),id=String(b?.id??""),state=String(b?.state??"").toUpperCase(),verification=String(b?.verificationState??"").toUpperCase();
      if(!communityId||!id||!["PROPOSED","ACTIVE","SUSPENDED","ENDED"].includes(state)||!["PENDING","VERIFIED","REJECTED","EXPIRED"].includes(verification))return cors(json({ok:false,code:"PROVIDER_STATUS_INPUT_INVALID"},400),request);
      const operator=await communityOperatorScope(env,session,communityId);
      if(!operator)return cors(json({ok:false,code:"COMMUNITY_OPERATOR_REQUIRED"},403),request);
      await query(env,`update legakeys.community_provider_links set state=$3,verification_state=$4,updated_at=now() where id=$1 and community_entity_id=$2`,[id,communityId,state,verification]);
      return cors(json({ok:true,state:"UPDATED",truth:{provider:"declared",verification:verification}}),request);
    }

    if (request.method === "POST" && url.pathname === "/api/community/access-point/status") {
      const session=await canonicalSession(env,request); if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED"},401),request);
      const b=await request.json().catch(()=>({})) as any,communityId=String(b?.communityEntityId??""),id=String(b?.id??""),state=String(b?.state??"").toUpperCase();
      if(!communityId||!id||!["DECLARED","ACTIVE","SUSPENDED","RETIRED"].includes(state))return cors(json({ok:false,code:"ACCESS_POINT_STATUS_INPUT_INVALID"},400),request);
      const operator=await communityOperatorScope(env,session,communityId);
      if(!operator)return cors(json({ok:false,code:"COMMUNITY_OPERATOR_REQUIRED"},403),request);
      await query(env,`update legakeys.community_access_points set state=$3,updated_at=now() where id=$1 and community_entity_id=$2`,[id,communityId,state]);
      return cors(json({ok:true,state:"UPDATED",truth:{access_point:"declared",provider:"not invented"}}),request);
    }

    if (request.method === "POST" && url.pathname === "/api/community/plan") {
      const session=await canonicalSession(env,request); if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED"},401),request);
      const b=await request.json().catch(()=>({})) as any,communityId=String(b?.communityEntityId??""),name=String(b?.name??"").trim(),objective=String(b?.objective??"").trim();
      const actorEntityId=String(session.entity_id??"");
      if(!communityId||name.length<2||objective.length<2)return cors(json({ok:false,code:"PLAN_INPUT_REQUIRED"},400),request);
      const operator=await communityOperatorScope(env,session,communityId);
      if(!operator)return cors(json({ok:false,code:"COMMUNITY_OPERATOR_REQUIRED"},403),request);
      const id=crypto.randomUUID(); await query(env,`insert into legakeys.community_plans(id,community_entity_id,name,objective,horizon_start,horizon_end,state,budget_model,measures,assumptions,risks,created_by_participant_ref,created_by_actor_entity_id) values($1,$2,$3,$4,$5::date,$6::date,'DRAFT',$7::jsonb,$8::jsonb,$9::jsonb,$10::jsonb,$11,$12)`,[id,communityId,name,objective,b?.horizonStart||null,b?.horizonEnd||null,JSON.stringify(b?.budgetModel||{}),JSON.stringify(b?.measures||[]),JSON.stringify(b?.assumptions||[]),JSON.stringify(b?.risks||[]),session.participant_id||null,actorEntityId]);
      return cors(json({ok:true,state:"DRAFT",plan_id:id,truth:{plan:"recorded",authorization:"required before consequential execution"}}),request);
    }
    if (request.method === "POST" && url.pathname === "/api/community/work-order") {
      const session=await canonicalSession(env,request); if(!session)return cors(json({ok:false,code:"AUTH_REQUIRED"},401),request);
      const b=await request.json().catch(()=>({})) as any,communityId=String(b?.communityEntityId??""),workspaceId=String(b?.workspaceId??""),title=String(b?.title??"").trim(),description=String(b?.description??"").trim(),priority=String(b?.priority??"NORMAL").toUpperCase();
      const actorEntityId=String(session.entity_id??"");
      if(!communityId||!workspaceId||title.length<2)return cors(json({ok:false,code:"WORK_ORDER_INPUT_REQUIRED"},400),request);
      if(!["LOW","NORMAL","HIGH","URGENT"].includes(priority))return cors(json({ok:false,code:"INVALID_PRIORITY"},400),request);
      const operator=await communityOperatorScope(env,session,communityId,workspaceId);
      if(!operator)return cors(json({ok:false,code:"COMMUNITY_OPERATOR_REQUIRED"},403),request);
      const id=crypto.randomUUID(); await query(env,`insert into legakeys.community_work_orders(id,community_entity_id,workspace_id,title,description,priority,state,target_ref,created_by_participant_ref,created_by_actor_entity_id) values($1,$2,$3,$4,$5,$6,'OPEN',$7,$8,$9)`,[id,communityId,workspaceId,title,description,priority,b?.targetRef||null,session.participant_id||null,actorEntityId]);
      return cors(json({ok:true,state:"OPEN",work_order_id:id,truth:{work_order:"recorded",execution:"not started",authorization:"required before consequential execution"}}),request);
    }
    if (request.method === "GET" && url.pathname === "/api/workspace-center") {
      const session = await canonicalSession(env, request);
      if (!session) return cors(json({ ok:false, code:"AUTH_REQUIRED", message:"A canonical LegaKeys session is required." }, 401), request);
      const type = url.searchParams.get("type");
      const participantId = String(session.participant_id ?? "");
      const allowedTypes = ["COMMUNITY_OPERATING","LEGAKEYS_OPERATING"];
      const selectedType = type && allowedTypes.includes(type) ? type : null;
      const workspaceRows = await query(env, `
        select w.id,w.workspace_type,w.name,w.purpose,w.scope_ref,w.lifecycle,w.governance_ref,w.version,w.created_at,w.updated_at,
               wm.id as membership_id,wm.role as membership_role,wm.status as membership_status,wm.scope_ref as membership_scope_ref,
               wm.valid_from,wm.valid_until
        from legakeys.workspaces w
        left join legakeys.workspace_memberships wm
          on wm.workspace_id=w.id and wm.participant_ref=$1 and wm.status='ACTIVE'
        where ($2::text is null or w.workspace_type=$2)
          and (wm.id is not null)
        order by w.updated_at desc
      `, [participantId, selectedType]);
      const workspaces = [];
      for (const ws of workspaceRows) {
        const items = await query(env,`
          select id,work_item_type,title,subject_ref,context_ref,proposal_ref,authorization_ref,status,created_at,updated_at
          from legakeys.workspace_work_items
          where workspace_id=$1
          order by updated_at desc limit 25
        `, [ws.id]);
        const caps = await query(env,`
          select id,capability_ref,role,scope_ref,policy_ref,enabled
          from legakeys.workspace_capabilities
          where workspace_id=$1 and enabled=true
          order by role,capability_ref
        `, [ws.id]);
        workspaces.push({ workspace:{
          id:ws.id,type:ws.workspace_type,name:ws.name,purpose:ws.purpose,scope_ref:ws.scope_ref,
          lifecycle:ws.lifecycle,governance_ref:ws.governance_ref,version:ws.version,
          created_at:ws.created_at,updated_at:ws.updated_at
        }, membership:{
          id:ws.membership_id,role:ws.membership_role,status:ws.membership_status,scope_ref:ws.membership_scope_ref,
          valid_from:ws.valid_from,valid_until:ws.valid_until
        }, capabilities:caps, work_items:items });
      }
      return cors(json({ok:true,participant_id:participantId,workspace_type:selectedType,workspaces,
        truth:{source:"canonical workspace tables",live_providers:false,authorization:"workspace visibility/capability never substitutes for authorization"}}), request);
    }

    if (request.method === "GET" && url.pathname === "/api/workspaces") {
      const session = await canonicalSession(env, request); if (!session) return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const rows = await query(env, "select w.id,w.workspace_type,w.name,w.purpose,w.scope_ref,w.lifecycle,w.governance_ref,w.version,w.created_at,w.updated_at from legakeys.workspaces w where exists (select 1 from legakeys.workspace_memberships wm where wm.workspace_id=w.id and wm.participant_ref=$1 and wm.status='ACTIVE') order by w.updated_at desc", [session.participant_id]);
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/identity") {
      const session = await canonicalSession(env, request); if (!session) return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const rows = await query(env, "select i.identity_id, i.entity_id, i.identity_type, i.state, i.verification_state, a.account_id, a.state as account_state, p.person_id, p.legal_name, p.display_name from legakeys.identities i left join legakeys.accounts a on a.identity_id=i.identity_id left join legakeys.persons p on p.entity_id=i.entity_id where i.identity_id=$1", [session.identity_id]);
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/core-domains") {
      const domains = {
        beataccess: ["access_points","access_credentials","access_operations","access_validation_results","access_provider_results","access_events","access_history"],
        workspaces: ["workspaces","workspace_memberships","workspace_capabilities","workspace_delegations","workspace_work_items","workspace_audit","community_profiles","community_roster","community_provider_links","community_service_config","community_work_orders","community_plans","community_plan_items"],
        digital_twin: ["digital_twins","digital_twin_properties","digital_twin_observations","digital_twin_relationships","digital_twin_transitions","digital_twin_scenarios"],
        constantyna: ["constantyna_runs","constantyna_inputs","constantyna_intents","constantyna_needs","constantyna_context_snapshots","constantyna_responses","constantyna_memory","constantyna_handoffs"],
        genesis: ["genesis_runs","genesis_inputs","genesis_findings","genesis_proposals","genesis_outputs","genesis_tool_invocations","genesis_evaluations"],
        world_intelligence: ["spatial_observations","map_features","weather_observations","earth_system_observations","climate_indicators","human_understandings","contextual_understandings","world_intelligence_quarantine","world_intelligence_fibonacci_policies"]
      };
      const expected = Object.entries(domains).flatMap(([domain, tables]) => tables.map(table => ({ domain, table })));
      const tableRows = await query(env, "select table_name from information_schema.tables where table_schema='legakeys' and table_name = any($1::text[])", [expected.map(x => x.table)]);
      const present = new Set(tableRows.map(row => String(row.table_name)));
      const matrix = Object.fromEntries(Object.entries(domains).map(([domain, tables]) => {
        const missing = tables.filter(table => !present.has(table));
        return [domain, { state: missing.length === 0 ? "VERIFIED" : "INCOMPLETE", required_table_count: tables.length, present_table_count: tables.length - missing.length, missing_tables: missing }];
      }));
      const linkageChecks = [
        ["workspace_to_authorization", "workspace_work_items", ["authorization_ref"]],
        ["digital_twin_to_event_evidence", "digital_twin_transitions", ["event_ref","evidence_refs"]],
        ["constantyna_to_session", "constantyna_runs", ["session_id"]],
        ["genesis_to_authorization", "genesis_proposals", ["authorization_id"]],
        ["genesis_to_action", "genesis_tool_invocations", ["authorization_id","action_id"]],
        ["world_to_provenance", "spatial_observations", ["provenance"]],
        ["world_to_context", "contextual_understandings", ["authority_refs","capability_refs","human_understanding_refs"]]
      ];
      const columnRows = await query(env, "select table_name, column_name from information_schema.columns where table_schema='legakeys' and table_name = any($1::text[])", [linkageChecks.map(x => x[1])]);
      const columns = new Set(columnRows.map(row => `${row.table_name}.${row.column_name}`));
      const linkage = linkageChecks.map(([name, table, requiredColumns]) => ({ name, state: requiredColumns.every(column => columns.has(`${table}.${column}`)) ? "VERIFIED" : "INCOMPLETE", table, required_columns: requiredColumns }));
      const ready = expected.every(x => present.has(x.table)) && linkage.every(x => x.state === "VERIFIED");
      return cors(json({ ok: ready, state: ready ? "VERIFIED" : "INCOMPLETE", domain_count: Object.keys(domains).length, matrix, linkage }), request);
    }

    if (request.method === "GET" && url.pathname === "/api/core-execution") {
      const required = [
        "authorization_decisions",
        "actions",
        "action_executions",
        "events",
        "event_outbox",
        "event_consumptions",
        "evidence",
        "action_outcomes"
      ];
      const tableRows = await query(env, "select table_name from information_schema.tables where table_schema='legakeys' and table_name = any($1::text[])", [required]);
      const present = new Set(tableRows.map(row => String(row.table_name)));
      const contractRows = await query(env, "select consequential_writes_enabled, legacy_runtime_allowed from legakeys.runtime_contract where contract_id=1");
      const triggerRows = await query(env, "select tg.tgname as trigger_name from pg_trigger tg join pg_class c on c.oid=tg.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='legakeys' and c.relname='action_executions' and not tg.tgisinternal");
      const integrationRows = await query(env, "select p.proname as function_name from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='legakeys' and p.proname in ('record_execution_event','next_action_event_sequence')");
      const eventTriggerRows = await query(env, "select tg.tgname as trigger_name from pg_trigger tg join pg_class c on c.oid=tg.tgrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='legakeys' and c.relname='events' and tg.tgisinternal = false");
      const evidenceRows = await query(env, "select column_name from information_schema.columns where table_schema='legakeys' and table_name='evidence' and column_name = any($1::text[])", [["action_id","event_id","content_hash","provenance","integrity"]]);
      const missing = required.filter(table => !present.has(table));
      const contract = contractRows[0] ?? {};
      const executionGatePresent = triggerRows.some(row => String(row.trigger_name) === "action_execution_authorization_gate");
      const eventEvidenceIntegrationPresent = integrationRows.some(row => String(row.function_name) === "record_execution_event") &&
        integrationRows.some(row => String(row.function_name) === "next_action_event_sequence") &&
        triggerRows.some(row => String(row.trigger_name) === "action_execution_event_evidence_integration");
      const evidenceLinkagePresent = ["action_id","event_id","content_hash","provenance","integrity"].every(column =>
        evidenceRows.some(row => String(row.column_name) === column)
      );
      const invariantChecks = {
        legacy_runtime_disabled: contract.legacy_runtime_allowed === false,
        consequential_writes_disabled: contract.consequential_writes_enabled === false,
        authorization_gate_present: executionGatePresent
      };
      const ready = missing.length === 0 && Object.values(invariantChecks).every(Boolean) && eventEvidenceIntegrationPresent && evidenceLinkagePresent;
      return cors(json({
        ok: ready,
        state: ready ? "VERIFIED" : "INCOMPLETE",
        consequential_writes_enabled: Boolean(contract.consequential_writes_enabled),
        legacy_runtime_allowed: Boolean(contract.legacy_runtime_allowed),
        authorization_gate: executionGatePresent ? "VERIFIED" : "MISSING",
        event_evidence_integration: eventEvidenceIntegrationPresent ? "VERIFIED" : "MISSING",
        evidence_linkage: evidenceLinkagePresent ? "VERIFIED" : "INCOMPLETE",
        invariant_checks: invariantChecks,
        required_table_count: required.length,
        present_table_count: required.length - missing.length,
        missing_tables: missing,
        invariants: [
          "INTENT -> PROPOSAL -> AUTHORIZATION -> ACTION -> EVENT -> EVIDENCE -> OUTCOME",
          "NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION",
          "AUTHENTICATION != AUTHORIZATION",
          "CAPABILITY != AUTHORIZATION",
          "DIGITAL TWIN != AUTHORITY"
        ]
      }), request);
    }

    if (request.method === "POST" && url.pathname === "/api/service-requests") {
      return cors(json({ ok: false, state: "AUTH_REQUIRED", code: "CANONICAL_SESSION_REQUIRED", message: "Consequential writes remain blocked until canonical session and authorization are connected." }, 401), request);
    }
    return json({ ok: false, state: "NOT_FOUND" }, 404);
  } catch (e) {
    const x = e as { code?: unknown; name?: unknown; message?: unknown };
    const rawCode = x && x.code != null ? String(x.code) : "";
    const code = /^[A-Z][A-Z0-9_]*$/.test(rawCode) ? rawCode : "DATABASE_ERROR";
    console.error("LegaKeys runtime error", { name: String(x?.name ?? ""), code: rawCode });
    return cors(json({
      ok: false,
      state: code === "DATABASE_NOT_CONFIGURED" ? "NOT_CONFIGURED" : "UNAVAILABLE",
      code
    }, code === "DATABASE_NOT_CONFIGURED" ? 503 : 502), request);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return api(request, env);
    return env.ASSETS.fetch(request);
  }
};

// Production build verification marker: canonical source is newline-normalized.
