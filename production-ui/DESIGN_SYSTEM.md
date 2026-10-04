# LegaKeys Production UI — Design System

## Experience architecture

Persistent shell:
1. Brand
2. Context switcher
3. Universal search
4. Constantyna
5. Notifications
6. Identity
7. Overflow

Primary surfaces:
1. Home
2. Places
3. Services
4. Activity
5. Workspaces
6. Identity

Layer model:
- L0 application background
- L1 page content
- L2 floating card
- L3 focused surface
- L4 full workflow

Navigation is for wayfinding. Toolbars and action controls operate on the current surface.

## Responsive model

Phone:
- five-item bottom navigation
- persistent top controls
- secondary navigation in a drawer
- one-column content
- full-width assistant drawer
- safe-area-aware viewport

Desktop:
- persistent left navigation
- contextual top bar
- bounded content width
- multi-column cards
- secondary actions in overflow

## Visual language

- deep navy foundation
- white structured typography
- green orientation and trust accent
- neutral white content surfaces
- restrained borders and elevation
- rounded floating cards
- one meaningful primary action per surface

## Accessibility

The implementation uses semantic controls, visible focus, logical headings, responsive reflow, separated touch targets and reduced-motion support. Production integration must continue through WCAG 2.2 AA verification.

## Governance UX

Truth states are not flattened into success.

Declared, verified, observed, inferred, proposed, unknown, unavailable, denied, pending, failed, expired, revoked and completed remain distinct.

Workspace visibility is not authority. Capability is not authority. Constantyna and GENESIS are not authority. Digital Twin state is not authority.

## Content

Labels are short and scannable. Explanations use plain language. Consequential actions expose scope and authorization before execution.
