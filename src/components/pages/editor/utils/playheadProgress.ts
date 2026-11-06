export function playheadProgress(
  now: number,
  startedAt: number,
  durationMs: number,
  initialDelayMs = 0,
): number {
  return Math.min(
    1,
    Math.max(0, (now - startedAt - initialDelayMs) / Math.max(1, durationMs)),
  );
}
