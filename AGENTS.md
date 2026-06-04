# AGENTS.md

## Project Rule

AYA-NECO is a local-first prototype. Keep production-value, custody, token-sale, eIDAS, and official partner claims out of the MVP.

## Structure

- Deployable UI lives in `apps/app`.
- Shared domain logic belongs in `packages/domain` once it outgrows the app slice.
- Icon choices are sourced from the local UniversalUI cache at `/Users/master/BASE/projects/universalui/ui/stack/icons`.
- UI decisions are documented in `docs/adr`.

## Commands

- `just setup`
- `just dev`
- `just check`
- `just build`

## Design Bar

Use a dense product UI: calm, inspectable, trust-building. Effects must explain state, proof, flow, or completion.

