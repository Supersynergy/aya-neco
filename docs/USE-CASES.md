# Use Cases

AYA-NECO is a prototype surface. These are the highest-leverage paths.

## 1. Community Contribution Wallet

Use it to show how common-good work could become visible.

Flow:

1. Member creates a demo identity.
2. Member logs two hours of community support.
3. App issues `40 GDD_DEMO`.
4. App mirrors the same amount into public/AUF demo funds.
5. Receipt is exported.

What to replace later:

- demo identity -> real member identity;
- demo acceptance -> community review;
- local hash -> IOTA proof;
- JSON export -> signed receipt.

## 2. Environmental Impact Receipt

Use it to show how CO2e impact can enter a common ledger without pretending validation happened.

Flow:

1. User enters `25 kg CO2e`.
2. App converts it to `2.5 PLANEDO_DEMO`.
3. Event trust level stays `demo-prevalidated`.
4. Evidence key is stored.
5. Receipt is exported.

What to replace later:

- self-declared estimate -> MRV method;
- demo-prevalidated -> external validator signature;
- local event -> partner register entry.

## 3. IOTA Proof Demo

Use it to notarize event hashes.

Flow:

1. Run local flow.
2. Take `LedgerEvent.hash`.
3. Submit hash through an IOTA adapter.
4. Store returned proof id in the event.
5. Show explorer/proof link in the UI.

First safe integration:

- notarize hashes only;
- do not mint production assets;
- do not custody tokens.

## 4. ONCE/WODA Module

Use it to expose AYA-NECO as a portable module.

Flow:

1. Validate `packages/once-woda/module.manifest.json`.
2. Convert a receipt into an envelope.
3. Mount commands into WODA:
   - `aya.issueCommonGood`
   - `aya.createImpactClaim`
   - `aya.applyDecay`
   - `aya.exportReceipt`
4. Keep the UI as one consumer, not the whole product.

## 5. Policy Sandbox

Use it to compare value rules.

Examples:

- change GDD/hour;
- change monthly cap;
- change decay rate;
- change trust levels;
- compare effect on balances.

Rule:

Every policy change needs a test.

