import { createHash } from "node:crypto";

function hash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

const event = {
  type: "CommonGoodContributionAccepted",
  actor: "aya-demo-user",
  asset: "GDD_DEMO",
  amount: 40,
  detail: "2h commons work, community-workshop-note",
  trust: "demo-prevalidated",
  proof: "local-hash",
  createdAt: "2026-06-04T00:00:00.000Z"
};

event.hash = hash(event);
event.id = event.hash.slice(0, 10);

const receipt = {
  schema: "aya-neco.receipt.v0",
  generatedAt: "2026-06-04T00:00:00.000Z",
  disclaimer: "Research/demo only. No monetary claim.",
  balances: {
    gdd: 360,
    planedo: 7.5,
    auf: 360,
    publicBudget: 360,
    proofs: 3
  },
  events: [event]
};

console.log(JSON.stringify(receipt, null, 2));

