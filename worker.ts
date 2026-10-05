import { Client } from "pg";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  HYPERDRIVE?: { connectionString: string };
  DATABASE_URL?: string;
}

type Row = Record<string, unknown>;


const SESSION_COOKIE="__Host-legakeys_session";
const SESSION_TTL_SECONDS=604800;
function requestOriginAllowed(request:Request){const origin=request.headers.get("Origin");return !origin||origin===new URL(request.url).origin}
function cookieValue(request:Request,name:string){const raw=request.headers.get("Cookie")??"";for(const part of raw.split(";")){const [key,...rest]=part.trim().split("=");if(key===name)return rest.join("=")||null}return null}
function bytesToBase64Url(bytes:Uint8Array){let b="";for(const x of bytes)b+=String.fromCharCode(x);return btoa(b).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function base64UrlToBytes(v:string){const b=atob(v.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((v.length+3)%4));const out=new Uint8Array(b.length);for(let i=0;i<b.length;i++)out[i]=b.charCodeAt(i);return out}
async function sha256(v:string){return bytesToBase64Url(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v))))}
async function derivePassword(password:string,salt:Uint8Array,iterations=600000){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),{name:"PBKDF2"},false,["deriveBits"]);return bytesToBase64Url(new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations,hash:"SHA-256"},key,256)))}
async function passwordRecord(password:string){const salt=crypto.getRandomValues(new Uint8Array(16));const iterations=600000;return "pbkdf2-sha256$v1$"+iterations+"$"+bytesToBase64Url(salt)+"$"+await derivePassword(password,salt,iterations)}
async function verifyPassword(password:string,record:string){const p=record.split("$");if(p.length!==5||p[0]!=="pbkdf2-sha256"||p[1]!=="v1")return false;const n=Number(p[2]);if(!Number.isInteger(n)||n<100000||n>1000000)return false;const a=new TextEncoder().encode(await derivePassword(password,base64UrlToBytes(p[3]),n)),b=new TextEncoder().encode(p[4]);if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0}
function sessionCookie(v:string,maxAge=SESSION_TTL_SECONDS){return SESSION_COOKIE+"="+v+"; Max-Age="+maxAge+"; Path=/; Secure; HttpOnly; SameSite=Strict"}
async function canonicalSession(env:Env,request:Request):Promise<Row|null>{const raw=cookieValue(request,SESSION_COOKIE);if(!raw)return null;const rows=await query(env,`select s.session_id,s.account_id,s.expires_at,a.state as account_state,a.identity_id,i.identity_type,i.verification_state,p.person_id,p.legal_name,p.display_name,pt.participant_id,pt.state as participant_state,pa.participation_id,pa.context_entity_id,pa.state as participation_state,pa.scope from legakeys.sessions s join legakeys.accounts a on a.account_id=s.account_id join legakeys.identities i on i.identity_id=a.identity_id left join legakeys.persons p on p.entity_id=i.entity_id left join legakeys.participants pt on pt.identity_id=i.identity_id and pt.state='ACTIVE' left join legakeys.participations pa on pa.participation_id=pt.participation_id where s.session_secret_reference=$1 and s.state='ACTIVE' and s.expires_at>now() and a.state='ACTIVE' order by pa.created_at desc nulls last limit 1`,[await sha256(raw)]);return rows[0]??null}
function publicAccount(r:Row){return {account_id:r.account_id,account_state:r.account_state,identity_id:r.identity_id,identity_type:r.identity_type,verification_state:r.verification_state,person:{person_id:r.person_id,legal_name:r.legal_name,display_name:r.display_name},participant:{participant_id:r.participant_id,state:r.participant_state},participation:{participation_id:r.participation_id,context_entity_id:r.context_entity_id,state:r.participation_state,scope:r.scope}}}

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
  const client = new Client({ connectionString });
  try {
    await client.connect();
    return (await client.query(sql, values)).rows as Row[];
  } finally {
    await client.end().catch(() => undefined);
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
        "participations", "participants", "places", "services", "service_versions", "service_offerings",
        "service_capabilities", "service_requests", "service_executions", "service_outcomes",
        "actions", "action_executions", "authorization_decisions", "events", "evidence", "workspaces", "genesis_runs",
        "digital_twins"
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


const SESSION_COOKIE="__Host-legakeys_session";
const SESSION_TTL_SECONDS=604800;
function requestOriginAllowed(request:Request){const origin=request.headers.get("Origin");return !origin||origin===new URL(request.url).origin}
function cookieValue(request:Request,name:string){const raw=request.headers.get("Cookie")??"";for(const part of raw.split(";")){const [key,...rest]=part.trim().split("=");if(key===name)return rest.join("=")||null}return null}
function bytesToBase64Url(bytes:Uint8Array){let b="";for(const x of bytes)b+=String.fromCharCode(x);return btoa(b).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}
function base64UrlToBytes(v:string){const b=atob(v.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((v.length+3)%4));const out=new Uint8Array(b.length);for(let i=0;i<b.length;i++)out[i]=b.charCodeAt(i);return out}
async function sha256(v:string){return bytesToBase64Url(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v))))}
async function derivePassword(password:string,salt:Uint8Array,iterations=600000){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),{name:"PBKDF2"},false,["deriveBits"]);return bytesToBase64Url(new Uint8Array(await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations,hash:"SHA-256"},key,256)))}
async function passwordRecord(password:string){const salt=crypto.getRandomValues(new Uint8Array(16));const iterations=600000;return "pbkdf2-sha256$v1$"+iterations+"$"+bytesToBase64Url(salt)+"$"+await derivePassword(password,salt,iterations)}
async function verifyPassword(password:string,record:string){const p=record.split("$");if(p.length!==5||p[0]!=="pbkdf2-sha256"||p[1]!=="v1")return false;const n=Number(p[2]);if(!Number.isInteger(n)||n<100000||n>1000000)return false;const a=new TextEncoder().encode(await derivePassword(password,base64UrlToBytes(p[3]),n)),b=new TextEncoder().encode(p[4]);if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0}
function sessionCookie(v:string,maxAge=SESSION_TTL_SECONDS){return SESSION_COOKIE+"="+v+"; Max-Age="+maxAge+"; Path=/; Secure; HttpOnly; SameSite=Strict"}
async function canonicalSession(env:Env,request:Request):Promise<Row|null>{const raw=cookieValue(request,SESSION_COOKIE);if(!raw)return null;const rows=await query(env,`select s.session_id,s.account_id,s.expires_at,a.state as account_state,a.identity_id,i.identity_type,i.verification_state,p.person_id,p.legal_name,p.display_name,pt.participant_id,pt.state as participant_state,pa.participation_id,pa.context_entity_id,pa.state as participation_state,pa.scope from legakeys.sessions s join legakeys.accounts a on a.account_id=s.account_id join legakeys.identities i on i.identity_id=a.identity_id left join legakeys.persons p on p.entity_id=i.entity_id left join legakeys.participants pt on pt.identity_id=i.identity_id and pt.state='ACTIVE' left join legakeys.participations pa on pa.participation_id=pt.participation_id where s.session_secret_reference=$1 and s.state='ACTIVE' and s.expires_at>now() and a.state='ACTIVE' order by pa.created_at desc nulls last limit 1`,[await sha256(raw)]);return rows[0]??null}
function publicAccount(r:Row){return {account_id:r.account_id,account_state:r.account_state,identity_id:r.identity_id,identity_type:r.identity_type,verification_state:r.verification_state,person:{person_id:r.person_id,legal_name:r.legal_name,display_name:r.display_name},participant:{participant_id:r.participant_id,state:r.participant_state},participation:{participation_id:r.participation_id,context_entity_id:r.context_entity_id,state:r.participation_state,scope:r.scope}}}

  try {

    if(request.method!=="GET"&&!requestOriginAllowed(request))return cors(json({ok:false,state:"DENIED",code:"CROSS_ORIGIN_MUTATION_BLOCKED"},403),request);
    if(request.method==="POST"&&url.pathname==="/api/account/signup"){
      const b=await request.json().catch(()=>null) as any,e=String(b?.email??"").trim().toLowerCase(),pw=String(b?.password??""),name=String(b?.legalName??"").trim(),display=String(b?.displayName??"").trim()||name,country=String(b?.countryOfResidence??"").trim()||null;
      if(!/^\S+@\S+\.\S+$/.test(e)||pw.length<12||name.length<2)return cors(json({ok:false,state:"INVALID_INPUT",code:"SIGNUP_INPUT_INVALID"},400),request);
      if((await query(env,"select 1 from legakeys.credentials where credential_type='EMAIL_PASSWORD' and lower(subject_reference)=lower($1) limit 1",[e])).length)return cors(json({ok:false,state:"CONFLICT",code:"ACCOUNT_ALREADY_EXISTS"},409),request);
      const secret=await passwordRecord(pw);
      const rows=await query(env,`with e as(insert into legakeys.entities(entity_type,canonical_name,display_name,lifecycle_state)values('PERSON',$1,$2,'ACTIVE')returning entity_id),i as(insert into legakeys.identities(entity_id,identity_type,state,verification_state)select entity_id,'PERSON','ACTIVE','UNVERIFIED' from e returning identity_id,entity_id),p as(insert into legakeys.persons(entity_id,legal_name,display_name,country_of_residence)select entity_id,$1,$2,$3 from i returning person_id,entity_id),a as(insert into legakeys.accounts(identity_id,state)select identity_id,'ACTIVE' from i returning account_id,identity_id),c as(insert into legakeys.credentials(account_id,credential_type,state,subject_reference,verification_state,secret_reference)select account_id,'EMAIL_PASSWORD','ACTIVE',$4,'UNVERIFIED',$5 from a returning credential_id,account_id),u as(update legakeys.accounts a set primary_credential_id=c.credential_id,updated_at=now()from c where a.account_id=c.account_id returning a.account_id,a.identity_id),pa as(insert into legakeys.participations(identity_id,state,scope)select identity_id,'ACTIVE','{}'::jsonb from i returning participation_id,identity_id),pt as(insert into legakeys.participants(participation_id,identity_id,state)select participation_id,identity_id,'ACTIVE'from pa returning participant_id,participation_id,identity_id)select u.account_id,u.identity_id,p.person_id,pt.participant_id,pt.participation_id from u join i on i.identity_id=u.identity_id join p on p.entity_id=i.entity_id join pt on pt.identity_id=u.identity_id limit 1`,[name,display,country,e,secret]);
      return cors(json({ok:true,state:"CREATED",account_id:rows[0]?.account_id,identity_id:rows[0]?.identity_id,participant_id:rows[0]?.participant_id,verification_state:"UNVERIFIED"}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/auth/login"){
      const b=await request.json().catch(()=>null) as any,e=String(b?.email??"").trim().toLowerCase(),pw=String(b?.password??"");
      const r=(await query(env,`select a.account_id,a.state as account_state,c.state as credential_state,c.secret_reference from legakeys.credentials c join legakeys.accounts a on a.account_id=c.account_id where c.credential_type='EMAIL_PASSWORD' and lower(c.subject_reference)=lower($1) limit 1`,[e]))[0];
      if(!r||r.account_state!=="ACTIVE"||r.credential_state!=="ACTIVE"||!r.secret_reference||!(await verifyPassword(pw,String(r.secret_reference))))return cors(json({ok:false,state:"DENIED",code:"INVALID_CREDENTIALS"},401),request);
      const raw=bytesToBase64Url(crypto.getRandomValues(new Uint8Array(32))),secret=await sha256(raw),ss=await query(env,"insert into legakeys.sessions(account_id,state,session_secret_reference,last_seen_at,expires_at)values($1,'ACTIVE',$2,now(),now()+interval '7 days')returning session_id,expires_at",[r.account_id]);
      await query(env,"update legakeys.accounts set last_authenticated_at=now(),updated_at=now()where account_id=$1",[r.account_id]);
      const out=cors(json({ok:true,state:"AUTHENTICATED",session_id:ss[0].session_id,expires_at:ss[0].expires_at}),request),h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie(raw));return new Response(out.body,{status:out.status,headers:h});
    }
    if(request.method==="POST"&&url.pathname==="/api/auth/logout"){
      const raw=cookieValue(request,SESSION_COOKIE);if(raw)await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now()where session_secret_reference=$1 and state='ACTIVE'",[await sha256(raw)]);
      const out=cors(json({ok:true,state:"SIGNED_OUT"}),request),h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie("",0));return new Response(out.body,{status:out.status,headers:h});
    }
    if(request.method==="GET"&&url.pathname==="/api/me"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);await query(env,"update legakeys.sessions set last_seen_at=now()where session_id=$1",[r.session_id]);return cors(json({ok:true,state:"AUTHENTICATED",data:publicAccount(r)}),request);
    }
    if(request.method==="GET"&&url.pathname==="/api/account"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);
      const sessions=await query(env,"select session_id,state,created_at,last_seen_at,expires_at,revoked_at from legakeys.sessions where account_id=$1 order by created_at desc",[r.account_id]),credentials=await query(env,"select credential_id,credential_type,state,verification_state,subject_reference,expires_at,revoked_at,created_at from legakeys.credentials where account_id=$1 order by created_at",[r.account_id]);return cors(json({ok:true,state:"AUTHENTICATED",data:{account:publicAccount(r),sessions,credentials}}),request);
    }
    if(request.method==="POST"&&url.pathname==="/api/account/suspend"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);await query(env,"update legakeys.credentials set state='DISABLED',updated_at=now()where account_id=$1 and state='ACTIVE'",[r.account_id]);await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now()where account_id=$1 and state='ACTIVE'",[r.account_id]);await query(env,"update legakeys.accounts set state='SUSPENDED',updated_at=now()where account_id=$1",[r.account_id]);const out=cors(json({ok:true,state:"SUSPENDED"}),request),h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie("",0));return new Response(out.body,{status:out.status,headers:h});
    }
    if(request.method==="POST"&&url.pathname==="/api/account/close"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);await query(env,"update legakeys.credentials set state='REVOKED',revoked_at=now(),updated_at=now()where account_id=$1",[r.account_id]);await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now()where account_id=$1",[r.account_id]);await query(env,"update legakeys.participants set state='SUSPENDED',updated_at=now()where identity_id=$1 and state='ACTIVE'",[r.identity_id]);await query(env,"update legakeys.accounts set state='CLOSED',updated_at=now()where account_id=$1",[r.account_id]);const out=cors(json({ok:true,state:"CLOSED"}),request),h=new Headers(out.headers);h.append("Set-Cookie",sessionCookie("",0));return new Response(out.body,{status:out.status,headers:h});
    }
    if(request.method==="POST"&&url.pathname==="/api/session/revoke"){
      const r=await canonicalSession(env,request);if(!r)return cors(json({ok:false,state:"AUTH_REQUIRED",code:"CANONICAL_SESSION_REQUIRED"},401),request);const b=await request.json().catch(()=>null) as any,id=String(b?.session_id??"");if(!id)return cors(json({ok:false,state:"INVALID_INPUT",code:"SESSION_ID_REQUIRED"},400),request);await query(env,"update legakeys.sessions set state='REVOKED',revoked_at=now()where session_id=$1 and account_id=$2",[id,r.account_id]);return cors(json({ok:true,state:"REVOKED",session_id:id}),request);
    }
    if (request.method === "GET" && url.pathname === "/api/services") {
      const rows = await query(env, "select service_id, beat_code, canonical_name, description, lifecycle_state, truth_state, native_or_provider_mode, provenance, updated_at from legakeys.services order by canonical_name");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/places") {
      const rows = await query(env, "select place_id, entity_id, place_type, parent_place_id, canonical_name, display_name, description, address_line, country_code, region_code, city_name, latitude, longitude, location_precision_m, lifecycle_state, effective_from, effective_to, updated_at from legakeys.places order by canonical_name");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/activity") {
      const rows = await query(env, "select id, event_source, event_version, event_type, action_id, execution_id, actor_id, principal_id, subject_type, subject_id, occurred_at, recorded_at, correlation_id, truth_state, source_type, source_reference from legakeys.events order by occurred_at desc limit 50");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
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
      const rows = await query(env, "select id, workspace_type, name, purpose, scope_ref, lifecycle, governance_ref, version, created_at, updated_at from legakeys.workspaces order by updated_at desc");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/identity") {
      const rows = await query(env, "select i.identity_id, i.entity_id, i.identity_type, i.state, i.verification_state, a.account_id, a.state as account_state, p.person_id, p.legal_name, p.display_name from legakeys.identities i left join legakeys.accounts a on a.identity_id=i.identity_id left join legakeys.persons p on p.entity_id=i.entity_id order by i.created_at desc limit 100");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/core-domains") {
      const domains = {
        workspaces: ["workspaces","workspace_memberships","workspace_capabilities","workspace_delegations","workspace_work_items","workspace_audit"],
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
    const code = e instanceof Error && "code" in e ? String((e as Error & {code?: string}).code) : "DATABASE_ERROR";
    return cors(json({ ok: false, state: code === "DATABASE_NOT_CONFIGURED" ? "NOT_CONFIGURED" : "UNAVAILABLE", code }, code === "DATABASE_NOT_CONFIGURED" ? 503 : 502), request);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return api(request, env);
    return env.ASSETS.fetch(request);
  }
};
