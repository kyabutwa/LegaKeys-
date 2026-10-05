-- LegaKeys canonical runtime resilience contract.
-- Fibonacci is used as a bounded recovery schedule, not as a security primitive.
-- Non-transient database errors must fail fast.
BEGIN;

CREATE TABLE IF NOT EXISTS legakeys.runtime_resilience_policies (
  policy_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_version text NOT NULL UNIQUE,
  domain text NOT NULL,
  sequence jsonb NOT NULL,
  max_retries integer NOT NULL CHECK (max_retries BETWEEN 0 AND 8),
  base_delay_ms integer NOT NULL CHECK (base_delay_ms > 0),
  max_delay_ms integer NOT NULL CHECK (max_delay_ms >= base_delay_ms),
  jitter_ratio numeric(5,4) NOT NULL CHECK (jitter_ratio >= 0 AND jitter_ratio <= 1),
  retryable_sqlstates text[] NOT NULL,
  reset_after_success boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO legakeys.runtime_resilience_policies (
  policy_version, domain, sequence, max_retries, base_delay_ms, max_delay_ms,
  jitter_ratio, retryable_sqlstates, reset_after_success
)
VALUES
  ('FIB-1.0','DATABASE',
   '[0,1,1,2,3,5,8,13,21]'::jsonb,5,100,3000,0.25,
   ARRAY['08000','08001','08003','08004','08006','08007','08009','40001','40P01','57P01'],true),
  ('FIB-1.0-RUNTIME','RUNTIME',
   '[0,1,1,2,3,5,8,13,21]'::jsonb,5,100,3000,0.25,
   ARRAY['TIMEOUT','NETWORK','TEMPORARY_UNAVAILABLE','RATE_LIMITED'],true)
ON CONFLICT (policy_version) DO UPDATE SET
  sequence=EXCLUDED.sequence,
  max_retries=EXCLUDED.max_retries,
  base_delay_ms=EXCLUDED.base_delay_ms,
  max_delay_ms=EXCLUDED.max_delay_ms,
  jitter_ratio=EXCLUDED.jitter_ratio,
  retryable_sqlstates=EXCLUDED.retryable_sqlstates,
  reset_after_success=EXCLUDED.reset_after_success,
  active=true;

CREATE TABLE IF NOT EXISTS legakeys.runtime_integrity_snapshots (
  snapshot_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_version text NOT NULL,
  schema_fingerprint text NOT NULL,
  table_count integer NOT NULL,
  foreign_key_count integer NOT NULL,
  trigger_count integer NOT NULL,
  policy_version text NOT NULL,
  state text NOT NULL CHECK (state IN ('VERIFIED','DEGRADED','FAILED')),
  checks jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION legakeys.fibonacci_delay_ms(
  p_attempt integer,
  p_base_ms integer DEFAULT 100,
  p_max_ms integer DEFAULT 3000
)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  a bigint := 0;
  b bigint := 1;
  i integer := 0;
  value_ms bigint;
BEGIN
  IF p_attempt <= 0 THEN RETURN 0; END IF;
  WHILE i < p_attempt LOOP
    value_ms := a + b;
    a := b;
    b := LEAST(value_ms, 1000000000);
    i := i + 1;
  END LOOP;
  RETURN LEAST(p_max_ms, GREATEST(p_base_ms, a * p_base_ms));
END;
$$;

COMMENT ON FUNCTION legakeys.fibonacci_delay_ms(integer,integer,integer) IS
'Bounded deterministic Fibonacci recovery schedule. Retry eligibility remains controlled by the caller/policy.';

COMMIT;
