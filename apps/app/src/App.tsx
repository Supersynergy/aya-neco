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
import { ProofRoute } from "./components/ProofRoute";
import { UseCaseRail } from "./components/UseCaseRail";
import { ValueLoopGraphic } from "./components/ValueLoopGraphic";
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
            <small>Proof economy lab</small>
          </span>
        </a>

        <nav aria-label="Primary">
          <a href="#workbench">Workbench</a>
          <a href="#ledger-heading">Ledger</a>
          <a href="#route-heading">Adapters</a>
        </nav>

        <div className="status-pill">
          <Icon name="shieldCheck" size={16} />
          {backendStatus === "online" ? "SQLite API online" : "Backend check"}
        </div>
      </header>

      <main id="workbench">
        <section className="command-band" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <div className="eyebrow">
              <Icon name="scanLine" size={16} />
              Local-first prototype
            </div>
            <h1 id="hero-heading">One contribution. One proof. One visible value loop.</h1>
            <p>
              Test Gradido-style commons rewards, Planedo-style impact units,
              and IOTA-ready proof routing without touching real money.
            </p>
          </div>

          <ValueLoopGraphic />
        </section>

        <UseCaseRail />

        <section className={`backend-panel backend-${backendStatus}`} aria-label="Backend status">
          <div>
            <span>
              <Icon name="database" size={17} />
              Backend
            </span>
            <strong>{backendStatus}</strong>
          </div>
          <div>
            <span>Last action</span>
            <strong>{lastAction}</strong>
          </div>
          <div>
            <span>Storage</span>
            <strong>{apiState?.ledger.storage ?? "not connected"}</strong>
          </div>
          <div>
            <span>Latest hash</span>
            <strong className="backend-hash">
              {apiState?.ledger.latestHash.slice(0, 14) ?? "genesis"}
            </strong>
          </div>
          <button className="secondary-button compact-button" onClick={() => void reloadBackendState()} disabled={busy}>
            Refresh
          </button>
        </section>

        {error ? (
          <section className="error-panel" role="alert">
            <strong>Backend is not ready</strong>
            <p>{error}</p>
            <code>just dev</code>
          </section>
        ) : null}

        <section className="metrics-grid" aria-label="Demo balances">
          <MetricCard
            icon="wallet"
            label="GDD demo"
            value={formatNumber(balances.gdd)}
            caption="Gradido-inspired local balance"
            tone="green"
          />
          <MetricCard
            icon="leaf"
            label="Planedo demo"
            value={formatNumber(balances.planedo, 1)}
            caption="10 kg CO2e per demo unit"
            tone="blue"
          />
          <MetricCard
            icon="landmark"
            label="AUF/public"
            value={formatNumber(balances.auf + balances.publicBudget)}
            caption="Community funds in simulation"
            tone="amber"
          />
          <MetricCard
            icon="fileCheck"
            label="Proofs"
            value={formatNumber(balances.proofs)}
            caption="Local hash-chain receipts"
            tone="ink"
          />
        </section>

        <section className="control-grid" aria-label="Prototype controls">
          <form
            className="action-panel"
            onSubmit={(event) => {
              event.preventDefault();
              void submitCommonGood();
            }}
          >
            <div className="section-title">
              <Icon name="handHeart" />
              <div>
                <h2>Common-good work</h2>
                <p>20 GDD/hour, capped at 50 hours per month.</p>
              </div>
            </div>

            <label>
              Hours
              <input
                min="0"
                max="50"
                type="number"
                value={hours}
                onChange={(event) => setHours(Number(event.target.value))}
              />
            </label>
            <label>
              Evidence key
              <input
                value={evidence}
                onChange={(event) => setEvidence(event.target.value)}
              />
            </label>

            <div className="projection">
              <span>Projected issue</span>
              <strong>{projectedCommonGood.person} GDD</strong>
            </div>

            <button className="primary-button" type="submit" disabled={busy}>
              <Icon name="badgeCheck" size={18} />
              Accept contribution
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
                <h2>Environmental impact</h2>
                <p>Convert a demo CO2e claim into Planedo-style units.</p>
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
              <span>Projected units</span>
              <strong>{projectedPlanedo.toFixed(2)} P</strong>
            </div>

            <button className="primary-button impact-button" type="submit" disabled={busy}>
              <Icon name="leaf" size={18} />
              Create impact proof
            </button>
          </form>

          <section className="action-panel system-panel" aria-label="System actions">
            <div className="section-title">
              <Icon name="zap" />
              <div>
                <h2>Simulation controls</h2>
                <p>Stress the model before any real integration.</p>
              </div>
            </div>

            <button className="secondary-button" onClick={() => void advanceMonth()} disabled={busy}>
              <Icon name="scale" size={18} />
              Advance one month
            </button>
            <button className="secondary-button" onClick={() => void submitIotaProof()} disabled={busy}>
              <Icon name="network" size={18} />
              Prepare IOTA proof
            </button>
            <button className="secondary-button" onClick={() => void downloadReceipt()}>
              <Icon name="fileCheck" size={18} />
              Export JSON receipt
            </button>
            <button className="secondary-button" onClick={() => void downloadWodaEnvelope()}>
              <Icon name="route" size={18} />
              Export WODA envelope
            </button>
            <button className="secondary-button danger-button" onClick={() => void resetBackendDemo()} disabled={busy}>
              Reset persistent demo
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

        <ProofRoute />
        <LedgerTable events={events} />
      </main>
    </div>
  );
}
