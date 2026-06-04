export type Asset = "GDD_DEMO" | "PLANEDO_DEMO" | "AUF_DEMO" | "PUBLIC_DEMO";

export type TrustLevel =
  | "self-declared"
  | "demo-prevalidated"
  | "community-reviewed"
  | "expert-mrv-ready";

export type ProofKind = "local-hash" | "iota-ready" | "iota-submitted-demo";

export type LedgerEvent = {
  id: string;
  type: string;
  actor: string;
  asset?: Asset;
  amount?: number;
  detail: string;
  trust: TrustLevel;
  hash: string;
  previousHash: string;
  proof: ProofKind;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type Balances = {
  gdd: number;
  planedo: number;
  auf: number;
  publicBudget: number;
  proofs: number;
};

export type Receipt = {
  schema: "aya-neco.receipt.v1";
  generatedAt: string;
  disclaimer: string;
  balances: Balances;
  events: LedgerEvent[];
};

export type WodaEnvelope = {
  woda_schema: "woda.object-envelope.v0";
  module: "aya.neco.proof-lab";
  module_version: string;
  kind: "receipt";
  commands: string[];
  trust_boundaries: string[];
  payload: Receipt;
};

export const GDD_PER_HOUR = 20;
export const GDD_MONTHLY_HOUR_CAP = 50;
export const GRADIDO_MONTHLY_DECAY_RATE = 0.0561;
export const KG_CO2E_PER_PLANEDO = 10;

export function issueCommonGood(hours: number) {
  const cappedHours = Math.min(Math.max(Number(hours) || 0, 0), GDD_MONTHLY_HOUR_CAP);
  const amount = cappedHours * GDD_PER_HOUR;

  return {
    person: amount,
    publicBudget: amount,
    auf: amount,
    cappedHours,
  };
}

export function planedoFromKg(kgCo2e: number) {
  return Math.max(Number(kgCo2e) || 0, 0) / KG_CO2E_PER_PLANEDO;
}

export function applyMonthlyDecay(balance: number) {
  const decay = Math.max(Number(balance) || 0, 0) * GRADIDO_MONTHLY_DECAY_RATE;
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
  input: Omit<LedgerEvent, "hash" | "id" | "previousHash" | "createdAt"> & {
    previousHash: string;
    now?: string;
  },
): Promise<LedgerEvent> {
  const createdAt = input.now ?? new Date().toISOString();
  const eventWithoutHash = {
    type: input.type,
    actor: input.actor,
    asset: input.asset,
    amount: input.amount,
    detail: input.detail,
    trust: input.trust,
    previousHash: input.previousHash,
    proof: input.proof,
    payload: input.payload,
    createdAt,
  };
  const hash = await hashPayload(eventWithoutHash);

  return {
    ...eventWithoutHash,
    id: hash.slice(0, 10),
    hash,
  };
}

export async function createCommonGoodEvents(input: {
  actor: string;
  hours: number;
  evidenceKey: string;
  previousHash: string;
  now?: string;
}) {
  const issued = issueCommonGood(input.hours);
  const basePayload = {
    hours: input.hours,
    cappedHours: issued.cappedHours,
    evidenceKey: input.evidenceKey,
    rule: "20_GDD_per_hour_max_50_hours_per_month",
  };
  const person = await createLedgerEvent({
    type: "CommonGoodContributionAccepted",
    actor: input.actor,
    asset: "GDD_DEMO",
    amount: issued.person,
    detail: `${issued.cappedHours}h commons work, ${input.evidenceKey}`,
    trust: "demo-prevalidated",
    previousHash: input.previousHash,
    proof: "local-hash",
    payload: basePayload,
    now: input.now,
  });
  const publicBudget = await createLedgerEvent({
    type: "PublicBudgetIssuedDemo",
    actor: "gradido-engine",
    asset: "PUBLIC_DEMO",
    amount: issued.publicBudget,
    detail: "Mirrored public-budget demo issuance",
    trust: "demo-prevalidated",
    previousHash: person.hash,
    proof: "local-hash",
    payload: { ...basePayload, mirroredFrom: person.id },
    now: input.now,
  });
  const auf = await createLedgerEvent({
    type: "AufIssuedDemo",
    actor: "gradido-engine",
    asset: "AUF_DEMO",
    amount: issued.auf,
    detail: "Mirrored compensation/environment fund demo issuance",
    trust: "demo-prevalidated",
    previousHash: publicBudget.hash,
    proof: "local-hash",
    payload: { ...basePayload, mirroredFrom: person.id },
    now: input.now,
  });

  return [person, publicBudget, auf];
}

export async function createImpactClaimEvent(input: {
  actor: string;
  kgCo2e: number;
  evidenceKey: string;
  previousHash: string;
  now?: string;
}) {
  const units = planedoFromKg(input.kgCo2e);

  return createLedgerEvent({
    type: "ImpactClaimAcceptedDemo",
    actor: input.actor,
    asset: "PLANEDO_DEMO",
    amount: units,
    detail: `${input.kgCo2e} kg CO2e mapped to demo units`,
    trust: "demo-prevalidated",
    previousHash: input.previousHash,
    proof: "local-hash",
    payload: {
      kgCo2e: input.kgCo2e,
      planedoUnits: units,
      evidenceKey: input.evidenceKey,
      rule: "10_kg_CO2e_per_PLANEDO_DEMO",
    },
    now: input.now,
  });
}

export async function createDecayEvent(input: {
  actor: string;
  currentGddBalance: number;
  previousHash: string;
  now?: string;
}) {
  const { decay, nextBalance } = applyMonthlyDecay(input.currentGddBalance);

  return createLedgerEvent({
    type: "GddDecayApplied",
    actor: input.actor,
    asset: "GDD_DEMO",
    amount: -decay,
    detail: "Monthly transience simulation at 5.61%",
    trust: "demo-prevalidated",
    previousHash: input.previousHash,
    proof: "local-hash",
    payload: {
      previousBalance: input.currentGddBalance,
      decay,
      nextBalance,
      rate: GRADIDO_MONTHLY_DECAY_RATE,
    },
    now: input.now,
  });
}

export function projectBalances(events: LedgerEvent[]): Balances {
  return events.reduce<Balances>(
    (balances, event) => {
      if (event.asset === "GDD_DEMO") balances.gdd += event.amount ?? 0;
      if (event.asset === "PLANEDO_DEMO") balances.planedo += event.amount ?? 0;
      if (event.asset === "AUF_DEMO") balances.auf += event.amount ?? 0;
      if (event.asset === "PUBLIC_DEMO") balances.publicBudget += event.amount ?? 0;
      balances.proofs += 1;
      return balances;
    },
    { gdd: 0, planedo: 0, auf: 0, publicBudget: 0, proofs: 0 },
  );
}

export function exportReceipt(
  events: LedgerEvent[],
  balances: Balances,
  generatedAt = new Date().toISOString(),
): Receipt {
  return {
    schema: "aya-neco.receipt.v1",
    generatedAt,
    disclaimer: "Research/demo only. No monetary claim.",
    balances,
    events,
  };
}

export function wrapReceiptForWoda(receipt: Receipt): WodaEnvelope {
  return {
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
      "no token sale",
    ],
    payload: receipt,
  };
}

