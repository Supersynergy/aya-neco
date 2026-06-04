import { Icon, type IconName } from "../icons/Icon";

const routeItems: Array<{
  icon: IconName;
  title: string;
  body: string;
  status: string;
}> = [
  {
    icon: "fingerprintPattern",
    title: "Identity",
    body: "Local demo identity now; DID/OIDC/eIDAS later.",
    status: "local",
  },
  {
    icon: "handHeart",
    title: "Commons",
    body: "20 GDD/hour, capped at 50 hours per month.",
    status: "live",
  },
  {
    icon: "leaf",
    title: "Impact",
    body: "10 kg CO2e maps to 1 Planedo demo unit.",
    status: "live",
  },
  {
    icon: "shieldCheck",
    title: "Proof",
    body: "SHA-256 hash chain for every event.",
    status: "live",
  },
  {
    icon: "network",
    title: "IOTA",
    body: "Adapter slot for testnet notarization.",
    status: "ready",
  },
  {
    icon: "route",
    title: "ONCE",
    body: "Module manifest boundary for WODA wrappers.",
    status: "ready",
  },
];

export function ProofRoute() {
  return (
    <section className="route-section" aria-labelledby="route-heading">
      <div className="section-title">
        <Icon name="route" />
        <div>
          <h2 id="route-heading">Proof route</h2>
          <p>Small interfaces now, deeper integrations later.</p>
        </div>
      </div>

      <div className="route-grid">
        {routeItems.map((item) => (
          <article className="route-node" key={item.title}>
            <Icon name={item.icon} />
            <strong>{item.title}</strong>
            <p>{item.body}</p>
            <span>{item.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

