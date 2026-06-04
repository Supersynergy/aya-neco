export type TrustLevel =
  | "self-declared"
  | "demo-prevalidated"
  | "community-reviewed"
  | "expert-mrv-ready";

export type LedgerEvent = {
  id: string;
  type: string;
  actor: string;
  asset?: "GDD_DEMO" | "PLANEDO_DEMO" | "AUF_DEMO" | "PUBLIC_DEMO";
  amount?: number;
  detail: string;
  trust: TrustLevel;
  hash: string;
  proof: "local-hash" | "iota-ready";
  createdAt: string;
};

export type Balances = {
  gdd: number;
  planedo: number;
  auf: number;
  publicBudget: number;
  proofs: number;
};

export const GDD_PER_HOUR = 20;
export const GDD_MONTHLY_HOUR_CAP = 50;
export const GRADIDO_MONTHLY_DECAY_RATE = 0.0561;
export const KG_CO2E_PER_PLANEDO = 10;

export function issueCommonGood(hours: number) {
  const cappedHours = Math.min(Math.max(hours, 0), GDD_MONTHLY_HOUR_CAP);
  return {
    person: cappedHours * GDD_PER_HOUR,
    publicBudget: cappedHours * GDD_PER_HOUR,
    auf: cappedHours * GDD_PER_HOUR,
    cappedHours,
  };
}

export function planedoFromKg(kgCo2e: number) {
  return Math.max(kgCo2e, 0) / KG_CO2E_PER_PLANEDO;
}

export function applyMonthlyDecay(balance: number) {
  const decay = Math.max(balance, 0) * GRADIDO_MONTHLY_DECAY_RATE;
  return {
    decay,
    nextBalance: Math.max(balance - decay, 0),
  };
}

export async function hashPayload(payload: unknown) {
  const encoded = new TextEncoder().encode(stableStringify(payload));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
    .join(",")}}`;
}

export async function createLedgerEvent(
  input: Omit<LedgerEvent, "hash" | "createdAt" | "id">,
  previousHash: string,
): Promise<LedgerEvent> {
  const createdAt = new Date().toISOString();
  const hash = await hashPayload({ ...input, createdAt, previousHash });

  return {
    ...input,
    id: hash.slice(0, 10),
    hash,
    createdAt,
  };
}

export function exportReceipt(events: LedgerEvent[], balances: Balances) {
  return {
    schema: "aya-neco.receipt.v0",
    generatedAt: new Date().toISOString(),
    disclaimer: "Research/demo only. No monetary claim.",
    balances,
    events,
  };
}

