# Best Practices

## Product

- Ship the smallest complete value loop.
- Keep demo and production language separate.
- Put "why" in docs and "state" in the UI.
- Make every claim inspectable.

## Domain Rules

- Rule changes require tests.
- Use event sourcing for explainability.
- Never hide balance changes.
- Use trust levels instead of binary "valid/invalid" labels.

## UI

- Use cards for repeated items, not page sections.
- Keep dense screens calm.
- Icons must identify actions or state.
- Motion should only explain state, proof, progress, or completion.
- Verify desktop and mobile screenshots.

## ONCE/WODA

- Expose commands and receipts.
- Use manifests as contracts.
- Keep object envelopes small.
- Do not make WODA depend on browser DOM.
- Do not upgrade trust without explicit signatures or validation.

## IOTA

- Start by notarizing hashes.
- Store returned proof id separately from the local hash.
- Keep testnet/localnet config optional.
- Avoid production assets until legal and security review exists.

## Legal/Safety

- No token sale.
- No redemption promise.
- No return promise.
- No custody.
- No official partner branding until approved.
- No eIDAS/KYC claim until certified.

