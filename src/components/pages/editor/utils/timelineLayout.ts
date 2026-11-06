export interface TimelineTile {
  index: number;
  startMs: number;
  durationMs: number;
  x: number;
  width: number;
}
export interface TimelineLayout {
  tiles: TimelineTile[];
  width: number;
  durationMs: number;
}
export function buildTimelineLayout(
  durations: number[],
  pixelsPerSecond: number,
  minimumWidth = 8,
): TimelineLayout {
  let x = 0,
    startMs = 0;
  const tiles = durations.map((ms, index) => {
    const durationMs = Number.isFinite(ms) ? Math.max(1, ms) : 1;
    const width = Math.max(minimumWidth, (durationMs * pixelsPerSecond) / 1000);
    const tile = { index, startMs, durationMs, x, width };
    x += width;
    startMs += durationMs;
    return tile;
  });
  return { tiles, width: x, durationMs: startMs };
}
export function timeToX(layout: TimelineLayout, time: number): number {
  const tile = layout.tiles.find((t) => time < t.startMs + t.durationMs);
  return tile
    ? tile.x + Math.max(0, (time - tile.startMs) / tile.durationMs) * tile.width
    : layout.width;
}
export function indexAtTime(layout: TimelineLayout, time: number): number {
  return (
    layout.tiles.find((t) => time < t.startMs + t.durationMs)?.index ??
    layout.tiles.length - 1
  );
}
// Seek to the closest boundary; -1 is the empty IDE before action zero.
export function xToIndex(layout: TimelineLayout, x: number): number {
  const tile = layout.tiles.find((t) => x < t.x + t.width);
  if (!tile) return layout.tiles.length - 1;
  return x - tile.x < tile.width / 2 ? tile.index - 1 : tile.index;
}
