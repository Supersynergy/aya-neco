# Quickstart

## 1. Install

```bash
git clone https://github.com/Supersynergy/aya-neco
cd aya-neco
just setup
```

## 2. Verify

```bash
just check
```

## 3. Run

```bash
just dev
```

Open:

```bash
http://127.0.0.1:5173/
```

## 4. Try The Demo

1. Click `Accept contribution`.
2. Confirm `CommonGoodContributionAccepted` appears in the ledger.
3. Click `Create impact proof`.
4. Confirm `ImpactClaimAcceptedDemo` appears.
5. Click `Advance one month`.
6. Confirm `GddDecayApplied` appears.
7. Click `Export JSON receipt`.

## 5. Generate Scripted Examples

```bash
just examples
```

Generated files:

- `data/exports/demo-receipt.json`
- `data/exports/once-woda-envelope.json`

