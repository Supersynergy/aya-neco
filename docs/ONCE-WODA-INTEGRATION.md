# ONCE/WODA Integration

AYA-NECO should enter ONCE/WODA as a small object/module, not as a large app blob.

The rule:

Expose API-backed domain commands and receipt envelopes first. Wrap the UI later.

## Integration Shape

```text
AYA API command
  -> shared domain rule
  -> ledger event
  -> SQLite event chain
  -> receipt
  -> ONCE/WODA envelope
  -> WODA object/runtime
```

## Files

- `packages/once-woda/module.manifest.json`
- `packages/once-woda/adapter-contract.md`
- `apps/api/src/http.ts`
- `packages/domain/src/index.ts`
- `examples/once-woda/aya-neco.module.json`
- `scripts/validate-once-woda-manifest.mjs`
- `scripts/once-woda-envelope.mjs`

## Step 1: Validate The Module Manifest

```bash
node scripts/validate-once-woda-manifest.mjs
```

The manifest declares:

- module name;
- commands;
- inputs;
- outputs;
- safety boundaries;
- runtime assumptions.

## Step 2: Convert A Receipt Into A WODA Envelope

```bash
node scripts/once-woda-envelope.mjs examples/receipts/common-good.json
```

Output shape:

```json
{
  "woda_schema": "woda.object-envelope.v0",
  "module": "aya.neco.proof-lab",
  "kind": "receipt",
  "commands": ["aya.exportReceipt"],
  "payload": {}
}
```

## Step 3: Mount Commands

Map these AYA commands into WODA through the API/domain boundary:

| Command | Input | Output |
|---|---|---|
| `aya.issueCommonGood` | hours, evidence key, actor | persisted ledger events |
| `aya.createImpactClaim` | kg CO2e, method, evidence key | persisted ledger event |
| `aya.applyDecay` | actor | persisted ledger event |
| `aya.prepareIotaProof` | latest hash | persisted proof-prep event |
| `aya.exportReceipt` | stored event list | receipt |
| `aya.wrapReceiptForWoda` | receipt | WODA envelope |

## Step 4: Keep Trust Boundaries Explicit

WODA can route objects, but it should not silently upgrade trust.

Allowed:

- `self-declared` -> `demo-prevalidated` when demo rule passes;
- `demo-prevalidated` -> `community-reviewed` when a configured reviewer signs;
- `community-reviewed` -> `expert-mrv-ready` when MRV evidence exists.

Not allowed:

- demo receipt -> official Planedo claim;
- local identity -> eIDAS identity;
- local hash -> IOTA proof unless submitted and confirmed.

## Step 5: Add IOTA Later

The clean path:

1. Keep local hash chain.
2. Add IOTA adapter that accepts event hashes.
3. Return proof id.
4. Store proof id in receipt.
5. Let WODA envelope carry both local hash and IOTA proof id.

Do not fork IOTA for the first working integration.
