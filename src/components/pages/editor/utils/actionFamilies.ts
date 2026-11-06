import {
  AllActions,
  AllActionStrings,
  IAction,
  isCompositeAction,
} from "@fullstackcraftllc/codevideo-types";
export const familyColors = {
  author: "blue",
  editor: "purple",
  terminal: "gray",
  "file-explorer": "green",
  mouse: "pink",
  external: "orange",
  slide: "amber",
} as const;
export type ActionFamily = keyof typeof familyColors;
export function familyOf(name: string): ActionFamily {
  return (
    (Object.keys(familyColors) as ActionFamily[]).find((f) =>
      name.startsWith(f + "-"),
    ) ?? "author"
  );
}
export const colorOf = (name: string) => familyColors[familyOf(name)];
export const isSpeakAction = (a: IAction) => a.name.startsWith("author-speak-");
export const trackOf = (a: IAction) => (isSpeakAction(a) ? "A" : "V");
export const insertableActions = AllActionStrings.filter(
  (name) =>
    name !== "editor-highlight-code" &&
    !isCompositeAction({ name: name as AllActions, value: "" }),
);
