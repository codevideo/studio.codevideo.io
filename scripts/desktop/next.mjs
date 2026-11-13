// Runs Next for the desktop app: the same pages as the web studio, built with
// the desktop runtime (no account, local Kokoro speech and renders).
//   node scripts/desktop/next.mjs build   -> out/, which Tauri bundles
//   node scripts/desktop/next.mjs dev     -> dev server for `tauri dev`
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const command = process.argv[2];
if (command !== "build" && command !== "dev") {
  console.error("usage: node scripts/desktop/next.mjs build|dev");
  process.exit(2);
}
const env = { ...process.env, NEXT_PUBLIC_CODEVIDEO_RUNTIME: "desktop" };
const run = (args) => {
  const result = spawnSync(process.execPath, args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
run([fileURLToPath(new URL("../copy-monaco.mjs", import.meta.url))]);
const next = require.resolve("next/dist/bin/next");
run(command === "build" ? [next, "build"] : [next, "dev", "-p", "8001"]);
