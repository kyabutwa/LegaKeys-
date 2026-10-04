# LegaKeys Workspaces — Verification Cases

100 cases: WS-001 → WS-100.

WS-001 valid workspace creation; WS-002 missing purpose rejected; WS-003 missing scope rejected; WS-004 duplicate creation idempotent; WS-005 lifecycle validated; WS-006 archived workspace restrictions; WS-007 version preserved; WS-008 governance reference required; WS-009 workspace type validated; WS-010 workspace identity stable.

WS-011 valid membership; WS-012 unresolved participant rejected; WS-013 temporal membership; WS-014 expired membership denied; WS-015 revoked membership denied; WS-016 suspended membership denied; WS-017 role scoped to workspace; WS-018 duplicate membership idempotent; WS-019 membership removal audited; WS-020 historical membership retained.

WS-021 capability mapping; WS-022 role-capability mismatch denied; WS-023 disabled capability denied; WS-024 policy reference required; WS-025 capability does not equal authorization; WS-026 workspace role does not equal authority; WS-027 team membership does not equal team authority; WS-028 subscription does not equal workspace authority; WS-029 location does not create access; WS-030 relationship does not create access.

WS-031 valid work item; WS-032 subject scope enforced; WS-033 context required for consequential item; WS-034 proposal remains proposal; WS-035 authorization reference validated; WS-036 work item cannot execute directly; WS-037 duplicate work item request idempotent; WS-038 status transitions governed; WS-039 unknown status preserved; WS-040 failed execution remains failed/unknown.

WS-041 valid delegation; WS-042 delegation requires authority basis; WS-043 delegation scope bounded; WS-044 delegation time bounded; WS-045 delegation cannot exceed delegator authority; WS-046 expired delegation denied; WS-047 revoked delegation denied; WS-048 cross-scope delegation denied; WS-049 delegation audited; WS-050 delegation cannot self-elevate.

WS-051 cross-workspace read requires policy; WS-052 cross-community join rejected without scope; WS-053 sensitive data filtered; WS-054 dual membership does not merge scopes; WS-055 parent workspace does not automatically authorize child; WS-056 child cannot exceed parent scope; WS-057 exported data remains governed; WS-058 shared view remains governed; WS-059 invitation does not equal membership; WS-060 accepted invitation does not equal consequential authorization.

WS-061 administrator role is scoped; WS-062 administrator cannot bypass Authorization; WS-063 system administrator remains policy-bound; WS-064 operator cannot self-elevate; WS-065 reviewer cannot execute without authorization; WS-066 viewer is read-only unless separately authorized; WS-067 analyst access remains scoped; WS-068 contributor cannot change protected configuration without capability; WS-069 role changes audited; WS-070 permission changes versioned.

WS-071 suspended workspace blocks new consequential actions; WS-072 archived workspace preserves audit; WS-073 degraded integration does not become success; WS-074 provider outage does not imply workspace failure; WS-075 unknown state remains unknown; WS-076 configuration correction is attributable; WS-077 audit timestamps preserved; WS-078 correlation ID preserved; WS-079 provenance preserved; WS-080 historical records immutable.

WS-081 Constantyna cannot grant workspace permission; WS-082 Genesis cannot grant workspace permission; WS-083 AI output cannot authorize; WS-084 prompt injection cannot expand scope; WS-085 retrieved content cannot grant authority; WS-086 Digital Twin cannot grant workspace permission; WS-087 Context cannot grant permission; WS-088 Capability cannot grant authorization; WS-089 workspace UI cannot unlock access; WS-090 workspace UI cannot authorize payment.

WS-091 consequential operation crosses Authorization; WS-092 Action Runtime owns execution; WS-093 Event records actual occurrence; WS-094 Evidence supports actual occurrence; WS-095 authorization does not imply success; WS-096 previous success does not imply current authorization; WS-097 emergency workspace mode remains bounded; WS-098 audit cannot be fabricated; WS-099 projection cannot rewrite history; WS-100 **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION**.
