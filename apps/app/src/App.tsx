import { useMemo, useState } from "react";
import { LedgerTable } from "./components/LedgerTable";
import { MetricCard } from "./components/MetricCard";
import { ProofRoute } from "./components/ProofRoute";
import { UseCaseRail } from "./components/UseCaseRail";
import { ValueLoopGraphic } from "./components/ValueLoopGraphic";
import {
  applyMonthlyDecay,
  createLedgerEvent,
  exportReceipt,
  issueCommonGood,
  planedoFromKg,
  type Balances,
  type LedgerEvent,
} from "./domain/economy";
import { designSource } from "./design/tokens";
import { Icon } from "./icons/Icon";

const initialBalances: Balances = {
  gdd: 320,
  planedo: 7.5,
  auf: 320,
  publicBudget: 320,
  proofs: 2,
};

const seedEvents: LedgerEvent[] = [
  {
    id: "seed-id",
    type: "DemoIdentityCreated",
    actor: "aya-demo-user",
    detail: "Local identity with DID placeholder",
    trust: "self-declared",
    proof: "local-hash",
    hash: "7d01c1fb2b6abf0c45632a59a913a70dbf71c0b169d0326d5b6bd81af9edaf20",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-proof",
    type: "ImpactClaimAcceptedDemo",
    actor: "aya-demo-user",
    asset: "PLANEDO_DEMO",
    amount: 7.5,
    detail: "75 kg CO2e demo claim",
    trust: "demo-prevalidated",
    proof: "local-hash",
    hash: "a650cdf21a8aa3ef68ecb1a5c54a1f2a3f67031317869c886bd7175e7a69c4c1",
    createdAt: new Date().toISOString(),
  },
];

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
  const [balances, setBalances] = useState<Balances>(initialBalances);
  const [events, setEvents] = useState<LedgerEvent[]>(seedEvents);
  const [busy, setBusy] = useState(false);

  const latestHash = events[0]?.hash ?? "genesis";

  const projectedCommonGood = useMemo(() => issueCommonGood(hours), [hours]);
  const projectedPlanedo = useMemo(() => planedoFromKg(kgCo2e), [kgCo2e]);

  async function appendEvent(input: Parameters<typeof createLedgerEvent>[0]) {
    const event = await createLedgerEvent(input, latestHash);
    setEvents((current) => [event, ...current]);
    return event;
  }

  async function submitCommonGood() {
    setBusy(true);
    const issued = issueCommonGood(hours);

    await appendEvent({
      type: "CommonGoodContributionAccepted",
      actor: "aya-demo-user",
      asset: "GDD_DEMO",
      amount: issued.person,
      detail: `${issued.cappedHours}h commons work, ${evidence}`,
      trust: "demo-prevalidated",
      proof: "local-hash",
    });

    setBalances((current) => ({
      ...current,
      gdd: current.gdd + issued.person,
      auf: current.auf + issued.auf,
      publicBudget: current.publicBudget + issued.publicBudget,
      proofs: current.proofs + 1,
    }));
    setBusy(false);
  }

  async function submitImpact() {
    setBusy(true);
    const units = planedoFromKg(kgCo2e);

    await appendEvent({
      type: "ImpactClaimAcceptedDemo",
      actor: "aya-demo-user",
      asset: "PLANEDO_DEMO",
      amount: units,
      detail: `${kgCo2e} kg CO2e mapped to demo units`,
      trust: "demo-prevalidated",
      proof: "local-hash",
    });

    setBalances((current) => ({
      ...current,
      planedo: current.planedo + units,
      proofs: current.proofs + 1,
    }));
    setBusy(false);
  }

  async function advanceMonth() {
    setBusy(true);
    const { decay, nextBalance } = applyMonthlyDecay(balances.gdd);

    await appendEvent({
      type: "GddDecayApplied",
      actor: "gradido-engine",
      asset: "GDD_DEMO",
      amount: -decay,
      detail: "Monthly transience simulation at 5.61%",
      trust: "demo-prevalidated",
      proof: "local-hash",
    });

    setBalances((current) => ({
      ...current,
      gdd: nextBalance,
      proofs: current.proofs + 1,
    }));
    setBusy(false);
  }

  function downloadReceipt() {
    const receipt = exportReceipt(events, balances);
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
          Demo only
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
            <button className="secondary-button" onClick={downloadReceipt}>
              <Icon name="fileCheck" size={18} />
              Export JSON receipt
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
