# LegaKeys Fibonacci Resilience Contract

## Purpose

LegaKeys uses Fibonacci as a **bounded recovery schedule** for transient runtime/database failures. It is not a cryptographic primitive, an authorization mechanism, or a guarantee against attacks.

## Canonical sequence

0, 1, 1, 2, 3, 5, 8, 13, 21

The production policy caps retries at 5 and caps the delay at 3000 ms. Jitter is applied by the runtime layer so independent failures do not synchronize into a retry storm.

## Failure classification

Retry is permitted only for explicitly classified transient conditions:

- PostgreSQL connection-class SQLSTATEs (08xxx family represented by the canonical policy entries)
- serialization/deadlock recovery (40001, 40P01)
- temporary database shutdown (57P01)
- runtime timeout/network/temporary-unavailable/rate-limit conditions

Schema errors, constraint violations, authentication/authorization failures, invalid input, missing tables, and application bugs are **fail-fast**. Repeating them cannot repair the cause.

## Canonical layers

1. PostgreSQL stores the policy and exposes `legakeys.fibonacci_delay_ms(...)`.
2. Migration verification requires the policy to exist before production is considered green.
3. Runtime adapters use the same bounded sequence and retry classification.
4. Idempotency remains mandatory before retrying consequential operations.
5. Event/Evidence history remains append-oriented so recovery cannot silently rewrite history.

## Integrity principle

Fibonacci improves recovery behavior; it does not replace database constraints, authorization gates, transactions, backups, observability, or deployment verification.

The invariant remains:

**NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**
