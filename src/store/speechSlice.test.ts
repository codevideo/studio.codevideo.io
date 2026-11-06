import { it, expect } from "vitest";
import reducer, {
  addSpeechTake,
  selectSpeechTake,
  initialSpeechState,
  ISpeechTake,
} from "./speechSlice";
it("keeps five takes per text, selects the latest and supports previous takes", () => {
  let state = initialSpeechState;
  for (let i = 0; i < 8; i++) {
    const take: ISpeechTake = {
      assetId: String(i),
      mp3Url: "https://example.com",
      provider: "kokoro",
      voiceId: "af_heart",
      speed: 1,
      durationMs: 1000,
      created: "",
    };
    state = reducer(state, addSpeechTake({ text: "Hello", take }));
  }
  expect(state.takesByText.Hello?.takes).toHaveLength(5);
  expect(state.takesByText.Hello?.activeAssetId).toBe("7");
  state = reducer(state, selectSpeechTake({ text: "Hello", assetId: "4" }));
  expect(state.takesByText.Hello?.activeAssetId).toBe("4");
  expect("elevenLabsApiKey" in state.settings).toBe(false);
});

it("handles speech text that matches an object prototype key", () => {
  const take: ISpeechTake = {
    assetId: "safe",
    mp3Url: "https://example.com/safe.mp3",
    provider: "kokoro",
    voiceId: "af_heart",
    speed: 1,
    durationMs: 1000,
    created: "",
  };
  const state = reducer(
    initialSpeechState,
    addSpeechTake({ text: "__proto__", take }),
  );
  expect(state.takesByText["__proto__"]?.activeAssetId).toBe("safe");
});
