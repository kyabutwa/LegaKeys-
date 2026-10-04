#!/usr/bin/env node

const baseUrl = (process.env.LEGAKEYS_PRODUCTION_URL || "").replace(/\/$/, "");
if (!baseUrl) {
  console.error("LEGAKEYS_PRODUCTION_URL is required");
  process.exit(2);
}

const checks = [
  ["/api/health", (body) => body?.ok === true && body?.state === "CONNECTED"],
  ["/api/services", (body) => body?.ok === true && body?.state === "VERIFIED" && Array.isArray(body?.data)],
  ["/api/places", (body) => body?.ok === true && body?.state === "VERIFIED" && Array.isArray(body?.data)],
  ["/api/activity", (body) => body?.ok === true && body?.state === "VERIFIED" && Array.isArray(body?.data)],
  ["/api/workspaces", (body) => body?.ok === true && body?.state === "VERIFIED" && Array.isArray(body?.data)],
  ["/api/identity", (body) => body?.ok === true && body?.state === "VERIFIED" && Array.isArray(body?.data)],
  ["/api/core-domains", (body) => body?.ok === true && body?.state === "VERIFIED" && body?.domain_count === 5]
];

let failed = false;

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
