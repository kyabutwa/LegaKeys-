# LegaKeys Production UI Verification Cases

## Shell
UI-001 brand is LegaKeys
UI-002 persistent top shell
UI-003 context explains that context does not grant authority
UI-004 universal search
UI-005 Constantyna entry
UI-006 identity entry
UI-007 overflow for secondary controls
UI-008 persistent desktop navigation
UI-009 persistent mobile navigation
UI-010 no more than five primary mobile destinations

## Information architecture
UI-011 17-domain architecture hidden from primary navigation
UI-012 Home answers what matters now
UI-013 Places represents connected place context
UI-014 Services represents declared capabilities
UI-015 Activity represents history
UI-016 Workspaces represents operational scope
UI-017 Identity represents identity and participation
UI-018 Constantyna is assistance, not authority

## Truth and safety
UI-019 no fake live location
UI-020 no fake provider availability
UI-021 no fake transaction success
UI-022 Unknown is explicit
UI-023 Declared is distinct from Verified
UI-024 membership is not authorization
UI-025 capability is not authority
UI-026 AI limitation is explicit
UI-027 context does not grant authority
UI-028 a button is never treated as inherent authorization
UI-029 consequential execution remains outside the UI layer
UI-030 no invented operational events

## Responsive
UI-031 phone collapses to one column
UI-032 phone uses bottom navigation
UI-033 desktop uses persistent side navigation
UI-034 drawer fits narrow screens
UI-035 no required horizontal scrolling
UI-036 viewport is safe-area aware
UI-037 reduced motion is honored
UI-038 focus-visible styles exist
UI-039 heading hierarchy is logical
UI-040 primary actions remain reachable

## Interaction
UI-041 search command surface
UI-042 Constantyna drawer
UI-043 identity surface
UI-044 context menu
UI-045 mobile navigation drawer
UI-046 primary navigation switches surface
UI-047 service cards route to Services
UI-048 action cards route to destination
UI-049 unavailable community workspace is labeled
UI-050 absence of places is an empty state, not fabricated data

## Integration gate
UI-051 production bindings use canonical domain contracts
UI-052 live state includes provenance and truth state
UI-053 consequential actions call Authorization before Action Runtime
UI-054 Action Runtime emits Event and Evidence
UI-055 UNKNOWN is rendered when required data is unavailable
UI-056 authorization is never cached as permanent permission
UI-057 context is scoped and timestamped when required
UI-058 errors preserve truthful state
UI-059 loading never implies success
UI-060 stale data is never silently current

## Visual QA
UI-061 readable text on navy
UI-062 readable text on white
UI-063 green is not the sole status channel
UI-064 consistent card geometry
UI-065 hierarchy works without shadows
UI-066 singular primary action
UI-067 no critical hover-only action
UI-068 predictable menus
UI-069 dismissible drawers
UI-070 production modals preserve focus

## Scale
UI-071 narrow reflow
UI-072 density reduction
UI-073 bounded reading width
UI-074 navigation remains recognizable after resize
UI-075 search remains accessible
UI-076 touch controls remain separated
UI-077 long labels wrap
UI-078 large text does not overlap
UI-079 no fixed-height content trap
UI-080 no action depends on precise pointer location

## Governance UX
UI-081 authorization state has a dedicated representation
UI-082 denied is not disguised as unavailable
UI-083 pending is not disguised as success
UI-084 expired and revoked are distinguishable
UI-085 evidence is reachable from consequential activity
UI-086 action scope can be shown before confirmation
UI-087 provider identity is separate from service identity
UI-088 Digital Twin is not ground truth
UI-089 GENESIS proposals are not approvals
UI-090 Constantyna suggestions are not decisions

## Completion gate
UI-091 build succeeds
UI-092 TypeScript compilation succeeds
UI-093 browser smoke test succeeds
UI-094 mobile visual check succeeds
UI-095 desktop visual check succeeds
UI-096 keyboard smoke test succeeds
UI-097 no browser console errors
UI-098 production data integration separately verified
UI-099 authentication and session integration separately verified
UI-100 deployment URL separately verified
