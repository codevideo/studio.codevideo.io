import {
  IAction,
  isAdvancedValueAction,
  isRepeatableAction,
} from "@fullstackcraftllc/codevideo-types";
import { isSpeakAction } from "./actionFamilies";
export function getValueKind(a: IAction) {
  if (a.name === "file-explorer-set-file-caret-position") return "caret";
  if (isAdvancedValueAction(a)) return "pair";
  if (isRepeatableAction(a)) return "repeat";
  if (a.name === "author-wait") return "milliseconds";
  if (isSpeakAction(a)) return "prose";
  if (a.name === "external-browser") return "url";
  if (a.name.startsWith("slide-")) return "markdown";
  return "code";
}

export function splitAdvancedValue(
  value: string,
  separator: string,
): [string, string] {
  const at = value.indexOf(separator);
  return at < 0
    ? [value, ""]
    : [value.slice(0, at), value.slice(at + separator.length)];
}
