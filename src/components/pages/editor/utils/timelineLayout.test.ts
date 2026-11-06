import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  buildTimelineLayout,
  timeToX,
  indexAtTime,
  xToIndex,
} from "./timelineLayout";
describe("timeline mapping", () => {
  it("maps a staircase with minimum clip widths piecewise", () => {
    const l = buildTimelineLayout([10, 1000, 10], 10);
    expect(l.tiles.map((t) => t.width)).toEqual([8, 10, 8]);
    expect(timeToX(l, 510)).toBe(13);
    expect(xToIndex(l, 2)).toBe(-1);
    expect(xToIndex(l, 7)).toBe(0);
    expect(xToIndex(l, 26)).toBe(2);
    expect(indexAtTime(l, 10)).toBe(1);
  });
  it("has contiguous clips with exact total times and monotone positions", () =>
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 100000 }), { maxLength: 100 }),
        fc.integer({ min: 1, max: 240 }),
        (durations, zoom) => {
          const l = buildTimelineLayout(durations, zoom);
          expect(l.durationMs).toBe(durations.reduce((s, d) => s + d, 0));
          expect(timeToX(l, l.durationMs)).toBe(l.width);
          l.tiles.forEach((t, i) => {
            expect(timeToX(l, t.startMs)).toBeCloseTo(t.x);
            expect(xToIndex(l, t.x + t.width)).toBe(i);
            expect(t.width).toBeGreaterThanOrEqual(8);
            expect(indexAtTime(l, t.startMs)).toBe(i);
          });
        },
      ),
    ));
  it("handles empty lessons and invalid estimates", () => {
    const l = buildTimelineLayout([], 48);
    expect(timeToX(l, 0)).toBe(0);
    expect(xToIndex(l, 10)).toBe(-1);
    expect(indexAtTime(l, 0)).toBe(-1);
    expect(
      buildTimelineLayout([NaN, -1, 0], 48).tiles.map((t) => t.width),
    ).toEqual([8, 8, 8]);
  });
});
