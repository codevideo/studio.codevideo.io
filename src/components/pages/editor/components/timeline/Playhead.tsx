import { RefObject, useEffect, useRef } from "react";
import { TimelineLayout, xToIndex } from "../../utils/timelineLayout";
import { playheadProgress } from "../../utils/playheadProgress";
import { Playback } from "../../hooks/usePlayback";
export function Playhead({
  layout,
  playback,
  scrollRef,
  follow,
}: {
  layout: TimelineLayout;
  playback: Playback;
  scrollRef: RefObject<HTMLDivElement | null>;
  follow: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const tile = layout.tiles[playback.index];
      const progress =
        playback.isPlaying && tile
          ? playheadProgress(
              performance.now(),
              playback.clock.current.startedAt,
              tile.durationMs,
              playback.index === 0 ? 1000 : 0,
            )
          : 1;
      const x = tile ? tile.x + tile.width * progress : 0;
      if (ref.current) ref.current.style.transform = `translateX(${x}px)`;
      const scroller = scrollRef.current;
      if (follow && playback.isPlaying && scroller) {
        if (
          x < scroller.scrollLeft ||
          x > scroller.scrollLeft + scroller.clientWidth - 60
        )
          scroller.scrollLeft = Math.max(0, x - scroller.clientWidth * 0.3);
      }
      if (playback.isPlaying) frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, [layout, playback, follow, scrollRef]);
  return (
    <div ref={ref} className="cv-playhead">
      <button
        aria-label="Scrub playhead"
        className="cv-playhead-handle"
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          playback.pause();
        }}
        onPointerMove={(e) => {
          if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
          const rect = scrollRef.current?.getBoundingClientRect();
          if (rect)
            playback.seek(
              xToIndex(
                layout,
                e.clientX - rect.left + (scrollRef.current?.scrollLeft ?? 0),
              ),
            );
        }}
        onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
      />
    </div>
  );
}
