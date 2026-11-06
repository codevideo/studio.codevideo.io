import { useEffect, useRef, useState } from "react";
import { Button } from "@radix-ui/themes";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { useSpeechTakes } from "../../../../../hooks/useSpeechTakes";
import { setSpeechSettings } from "../../../../../store/speechSlice";
import {
  getElevenLabsKey,
  saveElevenLabsKey,
} from "../../../../../utils/persistence/speechPersistence";
import { kokoroVoices } from "../../../../../utils/speech/kokoroVoices";
import { addToast } from "../../../../../store/toastSlice";
const sample = "Welcome to CodeVideo. Let’s build something together.";
export function SpeechSettings() {
  const { settings, generateTake, takeFor, pending } = useSpeechTakes();
  const dispatch = useAppDispatch();
  const [key, setKey] = useState("");
  const audio = useRef<HTMLAudioElement | null>(null);
  const [testing, setTesting] = useState(false);
  useEffect(() => {
    setKey(getElevenLabsKey());
    return () => audio.current?.pause();
  }, []);
  const test = async () => {
    setTesting(true);
    try {
      await generateTake(sample);
      dispatch(
        addToast("Voice sample generated. Press Play sample to listen."),
      );
    } catch (e) {
      dispatch(addToast(e instanceof Error ? e.message : "Voice test failed."));
    } finally {
      setTesting(false);
    }
  };
  const play = () => {
    const take = takeFor(sample);
    if (take) {
      audio.current?.pause();
      audio.current = new Audio(take.mp3Url);
      audio.current
        .play()
        .catch(() => dispatch(addToast("Could not play the sample.")));
    }
  };
  return (
    <div className="cv-speech-settings">
      <label className="cv-field-label">
        Provider
        <select
          value={settings.provider}
          onChange={(e) =>
            dispatch(
              setSpeechSettings({
                provider: e.target.value as "kokoro" | "elevenlabs",
              }),
            )
          }
        >
          <option value="kokoro">Kokoro (default)</option>
          <option value="elevenlabs">ElevenLabs (your key)</option>
        </select>
      </label>
      {settings.provider === "kokoro" ? (
        <>
          <label className="cv-field-label">
            Kokoro voice
            <select
              value={settings.kokoroVoice}
              onChange={(e) =>
                dispatch(setSpeechSettings({ kokoroVoice: e.target.value }))
              }
            >
              {kokoroVoices.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="cv-field-label">
            Speed · {settings.kokoroSpeed.toFixed(2)}×
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={settings.kokoroSpeed}
              onChange={(e) =>
                dispatch(
                  setSpeechSettings({ kokoroSpeed: Number(e.target.value) }),
                )
              }
            />
          </label>
        </>
      ) : (
        <>
          <label className="cv-field-label">
            ElevenLabs API key
            <input
              type="password"
              autoComplete="off"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                try {
                  saveElevenLabsKey(e.target.value);
                } catch {
                  dispatch(
                    addToast(
                      "Browser storage is unavailable; the key could not be saved.",
                    ),
                  );
                }
              }}
            />
          </label>
          <label className="cv-field-label">
            Voice ID
            <input
              value={settings.elevenLabsVoiceId}
              pattern="[A-Za-z0-9]{10,40}"
              onChange={(e) =>
                dispatch(
                  setSpeechSettings({ elevenLabsVoiceId: e.target.value }),
                )
              }
            />
          </label>
          <Button
            variant="soft"
            color="red"
            onClick={() => {
              saveElevenLabsKey("");
              setKey("");
            }}
          >
            Remove key
          </Button>
          <p className="cv-help">
            Your key stays in this browser. It is sent with each request to the
            CodeVideo API, which passes it to ElevenLabs and never stores or
            logs it. ElevenLabs bills you directly.
          </p>
        </>
      )}
      <div className="cv-inspector-actions">
        <Button disabled={testing || pending.includes(sample)} onClick={test}>
          {testing
            ? "Generating sample…"
            : settings.provider === "kokoro"
              ? "Generate sample"
              : "Test voice"}
        </Button>
        {takeFor(sample) && (
          <Button variant="soft" onClick={play}>
            Play sample
          </Button>
        )}
      </div>
    </div>
  );
}
