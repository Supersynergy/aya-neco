import { afterEach, describe, expect, it } from "bun:test";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createApi } from "../src/http";

function tempDbPath() {
  return join(tmpdir(), `aya-neco-${crypto.randomUUID()}.sqlite`);
}

async function json(response: Response) {
  expect(response.headers.get("content-type")).toContain("application/json");
  return response.json();
}

describe("AYA-NECO API backend", () => {
  const createdDbs: string[] = [];

  afterEach(() => {
    for (const path of createdDbs.splice(0)) {
      rmSync(path, { force: true });
    }
  });

  it("persists contribution, impact, decay, receipt, and WODA envelope through HTTP", async () => {
    const dbPath = tempDbPath();
    createdDbs.push(dbPath);
    const api = createApi({ dbPath });

    expect((await json(await api.fetch(new Request("http://api.test/health")))).ok).toBe(true);

    const commonGood = await json(
      await api.fetch(
        new Request("http://api.test/contributions/common-good", {
          method: "POST",
          body: JSON.stringify({
            actor: "aya-demo-user",
            hours: 2,
            evidenceKey: "community-workshop-note",
          }),
        }),
      ),
    );
    expect(commonGood.createdEvents).toHaveLength(3);
    expect(commonGood.events).toHaveLength(3);
    expect(commonGood.balances.gdd).toBe(40);

    const impact = await json(
      await api.fetch(
        new Request("http://api.test/impact-claims", {
          method: "POST",
          body: JSON.stringify({
            actor: "aya-demo-user",
            kgCo2e: 25,
            evidenceKey: "garden-compost-note",
          }),
        }),
      ),
    );
    expect(impact.balances.planedo).toBe(2.5);

    const decay = await json(
      await api.fetch(
        new Request("http://api.test/decay", {
          method: "POST",
          body: JSON.stringify({ actor: "gradido-engine" }),
        }),
      ),
    );
    expect(decay.createdEvents[0].type).toBe("GddDecayApplied");
    expect(decay.events[0].type).toBe("GddDecayApplied");

    const state = await json(await api.fetch(new Request("http://api.test/state")));
    expect(state.events.length).toBe(5);
    expect(state.balances.proofs).toBe(5);

    const receipt = await json(await api.fetch(new Request("http://api.test/receipts/latest")));
    expect(receipt.schema).toBe("aya-neco.receipt.v1");
    expect(receipt.events).toHaveLength(5);

    const envelope = await json(await api.fetch(new Request("http://api.test/woda/envelope")));
    expect(envelope.module).toBe("aya.neco.proof-lab");
    expect(envelope.payload.schema).toBe("aya-neco.receipt.v1");
    api.store.close();
  });

  it("rejects events that do not connect to the current ledger hash", async () => {
    const dbPath = tempDbPath();
    createdDbs.push(dbPath);
    const api = createApi({ dbPath });
    const valid = await json(
      await api.fetch(
        new Request("http://api.test/contributions/common-good", {
          method: "POST",
          body: JSON.stringify({
            actor: "aya-demo-user",
            hours: 1,
            evidenceKey: "community-workshop-note",
          }),
        }),
      ),
    );

    expect(valid.createdEvents).toHaveLength(3);
    expect(() => {
      api.store.appendEvents([
        {
          ...valid.createdEvents[0],
          id: crypto.randomUUID(),
          hash: crypto.randomUUID(),
          previousHash: "wrong-previous-hash",
        },
      ]);
    }).toThrow("Invalid ledger chain");
    api.store.close();
  });
});
