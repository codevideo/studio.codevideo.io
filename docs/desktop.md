# CodeVideo Studio for the desktop

The desktop app is the studio's editor (`/editor`) in a [Tauri 2](https://tauri.app) window, with everything it needs bundled inside it:

- Kokoro speech, from the same code as the cloud (`codevideo-api/codevideo-tts`);
- video renders with the CodeVideo CLI;
- Node, Chrome for Testing and FFmpeg for the CLI and the speech service.

It works with no network and no account. Nothing is downloaded when it starts.

The web studio and the desktop app are one frontend. `NEXT_PUBLIC_CODEVIDEO_RUNTIME=desktop` selects the desktop pieces at build time (`src/runtime/`).

## Versions

`package.json` holds the version, and everything else reads it:

- The web studio's footer shows it (`NEXT_PUBLIC_APP_VERSION`).
- So does the editor's settings dialog, on the web and on the desktop.
- The desktop app's own version comes from it: `tauri.conf.json` has `"version": "../package.json"`.
- `src-tauri/Cargo.toml` must carry the same number. The desktop workflow fails if it doesn't.

A release tag must be `v` plus that version, and the workflow refuses any other tag. A tag `v1.0.0` gives an app that reports 1.0.0 and files named `CodeVideo-Studio-1.0.0-…`. The site deployed from the same commit shows v1.0.0 too.

To release:

1. Set the new version in `package.json` (`npm version 1.1.0 --no-git-tag-version`) and in `src-tauri/Cargo.toml`.
2. Commit and push. Netlify deploys the web studio as usual.
3. Tag the commit with `git tag v1.1.0 && git push origin v1.1.0`. The **Desktop** workflow builds the installers and drafts a GitHub release with them.
4. Check the draft, then publish it.

## What's bundled

`scripts/desktop/runtime.lock.json` pins every bundled piece:

