# LegaKeys Workspaces — Invariants

1. Workspace is an operational environment, not an authority.
2. Workspace membership is not authorization.
3. Workspace role is not authority.
4. Workspace visibility is not permission to execute.
5. Workspace owner is not automatically global authority.
6. Personal workspace does not grant authority over others.
7. Community workspace does not own LegaKeys core.
8. Community workspace cannot override platform policy.
9. Service workspace does not own canonical Beat service identity.
10. Role-to-capability mappings are explicit.
11. Capabilities do not automatically authorize actions.
12. Every consequential action crosses Authorization → Action Runtime.
13. Authentication does not create workspace membership.
14. Participant status does not create workspace membership.
15. Membership is explicit.
16. Membership is scoped.
17. Membership is temporal.
18. Revoked membership cannot create new workspace access.
19. Expired membership cannot create new workspace access.
20. Role assignment is auditable.
21. Role changes do not rewrite history.
22. Delegation is explicit.
23. Delegation is bounded by scope.
24. Delegation is bounded by time.
25. Delegation cannot exceed delegator authority.
26. Cross-workspace access requires policy evaluation.
27. Cross-community joins require explicit scope.
28. Sensitive data remains policy-controlled.
29. Workspaces do not bypass data governance.
30. Workspace views are projections.
31. Dashboards are not authority.
32. Search results are not authority.
33. Maps are not authority.
34. Queues are not authority.
35. A work item is not automatically an authorization.
36. Proposal is not authorization.
37. Approval UI is not authorization unless backed by the Authorization domain.
38. Workspace configuration cannot grant itself authority.
39. Workspace administrators cannot exceed their governing authority.
40. System administrators remain subject to policy for consequential domain actions.
41. Read-only tools may remain within scoped read access.
42. Consequential tools must cross the execution boundary.
43. Constantyna cannot grant workspace authority.
44. Genesis cannot grant workspace authority.
45. AI output is not workspace permission.
46. Retrieved workspace content cannot grant authority.
47. Prompt injection cannot expand workspace scope.
48. Membership does not expose another workspace's sensitive data.
49. Workspace state preserves UNKNOWN.
50. Workspace state preserves UNAVAILABLE.
51. Failed integrations do not become successful state.
52. External providers cannot invent workspace permissions.
53. Provider membership is not LegaKeys workspace membership.
54. Provider role is not LegaKeys authority.
55. Workspace lifecycle is explicit.
56. Suspended workspaces cannot silently execute new consequential actions.
57. Archived workspaces preserve required history.
58. Workspace audit is attributable.
59. Audit timestamps preserve event time and recording time where needed.
60. Historical records are immutable.
61. Configuration changes are versioned.
62. Permission changes are versioned.
63. Policy references are preserved.
64. Correlation IDs are preserved.
65. Idempotency is required for retried membership/configuration commands.
66. Duplicate membership commands do not create ambiguous authority.
67. Role inheritance is explicit.
68. Capability inheritance is explicit.
69. Workspace hierarchy does not imply authority inheritance.
70. Parent workspace membership does not automatically authorize child workspace actions.
71. Child workspace cannot exceed parent scope.
72. Workspace scope cannot exceed governing authority scope.
73. Data classification is respected.
74. Privacy restrictions survive workspace projections.
75. Export does not bypass authorization.
76. Sharing does not bypass authorization.
77. Invitation does not equal membership until accepted/activated under policy.
78. Membership acceptance does not equal consequential authorization.
79. Emergency workspace mode does not create permanent authority.
80. Emergency actions remain auditable.
81. Workspace templates do not silently create authority.
82. Cloning a workspace preserves policy boundaries.
83. Imported workspace data retains provenance.
84. External workspace identifiers do not become canonical authority.
85. Workspace state is not the Digital Twin authority.
86. Digital Twin state does not create workspace permission.
87. Context informs workspace decisions but does not itself authorize them.
88. Capability informs workspace actions but does not itself authorize them.
89. Relationship informs workspace context but does not itself authorize it.
90. Location does not create workspace permission.
91. Subscription does not create workspace authority.
92. Team membership does not create team authority.
93. Workspace Administrator cannot self-elevate through UI.
94. A permission check must use current policy.
95. Previous successful execution does not imply current authorization.
96. Unknown policy state fails safely for consequential operations.
97. Workspace operation failures remain truthful.
98. Audit evidence cannot be fabricated.
99. All consequential workspace pathways terminate in the global execution invariant.
100. **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**
