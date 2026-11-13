import { Channel, convertFileSrc, invoke } from "@tauri-apps/api/core";

// The desktop app's native side (src-tauri). Only call these when IS_DESKTOP.

/** A Kokoro speech take, written by the bundled speech service to the app's cache. */
export interface SpokenTake {
  /** sha256 of the request, the same key the codevideo-tts service caches by. */
  assetId: string;
  path: string;
  voice: string;
  speed: number;
}

export function speak(text: string, voice: string, speed: number) {
  return invoke<SpokenTake>("tts_speak", { text, voice, speed });
}

/** A URL the webview can play for a file on disk. */
export const audioUrl = (path: string) => convertFileSrc(path);

export interface ProjectFile {
  path: string;
  contents: string;
}

/** Shows an Open dialog; null when the user cancels. */
export function openProjectFile() {
  return invoke<ProjectFile | null>("open_project_file");
}

/** Writes to `path`, or shows a Save dialog when there's none. Resolves to the path written, null when cancelled. */
export function saveProjectFile(
  contents: string,
  suggestedName: string,
  path?: string,
) {
  return invoke<string | null>("save_project_file", {
    contents,
    suggestedName,
    path: path ?? null,
  });
}

/** One line of the CLI's `--progress json` output, or a log line it printed. */
export type RenderEvent =
  | { type: "progress"; stage: string; fraction: number; detail: string }
  | { type: "result"; path: string }
  | { type: "error"; message: string };

export interface RenderRequest {
  /** The actions to render, as the CLI's project JSON. */
  project: string;
  /** Every narrated line's take: the CLI uses these instead of generating speech. */
  takes: { text: string; path: string }[];
  orientation: "landscape" | "portrait";
  resolution: "1080p" | "4K";
  suggestedName: string;
}

/**
 * Asks where to save the video, then renders it with the bundled CLI. Resolves
 * to the saved path, or null when the user cancels the Save dialog.
 */
export function renderVideo(
  request: RenderRequest,
  onEvent: (event: RenderEvent) => void,
) {
  const channel = new Channel<RenderEvent>();
  channel.onmessage = onEvent;
  return invoke<string | null>("render_video", { request, onEvent: channel });
}

export function cancelRender() {
  return invoke<void>("cancel_render");
}

/** Shows the file in Finder (or Explorer / the file manager). */
export function revealPath(path: string) {
  return invoke<void>("reveal_path", { path });
}
