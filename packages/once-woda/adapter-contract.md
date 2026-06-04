# ONCE/WODA Adapter Contract

AYA-NECO exposes receipts and commands.

## Inputs

### `ContributionSubmitted`

```json
{
  "actor": "aya-demo-user",
  "hours": 2,
  "evidence_key": "community-workshop-note"
}
```

### `ImpactClaimSubmitted`

```json
{
  "actor": "aya-demo-user",
  "kg_co2e": 25,
  "method_version": "demo-v0",
  "evidence_key": "garden-compost-note"
}
```

## Output: `WodaObjectEnvelope`

```json
{
  "woda_schema": "woda.object-envelope.v0",
  "module": "aya.neco.proof-lab",
  "kind": "receipt",
  "payload": {}
}
```

## Boundary

The adapter must not upgrade trust. Trust upgrades require explicit validation events.

