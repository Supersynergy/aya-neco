# @aya-neco/once-woda

Concrete ONCE/WODA boundary for AYA-NECO.

Use:

```bash
node scripts/validate-once-woda-manifest.mjs
node scripts/once-woda-envelope.mjs examples/receipts/common-good.json
```

This package intentionally contains a manifest and contract first. Runtime-specific WODA glue should be added after the host runtime and command API are confirmed.

