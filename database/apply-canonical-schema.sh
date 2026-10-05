#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"

export PGOPTIONS="${PGOPTIONS:-}"

echo "== LegaKeys canonical database migration =="
echo "Target is supplied through DATABASE_URL; credentials are never written to Git."

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/0000_canonical_runtime_contract.sql

schema_files=(
  implementation/identity/schema.sql
  implementation/identity/evidence-and-biometric-schema.sql
  implementation/world/schema.sql
  implementation/context/schema.sql
  implementation/capability/schema.sql
  implementation/authority/schema.sql
  implementation/beataccess/schema.sql
  implementation/beatvisitor/schema.sql
  implementation/services/schema.sql
  implementation/action-event-evidence/schema.sql
  implementation/action-event-evidence/integration.sql
  implementation/core-execution/schema.sql
  implementation/core-execution/hardening.sql
  implementation/genesis/schema.sql
  implementation/digital-twin/schema.sql
  implementation/workspaces/schema.sql
  implementation/world-intelligence/schema.sql
  implementation/constantyna/schema.sql
)

for file in "${schema_files[@]}"; do
  echo "Applying $file"
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$file"
done

echo "Applying database/0001_runtime_resilience.sql"
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/0001_runtime_resilience.sql

echo "== Verifying canonical LegaKeys contract =="
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -Atc   "select product_name || '|' || contract_version || '|' || canonical_schema || '|' || legacy_runtime_allowed || '|' || consequential_writes_enabled from legakeys.runtime_contract where contract_id=1"

echo "== Verifying Core Execution gate =="
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -Atc   "select count(*) from information_schema.tables where table_schema='legakeys' and table_name in ('authorization_requests','authorization_decisions','actions','action_executions','events','evidence')"

echo "== Verifying resilience policy =="
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -Atc   "select policy_version || '|' || domain || '|' || max_retries || '|' || max_delay_ms from legakeys.runtime_resilience_policies where active=true order by domain"

echo "== Running complete canonical database verification =="
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/verify.sql

echo "== Canonical LegaKeys schema applied and verified successfully =="
