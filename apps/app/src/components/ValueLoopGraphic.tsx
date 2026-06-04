import { Icon, type IconName } from "../icons/Icon";

const loopNodes: Array<{
  icon: IconName;
  label: string;
  detail: string;
}> = [
  {
    icon: "handHeart",
    label: "Work",
    detail: "2 hours logged",
  },
  {
    icon: "wallet",
    label: "Value",
    detail: "40 GDD demo",
  },
  {
    icon: "shieldCheck",
    label: "Proof",
    detail: "saved in SQLite",
  },
  {
    icon: "fileCheck",
    label: "Receipt",
    detail: "JSON or WODA",
  },
];

export function ValueLoopGraphic() {
  return (
    <aside className="value-loop" aria-label="AYA-NECO value loop">
      {loopNodes.map((node, index) => (
        <article className={`loop-node loop-node-${index + 1}`} key={node.label}>
          <span className="loop-index">{index + 1}</span>
          <Icon name={node.icon} size={20} />
          <strong>{node.label}</strong>
          <span>{node.detail}</span>
        </article>
      ))}

      <div className="loop-receipt">
        <Icon name="route" size={22} />
        <strong>One clear proof object</strong>
        <span>Readable by people, reusable by adapters.</span>
      </div>
    </aside>
  );
}
