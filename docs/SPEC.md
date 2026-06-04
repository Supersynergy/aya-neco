# AYA-NECO UI Spec

## Goal

Build the first testable full-stack AYA-NECO prototype: one person, one contribution, one impact claim, one persisted ledger proof, one exportable receipt, and one ONCE/WODA envelope.

## Architecture Requirement

The UI must not be the source of truth.

Required runtime:

- `apps/api`: Bun HTTP API.
- `apps/api/data/aya-neco.sqlite`: local SQLite ledger in development.
- `packages/domain`: shared event, projection, receipt, and WODA-envelope rules.
- `apps/app`: React UI that calls the API.

## First Screen

The first screen is the product, not a landing page. It shows:

- demo identity;
- balances;
- contribution entry;
- impact entry;
- ledger events;
- proof route;
- ONCE/WODA adapter status.

## Acceptance Criteria

- Local demo works without IOTA credentials.
- Common-good contribution issues `GDD_DEMO`.
- Environmental contribution issues `PLANEDO_DEMO`.
- Monthly decay can be simulated.
- Event hashes are visible.
- Export produces a JSON receipt.
- UI uses local UniversalUI icon assets.
- Backend exposes `/health`, `/state`, `/contributions/common-good`, `/impact-claims`, `/decay`, `/receipts/latest`, and `/woda/envelope`.
- Ledger events persist in SQLite across browser refreshes.
- Build, typecheck, and tests pass.
