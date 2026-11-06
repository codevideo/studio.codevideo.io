import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  IAction,
  advancedCommandValueSeparator,
} from "@fullstackcraftllc/codevideo-types";
import {
  moveAction,
  insertActionAfter,
  deleteAction,
  setActionValue,
  setAdvancedActionValue,
  renameAction,
  getSuggestedValueForActionName,
} from "./actionEdits";
const a = (value: string): IAction => ({ name: "editor-type", value });
describe("action edits", () => {
  it("moves one action without mutating or losing another", () =>
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 100 }),
        fc.nat(),
        fc.nat(),
        (values, x, y) => {
          const actions = values.map(a);
          const before = [...actions];
          const from = x % actions.length,
            to = y % actions.length;
          const result = moveAction(actions, from, to);
          expect(result.actions[to]).toBe(actions[from]);
          expect(result.actions.filter((_, i) => i !== to)).toEqual(
            actions.filter((_, i) => i !== from),
          );
          expect(actions).toEqual(before);
        },
      ),
    ));
  it("ignores invalid moves", () => {
    const actions = [a("x")];
    expect(moveAction(actions, -1, 0).actions).toBe(actions);
    expect(moveAction(actions, 0, 10).actions).toBe(actions);
  });
  it("inserts a copy, and deletes the last action to an empty list", () => {
    const source = a("a");
    const result = insertActionAfter([], -1, source);
    expect(result.actions[0]).not.toBe(source);
    expect(result.currentActionIndex).toBe(0);
    expect(deleteAction(result.actions, 0)).toEqual({
      actions: [],
      currentActionIndex: -1,
    });
  });
  it("clamps insertion at both boundaries", () => {
    expect(insertActionAfter([a("a")], -5, a("b")).currentActionIndex).toBe(0);
    expect(insertActionAfter([a("a")], 100, a("b")).currentActionIndex).toBe(1);
  });
  it("edits only the requested value", () => {
    const actions = [a("a"), a("b")];
    const next = setActionValue(actions, 1, "new");
    expect(next[0]).toBe(actions[0]);
    expect(next[1]?.value).toBe("new");
    expect(actions[1]?.value).toBe("b");
  });
  it("keeps both halves of advanced values", () => {
    expect(setAdvancedActionValue([a("a")], 0, "from", "to")[0]?.value).toBe(
      `from${advancedCommandValueSeparator}to`,
    );
  });
  it("uses valid defaults when changing value kinds", () => {
    expect(renameAction([a("code")], 0, "editor-enter")[0]?.value).toBe("1");
    expect(renameAction([a("code")], 0, "author-wait")[0]?.value).toBe("1000");
    expect(
      getSuggestedValueForActionName("file-explorer-rename-file"),
    ).toContain(advancedCommandValueSeparator);
  });
});

it("preserves speech when switching its placement", () => {
  expect(
    renameAction(
      [{ name: "author-speak-before", value: "Keep my words" }],
      0,
      "author-speak-after",
    )[0]?.value,
  ).toBe("Keep my words");
});
