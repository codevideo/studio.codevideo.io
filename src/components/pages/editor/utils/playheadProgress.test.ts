import { it, expect } from "vitest";
import fc from "fast-check";
import { playheadProgress } from "./playheadProgress";
it("accounts for the initial IDE delay and clamps progress", () => {
  expect(playheadProgress(500, 0, 1000, 1000)).toBe(0);
  expect(playheadProgress(1500, 0, 1000, 1000)).toBe(0.5);
  expect(playheadProgress(5000, 0, 1000, 1000)).toBe(1);
});
it("always stays on the current clip", () =>
  fc.assert(
    fc.property(
      fc.integer(),
      fc.integer(),
      fc.integer(),
      (now, start, duration) => {
        const p = playheadProgress(now, start, duration);
        expect(p).toBeGreaterThanOrEqual(0);
        expect(p).toBeLessThanOrEqual(1);
      },
    ),
  ));
