# LEGAKEYS — PLATFORM FOUNDATION UX

## Design target

The interface should feel like a mature operating system for life, places and work — not a property-management portal, a generic SaaS dashboard or a pile of mini-apps.

## Mobile-first shell

The primary mobile experience is designed around a modern phone viewport.

### Shell

```
┌─────────────────────────────────────┐
│ LegaKeys       Context     •••      │
│                                     │
│ Search / Ask LegaKeys               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ What needs your attention?      │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Quick actions                       │
│ [Access] [Pay] [Ride] [Request]     │
│                                     │
│ Today                                │
│ ┌─────────────────────────────────┐ │
│ │ Real event / real state         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Upcoming / pending              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Home Places Services Activity Work  │
└─────────────────────────────────────┘
```

This is a conceptual model, not a claim that these controls are already implemented.

## Context-first experience

The active context should always be visible.

Example:

**TSAVO · Home**

The participant can switch to:

- another community
- another unit
- LegaKeys Workspace
- Community Operating Workspace
- another authorized place
- another active operational context

Changing context changes what is relevant, not who the participant is.

## Universal command surface

The assistant/search surface should support natural requests:

- “Show my pending maintenance requests.”
- “Who is expected at my unit today?”
- “Pay this merchant.”
- “Find an available facility.”
- “What changed in my building?”
- “Create a work order.”
- “Why was this access request denied?”
- “Show evidence for this incident.”

The platform translates the human request into the governed execution model.

## Status language

Use explicit state labels:

- Verified
- Available
- Pending
- Requires approval
- Scheduled
- In progress
- Completed
- Failed
- Expired
- Revoked
- Unknown
- Unavailable

Never use a positive visual state to imply completion when the event has not occurred.

## Mature visual behavior

The experience should:

- prioritize one task at a time
- use whitespace
- preserve hierarchy
- avoid oversized dashboards
- avoid excessive gradients
- avoid fake AI animations
- avoid decorative charts without operational meaning
- avoid dense tables on mobile
- use sheets and sub-pages for detail
- maintain visible back navigation
- preserve state during navigation
- provide skeleton/loading states
- show errors as recoverable states

## Accessibility

Critical actions must remain understandable without color.

Green is an orientation/accent signal, not the only way to communicate success.

Every consequential action should have:

- clear label
- current state
- scope
- confirmation where required
- result
- evidence reference when applicable

## Desktop / operator experience

The same platform foundation expands into a richer workspace:

```
┌────────────┬─────────────────────────────────────────┐
│ NAVIGATION │ CONTEXT / SEARCH / ACCOUNT              │
│            ├─────────────────────────────────────────┤
│ Home       │                                         │
│ People     │ Current operational view                │
│ Places     │                                         │
│ Work       │ Requests / tasks / events / twin state │
│ Services   │                                         │
│ Access     │                                         │
│ Intelligence                                        │
│ Evidence   │                                         │
│ Governance │                                         │
└────────────┴─────────────────────────────────────────┘
```

Consumer simplicity and operator depth are two views over the same platform primitives.

## Product rule

**Do not expose architecture merely because architecture exists.**

Expose complexity only when the user's purpose requires it.
