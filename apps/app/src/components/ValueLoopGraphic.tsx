import { Icon, type IconName } from "../icons/Icon";

const loopNodes: Array<{
  icon: IconName;
  label: string;
  detail: string;
}> = [
  {
    icon: "fingerprintPattern",
    label: "Identity",
    detail: "demo DID",
  },
  {
    icon: "handHeart",
    label: "Contribution",
    detail: "commons work",
  },
  {
    icon: "leaf",
    label: "Impact",
    detail: "kg CO2e",
  },
  {
    icon: "shieldCheck",
    label: "Proof",
    detail: "hash chain",
  },
  {
    icon: "network",
    label: "IOTA",
    detail: "adapter slot",
  },
  {
    icon: "route",
    label: "WODA",
    detail: "object envelope",
  },
];

export function ValueLoopGraphic() {
  return (
    <aside className="value-loop" aria-label="AYA-NECO value loop graphic">
      <div className="loop-core">
        <Icon name="fileCheck" size={34} />
        <strong>Receipt</strong>
        <span>one exported proof object</span>
      </div>

      {loopNodes.map((node, index) => (
        <article className={`loop-node loop-node-${index + 1}`} key={node.label}>
          <Icon name={node.icon} size={20} />
          <strong>{node.label}</strong>
          <span>{node.detail}</span>
        </article>
      ))}
    </aside>
  );
}

