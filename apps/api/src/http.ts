import {
  createCommonGoodEvents,
  createDecayEvent,
  createImpactClaimEvent,
  createLedgerEvent,
  wrapReceiptForWoda,
} from "@aya-neco/domain";
import { LedgerStore } from "./store";

export type ApiOptions = {
  dbPath?: string;
};

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

export function createApi(options: ApiOptions = {}) {
  const store = new LedgerStore(options.dbPath ?? "data/aya-neco.sqlite");

  return {
    store,
    async fetch(request: Request) {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: jsonHeaders });
      }

      try {
        return await route(request, store);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown API error";
        return json({ error: message }, 500);
      }
    },
  };
}

async function route(request: Request, store: LedgerStore) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "") || "/";

  if (request.method === "GET" && path === "/health") {
    return json({
      ok: true,
      service: "aya-neco-api",
      version: "0.2.0",
      storage: "sqlite",
    });
  }

  if (request.method === "GET" && path === "/state") {
    return json(store.state());
  }

  if (request.method === "POST" && path === "/demo/reset") {
    store.resetDemo();
    return json(store.state());
  }

  if (request.method === "POST" && path === "/contributions/common-good") {
    const body = await readJson(request);
    const events = await createCommonGoodEvents({
      actor: String(body.actor ?? "aya-demo-user"),
      hours: Number(body.hours ?? 0),
      evidenceKey: String(body.evidenceKey ?? "demo-evidence"),
      previousHash: store.latestHash(),
    });
    store.appendEvents(events);
    return json({ ...store.state(), createdEvents: events });
  }

  if (request.method === "POST" && path === "/impact-claims") {
    const body = await readJson(request);
    const event = await createImpactClaimEvent({
      actor: String(body.actor ?? "aya-demo-user"),
      kgCo2e: Number(body.kgCo2e ?? 0),
      evidenceKey: String(body.evidenceKey ?? "demo-evidence"),
      previousHash: store.latestHash(),
    });
    store.appendEvents([event]);
    return json({ ...store.state(), createdEvents: [event] });
  }

  if (request.method === "POST" && path === "/decay") {
    const body = await readJson(request);
    const currentGddBalance = store.state().balances.gdd;
    const event = await createDecayEvent({
      actor: String(body.actor ?? "gradido-engine"),
      currentGddBalance,
      previousHash: store.latestHash(),
    });
    store.appendEvents([event]);
    return json({ ...store.state(), createdEvents: [event] });
  }

  if (request.method === "POST" && path === "/iota/local-proof") {
    const event = await createLedgerEvent({
      type: "IotaProofPreparedDemo",
      actor: "iota-adapter",
      detail: "Prepared latest ledger hash for IOTA testnet notarization",
      trust: "demo-prevalidated",
      previousHash: store.latestHash(),
      proof: "iota-ready",
      payload: {
        latestHash: store.latestHash(),
        adapter: "iota-testnet-placeholder",
      },
    });
    store.appendEvents([event]);
    return json({ ...store.state(), createdEvents: [event] });
  }

  if (request.method === "GET" && path === "/receipts/latest") {
    return json(store.receipt());
  }

  if (request.method === "GET" && path === "/woda/envelope") {
    return json(wrapReceiptForWoda(store.receipt()));
  }

  return json({ error: `Route not found: ${request.method} ${path}` }, 404);
}

async function readJson(request: Request) {
  const text = await request.text();
  if (!text.trim()) return {};
  return JSON.parse(text) as Record<string, unknown>;
}

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value, null, 2), {
    status,
    headers: jsonHeaders,
  });
}
