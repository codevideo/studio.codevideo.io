/**
 * Which studio this build is. Both come from the same pages; the desktop app
 * (Tauri) is built with NEXT_PUBLIC_CODEVIDEO_RUNTIME=desktop and runs offline:
 * no account, Kokoro speech and renders on the user's machine.
 */
export const IS_DESKTOP =
  process.env.NEXT_PUBLIC_CODEVIDEO_RUNTIME === "desktop";

/**
 * The studio's version, from package.json. The web footer and the desktop app
 * show the same number, and a desktop release is tagged with it (v1.0.0).
 */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "";
