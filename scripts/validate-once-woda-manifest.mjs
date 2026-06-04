import { readFileSync } from "node:fs";

const manifestPath = new URL("../packages/once-woda/module.manifest.json", import.meta.url);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

const required = ["schema", "name", "version", "commands", "trust_boundaries", "source"];
const missing = required.filter((key) => !(key in manifest));

if (missing.length > 0) {
  console.error(`Missing manifest fields: ${missing.join(", ")}`);
  process.exit(1);
}

if (!Array.isArray(manifest.commands) || manifest.commands.length < 5) {
  console.error("Manifest must expose at least five AYA commands.");
  process.exit(1);
}

if (!manifest.trust_boundaries.includes("no token sale")) {
  console.error("Manifest must include the no-token-sale boundary.");
  process.exit(1);
}

console.log(`valid ${manifest.name}@${manifest.version}`);

