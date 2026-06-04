import { Icon, type IconName } from "../icons/Icon";

const useCases: Array<{
  icon: IconName;
  title: string;
  body: string;
}> = [
  {
    icon: "handHeart",
    title: "Community wallet",
    body: "Turn common-good work into transparent demo receipts.",
  },
  {
    icon: "sprout",
    title: "Impact receipt",
    body: "Attach environmental claims without pretending validation happened.",
  },
  {
    icon: "network",
    title: "IOTA proof",
    body: "Use event hashes as the clean testnet notarization boundary.",
  },
  {
    icon: "route",
    title: "WODA module",
    body: "Wrap receipts as small ONCE/WODA object envelopes.",
  },
];

export function UseCaseRail() {
  return (
    <section className="use-case-rail" aria-label="Starter use cases">
      {useCases.map((item) => (
        <article key={item.title}>
          <Icon name={item.icon} size={19} />
          <div>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

