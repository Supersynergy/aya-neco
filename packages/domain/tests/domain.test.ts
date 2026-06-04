import { describe, expect, it } from "bun:test";
import {
  createCommonGoodEvents,
  createDecayEvent,
  createImpactClaimEvent,
  exportReceipt,
  projectBalances,
  wrapReceiptForWoda,
} from "../src/index";

describe("shared domain event model", () => {
  it("creates a chained common-good event bundle with person, public, and AUF balances", async () => {
    const events = await createCommonGoodEvents({
      actor: "aya-demo-user",
      hours: 2,
      evidenceKey: "community-workshop-note",
      previousHash: "genesis",
      now: "2026-06-04T00:00:00.000Z",
    });

    expect(events.map((event) => event.type)).toEqual([
      "CommonGoodContributionAccepted",
      "PublicBudgetIssuedDemo",
      "AufIssuedDemo",
    ]);
    expect(events.map((event) => event.amount)).toEqual([40, 40, 40]);
    expect(events[1].previousHash).toBe(events[0].hash);
    expect(events[2].previousHash).toBe(events[1].hash);
    expect(projectBalances(events)).toMatchObject({
      gdd: 40,
      publicBudget: 40,
      auf: 40,
      proofs: 3,
    });
  });

  it("creates impact and decay events that project into a receipt and WODA envelope", async () => {
    const impact = await createImpactClaimEvent({
      actor: "aya-demo-user",
      kgCo2e: 25,
      evidenceKey: "garden-compost-note",
      previousHash: "genesis",
      now: "2026-06-04T00:00:00.000Z",
    });
    const decay = await createDecayEvent({
      actor: "gradido-engine",
      currentGddBalance: 1000,
      previousHash: impact.hash,
      now: "2026-07-04T00:00:00.000Z",
    });
    const events = [impact, decay];
    const receipt = exportReceipt(events, projectBalances(events), "2026-07-04T00:00:00.000Z");
    const envelope = wrapReceiptForWoda(receipt);

    expect(impact.amount).toBe(2.5);
    expect(decay.amount).toBeCloseTo(-56.1);
    expect(receipt.schema).toBe("aya-neco.receipt.v1");
    expect(envelope.woda_schema).toBe("woda.object-envelope.v0");
    expect(envelope.payload.events).toHaveLength(2);
  });
});
