import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { reconcileActionIds } from "./reconcileActionIds";
const a = (value: string): IAction => ({ name: "editor-type", value });
describe("clip IDs", () => {
  it("preserves distinct occurrences of the same object", () => {
    const x = a("x");
    expect(reconcileActionIds([x, x], ["a", "b"], [x, x])).toEqual(["a", "b"]);
    expect(
      reconcileActionIds([x, x], ["a", "b"], [x, x, x], () => "new"),
    ).toEqual(["a", "b", "new"]);
  });
  it("preserves position for edits, reference for moves and creates new insertion IDs", () => {
    const x = a("x"),
      y = a("y");
    expect(reconcileActionIds([x, y], ["a", "b"], [y, x])).toEqual(["b", "a"]);
    expect(reconcileActionIds([x, y], ["a", "b"], [a("z"), y])).toEqual([
      "a",
      "b",
    ]);
    expect(
      reconcileActionIds([x, y], ["a", "b"], [x, a("new"), y], () => "new"),
    ).toEqual(["a", "new", "b"]);
  });
  it("never duplicates an id when references are reversed or replaced", () =>
    fc.assert(
      fc.property(fc.array(fc.string(), { maxLength: 100 }), (values) => {
        const prev = values.map(a);
        const ids = prev.map((_, i) => String(i));
        let created = 0;
        const next = [...prev]
          .reverse()
          .map((x, i) => (i % 3 === 0 ? a(x.value) : x));
        const result = reconcileActionIds(
          prev,
          ids,
          next,
          () => `new-${created++}`,
        );
        expect(new Set(result).size).toBe(next.length);
      }),
    ));
});
