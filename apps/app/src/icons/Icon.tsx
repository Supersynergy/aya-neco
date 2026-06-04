import badgeCheck from "../assets/icons/lucide/badge-check.svg?raw";
import badgeEuro from "../assets/icons/lucide/badge-euro.svg?raw";
import circleDollarSign from "../assets/icons/lucide/circle-dollar-sign.svg?raw";
import coins from "../assets/icons/lucide/coins.svg?raw";
import database from "../assets/icons/lucide/database.svg?raw";
import fileCheck from "../assets/icons/lucide/file-check.svg?raw";
import fingerprintPattern from "../assets/icons/lucide/fingerprint-pattern.svg?raw";
import handHeart from "../assets/icons/lucide/hand-heart.svg?raw";
import handshake from "../assets/icons/lucide/handshake.svg?raw";
import landmark from "../assets/icons/lucide/landmark.svg?raw";
import leaf from "../assets/icons/lucide/leaf.svg?raw";
import network from "../assets/icons/lucide/network.svg?raw";
import recycle from "../assets/icons/lucide/recycle.svg?raw";
import route from "../assets/icons/lucide/route.svg?raw";
import scale from "../assets/icons/lucide/scale.svg?raw";
import scanLine from "../assets/icons/lucide/scan-line.svg?raw";
import shieldCheck from "../assets/icons/lucide/shield-check.svg?raw";
import sprout from "../assets/icons/lucide/sprout.svg?raw";
import wallet from "../assets/icons/lucide/wallet.svg?raw";
import zap from "../assets/icons/lucide/zap.svg?raw";

export const iconRegistry = {
  badgeCheck,
  badgeEuro,
  circleDollarSign,
  coins,
  database,
  fileCheck,
  fingerprintPattern,
  handHeart,
  handshake,
  landmark,
  leaf,
  network,
  recycle,
  route,
  scale,
  scanLine,
  shieldCheck,
  sprout,
  wallet,
  zap,
} as const;

export type IconName = keyof typeof iconRegistry;

type IconProps = {
  name: IconName;
  label?: string;
  size?: number;
  className?: string;
};

export function Icon({ name, label, size = 20, className = "" }: IconProps) {
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={`icon ${className}`}
      role={label ? "img" : undefined}
      dangerouslySetInnerHTML={{ __html: iconRegistry[name] }}
      style={{
        "--icon-size": `${size}px`,
      } as React.CSSProperties}
    />
  );
}
