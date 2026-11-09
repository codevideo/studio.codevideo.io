import { ICourse } from "@fullstackcraftllc/codevideo-types";
import {
  command,
  createFile,
  openTerminal,
  save,
  speak,
  type,
} from "./lessonActions";

export const offByOneStart = `limit = 5
for number in range(1, limit):
    print(number)
`;
export const offByOneFixed = offByOneStart.replace(
  "range(1, limit)",
  "range(1, limit + 1)",
);

export const pythonOffByOne: ICourse = {
  id: "python-off-by-one",
  name: "Fix an Off-by-One Bug",
  primaryLanguage: "python",
  description:
    "Find a missing loop iteration, explain Python’s exclusive stop value, and fix the boundary.",
  lessons: [
    {
      id: "python-range-boundaries",
      name: "Why did the loop stop at four?",
      description:
        "Use a small failing case to diagnose an inclusive-versus-exclusive boundary.",
      actions: [
        speak(
          "We want to print the numbers one through five. This program looks reasonable, but its last number is missing. Let’s reproduce the problem before changing anything.",
        ),
        ...createFile("count.py", offByOneStart),
        openTerminal,
        ...command("python3 count.py", "1\n2\n3\n4"),
        speak(
          "The output stops at four. Python’s range includes its start, but excludes its stop. Our limit is five, so five is the first number the loop does not visit.",
        ),
        speak(
          "We want an inclusive limit. Select the stop expression and add one. Keeping the correction here makes the intended boundary clear without changing the loop body.",
        ),
        { name: "editor-arrow-up", value: "2" },
        { name: "editor-command-right", value: "1" },
        { name: "editor-arrow-left", value: "2" },
        { name: "editor-shift+arrow-left", value: "5" },
        type("limit + 1"),
        save("count.py"),
        ...command("python3 count.py", "1\n2\n3\n4\n5"),
        speak(
          "Now five appears exactly once. Try a limit of one as a boundary check: the corrected range still visits one. For loop bugs, write down the first included value and the first excluded value.",
        ),
      ],
    },
  ],
};
