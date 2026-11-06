import { it, expect } from "vitest";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { SpeechLine, ISpeechTake } from "../../store/speechSlice";
import { buildSpeakActionAudios, speechMsByIndex } from "./speechAudio";
const take: ISpeechTake = {
  assetId: "take",
  mp3Url: "https://example.com/take.mp3",
  durationMs: 4200,
  provider: "kokoro",
  voiceId: "af_heart",
  speed: 1,
  created: "",
};
const takes: Record<string, SpeechLine> = {
  Hello: { activeAssetId: "take", takes: [take] },
};
it("maps exact text matches on speech only and handles repeated speech", () => {
  const actions: IAction[] = [
    { name: "author-speak-before", value: "Hello" },
    { name: "editor-type", value: "Hello" },
    { name: "author-speak-after", value: "Hello" },
    { name: "author-speak-before", value: "Hello!" },
  ];
  expect(
    buildSpeakActionAudios(actions, takes).map((a) => a.actionIndex),
  ).toEqual([0, 2]);
  expect(speechMsByIndex(actions, takes)).toEqual({ 0: 4200, 2: 4200 });
});
it("does not silently select a non-active take", () => {
  expect(
    buildSpeakActionAudios([{ name: "author-speak-before", value: "Hello" }], {
      Hello: { ...takes.Hello!, activeAssetId: "missing" },
    }),
  ).toEqual([]);
});
