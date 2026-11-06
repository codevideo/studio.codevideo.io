import { Button } from "@radix-ui/themes";
export function TimelineToolbar({
  zoom,
  setZoom,
  fit,
  follow,
  setFollow,
  undo,
  redo,
}: {
  zoom: number;
  setZoom: (n: number) => void;
  fit: () => void;
  follow: boolean;
  setFollow: (b: boolean) => void;
  undo: () => void;
  redo: () => void;
}) {
  return (
    <div className="cv-timeline-toolbar">
      <span className="cv-section-label">TIMELINE</span>
      <Button size="1" variant="ghost" onClick={undo}>
        Undo
      </Button>
      <Button size="1" variant="ghost" onClick={redo}>
        Redo
      </Button>
      <div className="cv-topbar-spacer" />
      <label className="cv-inline-label">
        <input
          type="checkbox"
          checked={follow}
          onChange={(e) => setFollow(e.target.checked)}
        />{" "}
        Follow playhead
      </label>
      <label className="cv-inline-label">
        Zoom
        <input
          aria-label="Timeline zoom"
          type="range"
          min="0.1"
          step="0.1"
          max="240"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </label>
      <Button size="1" variant="soft" onClick={fit}>
        Fit
      </Button>
    </div>
  );
}
