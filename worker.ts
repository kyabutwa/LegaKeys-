import { Client } from "pg";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  HYPERDRIVE?: { connectionString: string };
  DATABASE_URL?: string;
}

type Row = Record<string, unknown>;

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function cors(response: Response, request: Request): Response {
  const origin = request.headers.get("Origin");
  if (!origin) return response;
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
        "actions", "action_executions", "events", "evidence", "workspaces", "genesis_runs",
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

  try {
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
    if (request.method === "GET" && url.pathname === "/api/workspaces") {
      const rows = await query(env, "select id, workspace_type, name, purpose, scope_ref, lifecycle, governance_ref, version, created_at, updated_at from legakeys.workspaces order by updated_at desc");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/identity") {
      const rows = await query(env, "select i.identity_id, i.entity_id, i.identity_type, i.state, i.verification_state, a.account_id, a.state as account_state, p.person_id, p.legal_name, p.display_name from legakeys.identities i left join legakeys.accounts a on a.identity_id=i.identity_id left join legakeys.persons p on p.entity_id=i.entity_id order by i.created_at desc limit 100");
      return cors(json({ ok: true, state: "VERIFIED", data: rows }), request);
    }
    if (request.method === "GET" && url.pathname === "/api/me") {
      return cors(json({ ok: false, state: "AUTH_REQUIRED", code: "CANONICAL_SESSION_REQUIRED" }, 401), request);
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
