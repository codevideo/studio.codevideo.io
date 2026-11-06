import { it, expect } from "vitest";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import {
  isSpeakAction,
  trackOf,
  colorOf,
  insertableActions,
} from "./actionFamilies";
import { getValueKind, splitAdvancedValue } from "./valueKind";
const a = (name: string, value = ""): IAction => ({
  name: name as IAction["name"],
  value,
});
it("keeps waits on video and only speech on audio", () => {
  expect(trackOf(a("author-wait"))).toBe("V");
  expect(trackOf(a("author-speak-during"))).toBe("A");
  expect(isSpeakAction(a("author-wait"))).toBe(false);
  expect(colorOf("slide-show")).toBe("amber");
});
it("hides unsupported actions in the insert picker", () => {
  expect(insertableActions).not.toContain("editor-highlight-code");
  expect(insertableActions.some((n) => n.startsWith("author-speak-"))).toBe(
    true,
  );
});
it("chooses field types", () => {
  expect(getValueKind(a("editor-enter"))).toBe("repeat");
  expect(getValueKind(a("author-wait"))).toBe("milliseconds");
  expect(getValueKind(a("external-browser"))).toBe("url");
  expect(getValueKind(a("file-explorer-rename-file"))).toBe("pair");
  expect(getValueKind(a("author-speak-before"))).toBe("prose");
  expect(getValueKind(a("editor-type"))).toBe("code");
});

it("preserves separators embedded in file content", () => {
  expect(splitAdvancedValue("file_____hello_____world", "_____")).toEqual([
    "file",
    "hello_____world",
  ]);
  expect(getValueKind(a("file-explorer-set-file-caret-position"))).toBe(
    "caret",
  );
});
