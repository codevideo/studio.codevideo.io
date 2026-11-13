// Assembles src-tauri/runtime/: everything the desktop app runs besides
// itself. Nothing is downloaded when the app starts; it all ships in the app.
//
//   node scripts/desktop/prepare-runtime.mjs --cli-src ../codevideo-cli --tts-src ../codevideo-api/codevideo-tts
//
//   --cli-src <dir>   a codevideo-cli checkout (the desktop workflow checks out the commit in runtime.lock.json)
//   --tts-src <dir>   the codevideo-tts folder of a codevideo-api checkout
//   --cache <dir>     where downloads and the FFmpeg build are kept (default ~/.cache/codevideo-desktop)
//   --out <dir>       default src-tauri/runtime
//
// Downloads come from runtime.lock.json, and each one must match its sha256.
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const lock = JSON.parse(readFileSync(path.join(here, "runtime.lock.json"), "utf8"));

const { values: args } = parseArgs({
  options: {
    "cli-src": { type: "string" },
    "tts-src": { type: "string" },
    cache: { type: "string", default: path.join(os.homedir(), ".cache", "codevideo-desktop") },
    out: { type: "string", default: path.join(root, "src-tauri", "runtime") },
  },
});
if (!args["cli-src"] || !args["tts-src"]) {
  console.error("usage: prepare-runtime.mjs --cli-src <codevideo-cli> --tts-src <codevideo-tts> [--cache <dir>] [--out <dir>]");
  process.exit(2);
}
const cliSrc = path.resolve(args["cli-src"]);
const ttsSrc = path.resolve(args["tts-src"]);
const out = path.resolve(args.out);
const downloads = path.join(path.resolve(args.cache), "downloads");
const platform = `${process.platform}-${process.arch}`;
const windows = process.platform === "win32";
const exe = (name) => (windows ? `${name}.exe` : name);

function pinned(section, key = platform) {
  const entry = lock[section].files?.[key];
  if (!entry) throw new Error(`runtime.lock.json has no ${section} for ${key} yet.`);
  return entry;
}

function step(name) {
  console.log(`==> ${name}`);
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, { stdio: "inherit", ...options });
  if (result.status !== 0) {
    throw new Error(`${command} ${commandArgs.join(" ")} failed (${result.status ?? result.signal})`);
  }
}

async function sha256(file) {
  const hash = createHash("sha256");
  await pipeline(createReadStream(file), hash);
  return hash.digest("hex");
}

/** Downloads `url` once into the cache, and checks it against `expected`. */
async function download(url, expected, name = path.basename(new URL(url).pathname)) {
  mkdirSync(downloads, { recursive: true });
  const file = path.join(downloads, name);
  if (!existsSync(file) || (await sha256(file)) !== expected) {
    console.log(`    downloading ${url}`);
    // curl rather than fetch: Node's fetch always sends `Sec-Fetch-Mode: cors`,
    // and code.videolan.org (x264) refuses that with HTTP 406.
    const partial = `${file}.partial`;
    run("curl", [
      "--fail", "--silent", "--show-error", "--location",
      "--proto", "=https", "--proto-redir", "=https",
      "--retry", "3", "--connect-timeout", "30",
      "--output", partial, url,
    ]);
    renameSync(partial, file);
  }
  const actual = await sha256(file);
  if (actual !== expected) {
    throw new Error(`${name} has sha256 ${actual}, but runtime.lock.json pins ${expected}`);
  }
  return file;
}

function extract(archive, into) {
  mkdirSync(into, { recursive: true });
  if (archive.endsWith(".zip") && process.platform === "darwin") {
    // ditto keeps the symlinks and signatures inside .app bundles.
    run("ditto", ["-x", "-k", archive, into]);
  } else if (archive.endsWith(".zip") && !windows) {
    run("unzip", ["-q", archive, "-d", into]);
  } else if (windows) {
    // Windows' own tar reads zips and C:\ paths. The GNU tar that Git Bash puts
    // first on PATH does neither.
    run(path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "tar.exe"), ["-xf", archive, "-C", into]);
  } else {
    run("tar", ["-xf", archive, "-C", into]);
  }
}

