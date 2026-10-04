# LegaKeys — Production UI

The first production-oriented experience shell for LegaKeys.

## Product surface

The user should experience a small number of durable surfaces, not the 17 internal architecture domains:

- Home — what matters now
- Places — where I belong
- Services — what I can use
- Activity — what happened
- Workspaces — where I operate
- Identity — who I am
- Constantyna — understand, clarify, guide and prepare

## Shell

Global controls are persistent: brand, context, universal search, Constantyna, notifications, identity and overflow.

## Truth contract

The UI never invents live location, provider availability, transactions, events or authorization. Unknown, declared and unavailable states remain visible.

## Governance contract

The interface is not the authority layer. A visible action does not imply authorization.

Canonical consequential path:

UI intent → context → capability → authorization → action → event → evidence → outcome

## Current scope

This commit establishes the executable UI foundation and interaction model. Live Neon bindings, production authentication/session wiring, provider adapters, authorization execution and deployment verification remain separate integration gates.
