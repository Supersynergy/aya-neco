import { Database } from "bun:sqlite";
import { dirname } from "node:path";
import { mkdirSync } from "node:fs";
import {
  exportReceipt,
  projectBalances,
  type LedgerEvent,
  type Receipt,
} from "@aya-neco/domain";

type StoredEventRow = {
  id: string;
  type: string;
  actor: string;
  asset: string | null;
  amount: number | null;
  detail: string;
  trust: LedgerEvent["trust"];
  hash: string;
  previous_hash: string;
  proof: LedgerEvent["proof"];
  payload_json: string;
  created_at: string;
};

export class LedgerStore {
  private readonly db: Database;

  constructor(dbPath: string) {
    if (dbPath !== ":memory:") {
      mkdirSync(dirname(dbPath), { recursive: true });
    }
    this.db = new Database(dbPath);
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.migrate();
    this.ensureDemoIdentity();
  }

  close() {
    this.db.close();
  }

  resetDemo() {
    this.db.exec("DELETE FROM ledger_events;");
    this.db.exec("DELETE FROM identities;");
    this.ensureDemoIdentity();
  }

  latestHash() {
    const row = this.db
      .query<{ hash: string }, []>("SELECT hash FROM ledger_events ORDER BY sequence DESC LIMIT 1")
      .get();
    return row?.hash ?? "genesis";
  }

  appendEvents(events: LedgerEvent[]) {
    let expectedPreviousHash = this.latestHash();
    for (const event of events) {
      if (event.previousHash !== expectedPreviousHash) {
        throw new Error(
          `Invalid ledger chain: expected previous hash ${expectedPreviousHash}, got ${event.previousHash}`,
        );
      }
      expectedPreviousHash = event.hash;
    }

    const insert = this.db.prepare(`
      INSERT INTO ledger_events (
        id, type, actor, asset, amount, detail, trust, hash, previous_hash, proof, payload_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const transaction = this.db.transaction((items: LedgerEvent[]) => {
      for (const event of items) {
        insert.run(
          event.id,
          event.type,
          event.actor,
          event.asset ?? null,
          event.amount ?? null,
          event.detail,
          event.trust,
          event.hash,
          event.previousHash,
          event.proof,
          JSON.stringify(event.payload),
          event.createdAt,
        );
      }
    });
    transaction(events);
  }

  listEvents(order: "asc" | "desc" = "asc"): LedgerEvent[] {
    const rows = this.db
      .query<StoredEventRow, []>(
        `SELECT id, type, actor, asset, amount, detail, trust, hash, previous_hash, proof, payload_json, created_at
         FROM ledger_events
         ORDER BY sequence ${order === "asc" ? "ASC" : "DESC"}`,
      )
      .all();

    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      actor: row.actor,
      asset: row.asset ? (row.asset as LedgerEvent["asset"]) : undefined,
      amount: row.amount ?? undefined,
      detail: row.detail,
      trust: row.trust,
      hash: row.hash,
      previousHash: row.previous_hash,
      proof: row.proof,
      payload: JSON.parse(row.payload_json) as Record<string, unknown>,
      createdAt: row.created_at,
    }));
  }

  state() {
    const eventsAsc = this.listEvents("asc");
    return {
      identity: this.demoIdentity(),
      balances: projectBalances(eventsAsc),
      events: this.listEvents("desc"),
      ledger: {
        eventCount: eventsAsc.length,
        latestHash: eventsAsc.at(-1)?.hash ?? "genesis",
        storage: "sqlite",
      },
    };
  }

  receipt(): Receipt {
    const events = this.listEvents("asc");
    return exportReceipt(events, projectBalances(events));
  }

  private migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS identities (
        id TEXT PRIMARY KEY,
        display_name TEXT NOT NULL,
        did TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ledger_events (
        sequence INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        actor TEXT NOT NULL,
        asset TEXT,
        amount REAL,
        detail TEXT NOT NULL,
        trust TEXT NOT NULL,
        hash TEXT NOT NULL UNIQUE,
        previous_hash TEXT NOT NULL,
        proof TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
  }

  private ensureDemoIdentity() {
    this.db
      .prepare(
        `INSERT OR IGNORE INTO identities (id, display_name, did, created_at)
         VALUES (?, ?, ?, ?)`,
      )
      .run(
        "aya-demo-user",
        "AYA Demo User",
        "did:example:aya-demo-user",
        new Date().toISOString(),
      );
  }

  private demoIdentity() {
    return this.db
      .query<
        { id: string; display_name: string; did: string; created_at: string },
        []
      >("SELECT id, display_name, did, created_at FROM identities WHERE id = 'aya-demo-user'")
      .get();
  }
}
