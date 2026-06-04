# ONCE/WODA Example

Validate the module:

```bash
node scripts/validate-once-woda-manifest.mjs
```

Wrap a receipt:

```bash
node scripts/once-woda-envelope.mjs examples/receipts/common-good.json
```

The output is a small object envelope that WODA can route without needing to know the React UI.