- Node 24 LTS;
- Chrome for Testing (the version codevideo-cli's CI renders with);
- the FFmpeg, x264 and LAME sources;
- the Kokoro model's Hugging Face revision;
- the codevideo-cli and codevideo-tts commits.

Each download has a sha256, and the build refuses a file that doesn't match it.

`scripts/desktop/prepare-runtime.mjs` assembles `src-tauri/runtime/` for the machine it runs on. The folder is about 900 MB.

| Folder | What | Notes |
|---|---|---|
| `node/` | Node | Runs the CLI's Puppeteer runner and the speech host |
| `chrome/` | Chrome for Testing | The CLI renders in it |
| `ffmpeg/` | `ffmpeg`, `ffprobe` | Built from source by `build-ffmpeg.sh`, with no Homebrew libraries |
| `cli/` | `codevideo`, `runner/` | The Go CLI, and the runner files the npm package ships |
| `tts/` | codevideo-tts and the Kokoro q8 model | `desktop-host.mjs` serves the app |
| `manifest.json` | Paths and versions | The app reads it to find everything |

To update a pin, change the version, URL and sha256 together, then run the script again. Google publishes no checksums for Chrome for Testing, so take its sha256 from a download you trust.

## Running it locally

You need:

- Node 22 or newer;
- Go (the version in codevideo-cli's `go.mod`);
- Rust (stable);
- Xcode command line tools;
- `pkg-config`, for the FFmpeg build.

```bash
npm ci
node scripts/desktop/prepare-runtime.mjs --cli-src ../codevideo-cli --tts-src ../codevideo-api/codevideo-tts
CODEVIDEO_DESKTOP_RUNTIME_DIR="$PWD/src-tauri/runtime" npm run tauri dev
```

`tauri dev` runs the desktop frontend on port 8001 (`npm run dev:desktop`). `CODEVIDEO_DESKTOP_RUNTIME_DIR` points the app at the runtime, so the build doesn't copy 900 MB into `target/`.

To build the app and the disk image as CI does:

```bash
npx tauri build --bundles app
bash scripts/desktop/package-macos.sh "src-tauri/target/release/bundle/macos/CodeVideo Studio.app" src-tauri/runtime dist/CodeVideo-Studio.dmg
```

The runtime isn't one of Tauri's `bundle.resources`. Tauri's resource copy turns symlinks into copies, which breaks Chrome's framework and its signature. So `package-macos.sh` adds it with `ditto` afterwards, signs the app again (ad-hoc), and makes the DMG. The DMG is about 300 MB; the installed app is about 900 MB.

## Testing

- `npm test` runs the unit tests, the desktop ones included (`*.desktop.test.ts`).
- `node scripts/desktop/smoke-runtime.mjs` checks the runtime without the window:
  - Kokoro speaks two lines;
  - the CLI renders a short lesson with those takes, the way the app runs it;
  - ffprobe checks the MP4.
- To prove it needs no network, run it in a sandbox that refuses everything but localhost (this is what CI runs):

  ```bash
  sandbox-exec -f scripts/desktop/offline.sb node scripts/desktop/smoke-runtime.mjs
  ```

## How it fits together

- **Pages.** `_app.tsx` renders only the editor in the desktop build. Other routes show a pointer to `/editor`, because they need an account (Clerk), and the desktop build has no `ClerkProvider` and no analytics.
- **Auth hooks** (`src/runtime/auth.ts`) are chosen once per build, so Clerk's hooks never run on the desktop.
- **Native commands** (`src/runtime/desktop.ts` → `src-tauri/src/*.rs`):
  - `tts_speak` sends a line to a long-lived Node process, `runtime/tts/desktop-host.mjs`, which runs codevideo-tts's `synthesize()` and writes the MP3 to the app's cache. The cache key is codevideo-tts's own.
  - `render_video` runs the CLI:
    - with `--audio-items` (the selected takes), `--progress json`, `--orientation` and `--resolution`;
    - in a cleared environment, so no keys or webhooks from the user's shell reach it;
    - streaming progress to the window.
  - `cancel_render` sends SIGINT; on Windows it uses `taskkill /T`.
  - `open_project_file` and `save_project_file` go through the system's Open and Save dialogs. The webview has no filesystem access of its own.
- **Project files** are the CLI's JSON: an array of actions, a lesson or a course.
- **Takes.** They stay in the app's cache and are reused by text, voice and speed. A project file doesn't carry its audio yet.
- **Content security policy.** The window's CSP allows only the app itself, Tauri's IPC and its asset protocol. A request to any other origin would be refused.

## Unsigned builds

The builds are ad-hoc signed and not notarized, so macOS refuses a downloaded copy at first. After copying the app to Applications, run:

```bash
xattr -dr com.apple.quarantine "/Applications/CodeVideo Studio.app"
```

### Signing, later

To sign and notarize, the workflow needs:

- a Developer ID Application certificate (`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`);
- notarization credentials (`APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`).

Every bundled executable must be signed with the hardened runtime: Chrome's helpers, `node`, `ffmpeg`, the CLI and onnxruntime's addon. Chrome and Node need JIT entitlements.

New Windows code-signing keys must live on hardware. Use a cloud signing service (Azure Trusted Signing or a cloud HSM), not a certificate file in GitHub Secrets.

Tauri's updater has its own signing key (`TAURI_SIGNING_PRIVATE_KEY`), separate from code signing.

## Platforms

macOS on Apple silicon is built and tested. Each other platform needs pins in `runtime.lock.json` and an entry in the workflow's matrix.

| Platform | What's left |
|---|---|
| macOS x64 | Chrome's mac-x64 zip pin; cross-build FFmpeg on the arm64 runner or use an Intel runner |
| Windows x64 | Chrome's win64 zip pin; a pinned FFmpeg build (`ffmpeg.files["win32-x64"]`, e.g. a BtbN GPL release); check the Rust-side cancel (`taskkill /T`) |
| Linux x64 | Chrome's linux64 zip pin; build FFmpeg on an older Ubuntu (glibc); the AppImage needs GStreamer for MP3 previews in WebKitGTK (`bundle.linux.appimage.bundleMediaFramework`) |

## Licenses

The app bundles third-party programs under their own licenses:

- **FFmpeg with x264** is GPL. It runs as a separate program, and `manifest.json` lists its exact sources.
- **LAME** is LGPL.
- **Chrome for Testing:** check Google's terms for redistributing it.
- **Node** is MIT.
- **The Kokoro model** and kokoro-js are Apache-2.0.
- **phonemizer**, which kokoro-js uses, embeds espeak-ng, which is GPLv3. Check how that applies.

The license files sit next to each program in `runtime/`.

## Not in the desktop app yet

- **Exports other than video** (markdown, PDF, PPTX and so on). Desktop versions belong in codevideo-exporters.
- **Cloud features:** account, cloud renders, sync.
- **Web previews of HTML steps.** ide-react loads esbuild-wasm from a CDN for those.
