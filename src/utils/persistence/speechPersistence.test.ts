import { afterEach, it, expect, vi } from "vitest";
import {
  loadSpeech,
  saveSpeech,
  saveElevenLabsKey,
  getElevenLabsKey,
  SPEECH_KEY,
  ELEVENLABS_KEY,
} from "./speechPersistence";
import { initialSpeechState } from "../../store/speechSlice";
afterEach(() => vi.unstubAllGlobals());
function storage() {
  const data = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  });
  return data;
}
it("stores the BYO key separately from takes and settings, and removes it", () => {
  const data = storage();
  saveElevenLabsKey("secret");
  saveSpeech(initialSpeechState);
  expect(getElevenLabsKey()).toBe("secret");
  expect(data.get(SPEECH_KEY)).not.toContain("secret");
  expect(data.get(ELEVENLABS_KEY)).toBe("secret");
  saveElevenLabsKey("");
  expect(getElevenLabsKey()).toBe("");
});
it("recovers from invalid JSON and rejects invalid audio URLs", () => {
  const data = storage();
  data.set(SPEECH_KEY, "bad JSON");
  expect(loadSpeech().settings.provider).toBe("kokoro");
  data.set(
    SPEECH_KEY,
    JSON.stringify({
      takesByText: {
        Hello: {
          activeAssetId: "bad",
          takes: [
            {
              assetId: "bad",
              mp3Url: "javascript:bad",
              durationMs: 1000,
              provider: "kokoro",
            },
          ],
        },
      },
      settings: { kokoroSpeed: 12 },
    }),
  );
  expect(loadSpeech().takesByText.Hello).toBeUndefined();
  expect(loadSpeech().settings.kokoroSpeed).toBe(2);
});
