# AYA-NECO

Local-first open-source prototype for a humane, impact-based wallet.

AYA-NECO combines:

- Gradido-inspired common-good reward logic.
- Planedo-inspired environmental impact units.
- IOTA-ready proof and notarization slots.
- ONCE/WODA-style modular adapter boundaries.
- UniversalUI-sourced icon and interface decisions.

This is a research/demo app. It is not money, not a token sale, not a custody wallet, and not an official Gradido, Planedo, IOTA, or ONCE product.

## Run

```bash
just setup
just dev
```

Open the local URL printed by Vite.

## Verify

```bash
just check
```

## UI Source

The first UI slice uses the local UniversalUI cache:

- Manifest: `/Users/master/BASE/projects/universalui/ui/stack/MANIFEST.tsv`
- Icons: `/Users/master/BASE/projects/universalui/ui/stack/icons/lucide/source/icons`
- ADR: `/Users/master/BASE/projects/universalui/docs/adr/2026-06-04-local-ui-stack-cache.md`

Selected icons are copied into `apps/app/src/assets/icons/lucide`.

