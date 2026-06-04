import { Icon, type IconName } from "../icons/Icon";

const roles: Array<{
  icon: IconName;
  title: string;
  job: string;
  handoff: string;
}> = [
  {
    icon: "handHeart",
    title: "AYA Regeln / AYA rules",
    job: "Stunden, Limits und Impact-Regeln werden zu Ledger-Events.",
    handoff: "Inputs become typed events, never direct balance edits.",
  },
  {
    icon: "database",
    title: "SQLite Ledger",
    job: "Speichert jedes Event als append-only SHA-256-Hash-Chain.",
    handoff: "Balances, receipts, and adapters replay the stored events.",
  },
  {
    icon: "fileCheck",
    title: "Receipt",
    job: "Verpackt Balances, Events, Hashes und Sicherheitsgrenzen.",
    handoff: "The receipt is the audit object people and tools inspect.",
  },
  {
    icon: "route",
    title: "WODA Envelope",
    job: "Macht den Receipt als ONCE/WODA-Objekt portabel.",
    handoff: "WODA can route the proof object without owning the app.",
  },
  {
    icon: "network",
    title: "IOTA Slot",
    job: "Bereitet den letzten Hash für spätere Testnet-Notarisierung vor.",
    handoff: "IOTA starts from hashes, not demo balances or UI state.",
  },
];

export function ToolRoles() {
  return (
    <section className="tool-roles" aria-labelledby="tool-roles-heading">
      <div className="tool-roles-copy">
        <span className="step-label">Technik / For builders</span>
        <h2 id="tool-roles-heading">Jede Komponente hat eine klare Rolle.</h2>
        <p>
          Die Wallet-Ansicht bleibt menschlich. Darunter liegen Ledger, Receipts
          und Adaptergrenzen für Entwickler.
        </p>
        <p className="copy-en">
          The wallet stays human. Ledger, receipts, and adapter boundaries stay
          available for builders.
        </p>
      </div>

      <div className="tool-role-grid">
        {roles.map((role) => (
          <article key={role.title}>
            <Icon name={role.icon} size={20} />
            <div>
              <strong>{role.title}</strong>
              <p>{role.job}</p>
              <small>{role.handoff}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
