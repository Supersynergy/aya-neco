# AYA-NECO Workflow

AYA-NECO is now a local proof workflow, not only a visual prototype.

The core idea did not change: useful work becomes a transparent proof object. The
new version adds the missing runtime pieces around that idea: backend commands,
SQLite persistence, hash-chain receipts, and adapter boundaries for IOTA and
ONCE/WODA.

## What Each Tool Does

| Tool | Current role | It does not do yet |
|---|---|---|
| React app | Human workbench for entering contribution hours, impact claims, and export actions. | It is not the source of truth. |
| Bun API | Owns runtime commands for contributions, impact claims, decay, proof prep, receipts, and WODA envelopes. | It does not custody funds or talk to mainnet networks. |
| Domain package | Applies the demo rules: `20 GDD_DEMO/hour`, 50-hour cap, `5.61%` monthly decay, `10 kg CO2e = 1 PLANEDO_DEMO`. | It does not certify identity, MRV, or partner validation. |
| SQLite ledger | Stores every event in a local append-only hash chain. | It is not a distributed ledger. |
| JSON receipt | Exports balances, events, hashes, and disclaimers as an audit artifact. | It is not a signed legal certificate. |
| ONCE/WODA envelope | Wraps a receipt as a portable object/module boundary for WODA runtimes. | It does not make the demo an official WODA host integration by itself. |
| IOTA proof slot | Creates a local event that marks the latest hash as ready for future testnet notarization. | It does not submit to IOTA yet. |

## WODA In This Prototype

WODA is treated as a runtime boundary, not as the whole app.

Current WODA path:

```text
receipt
  -> wrapReceiptForWoda()
  -> woda.object-envelope.v0
  -> aya.neco.proof-lab module boundary
```

That means AYA-NECO can hand WODA one clear object:

- module name;
- module version;
- allowed commands;
- trust boundaries;
- original receipt payload.

This keeps the integration honest. WODA can route or mount the object later, but
AYA-NECO keeps the proof generation, safety rules, and ledger state explicit.

## Click Workflow

1. Open the app.
2. Confirm the backend shows `SQLite API online`.
3. Click `Create first receipt` or scroll to `Log common-good work`.
4. Enter hours and an evidence key.
5. Click `Accept contribution`.
6. The API writes three events:
   - `CommonGoodContributionAccepted`
   - `PublicBudgetIssuedDemo`
   - `AufIssuedDemo`
7. Optionally click `Create impact proof`.
8. Optionally click `Advance one month`.
9. Optionally click `Prepare IOTA proof`.
10. Export either:
   - `Export JSON receipt`
   - `Export WODA envelope`

## Data Workflow

```text
user action
  -> API command
  -> shared domain rule
  -> typed ledger event
  -> SHA-256 hash over stable payload
  -> SQLite append
  -> projected balances
  -> receipt export
  -> WODA envelope or future IOTA adapter
```

Balances are always projections from events. If the browser refreshes, the API
reloads from SQLite and recalculates the same state from the stored event list.

## Fit With The Original Version

The original version was the concept surface: a first screen that made AYA-NECO
understandable as a value loop.

The current version keeps that surface and adds operational depth:

| Original concept | Current implementation |
|---|---|
| Contribution becomes value | `Accept contribution` creates persisted demo issuance events. |
| Impact can share the same proof trail | `Create impact proof` creates a `PLANEDO_DEMO` event. |
| Ledger should be inspectable | The UI shows event titles, summaries, trust, amounts, and hashes. |
| Proof should be exportable | `/receipts/latest` and UI export generate JSON receipts. |
| WODA should be possible | `/woda/envelope` wraps the receipt as a WODA object envelope. |
| IOTA should be possible | `/iota/local-proof` prepares the latest hash for future notarization. |

The important architectural change is that the UI no longer invents state. It
calls the API; the API writes events; receipts and adapters derive from the
ledger.

## Safe Next Integrations

1. Add a real IOTA testnet adapter that accepts `LedgerEvent.hash` and stores the returned proof id.
2. Add reviewer signatures so `demo-prevalidated` can become `community-reviewed`.
3. Add MRV evidence fields before any `expert-mrv-ready` impact claim.
4. Add a WODA runtime shim that calls the existing API commands instead of embedding the UI.
