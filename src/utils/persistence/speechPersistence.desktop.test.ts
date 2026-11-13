import { afterEach, expect, it, vi } from "vitest";

// The desktop build (NEXT_PUBLIC_CODEVIDEO_RUNTIME=desktop) keeps takes that are
// files on disk, read through Tauri's asset protocol, and speaks with Kokoro only.

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function load(runtime: string, saved: unknown) {
  vi.stubEnv("NEXT_PUBLIC_CODEVIDEO_RUNTIME", runtime);
  vi.resetModules();
  vi.stubGlobal("localStorage", {
    getItem: () => JSON.stringify(saved),
    setItem: () => {},
    removeItem: () => {},
  });
  const { loadSpeech } = await import("./speechPersistence");
  return loadSpeech();
}

const desktopTake = {
  assetId: "4f2c",
  mp3Url: "asset://localhost/%2FUsers%2Fme%2FLibrary%2FCaches%2Fio.codevideo.studio%2Ftts%2F4f2c.mp3",
  path: "/Users/me/Library/Caches/io.codevideo.studio/tts/4f2c.mp3",
  provider: "kokoro",
  voiceId: "af_heart",
  speed: 1,
  durationMs: 1800,
  created: "2026-11-13T12:00:00.000Z",
};
const saved = {
  takesByText: { Hello: { activeAssetId: "4f2c", takes: [desktopTake] } },
  settings: { provider: "elevenlabs", kokoroVoice: "am_adam", kokoroSpeed: 1.2 },
};

it("keeps desktop takes, with their file, after a restart", async () => {
  const speech = await load("desktop", saved);
  expect(speech.takesByText.Hello?.takes[0]).toMatchObject({
    path: desktopTake.path,
    mp3Url: desktopTake.mp3Url,
  });
});

it("speaks with Kokoro on desktop, even if ElevenLabs was saved", async () => {
  const speech = await load("desktop", saved);
  expect(speech.settings.provider).toBe("kokoro");
  expect(speech.settings.kokoroVoice).toBe("am_adam");
});

it("drops asset URLs on the web, where they can't play", async () => {
  const speech = await load("", saved);
  expect(speech.takesByText.Hello).toBeUndefined();
  expect(speech.settings.provider).toBe("elevenlabs");
});
