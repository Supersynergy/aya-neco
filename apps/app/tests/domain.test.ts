import { describe, expect, it } from "vitest";
import {
  applyMonthlyDecay,
  createLedgerEvent,
  issueCommonGood,
  planedoFromKg,
} from "../src/domain/economy";

describe("Gradido-inspired common-good rules", () => {
  it("issues 20 GDD per hour and mirrors public/AUF demo funds", () => {
    expect(issueCommonGood(2)).toEqual({
      person: 40,
      publicBudget: 40,
      auf: 40,
      cappedHours: 2,
    });
  });

  it("caps active basic income at 50 hours per month", () => {
    expect(issueCommonGood(99).person).toBe(1000);
  });

  it("applies monthly transience at 5.61 percent", () => {
    const result = applyMonthlyDecay(1000);
    expect(result.decay).toBeCloseTo(56.1);
    expect(result.nextBalance).toBeCloseTo(943.9);
  });
});

describe("Planedo-inspired impact rules", () => {
  it("maps 10 kg CO2e to one demo unit", () => {
    expect(planedoFromKg(25)).toBe(2.5);
  });

  it("does not create negative demo units", () => {
    expect(planedoFromKg(-10)).toBe(0);
  });
});

describe("ledger proof events", () => {
  it("creates deterministic-size SHA-256 event hashes", async () => {
    const event = await createLedgerEvent(
      {
        type: "ProofCreated",
        actor: "test",
        detail: "unit test",
        trust: "self-declared",
        proof: "local-hash",
      },
      "genesis",
    );

    expect(event.hash).toHaveLength(64);
    expect(event.id).toHaveLength(10);
  });
});

