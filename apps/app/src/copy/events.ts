import type { LedgerEvent } from "@aya-neco/domain";

const eventTitles: Record<string, string> = {
  CommonGoodContributionAccepted: "Beitrag bestätigt / Community work accepted",
  PublicBudgetIssuedDemo: "Public-Budget-Spiegel / Public budget mirror",
  AufIssuedDemo: "AUF-Spiegel / Environment fund mirror",
  ImpactClaimAcceptedDemo: "Impact erfasst / Impact claim recorded",
  IotaProofPreparedDemo: "IOTA vorbereitet / IOTA proof prepared",
  GddDecayApplied: "Monat simuliert / Monthly decay simulated",
};

const eventSummaries: Record<string, string> = {
  CommonGoodContributionAccepted:
    "Die Person erhält Demo-GDD für bestätigte Arbeit. / The person receives demo GDD for reviewed work.",
  PublicBudgetIssuedDemo:
    "Der gleiche Betrag wird ins Public-Budget gespiegelt. / The same amount is mirrored for the public budget.",
  AufIssuedDemo:
    "Der gleiche Betrag wird in den AUF-Fonds gespiegelt. / The same amount is mirrored into the environment fund.",
  ImpactClaimAcceptedDemo:
    "Ein Klima-Claim wird als Demo-Impact gespeichert. / A climate-impact claim is stored as demo impact.",
  IotaProofPreparedDemo:
    "Der letzte Hash ist bereit für IOTA-Testnet. / The latest hash is ready for IOTA testnet.",
  GddDecayApplied:
    "Die Demo simuliert monatliche Vergänglichkeit. / The demo applies monthly transience.",
};

export function eventTitle(event?: LedgerEvent) {
  if (!event) return "Noch kein Receipt / No receipt yet";
  return eventTitles[event.type] ?? event.type;
}

export function eventSummary(event?: LedgerEvent) {
  if (!event) return "Erzeuge ein Receipt, um den Nachweis zu füllen. / Create a receipt to populate the proof trail.";
  return eventSummaries[event.type] ?? event.detail;
}

export function eventTypeHint(event: LedgerEvent) {
  return eventTitles[event.type] ? event.type : "custom event";
}
