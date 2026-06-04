import { useEffect, useMemo, useState } from "react";
import {
  acceptCommonGood,
  applyDecay,
  createImpactClaim,
  getHealth,
  getReceipt,
  getState,
  getWodaEnvelope,
  prepareIotaProof,
  resetDemo,
  type ApiState,
} from "./api/client";
import { LedgerTable } from "./components/LedgerTable";
import { MetricCard } from "./components/MetricCard";
import { ProjectExamples } from "./components/ProjectExamples";
import { ProofRoute } from "./components/ProofRoute";
import { ToolRoles } from "./components/ToolRoles";
import { WalletPreview } from "./components/WalletPreview";
import { eventSummary, eventTitle } from "./copy/events";
import {
  issueCommonGood,
  planedoFromKg,
  type Balances,
  type LedgerEvent,
} from "@aya-neco/domain";
import { designSource } from "./design/tokens";
import { Icon } from "./icons/Icon";

const initialBalances: Balances = {
  gdd: 0,
  planedo: 0,
  auf: 0,
  publicBudget: 0,
  proofs: 0,
};

function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function App() {
  const [hours, setHours] = useState(2);
  const [kgCo2e, setKgCo2e] = useState(25);
  const [evidence, setEvidence] = useState("community-workshop-note");
  const [apiState, setApiState] = useState<ApiState | null>(null);
  const [balances, setBalances] = useState<Balances>(initialBalances);
  const [events, setEvents] = useState<LedgerEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">(
    "checking",
  );
  const [lastAction, setLastAction] = useState("Load backend state");
  const [error, setError] = useState<string | null>(null);

  const projectedCommonGood = useMemo(() => issueCommonGood(hours), [hours]);
  const projectedPlanedo = useMemo(() => planedoFromKg(kgCo2e), [kgCo2e]);
  const latestEvent = events[0];
  const proofCount = apiState?.ledger.eventCount ?? events.length;
  const latestHash = apiState?.ledger.latestHash.slice(0, 14) ?? "genesis";

  useEffect(() => {
    void reloadBackendState();
  }, []);

  function applyState(nextState: ApiState, action: string) {
    setApiState(nextState);
    setBalances(nextState.balances);
    setEvents(nextState.events);
    setBackendStatus("online");
    setLastAction(action);
    setError(null);
  }

  async function runAction(action: string, work: () => Promise<ApiState>) {
    setBusy(true);
    setError(null);
    try {
      applyState(await work(), action);
    } catch (caught) {
      setBackendStatus("offline");
      setError(caught instanceof Error ? caught.message : "Unknown backend error");
    } finally {
      setBusy(false);
    }
  }

  async function reloadBackendState() {
    setBusy(true);
    setError(null);
    try {
      await getHealth();
      applyState(await getState(), "Backend state loaded");
    } catch (caught) {
      setBackendStatus("offline");
      setError(
        caught instanceof Error
          ? caught.message
          : "Backend not reachable. Start it with `just dev`.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function submitCommonGood() {
    await runAction("Persisted common-good contribution", () => {
      return acceptCommonGood({
        actor: apiState?.identity.id ?? "aya-demo-user",
        hours,
        evidenceKey: evidence,
      });
    });
  }

  async function submitImpact() {
    await runAction("Persisted impact claim", () => {
      return createImpactClaim({
        actor: apiState?.identity.id ?? "aya-demo-user",
        kgCo2e,
        evidenceKey: evidence,
      });
    });
  }

  async function advanceMonth() {
    await runAction("Persisted monthly decay event", () => applyDecay());
  }

  async function submitIotaProof() {
    await runAction("Prepared IOTA proof event", () => prepareIotaProof());
  }

  async function resetBackendDemo() {
    await runAction("Reset persistent demo ledger", () => resetDemo());
  }

  async function downloadReceipt() {
    const receipt = await getReceipt();
    const blob = new Blob([JSON.stringify(receipt, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aya-neco-demo-receipt.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function downloadWodaEnvelope() {
    const envelope = await getWodaEnvelope();
    const blob = new Blob([JSON.stringify(envelope, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aya-neco-woda-envelope.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#workbench" aria-label="AYA-NECO workbench">
          <span className="brand-mark">
            <Icon name="handshake" size={22} />
          </span>
          <span>
            <strong>AYA-NECO</strong>
            <small>Community proof wallet</small>
          </span>
        </a>

        <nav aria-label="Primary">
          <a href="#wallet">Wallet</a>
          <a href="#projects">Projekte</a>
          <a href="#start">Beitrag</a>
          <a href="#builders">Technik</a>
        </nav>

        <div className="status-pill">
          <Icon name="shieldCheck" size={16} />
          {backendStatus === "online" ? "Demo online" : "Backend check"}
        </div>
      </header>

      <main id="workbench">
        <section id="wallet" className="command-band wallet-hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <div className="eyebrow">
              <Icon name="wallet" size={16} />
              Proof wallet / Nachweis-Wallet
            </div>
            <h1 id="hero-heading">
              Gemeinwohl-Arbeit wird sichtbar.
              <span>Make useful work visible.</span>
            </h1>
            <p className="copy-de">
              AYA-NECO zeigt, wie Communities Beiträge erfassen, prüfen und als
              Wallet-Receipt exportieren können.
            </p>
            <p className="copy-en">
              AYA-NECO shows how communities can record, review, and export useful
              work as wallet receipts.
            </p>
            <div className="hero-actions" aria-label="Primary actions">
              <a className="primary-button hero-button" href="#start">
                <Icon name="badgeCheck" size={18} />
                Beitrag erfassen / Log contribution
              </a>
              <a className="secondary-button hero-button" href="#outcome">
                <Icon name="fileCheck" size={18} />
                Receipt ansehen / View receipt
              </a>
            </div>
            <div className="human-note">
              <Icon name="shieldCheck" size={17} />
              <span>
                Noch kein echtes Geld. Kein Custody. Erst der prüfbare Nachweis.
                <small>No real money yet. No custody. Proof first.</small>
              </span>
            </div>
          </div>

          <WalletPreview
            balances={balances}
            latestHash={latestHash}
            latestTitle={eventTitle(latestEvent)}
            proofCount={proofCount}
          />
        </section>

        <ProjectExamples />

        {error ? (
          <section className="error-panel" role="alert">
            <strong>Backend is not ready</strong>
            <p>{error}</p>
            <code>just dev</code>
          </section>
        ) : null}

        <section id="outcome" className="outcome-section" aria-label="Current demo result">
          <div className="outcome-copy">
            <span className="step-label">Current result</span>
            <h2>Ein Wallet für Beiträge, Wirkung und Nachweise.</h2>
            <p className="copy-de">
              Menschen sehen nicht zuerst Hashes. Sie sehen ihren Beitrag, den
              Status, die Wirkung und den exportierbaren Nachweis.
            </p>
            <p className="copy-en">
              People do not see hashes first. They see their contribution, status,
              impact, and exportable receipt.
            </p>
          </div>
          <div className="latest-proof-card">
            <span>Letzter Nachweis / Latest proof</span>
            <strong>{eventTitle(latestEvent)}</strong>
            <p>{eventSummary(latestEvent)}</p>
            <small>{proofCount} stored events</small>
          </div>
        </section>

        <section className="metrics-grid" aria-label="Demo balances">
          <MetricCard
            icon="wallet"
            label="GDD demo"
            value={formatNumber(balances.gdd)}
            caption="Lokale Demo-Balance / Local demo balance"
            tone="green"
          />
          <MetricCard
            icon="leaf"
            label="Planedo demo"
            value={formatNumber(balances.planedo, 1)}
            caption="Impact-Einheiten / Impact units"
            tone="blue"
          />
          <MetricCard
            icon="landmark"
            label="AUF/public"
            value={formatNumber(balances.auf + balances.publicBudget)}
            caption="Gemeinschaftsfonds / Community funds"
            tone="amber"
          />
          <MetricCard
            icon="fileCheck"
            label="Proofs"
            value={formatNumber(balances.proofs)}
            caption="Receipts im Ledger / Ledger receipts"
            tone="ink"
          />
        </section>

        <section className="control-grid" aria-label="Prototype controls">
          <form
            id="start"
            className="action-panel start-panel"
            onSubmit={(event) => {
              event.preventDefault();
              void submitCommonGood();
            }}
          >
            <div className="section-title">
              <Icon name="handHeart" />
              <div>
                <span className="step-label">Start here / Hier starten</span>
                <h2>Beitrag erfassen / Log contribution</h2>
                <p>2 Stunden helfen, prüfen, Receipt erzeugen. Demo-Regel: 20 GDD/hour.</p>
              </div>
            </div>

            <label>
              Stunden / Hours
              <input
                min="0"
                max="50"
                type="number"
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
              />
            </label>
            <label>
              Belegschlüssel / Evidence key
              <input
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
              />
            </label>

            <div className="projection">
              <span>Ergebnis / Projected issue</span>
              <strong>{projectedCommonGood.person} GDD</strong>
            </div>

            <button className="primary-button" type="submit" disabled={busy}>
              <Icon name="badgeCheck" size={18} />
              Beitrag bestätigen / Accept contribution
            </button>
          </form>

          <form
            className="action-panel"
            onSubmit={(event) => {
              event.preventDefault();
              void submitImpact();
            }}
          >
            <div className="section-title">
              <Icon name="sprout" />
              <div>
                <span className="step-label">Impact / Wirkung</span>
                <h2>Umweltwirkung / Environmental impact</h2>
                <p>CO2e-Wirkung sichtbar machen, ohne Zertifizierung vorzutäuschen.</p>
              </div>
            </div>

            <label>
              kg CO2e
              <input
                min="0"
                step="0.1"
                type="number"
                value={kgCo2e}
                onChange={(event) => setKgCo2e(Number(event.target.value))}
              />
            </label>

            <div className="trust-band">
              <span>
                <Icon name="shieldCheck" size={16} />
                demo-prevalidated
              </span>
              <span>
                <Icon name="recycle" size={16} />
                MRV-ready later
              </span>
            </div>

            <div className="projection">
              <span>Einheiten / Projected units</span>
              <strong>{projectedPlanedo.toFixed(2)} P</strong>
            </div>

            <button className="primary-button impact-button" type="submit" disabled={busy}>
              <Icon name="leaf" size={18} />
              Impact-Receipt erzeugen / Create impact proof
            </button>
          </form>

          <section className="action-panel system-panel" aria-label="System actions">
            <div className="section-title">
              <Icon name="zap" />
              <div>
                <span className="step-label">Receipt / Export</span>
                <h2>Nachweis teilen / Share proof</h2>
                <p>Receipt herunterladen oder für WODA/IOTA vorbereiten.</p>
              </div>
            </div>

            <button className="secondary-button" onClick={() => void advanceMonth()} disabled={busy}>
              <Icon name="scale" size={18} />
              Monat simulieren / Advance month
            </button>
            <button className="secondary-button" onClick={() => void submitIotaProof()} disabled={busy}>
              <Icon name="network" size={18} />
              Prepare IOTA proof
            </button>
            <button className="secondary-button" onClick={() => void downloadReceipt()}>
              <Icon name="fileCheck" size={18} />
              JSON Receipt exportieren
            </button>
            <button className="secondary-button" onClick={() => void downloadWodaEnvelope()}>
              <Icon name="route" size={18} />
              WODA Envelope exportieren
            </button>
            <button className="secondary-button danger-button" onClick={() => void resetBackendDemo()} disabled={busy}>
              Demo zurücksetzen / Reset demo
            </button>

            <div className="adapter-readiness">
              <span>
                <Icon name="network" size={16} />
                IOTA proof slot
              </span>
              <span>
                <Icon name="route" size={16} />
                ONCE manifest slot
              </span>
              <span>
                <Icon name="fingerprintPattern" size={16} />
                {designSource.posture}
              </span>
            </div>
          </section>
        </section>

        <section id="builders" className={`backend-panel backend-${backendStatus}`} aria-label="Backend status">
          <div>
            <span>
              <Icon name="database" size={17} />
              System
            </span>
            <strong>{backendStatus}</strong>
          </div>
          <div>
            <span>Was passiert ist / Last action</span>
            <strong>{lastAction}</strong>
          </div>
          <div>
            <span>Gespeichert in / Stored in</span>
            <strong>{apiState?.ledger.storage ?? "not connected"}</strong>
          </div>
          <div>
            <span>Proof hash</span>
            <strong className="backend-hash">
              {latestHash}
            </strong>
          </div>
          <button className="secondary-button compact-button" onClick={() => void reloadBackendState()} disabled={busy}>
            Refresh
          </button>
        </section>

        <ToolRoles />
        <ProofRoute />
        <LedgerTable events={events} />
      </main>
    </div>
  );
}
