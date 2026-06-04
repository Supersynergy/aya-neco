# Architecture

AYA-NECO uses a small, inspectable architecture.

<p align="center">
  <img src="assets/architecture.svg" alt="AYA-NECO architecture" width="100%">
</p>

## Layers

| Layer | Current file | Responsibility |
|---|---|---|
| UI | `apps/app/src/App.tsx` | User-facing proof lab. |
| API | `apps/api/src/http.ts` | HTTP routes for state, contributions, impact claims, decay, receipts, and WODA envelopes. |
| Store | `apps/api/src/store.ts` | SQLite persistence for identity and ledger events. |
| Components | `apps/app/src/components` | Reusable metric, route, ledger, and graphic panels. |
| Domain rules | `packages/domain/src/index.ts` | Issuance, decay, conversion, event hashing, receipt and WODA envelope creation. |
| Icon registry | `apps/app/src/icons/Icon.tsx` | Local UniversalUI/Lucide icon rendering. |
| Examples | `examples/` | Receipts and ONCE/WODA inputs. |
| ONCE/WODA package | `packages/once-woda` | Manifest and adapter contract. |
| Scripts | `scripts/` | Example generation and envelope conversion. |

## Data Flow

```mermaid
sequenceDiagram
  participant User
  participant UI
  participant API
  participant Domain
  participant Ledger
  participant Export
  participant WODA
  User->>UI: Submit contribution or impact claim
  UI->>API: POST command
  API->>Domain: Apply rule
  Domain->>Ledger: Create event payload
  Ledger->>Ledger: Hash event with previous hash
  Ledger->>API: Persist event in SQLite
  API->>UI: Return projected state
  UI->>Export: Download backend receipt
  Export->>WODA: Optional envelope bridge
```

## Event Rules

The app does not mutate balances directly as source of truth.

It creates events first, then projects balances:

- `DemoIdentityCreated`
- `CommonGoodContributionAccepted`
- `PublicBudgetIssuedDemo`
- `AufIssuedDemo`
- `ImpactClaimAcceptedDemo`
- `GddDecayApplied`
- `IotaProofPreparedDemo`

The API appends event bundles only when each event points to the current previous hash. SQLite persists the chain; receipts and WODA envelopes are derived by replaying stored events.

## Trust Levels

Trust levels prevent overclaiming:

| Level | Meaning |
|---|---|
| `self-declared` | User or demo system made the claim. |
| `demo-prevalidated` | Demo rules accepted the event. |
| `community-reviewed` | Future community validation. |
| `expert-mrv-ready` | Future external MRV path. |

## Adapter Direction

Adapters should consume events and receipts, not UI state.

Correct boundary:

```text
Receipt JSON -> adapter -> external proof/runtime
```

Avoid:

```text
External runtime -> DOM scraping -> hidden app state
```
