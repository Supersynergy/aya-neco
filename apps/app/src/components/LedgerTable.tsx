import type { LedgerEvent } from "@aya-neco/domain";
import { eventSummary, eventTitle, eventTypeHint } from "../copy/events";
import { Icon } from "../icons/Icon";

type LedgerTableProps = {
  events: LedgerEvent[];
};

export function LedgerTable({ events }: LedgerTableProps) {
  return (
    <section className="ledger-section" aria-labelledby="ledger-heading">
      <div className="section-title">
        <Icon name="database" />
        <div>
          <h2 id="ledger-heading">Append-only Proof Ledger</h2>
          <p>Jede Balance oben wird aus diesen Events berechnet.</p>
          <p className="copy-en">Every balance shown above is projected from these events.</p>
        </div>
      </div>

      <div className="ledger-table" role="table" aria-label="Ledger events">
        <div className="ledger-row ledger-row-head" role="row">
          <span role="columnheader">Event / Ereignis</span>
          <span role="columnheader">Asset</span>
          <span role="columnheader">Amount / Betrag</span>
          <span role="columnheader">Trust</span>
          <span role="columnheader">Hash</span>
        </div>

        {events.map((event) => (
          <div className="ledger-row" role="row" key={event.id}>
            <span role="cell">
              <strong>{eventTitle(event)}</strong>
              <small>{eventSummary(event)}</small>
              <em>{eventTypeHint(event)}</em>
            </span>
            <span role="cell">{event.asset ?? "PROOF"}</span>
            <span role="cell">
              {typeof event.amount === "number" ? event.amount.toFixed(2) : "-"}
            </span>
            <span role="cell">
              <mark>{event.trust}</mark>
            </span>
            <span role="cell" className="hash-cell">
              {event.hash.slice(0, 14)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
