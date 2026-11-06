import { initialSpeechState, SpeechState } from "../../store/speechSlice";
export const SPEECH_KEY = "CODEVIDEO_SPEECH";
export const ELEVENLABS_KEY = "CODEVIDEO_ELEVENLABS_KEY";
export function loadSpeech(): Pick<SpeechState, "takesByText" | "settings"> {
  try {
    const data = JSON.parse(localStorage.getItem(SPEECH_KEY) ?? "null");
    if (!data || typeof data !== "object") return initialSpeechState;
    const takesByText: SpeechState["takesByText"] = Object.create(null);
    for (const [text, line] of Object.entries(data.takesByText ?? {}) as [
      string,
      any,
    ][]) {
      if (!line || !Array.isArray(line.takes)) continue;
      const takes = line.takes
        .filter(
          (t: any) =>
            typeof t.assetId === "string" &&
            typeof t.mp3Url === "string" &&
            /^https?:/.test(t.mp3Url) &&
            Number.isFinite(t.durationMs) &&
            t.durationMs > 0 &&
            ["kokoro", "elevenlabs"].includes(t.provider),
        )
        .slice(0, 5);
      if (takes.length)
        takesByText[text] = {
          takes,
          activeAssetId: takes.some(
            (t: any) => t.assetId === line.activeAssetId,
          )
            ? line.activeAssetId
            : takes[0].assetId,
        };
    }
    const s = data.settings ?? {};
    return {
      takesByText,
      settings: {
        provider: s.provider === "elevenlabs" ? "elevenlabs" : "kokoro",
        kokoroVoice:
          typeof s.kokoroVoice === "string" ? s.kokoroVoice : "af_heart",
        kokoroSpeed: Number.isFinite(s.kokoroSpeed)
          ? Math.max(0.5, Math.min(2, s.kokoroSpeed))
          : 1,
        elevenLabsVoiceId:
          typeof s.elevenLabsVoiceId === "string" ? s.elevenLabsVoiceId : "",
      },
    };
  } catch {
    return initialSpeechState;
  }
}
export function saveSpeech(state: SpeechState) {
  localStorage.setItem(
    SPEECH_KEY,
    JSON.stringify({
      takesByText: state.takesByText,
      settings: state.settings,
    }),
  );
}
export const getElevenLabsKey = () =>
  localStorage.getItem(ELEVENLABS_KEY) ?? "";
export function saveElevenLabsKey(key: string) {
  if (key) localStorage.setItem(ELEVENLABS_KEY, key);
  else localStorage.removeItem(ELEVENLABS_KEY);
}
