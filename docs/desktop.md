# CodeVideo Studio for the desktop

The desktop app is the studio's editor (`/editor`) in a [Tauri 2](https://tauri.app) window, with everything it needs bundled inside it:

- Kokoro speech, from the same code as the cloud (`codevideo-api/codevideo-tts`);
- video renders with the CodeVideo CLI;
- Node, Chrome for Testing and FFmpeg for the CLI and the speech service.

It works with no network and no account. Nothing is downloaded when it starts.

CI builds it for macOS on Apple silicon (a DMG) and for Windows x64 (an MSI and a `setup.exe`).

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
| `ffmpeg/` | `ffmpeg`, `ffprobe` | macOS: built from source by `build-ffmpeg.sh`, with no Homebrew libraries. Windows: Gyan's essentials build of 8.1.2 (there's no 8.1.3 one) |
| `cli/` | `codevideo`, `runner/` | The Go CLI, and the runner files the npm package ships |
| `tts/` | codevideo-tts and the Kokoro q8 model | `desktop-host.mjs` serves the app |
| `manifest.json` | Paths and versions | The app reads it to find everything |

To update a pin, change the version, URL and sha256 together, then run the script again. Google publishes no sha256 for Chrome for Testing. Before taking the sha256 of a download, check its MD5 against the `x-goog-hash` header that `curl -I` shows for the URL.

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

On macOS the runtime isn't one of Tauri's `bundle.resources`. Tauri's resource copy turns symlinks into copies, which breaks Chrome's framework and its signature. So `package-macos.sh` adds it with `ditto` afterwards, signs the app again (ad-hoc), and makes the DMG. The DMG is about 300 MB; the installed app is about 900 MB.

### On Windows

You need Node, Go, Rust with the MSVC toolchain, and the Visual Studio C++ build tools. FFmpeg is a pinned build, so there's nothing to compile for it. Run the commands from Git Bash, or adapt them for PowerShell:

```bash
npm ci
node scripts/desktop/prepare-runtime.mjs --cli-src ../codevideo-cli --tts-src ../codevideo-api/codevideo-tts
npx tauri build --bundles msi,nsis
```

Windows has no symlinks to break, so `tauri.windows.conf.json` makes the runtime one of Tauri's resources, and both installers contain it. Tauri downloads WiX and NSIS the first time it builds them. That file also sets:

- **The installers:** `setup.exe` installs for the current user without admin rights. The MSI installs for every user on the PC, which is what IT departments deploy.
- **WebView2:** the installers embed Microsoft's offline WebView2 installer (about 130 MB), so a PC without WebView2 can install the app with no network. Windows 10 and 11 usually have WebView2 already.
- **The MSI upgrade code:** fixed, so a new MSI upgrades the installed one. Never change it.

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

  Windows has no `sandbox-exec`. There, CI adds firewall rules that block each bundled program's outbound traffic, then checks that the bundled Node can't reach the internet before it runs the smoke test. The firewall doesn't filter loopback, so the CLI still reaches its local servers.
- The `windows-installers` job installs what users download, each installer on its own fresh Windows machine. It runs the smoke test from the install folder, opens the installed app, and keeps a screenshot of it as the `windows-screenshot-<version>-<installer>` artifact. A render writes nothing into the runtime folder, so the MSI's read-only install in Program Files works.

  Each installer reuses the folder of an earlier install by the other one: Tauri keeps it in `HKCU\Software\Full Stack Craft\CodeVideo Studio`. So an MSI run after `setup.exe` installs into the user's `AppData\Local\CodeVideo Studio`, not Program Files.

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

The macOS builds are ad-hoc signed and not notarized, so macOS refuses a downloaded copy at first. After copying the app to Applications, run:

```bash
xattr -dr com.apple.quarantine "/Applications/CodeVideo Studio.app"
```

The Windows installers aren't signed, so SmartScreen may say "Windows protected your PC". Choose **More info**, then **Run anyway**.

### Signing, later

To sign and notarize, the workflow needs:

- a Developer ID Application certificate (`APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_SIGNING_IDENTITY`);
- notarization credentials (`APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID`).

Every bundled executable must be signed with the hardened runtime: Chrome's helpers, `node`, `ffmpeg`, the CLI and onnxruntime's addon. Chrome and Node need JIT entitlements.

New Windows code-signing keys must live on hardware. Use a cloud signing service (Azure Trusted Signing or a cloud HSM), not a certificate file in GitHub Secrets.

Tauri's updater has its own signing key (`TAURI_SIGNING_PRIVATE_KEY`), separate from code signing.

## Platforms

CI builds macOS on Apple silicon and Windows x64, and runs the offline smoke test on both. CI never opens the app's window, so try the editor by hand on each platform before a release. Each other platform needs pins in `runtime.lock.json` and an entry in the workflow's matrix.

| Platform | What's left |
|---|---|
| macOS x64 | Chrome's mac-x64 zip pin; cross-build FFmpeg on the arm64 runner or use an Intel runner |
| Linux x64 | Chrome's linux64 zip pin; build FFmpeg on an older Ubuntu (glibc); the AppImage needs GStreamer for MP3 previews in WebKitGTK (`bundle.linux.appimage.bundleMediaFramework`) |

On Windows, Cancel ends the CLI and everything it started with `taskkill /T /F`, because Windows can't send another process a Ctrl-C. As on macOS, the app then deletes the render's job folder and the unfinished video.

## Licenses

The app bundles third-party programs under their own licenses:

- **FFmpeg with x264** is GPL. It runs as a separate program. On macOS, `manifest.json` lists its exact sources. On Windows, it's Gyan's GPL v3 build, whose `README.txt` (next to it) lists every library's version. Building that one from source too would make the GPL source offer simpler.
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