function gitDescribe(dir) {
  try {
    const commit = execFileSync("git", ["-C", dir, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
    const dirty = execFileSync("git", ["-C", dir, "status", "--porcelain", "--", "."], { encoding: "utf8" }).trim() !== "";
    return dirty ? `${commit}+local-changes` : commit;
  } catch {
    return "unknown";
  }
}

const manifest = { platform, created: new Date().toISOString(), paths: {}, versions: {}, sources: {} };

async function main() {
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const work = path.join(out, ".work");

  step(`Node ${lock.node.version}`);
  {
    const { url, sha256: expected } = pinned("node");
    const archive = await download(url, expected);
    extract(archive, work);
    const unpacked = path.join(work, readdirSync(work).find((n) => n.startsWith("node-v")));
    const node = windows ? "node/node.exe" : "node/bin/node";
    mkdirSync(path.dirname(path.join(out, node)), { recursive: true });
    cpSync(path.join(unpacked, windows ? "node.exe" : "bin/node"), path.join(out, node));
    cpSync(path.join(unpacked, "LICENSE"), path.join(out, "node", "LICENSE"));
    manifest.paths.node = node;
    manifest.versions.node = lock.node.version;
    manifest.sources.node = url;
    rmSync(work, { recursive: true, force: true });
  }

  step(`Chrome for Testing ${lock.chrome.version}`);
  {
    const { url, sha256: expected, executable } = pinned("chrome");
    const archive = await download(url, expected, `chrome-${lock.chrome.version}-${path.basename(new URL(url).pathname)}`);
    extract(archive, path.join(out, "chrome"));
    if (!existsSync(path.join(out, "chrome", executable))) throw new Error(`Chrome isn't at chrome/${executable}`);
    manifest.paths.chrome = `chrome/${executable}`;
    manifest.versions.chrome = lock.chrome.version;
    manifest.sources.chrome = url;
  }

  const prebuilt = lock.ffmpeg.files?.[platform];
  step(`FFmpeg ${prebuilt?.version ?? lock.ffmpeg.version}`);
  {
    const ffmpegDir = path.join(out, "ffmpeg");
    if (prebuilt) {
      // A pinned build: just its programs and license files.
      const archive = await download(prebuilt.url, prebuilt.sha256);
      extract(archive, work);
      mkdirSync(ffmpegDir, { recursive: true });
      for (const file of [...prebuilt.programs, ...prebuilt.licenses]) {
        cpSync(path.join(work, file), path.join(ffmpegDir, path.basename(file)));
      }
      rmSync(work, { recursive: true, force: true });
    } else {
      const sources = {};
      for (const [name, { url, sha256: expected }] of Object.entries(lock.ffmpeg.sources)) {
        sources[name] = await download(url, expected);
      }
      // The build takes minutes, so it's kept until a pin or the build script changes.
      const script = path.join(here, "build-ffmpeg.sh");
      const key = createHash("sha256")
        .update(platform)
        .update(JSON.stringify({ version: lock.ffmpeg.version, sources: lock.ffmpeg.sources }))
        .update(readFileSync(script))
        .digest("hex")
        .slice(0, 16);
      const built = path.join(path.resolve(args.cache), `ffmpeg-${lock.ffmpeg.version}-${platform}-${key}`);
      if (!existsSync(path.join(built, exe("ffprobe")))) {
        rmSync(built, { recursive: true, force: true });
        run("bash", [script, sources.ffmpeg, sources.x264, sources.lame, built]);
      }
      cpSync(built, ffmpegDir, { recursive: true });
    }
    manifest.paths.ffmpeg = `ffmpeg/${exe("ffmpeg")}`;
    manifest.paths.ffprobe = `ffmpeg/${exe("ffprobe")}`;
    manifest.versions.ffmpeg = prebuilt?.version ?? lock.ffmpeg.version;
    manifest.sources.ffmpeg = prebuilt?.url ?? Object.values(lock.ffmpeg.sources).map((s) => s.url);
  }

  step("CodeVideo CLI");
  {
    const cliVersion = JSON.parse(readFileSync(path.join(cliSrc, "npm", "package.json"), "utf8")).version;
    const binary = path.join(out, "cli", exe("codevideo"));
    run("go", ["build", "-trimpath", "-ldflags", `-s -w -X main.version=${cliVersion}`, "-o", binary, "."], {
      cwd: cliSrc,
      env: { ...process.env, CGO_ENABLED: "0" },
    });
    // The same runner files the npm package ships (npm/scripts/prepare-packages.mjs).
    const runner = path.join(out, "cli", "runner");
    mkdirSync(runner, { recursive: true });
    for (const file of ["recordVideoV3.js", "runtimePaths.js", "renderFramesV1.js", "virtualClock.js", "renderSegments.js", "package.json", "package-lock.json"]) {
      cpSync(path.join(cliSrc, "puppeteer-runner", file), path.join(runner, file));
    }
    run("npm", ["ci", "--omit=dev", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: runner, shell: windows });
    cpSync(path.join(cliSrc, "LICENSE"), path.join(out, "cli", "LICENSE"));
    manifest.paths.cli = `cli/${exe("codevideo")}`;
    manifest.paths.runner = "cli/runner/recordVideoV3.js";
    manifest.versions.cli = cliVersion;
    manifest.sources.cli = `${lock.cli.repository}@${gitDescribe(cliSrc)}`;
  }

  step("codevideo-tts (Kokoro)");
  {
    const tts = path.join(out, "tts");
    cpSync(ttsSrc, tts, {
      recursive: true,
      filter: (src) => {
        const name = path.basename(src);
        return !["node_modules", "audio-cache", "alt-kokoro-web", ".git"].includes(name) && !name.startsWith(".env");
      },
    });
    // onnxruntime-node would otherwise fetch CUDA libraries on Linux.
    run("npm", ["ci", "--omit=dev", "--no-audit", "--no-fund"], {
      cwd: tts,
      shell: windows,
      env: { ...process.env, ONNXRUNTIME_NODE_INSTALL_CUDA: "skip" },
    });
    // onnxruntime-node ships every platform's binaries; keep this one's.
    const napi = path.join(tts, "node_modules", "onnxruntime-node", "bin", "napi-v3");
    const osName = { darwin: "darwin", linux: "linux", win32: "win32" }[process.platform];
    for (const dirOs of readdirSync(napi)) {
      for (const dirArch of readdirSync(path.join(napi, dirOs))) {
        if (dirOs !== osName || dirArch !== process.arch) rmSync(path.join(napi, dirOs, dirArch), { recursive: true });
      }
    }
    cpSync(path.join(here, "tts-host.mjs"), path.join(tts, "desktop-host.mjs"));
    const model = path.join(tts, "models", lock.kokoro.repository);
    const base = `https://huggingface.co/${lock.kokoro.repository}/resolve/${lock.kokoro.revision}`;
    for (const [file, expected] of Object.entries(lock.kokoro.files)) {
      const cached = await download(`${base}/${file}`, expected, `kokoro-${lock.kokoro.revision}-${path.basename(file)}`);
      mkdirSync(path.dirname(path.join(model, file)), { recursive: true });
      cpSync(cached, path.join(model, file));
    }
    manifest.paths.ttsHost = "tts/desktop-host.mjs";
    manifest.versions.kokoro = `${lock.kokoro.repository}@${lock.kokoro.revision} (q8)`;
    manifest.sources.tts = `${lock.tts.repository}/${lock.tts.path}@${gitDescribe(ttsSrc)}`;
  }

  step("Check the bundled programs");
  {
    const version = (file, flag = "--version") =>
      execFileSync(path.join(out, file), [flag], { encoding: "utf8" }).split("\n")[0].trim();
    console.log(`    node ${version(manifest.paths.node)}`);
    console.log(`    ${version(manifest.paths.ffmpeg, "-version")}`);
    const encoders = execFileSync(path.join(out, manifest.paths.ffmpeg), ["-hide_banner", "-encoders"], { encoding: "utf8" });
    for (const encoder of ["libx264", "aac", "libmp3lame"]) {
      if (!encoders.includes(` ${encoder} `)) throw new Error(`The bundled FFmpeg has no ${encoder} encoder`);
    }
    console.log(`    ${version(manifest.paths.cli)}`);
    for (const file of Object.values(manifest.paths)) {
      const full = path.join(out, file);
      if (!existsSync(full)) throw new Error(`missing ${file}`);
      if (!windows && /\.(js|mjs)$/.test(file) === false) chmodSync(full, statSync(full).mode | 0o111);
    }
  }

  writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  rmSync(work, { recursive: true, force: true });
  const size = windows ? "" : ` (${execFileSync("du", ["-sh", out], { encoding: "utf8" }).split("\t")[0]})`;
  console.log(`Runtime for ${platform} is ready in ${path.relative(process.cwd(), out)}${size}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
