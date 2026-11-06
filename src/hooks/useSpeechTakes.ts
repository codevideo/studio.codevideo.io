import { useAuth } from "@clerk/clerk-react";
import { useStore } from "react-redux";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { RootState } from "../store";
import {
  addSpeechTake,
  selectSpeechTake,
  setSpeechPending,
  SpeechSettings,
} from "../store/speechSlice";
import {
  activeTake,
  buildSpeakActionAudios,
} from "../utils/speech/speechAudio";
import { getElevenLabsKey } from "../utils/persistence/speechPersistence";
import { textToSpeech, measureAudioDuration } from "../utils/api/textToSpeech";
import { addToast } from "../store/toastSlice";
const inFlight = new Map<string, Promise<void>>();
export function useSpeechTakes() {
  const state = useAppSelector((s) => s.speech);
  const store = useStore<RootState>();
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  async function generateTake(
    text: string,
    overrides: Partial<SpeechSettings> = {},
  ) {
    if (inFlight.has(text)) return inFlight.get(text)!;
    const task = (async () => {
      dispatch(setSpeechPending({ text, pending: true }));
      try {
        if (!text.trim() || text.length > 1000)
          throw new Error("Speech needs 1–1000 characters.");
        const settings = { ...store.getState().speech.settings, ...overrides };
        const token = await getToken();
        if (!token) throw new Error("Sign in to generate speech.");
        const key =
          settings.provider === "elevenlabs" ? getElevenLabsKey() : undefined;
        if (
          settings.provider === "elevenlabs" &&
          (!key || !/^[A-Za-z0-9]{10,40}$/.test(settings.elevenLabsVoiceId))
        )
          throw new Error(
            "Add your ElevenLabs key and a valid voice ID in Speech settings.",
          );
        const take = await textToSpeech(
          {
            text,
            provider: settings.provider,
            voiceId:
              settings.provider === "kokoro"
                ? settings.kokoroVoice
                : settings.elevenLabsVoiceId,
            speed: settings.provider === "kokoro" ? settings.kokoroSpeed : 1,
            ...(key ? { elevenLabsApiKey: key } : {}),
          },
          token,
        );
        const durationMs = await measureAudioDuration(take.mp3Url);
        dispatch(
          addSpeechTake({
            text,
            take: { ...take, durationMs, created: new Date().toISOString() },
          }),
        );
      } finally {
        dispatch(setSpeechPending({ text, pending: false }));
      }
    })();
    inFlight.set(text, task);
    try {
      await task;
    } finally {
      inFlight.delete(text);
    }
  }
  async function generateMissing(actions: IAction[]) {
    const texts = [
      ...new Set(
        actions
          .filter((a) => a.name.startsWith("author-speak-"))
          .map((a) => a.value),
      ),
    ].filter((t) => !activeTake(t, store.getState().speech.takesByText));
    const settings = { ...store.getState().speech.settings };
    let next = 0,
      done = 0;
    const errors: unknown[] = [];
    dispatch(addToast(`Generating ${texts.length} missing speech lines…`));
    async function worker() {
      while (next < texts.length) {
        const text = texts[next++]!;
        try {
          await generateTake(text, settings);
        } catch (e) {
          errors.push(e);
        }
        done++;
        dispatch(addToast(`Speech: ${done} / ${texts.length} processed`));
      }
    }
    await Promise.all([worker(), worker()]);
    if (errors.length)
      throw new Error(
        `${errors.length} speech lines could not be generated. ${errors[0] instanceof Error ? errors[0].message : ""}`,
      );
    return buildSpeakActionAudios(actions, store.getState().speech.takesByText);
  }
  return {
    ...state,
    generateTake,
    generateMissing,
    takeFor: (text: string) => activeTake(text, state.takesByText),
    selectTake: (text: string, assetId: string) =>
      dispatch(selectSpeechTake({ text, assetId })),
  };
}
