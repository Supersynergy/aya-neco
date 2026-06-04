import type { LedgerEvent } from "@aya-neco/domain";

const eventTitles: Record<string, string> = {
  CommonGoodContributionAccepted: "Community work accepted",
  PublicBudgetIssuedDemo: "Public budget mirror added",
  AufIssuedDemo: "Environment fund mirror added",
  ImpactClaimAcceptedDemo: "Impact claim recorded",
  IotaProofPreparedDemo: "IOTA proof prepared",
  GddDecayApplied: "Monthly decay simulated",
};

const eventSummaries: Record<string, string> = {
  CommonGoodContributionAccepted: "The person receives demo GDD for verified community work.",
  PublicBudgetIssuedDemo: "The same amount is mirrored for the public-budget simulation.",
  AufIssuedDemo: "The same amount is mirrored for the compensation and environment fund.",
  ImpactClaimAcceptedDemo: "A climate-impact claim is stored as demo Planedo units.",
  IotaProofPreparedDemo: "The latest hash is ready for a future IOTA testnet adapter.",
  GddDecayApplied: "The demo applies monthly Gradido-style transience.",
};

export function eventTitle(event?: LedgerEvent) {
  if (!event) return "No receipt yet";
  return eventTitles[event.type] ?? event.type;
}

export function eventSummary(event?: LedgerEvent) {
  if (!event) return "Create a receipt to populate the proof trail.";
  return eventSummaries[event.type] ?? event.detail;
}

export function eventTypeHint(event: LedgerEvent) {
  return eventTitles[event.type] ? event.type : "custom event";
}
