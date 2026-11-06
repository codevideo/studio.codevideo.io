import {
  advancedCommandValueSeparator,
  AllActions,
  IAction,
  isRepeatableAction,
  isAdvancedValueAction,
} from "@fullstackcraftllc/codevideo-types";
export interface IActionsEdit {
  actions: IAction[];
  currentActionIndex: number;
}
export function insertActionAfter(
  actions: IAction[],
  index: number,
  action: IAction,
): IActionsEdit {
  const at = Math.max(0, Math.min(actions.length, index + 1));
  return {
    actions: [...actions.slice(0, at), { ...action }, ...actions.slice(at)],
    currentActionIndex: at,
  };
}
export function deleteAction(actions: IAction[], index: number): IActionsEdit {
  if (!actions[index]) return { actions, currentActionIndex: index };
  return {
    actions: actions.filter((_, i) => i !== index),
    currentActionIndex: Math.min(index, actions.length - 2),
  };
}
export const setActionValue = (
  actions: IAction[],
  index: number,
  value: string,
) => actions.map((a, i) => (i === index ? { ...a, value } : a));
export const setAdvancedActionValue = (
  actions: IAction[],
  index: number,
  from: string,
  to: string,
) =>
  setActionValue(
    actions,
    index,
    `${from}${advancedCommandValueSeparator}${to}`,
  );
export function getSuggestedValueForActionName(
  name: string,
  spaces = 0,
): string {
  const a = { name: name as AllActions, value: "" };
  if (isRepeatableAction(a)) return "1";
  if (name === "file-explorer-set-file-caret-position")
    return ["myfile.txt", "1", "1"].join(advancedCommandValueSeparator);
  if (name === "file-explorer-set-file-contents")
    return ["myfile.txt", "Hello, world!"].join(advancedCommandValueSeparator);
  if (isAdvancedValueAction(a) && name.includes("folder"))
    return ["myfolder", "mynewfolder"].join(advancedCommandValueSeparator);
  if (name === "terminal-set-output") return "Hello, world!";
  if (name === "terminal-set-prompt") return "$";
  if (name === "terminal-set-present-working-directory") return "~/project";
  if (isAdvancedValueAction(a))
    return `myfile.txt${advancedCommandValueSeparator}mynewfile.txt`;
  if (name.startsWith("author-speak-")) return "My new speak action.";
  if (name === "author-wait") return "1000";
  if (name === "editor-type") return " ".repeat(spaces) + "code";
  if (name === "terminal-type") return "echo Hello";
  if (name === "external-browser") return "https://example.com";
  if (name.startsWith("slide-")) return "# My slide";
  if (name.startsWith("file-explorer-"))
    return name.includes("folder") ? "myfolder" : "myfile.txt";
  return "1";
}
export const renameAction = (
  actions: IAction[],
  index: number,
  name: AllActions,
  spaces = 0,
) =>
  actions.map((action, i) => {
    if (i !== index || action.name === name) return action;
    const target = { name, value: action.value };
    const compatible =
      action.name.split("-")[0] === name.split("-")[0] &&
      isRepeatableAction(action) === isRepeatableAction(target) &&
      isAdvancedValueAction(action) === isAdvancedValueAction(target) &&
      (action.name === "file-explorer-set-file-caret-position") ===
        (name === "file-explorer-set-file-caret-position") &&
      (action.name === "author-wait") === (name === "author-wait");
    return {
      ...action,
      name,
      value: compatible
        ? action.value
        : getSuggestedValueForActionName(name, spaces),
    };
  });
export function moveAction(
  actions: IAction[],
  from: number,
  to: number,
): IActionsEdit {
  if (!actions[from] || to < 0 || to >= actions.length || from === to)
    return { actions, currentActionIndex: from };
  const next = [...actions];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return { actions: next, currentActionIndex: to };
}
