import type { Balances } from "@aya-neco/domain";
import { Icon } from "../icons/Icon";

type WalletPreviewProps = {
  balances: Balances;
  latestHash: string;
  proofCount: number;
  latestTitle: string;
};

function format(value: number, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function WalletPreview({
  balances,
  latestHash,
  proofCount,
  latestTitle,
}: WalletPreviewProps) {
  return (
    <aside className="wallet-preview" aria-label="Community wallet preview">
      <div className="wallet-card-top">
        <div className="wallet-person">
          <span className="wallet-avatar">MR</span>
          <div>
            <strong>Maria R.</strong>
            <small>Community wallet / Gemeinwohl-Wallet</small>
          </div>
        </div>
        <span className="review-badge">
          <Icon name="shieldCheck" size={15} />
          Geprüft / Reviewed
        </span>
      </div>

      <div className="wallet-hero-balance">
        <span>Aktueller Beitrag / Current contribution</span>
        <strong>{format(balances.gdd)} GDD_DEMO</strong>
        <p>2h Nachbarschaftsküche / 2h community kitchen</p>
      </div>

      <div className="wallet-stats">
        <div>
          <Icon name="leaf" size={17} />
          <strong>{format(balances.planedo, 1)}</strong>
          <span>Impact units</span>
        </div>
        <div>
          <Icon name="landmark" size={17} />
          <strong>{format(balances.auf + balances.publicBudget)}</strong>
          <span>Public/AUF</span>
        </div>
        <div>
          <Icon name="fileCheck" size={17} />
          <strong>{proofCount}</strong>
          <span>Receipts</span>
        </div>
      </div>

      <div className="wallet-receipt">
        <div>
          <span>Letzter Nachweis / Latest proof</span>
          <strong>{latestTitle}</strong>
        </div>
        <code>{latestHash}</code>
      </div>
    </aside>
  );
}
