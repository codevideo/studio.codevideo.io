// Copies Monaco's AMD build into public/monaco/vs, so the editor loads from
// this site instead of a CDN. The desktop app (src-tauri) runs offline, so
// nothing it shows may come from outside.
import { cpSync, rmSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const monacoRoot = path.dirname(require.resolve("monaco-editor/package.json"));
const { version } = JSON.parse(readFileSync(path.join(monacoRoot, "package.json"), "utf8"));
const target = path.join(root, "public", "monaco", "vs");

rmSync(target, { recursive: true, force: true });
cpSync(path.join(monacoRoot, "min", "vs"), target, { recursive: true });
console.log(`Copied monaco-editor ${version} to ${path.relative(root, target)}`);
