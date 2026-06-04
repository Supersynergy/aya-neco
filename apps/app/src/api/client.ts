import type { Balances, LedgerEvent, Receipt, WodaEnvelope } from "@aya-neco/domain";

export type ApiState = {
  identity: {
    id: string;
    display_name: string;
    did: string;
    created_at: string;
  };
  balances: Balances;
  events: LedgerEvent[];
  ledger: {
    eventCount: number;
    latestHash: string;
    storage: "sqlite";
  };
  createdEvents?: LedgerEvent[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8787";

export async function getHealth() {
  return request<{ ok: boolean; service: string; version: string; storage: string }>("/health");
}

export async function getState() {
  return request<ApiState>("/state");
}

export async function resetDemo() {
  return request<ApiState>("/demo/reset", {
    method: "POST",
  });
}

export async function acceptCommonGood(input: {
  actor: string;
  hours: number;
  evidenceKey: string;
}) {
  return request<ApiState>("/contributions/common-good", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function createImpactClaim(input: {
  actor: string;
  kgCo2e: number;
  evidenceKey: string;
}) {
  return request<ApiState>("/impact-claims", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function applyDecay(actor = "gradido-engine") {
  return request<ApiState>("/decay", {
    method: "POST",
    body: JSON.stringify({ actor }),
  });
}

export async function prepareIotaProof() {
  return request<ApiState>("/iota/local-proof", {
    method: "POST",
  });
}

export async function getReceipt() {
  return request<Receipt>("/receipts/latest");
}

export async function getWodaEnvelope() {
  return request<WodaEnvelope>("/woda/envelope");
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}

