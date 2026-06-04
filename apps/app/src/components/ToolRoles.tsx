import { Icon, type IconName } from "../icons/Icon";

const roles: Array<{
  icon: IconName;
  title: string;
  job: string;
  handoff: string;
}> = [
  {
    icon: "handHeart",
    title: "AYA rules",
    job: "Turns hours, caps, decay, and impact ratios into ledger events.",
    handoff: "Input becomes typed events, never direct balance edits.",
  },
  {
    icon: "database",
    title: "SQLite ledger",
    job: "Persists every event as an append-only SHA-256 hash chain.",
    handoff: "Balances, receipts, and adapters replay the stored events.",
  },
  {
    icon: "fileCheck",
    title: "Receipt",
    job: "Packages balances, events, hashes, and safety disclaimers.",
    handoff: "The receipt is the audit object people and tools inspect.",
  },
  {
    icon: "route",
    title: "WODA envelope",
    job: "Wraps the receipt as a portable ONCE/WODA object boundary.",
    handoff: "WODA can route the proof object without owning the app.",
  },
  {
    icon: "network",
    title: "IOTA slot",
    job: "Prepares the latest local hash for future testnet notarization.",
    handoff: "IOTA starts from hashes, not demo balances or UI state.",
  },
];

export function ToolRoles() {
  return (
    <section className="tool-roles" aria-labelledby="tool-roles-heading">
      <div className="tool-roles-copy">
        <span className="step-label">Tool roles</span>
        <h2 id="tool-roles-heading">Each tool has one narrow job in the proof flow.</h2>
        <p>
          The original demo idea stays intact: a contribution becomes visible proof.
          The new version adds persistence, exports, and adapter boundaries around
          that idea.
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
