import { Icon, type IconName } from "../icons/Icon";

const routeItems: Array<{
  icon: IconName;
  title: string;
  body: string;
  status: string;
}> = [
  {
    icon: "fingerprintPattern",
    title: "Identität / Identity",
    body: "Lokale Demo-Identität jetzt; DID/OIDC/eIDAS später.",
    status: "local",
  },
  {
    icon: "handHeart",
    title: "Beiträge / Commons",
    body: "20 GDD/Stunde, gedeckelt auf 50 Stunden pro Monat.",
    status: "live",
  },
  {
    icon: "leaf",
    title: "Wirkung / Impact",
    body: "10 kg CO2e werden zu 1 Planedo-Demo-Einheit.",
    status: "live",
  },
  {
    icon: "shieldCheck",
    title: "Nachweis / Proof",
    body: "SHA-256-Hash-Chain für jedes Event.",
    status: "live",
  },
  {
    icon: "network",
    title: "IOTA",
    body: "Adapter-Slot für spätere Testnet-Notarisierung.",
    status: "ready",
  },
  {
    icon: "route",
    title: "ONCE",
    body: "Modul-Manifest als Grenze für WODA-Wrapper.",
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
          <p>Kleine Schnittstellen jetzt, tiefere Integrationen später.</p>
          <p className="copy-en">Small interfaces now, deeper integrations later.</p>
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
