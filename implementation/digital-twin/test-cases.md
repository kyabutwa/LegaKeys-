# LegaKeys Digital Twin — Verification Cases

100 cases: DT-001 → DT-100.

## Identity and model
DT-001 register valid twin; DT-002 reject unresolved subject; DT-003 preserve model version; DT-004 duplicate registration is idempotent; DT-005 govern lifecycle transitions; DT-006 reject normal updates to retired twins; DT-007 keep twin identity stable; DT-008 require scope; DT-009 require model reference; DT-010 require model version.

## Truth and freshness
DT-011 VERIFIED requires verification basis; DT-012 DECLARED remains declared; DT-013 OBSERVED remains observed; DT-014 INFERRED remains inferred; DT-015 PROPOSED cannot silently become current; DT-016 UNKNOWN is queryable; DT-017 stale property is marked STALE; DT-018 expired property is marked EXPIRED; DT-019 missing update does not imply continued presence; DT-020 confidence does not equal truth.

## Observations
DT-021 ingest valid observation; DT-022 quarantine malformed observation; DT-023 reject missing provenance; DT-024 preserve source identity; DT-025 preserve observed/received times; DT-026 preserve correlation ID; DT-027 make replay idempotent; DT-028 handle out-of-order observations; DT-029 preserve restricted scope; DT-030 map source failure to UNKNOWN/DEGRADED.

## Properties and state
DT-031 apply valid property; DT-032 enforce scope; DT-033 require source reference; DT-034 preserve evidence references; DT-035 preserve quality; DT-036 enforce temporal validity; DT-037 do not let stale writes silently overwrite fresher state; DT-038 allow UNKNOWN to replace stale knowledge; DT-039 record corrections as transitions; DT-040 treat current state as a projection.

## Relationships
DT-041 create valid relationship; DT-042 reject missing source; DT-043 reject missing target; DT-044 preserve relationship provenance; DT-045 enforce temporal validity; DT-046 containment does not grant authority; DT-047 location does not grant authority; DT-048 keep direction explicit; DT-049 make duplicate relationship creation idempotent; DT-050 require policy for cross-scope relationships.

## History and provenance
DT-051 append transition; DT-052 reject transition update; DT-053 reject transition deletion; DT-054 preserve prior value; DT-055 preserve next value; DT-056 preserve event reference; DT-057 preserve evidence references; DT-058 preserve reason; DT-059 expose provenance chain; DT-060 reconstruct as-of state deterministically.

## Reconciliation
DT-061 consider trusted source; DT-062 do not let stale source silently win; DT-063 expose conflicting sources; DT-064 return CONFLICTED when unresolved; DT-065 return UNKNOWN when evidence is insufficient; DT-066 require explicit reconciliation policy; DT-067 preserve originals; DT-068 make reconciliation idempotent; DT-069 provider outage is not physical failure; DT-070 reconcile after source recovery.

## Scenarios
DT-071 isolate scenario from current state; DT-072 label simulation PROPOSED/UNKNOWN; DT-073 preserve model/version; DT-074 preserve assumptions; DT-075 enforce expiry; DT-076 forecast cannot overwrite observation; DT-077 what-if cannot become fact; DT-078 preserve scenario provenance; DT-079 keep scenario non-authoritative; DT-080 scenario cannot grant authority.

## Security and privacy
DT-081 reject unauthorized data scope; DT-082 reject cross-community leakage; DT-083 reject raw biometric data; DT-084 reject raw authentication secrets; DT-085 exclude provider secrets; DT-086 enforce sensitive-location policy; DT-087 prompt injection cannot expand scope; DT-088 retrieved content cannot grant authority; DT-089 twin query cannot unlock access; DT-090 twin mutation cannot authorize payment.

## Intelligence and execution boundary
DT-091 Constantyna cannot directly execute consequential twin actions; DT-092 Genesis proposal remains a proposal; DT-093 authorization is checked outside twin; DT-094 Action Runtime owns consequential execution; DT-095 Event records actual occurrence; DT-096 Evidence supports occurrence; DT-097 authorization does not imply physical success; DT-098 missing physical evidence yields UNKNOWN; DT-099 projection cannot rewrite history; DT-100 **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION**.
