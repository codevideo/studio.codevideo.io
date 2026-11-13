// Checks the bundled runtime end to end, without the app's window: Kokoro
// speaks two lines, then the CLI renders a short lesson with those takes, the
// way the desktop app does (same programs, flags and clean environment).
//
//   node scripts/desktop/smoke-runtime.mjs [--runtime src-tauri/runtime] [--keep]
//
// Run it with the network off to prove the app needs none (the desktop
// workflow does on Linux; on macOS, see scripts/desktop/offline.sb).
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const here = path.dirname(fileURLToPath(import.meta.url));
const { values: args } = parseArgs({
  options: {
    runtime: { type: "string", default: path.resolve(here, "..", "..", "src-tauri", "runtime") },
    keep: { type: "boolean", default: false },
  },
});
const runtime = path.resolve(args.runtime);
const manifest = JSON.parse(readFileSync(path.join(runtime, "manifest.json"), "utf8"));
const at = (key) => path.join(runtime, manifest.paths[key]);
const work = mkdtempSync(path.join(os.tmpdir(), "codevideo-desktop-smoke-"));

const lines = [
  "This video was made on this computer, with no network at all.",
  "That is the whole render, done locally.",
];
const lesson = [
  { name: "author-speak-before", value: lines[0] },
  { name: "file-explorer-create-file", value: "hello.js" },
  { name: "file-explorer-open-file", value: "hello.js" },
  { name: "editor-type", value: 'console.log("Hello from the desktop app");' },
  { name: "author-speak-after", value: lines[1] },
];

// The environment the app gives its children (src-tauri/src/runtime.rs).
const keep = ["HOME", "USER", "LOGNAME", "TMPDIR", "TEMP", "TMP", "LANG", "LC_ALL", "LC_CTYPE", "SystemRoot", "SYSTEMROOT", "WINDIR", "USERPROFILE", "LOCALAPPDATA", "APPDATA", "PROGRAMDATA", "ProgramFiles", "COMSPEC", "PATHEXT", "XDG_RUNTIME_DIR", "DISPLAY", "WAYLAND_DISPLAY"];
const systemPath = process.platform === "win32" ? (process.env.PATH ?? "").split(path.delimiter) : ["/usr/bin", "/bin", "/usr/sbin", "/sbin"];
function cleanEnv(extra) {
  const env = Object.fromEntries(keep.filter((k) => process.env[k] !== undefined).map((k) => [k, process.env[k]]));
  env.PATH = [path.dirname(at("node")), path.dirname(at("ffmpeg")), ...systemPath].join(path.delimiter);
  return { ...env, ...extra };
}

function fail(message) {
  console.error(`✗ ${message}`);
  if (!args.keep) rmSync(work, { recursive: true, force: true });
  process.exit(1);
}

function probe(file) {
  const json = execFileSync(at("ffprobe"), ["-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name", "-of", "json", file], { encoding: "utf8" });
  return JSON.parse(json);
}

async function speak() {
  const host = spawn(at("node"), [at("ttsHost")], {
    env: cleanEnv({ CODEVIDEO_TTS_CACHE_DIR: path.join(work, "tts") }),
    stdio: ["pipe", "pipe", "inherit"],
  });
  const replies = new Map();
  createInterface({ input: host.stdout }).on("line", (line) => {
    try {
      const reply = JSON.parse(line);
      replies.get(reply.id)?.(reply);
    } catch {}
  });
  const takes = [];
  for (const [id, text] of lines.entries()) {
    const reply = await new Promise((resolve) => {
      replies.set(id, resolve);
      host.stdin.write(JSON.stringify({ id, text, voice: "af_heart", speed: 1 }) + "\n");
    });
    if (reply.error) fail(`speech: ${reply.error}`);
    const seconds = Number(probe(reply.take.path).format.duration);
    if (!(seconds > 0.5)) fail(`speech take ${reply.take.path} is ${seconds}s long`);
    console.log(`✓ spoke "${text}" (${seconds.toFixed(2)}s)`);
    takes.push({ text, path: reply.take.path });
  }
  host.stdin.end();
  await new Promise((resolve) => host.on("exit", resolve));
  return takes;
}

async function render(takes) {
  const project = path.join(work, "project.json");
  const takesFile = path.join(work, "takes.json");
  const noEnv = path.join(work, "empty.env");
  const output = path.join(work, "smoke.mp4");
  writeFileSync(project, JSON.stringify(lesson));
  writeFileSync(takesFile, JSON.stringify(takes));
  writeFileSync(noEnv, "");
  const started = Date.now();
  const cli = spawn(
    at("cli"),
    ["--project-file", project, "--audio-items", takesFile, "--output", output, "--progress", "json"],
    {
      env: cleanEnv({
        CODEVIDEO_PUPPETEER_RUNNER_PATH: at("runner"),
        CODEVIDEO_CHROME_PATH: at("chrome"),
        CODEVIDEO_FFMPEG_PATH: at("ffmpeg"),
        CODEVIDEO_FFPROBE_PATH: at("ffprobe"),
        CODEVIDEO_WORK_DIR: path.join(work, "work"),
        CODEVIDEO_LOG_DIR: path.join(work, "logs"),
        CODEVIDEO_TTS_CACHE_DIR: path.join(work, "cli-tts"),
        CODEVIDEO_OUTPUT_DIR: work,
        CODEVIDEO_ENV_FILE: noEnv,
        CODEVIDEO_TTS_PROVIDER: "kokoro",
      }),
      stdio: ["ignore", "ignore", "pipe"],
    },
  );
  let lastStage = "";
  let error = "";
  createInterface({ input: cli.stderr }).on("line", (line) => {
    try {
      const event = JSON.parse(line);
      if (event.stage && event.stage !== lastStage) console.log(`  ${(lastStage = event.stage)}`);
      if (event.error) error = event.error;
    } catch {}
  });
  const code = await new Promise((resolve) => cli.on("exit", resolve));
  if (code !== 0) fail(`the CLI exited with ${code}: ${error} (logs in ${path.join(work, "logs")})`);
  if (!existsSync(output) || statSync(output).size === 0) fail("the CLI made no video");
  const { format, streams } = probe(output);
  const codecs = streams.map((s) => `${s.codec_type}:${s.codec_name}`);
  if (!codecs.includes("video:h264") || !codecs.includes("audio:aac")) fail(`unexpected streams ${codecs}`);
  console.log(`✓ rendered ${(statSync(output).size / 1e6).toFixed(1)} MB, ${Number(format.duration).toFixed(1)}s (${codecs.join(", ")}) in ${((Date.now() - started) / 1000).toFixed(0)}s`);
  return output;
}

const takes = await speak();
const video = await render(takes);
if (args.keep) console.log(`Kept ${work} (video: ${video})`);
else rmSync(work, { recursive: true, force: true });
console.log("✓ the bundled runtime speaks and renders");
