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
      const missing = required.filter(table => !present.has(table));
      const contract = contractRows[0] ?? {};
      const executionGatePresent = triggerRows.some(row => String(row.trigger_name) === "action_execution_authorization_gate");
      const invariantChecks = {\n        legacy_runtime_disabled: contract.legacy_runtime_allowed === false,\n        consequential_writes_disabled: contract.consequential_writes_enabled === false,\n        authorization_gate_present: executionGatePresent\n      };\n      const ready = missing.length === 0 && Object.values(invariantChecks).every(Boolean);
      return cors(json({
        ok: ready,
        state: ready ? "VERIFIED" : "INCOMPLETE",
        consequential_writes_enabled: Boolean(contract.consequential_writes_enabled),
        legacy_runtime_allowed: Boolean(contract.legacy_runtime_allowed),
        authorization_gate: executionGatePresent ? "VERIFIED" : "MISSING",\n        invariant_checks: invariantChecks,
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
