import { readFileSync } from "node:fs";

const receiptPath = process.argv[2];

if (!receiptPath) {
  console.error("Usage: node scripts/once-woda-envelope.mjs <receipt.json>");
  process.exit(1);
}

const receipt = JSON.parse(readFileSync(receiptPath, "utf8"));

if (receipt.schema !== "aya-neco.receipt.v1") {
  console.error("Unsupported receipt schema.");
  process.exit(1);
}

const envelope = {
  woda_schema: "woda.object-envelope.v0",
  module: "aya.neco.proof-lab",
  module_version: "0.2.0",
  kind: "receipt",
  commands: ["aya.exportReceipt", "aya.wrapReceiptForWoda"],
  trust_boundaries: [
    "demo units only",
    "no custody",
    "no official validation claim",
    "no eIDAS/KYC claim",
    "no token sale"
  ],
  payload: receipt
};

console.log(JSON.stringify(envelope, null, 2));
