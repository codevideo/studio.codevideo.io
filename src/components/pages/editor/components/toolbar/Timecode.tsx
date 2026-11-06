import { useEffect, useRef } from "react";
import { Playback } from "../../hooks/usePlayback";
import { TimelineLayout } from "../../utils/timelineLayout";
import { playheadProgress } from "../../utils/playheadProgress";
export const formatTimecode = (ms: number) => {
  const s = Math.max(0, ms) / 1000;
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(s % 60)
    .toString()
    .padStart(2, "0")}.${Math.floor((s % 1) * 10)}`;
};
export function Timecode({
  playback,
  layout,
}: {
  playback: Playback;
  layout: TimelineLayout;
}) {
  const ref = useRef<HTMLOutputElement>(null);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const t = layout.tiles[playback.index];
      const current = t
        ? t.startMs +
          (playback.isPlaying
            ? playheadProgress(
                performance.now(),
                playback.clock.current.startedAt,
                t.durationMs,
                playback.index === 0 ? 1000 : 0,
              )
            : 1) *
            t.durationMs
        : 0;
      if (ref.current)
        ref.current.textContent = `${formatTimecode(current)} / ${formatTimecode(layout.durationMs)}`;
      if (playback.isPlaying) frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [playback, layout]);
  return (
    <output ref={ref} className="cv-timecode">
      00:00.0 / {formatTimecode(layout.durationMs)}
    </output>
  );
}
