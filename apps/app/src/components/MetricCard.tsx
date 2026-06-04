import { Icon, type IconName } from "../icons/Icon";

type MetricCardProps = {
  icon: IconName;
  label: string;
  value: string;
  caption: string;
  tone?: "green" | "blue" | "amber" | "ink";
};

export function MetricCard({
  icon,
  label,
  value,
  caption,
  tone = "ink",
}: MetricCardProps) {
  return (
    <article className={`metric metric-${tone}`}>
      <div className="metric-head">
        <Icon name={icon} />
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      <p>{caption}</p>
    </article>
  );
}

