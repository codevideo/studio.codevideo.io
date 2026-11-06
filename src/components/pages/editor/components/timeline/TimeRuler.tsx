import { TimelineLayout, timeToX } from "../../utils/timelineLayout";
import { formatTimecode } from "../toolbar/Timecode";
export function TimeRuler({ layout }: { layout: TimelineLayout }) {
  const interval = Math.max(
    1000,
    Math.ceil(layout.durationMs / Math.max(1, layout.width / 100) / 1000) *
      1000,
  );
  return (
    <div className="cv-time-ruler">
      {Array.from(
        { length: Math.floor(layout.durationMs / interval) + 1 },
        (_, i) => i * interval,
      ).map((ms) => (
        <span key={ms} style={{ left: timeToX(layout, ms) }}>
          {formatTimecode(ms)}
        </span>
      ))}
    </div>
  );
}
