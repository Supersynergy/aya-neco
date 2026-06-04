# ADR: UniversalUI-Driven First Interface

Date: 2026-06-04
Status: Accepted

## Context

AYA-NECO needs a credible first UI that proves the value loop without becoming a speculative finance product.

The local UniversalUI stack already caches web UI sources and icon packs under `/Users/master/BASE/projects/universalui/ui/stack`.

## Decision

Use UniversalUI as the design source and avoid heavy novelty effects in the MVP.

Chosen surface:

- Dense product UI.
- Local React/Vite app.
- CSS variable token system.
- Local component registry.
- Lucide icons copied from the UniversalUI cache.
- Motion limited to state, proof, and progress meaning.

Chosen icons:

- `wallet`: wallet and balances.
- `hand-heart`: common-good contribution.
- `leaf`, `sprout`, `recycle`: environmental impact.
- `badge-check`, `shield-check`, `file-check`: trust and proof.
- `network`, `route`: IOTA and ONCE/WODA adapter flow.
- `database`: append-only ledger.
- `landmark`: public budget.
- `coins`, `circle-dollar-sign`, `badge-euro`: demo units.

## Consequences

- The app has no runtime icon dependency.
- The icon choices are auditable and pinned to the local UniversalUI cache.
- The UI can later migrate to shadcn/ui, Base UI, Radix, Motion, and Number Flow if the prototype needs heavier interaction polish.

