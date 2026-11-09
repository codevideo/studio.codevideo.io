import {
  IAction,
  advancedCommandValueSeparator,
} from "@fullstackcraftllc/codevideo-types";

export const speak = (value: string): IAction => ({
  name: "author-speak-before",
  value,
});
export const type = (value: string): IAction => ({
  name: "editor-type",
  value,
});
export const save = (filename: string): IAction => ({
  name: "editor-save",
  value: filename,
});

export function createFile(filename: string, content: string): IAction[] {
  return [
    { name: "file-explorer-create-file", value: filename },
    { name: "file-explorer-open-file", value: filename },
    type(content),
    save(filename),
  ];
}

/** Seed a previous lesson's file without relying on cross-lesson IDE state. */
export function startingFile(filename: string, content: string): IAction[] {
  return [
    { name: "file-explorer-create-file", value: filename },
    {
      name: "file-explorer-set-file-contents",
      value: filename + advancedCommandValueSeparator + content,
    },
    { name: "file-explorer-open-file", value: filename },
  ];
}

/** Select complete lines, including the final newline, before typing a replacement. */
export function replaceFile(
  filename: string,
  before: string,
  after: string,
): IAction[] {
  const lines = before.split("\n").length - 1;
  if (!before.endsWith("\n") || lines < 1 || lines > 100)
    throw new Error(
      "Example replacements need 1–100 newline-terminated lines.",
    );
  return [
    { name: "file-explorer-open-file", value: filename },
    { name: "editor-arrow-down", value: String(lines) },
    { name: "editor-command-right", value: "1" },
    { name: "editor-shift+arrow-up", value: String(lines) },
    type(after),
    save(filename),
  ];
}

export const openTerminal: IAction = { name: "terminal-open", value: "1" };

/** Programming runtimes are demonstrated with authored output, as in the existing examples. */
export function command(value: string, output?: string): IAction[] {
  return [
    { name: "terminal-type", value },
    ...(output
      ? [{ name: "terminal-set-output" as const, value: output }]
      : []),
    { name: "terminal-enter", value: "1" },
  ];
}
