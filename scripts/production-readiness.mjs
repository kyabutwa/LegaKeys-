#!/usr/bin/env node

const baseUrl = (process.env.LEGAKEYS_PRODUCTION_URL || "").replace(/\/$/, "");
if (!baseUrl) {
  console.error("LEGAKEYS_PRODUCTION_URL is required");
  process.exit(2);
}

const checks = [
  ["/api/health", (body) => body?.ok === true && body?.state === "CONNECTED"],
  ["/api/services", (body) => body?.ok === true && body?.state === "VERIFIED" && Array.isArray(body?.data)],
  ["/api/core-domains", (body) => body?.ok === true && body?.state === "VERIFIED" && body?.domain_count === 5],
  ["/api/core-execution", (body) => body?.ok === true && body?.state === "VERIFIED" && body?.authorization_gate === "VERIFIED" && body?.event_evidence_integration === "VERIFIED" && body?.evidence_linkage === "VERIFIED"]
];

let failed = false;

const protectedChecks = ["/api/places", "/api/activity", "/api/workspaces", "/api/identity"];
for (const path of protectedChecks) {
  try {
    const response = await fetch(baseUrl + path, { headers: { accept: "application/json" }, redirect: "follow" });
    const text = await response.text();
    let body;
    try { body = JSON.parse(text); } catch { body = null; }
    if (response.status !== 401 || body?.code !== "CANONICAL_SESSION_REQUIRED") {
      failed = true;
      console.error(`FAIL auth boundary ${path}: HTTP ${response.status} ${text.slice(0, 500)}`);
    } else {
      console.log(`PASS auth boundary ${path}: HTTP 401`);
    }
  } catch (error) {
    failed = true;
    console.error(`FAIL auth boundary ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const [path, validate] of checks) {
  try {
    const response = await fetch(baseUrl + path, {
      headers: { accept: "application/json" },
      redirect: "follow"
    });
    const text = await response.text();
    let body;
    try { body = JSON.parse(text); } catch { body = null; }

    if (!response.ok || !validate(body)) {
      failed = true;
      console.error(`FAIL ${path}: HTTP ${response.status} ${text.slice(0, 500)}`);
    } else {
      console.log(`PASS ${path}: HTTP ${response.status}`);
    }
  } catch (error) {
    failed = true;
    console.error(`FAIL ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failed) {
  console.error("LegaKeys production readiness gate: FAILED");
  process.exit(1);
}

console.log("LegaKeys production readiness gate: PASSED");
