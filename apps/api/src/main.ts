import { createApi } from "./http";

const port = Number(process.env.PORT ?? 8787);
const dbPath = process.env.AYA_NECO_DB ?? "data/aya-neco.sqlite";
const api = createApi({ dbPath });

Bun.serve({
  port,
  fetch: api.fetch,
});

console.log(`AYA-NECO API listening on http://127.0.0.1:${port}`);
console.log(`SQLite ledger: ${dbPath}`);

