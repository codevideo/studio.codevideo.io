import { useEffect, useRef, useState } from "react";
import { Button } from "@radix-ui/themes";
import { useSpeechTakes } from "../../../../../hooks/useSpeechTakes";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { addToast } from "../../../../../store/toastSlice";
import { kokoroVoices } from "../../../../../utils/speech/kokoroVoices";
export function SpeechTakePanel({ text }: { text: string }) {
  const speech = useSpeechTakes();
  const take = speech.takeFor(text);
  const [voice, setVoice] = useState(speech.settings.kokoroVoice);
  const [speed, setSpeed] = useState(speech.settings.kokoroSpeed);
  const dispatch = useAppDispatch();
  const audio = useRef<HTMLAudioElement | null>(null);
  const [auditioning, setAuditioning] = useState(false);
  useEffect(
    () => () => {
      audio.current?.pause();
      window.speechSynthesis?.cancel();
    },
    [],
  );
  const busy = speech.pending.includes(text);
  const matching =
    take?.provider === "kokoro" &&
    take.voiceId === voice &&
    take.speed === speed;
  const audition = () => {
    if (auditioning) {
      audio.current?.pause();
      window.speechSynthesis?.cancel();
      setAuditioning(false);
      return;
    }
    setAuditioning(true);
    if (take) {
      audio.current = new Audio(take.mp3Url);
      audio.current.onended = () => setAuditioning(false);
      audio.current.play().catch(() => {
        setAuditioning(false);
        dispatch(addToast("Could not play this take."));
      });
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setAuditioning(false);
      utterance.onerror = () => setAuditioning(false);
      window.speechSynthesis.speak(utterance);
    }
  };
  return (
    <section className="cv-take-panel">
      <h3>Speech take</h3>
      <p className="cv-help">
        {take
          ? `${take.provider === "kokoro" ? "Kokoro" : "ElevenLabs"} · ${take.voiceId} · ${(take.durationMs / 1000).toFixed(1)} s`
          : "Browser voice preview, no audio yet"}
      </p>
      <div className="cv-inspector-actions">
        <Button size="1" variant="soft" onClick={audition}>
          {auditioning ? "Stop" : "Audition"}
        </Button>
        <Button
          size="1"
          disabled={busy || !text.trim()}
          onClick={() =>
            speech
              .generateTake(text, { kokoroVoice: voice, kokoroSpeed: speed })
              .catch((e) => dispatch(addToast(e.message)))
          }
        >
          {busy ? "Generating…" : take ? "Regenerate" : "Generate"}
        </Button>
      </div>
      {speech.settings.provider === "kokoro" && (
        <>
          <label className="cv-field-label">
            Voice for this line
            <select value={voice} onChange={(e) => setVoice(e.target.value)}>
              {kokoroVoices.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <label className="cv-field-label">
            Speed · {speed.toFixed(2)}×
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>
          {matching && (
            <p className="cv-help">
              Kokoro caches identical requests. Choose a different voice or
              speed for a different take.
            </p>
          )}
        </>
      )}
      <label className="cv-field-label">
        Earlier takes
        <select
          disabled={!take}
          value={take?.assetId ?? ""}
          onChange={(e) => speech.selectTake(text, e.target.value)}
        >
          {!take && <option value="">No takes yet</option>}
          {speech.takesByText[text]?.takes.map((t, i) => (
            <option key={t.assetId} value={t.assetId}>
              {i + 1}. {t.voiceId} · {t.speed}× ·{" "}
              {(t.durationMs / 1000).toFixed(1)} s
            </option>
          ))}
        </select>
      </label>
      <p className="cv-help">
        Use your own ElevenLabs voice in Settings → Speech. Up to five takes are
        kept for each line.
      </p>
    </section>
  );
}
