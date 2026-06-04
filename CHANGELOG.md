# Changelog

## 0.2.0 - 2026-06-04

### Added

- Real Bun HTTP API under `apps/api`.
- SQLite-backed persistent ledger store.
- Shared domain package under `packages/domain`.
- Frontend API client for backend state, contribution, impact, decay, IOTA-prep, receipt export, WODA-envelope export, and reset.
- Backend status panel in the UI.
- API/domain tests that prove persistence and receipt/envelope generation.

### Changed

- Receipt schema moved from `aya-neco.receipt.v0` to `aya-neco.receipt.v1`.
- `just dev` now starts API and app together.
- CI now checks backend/domain structure as well as build/tests.

## 0.1.0 - 2026-06-04

### Added

- Local-first AYA-NECO proof lab UI.
- Gradido-inspired common-good issuance and decay simulation.
- Planedo-inspired environmental impact conversion.
- Hash-chain ledger events and JSON receipt export.
- UniversalUI-sourced local Lucide icon registry.
- ONCE/WODA module manifest and envelope examples.
- GitHub-ready README, docs, CI, license, notice, and social preview assets.

### Safety

- Demo-only boundaries are explicit in UI and docs.
- No token sale, no custody, no official partner claims, and no eIDAS/KYC claims.
