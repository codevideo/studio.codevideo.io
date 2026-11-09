import { ICourse } from "@fullstackcraftllc/codevideo-types";
import {
  command,
  createFile,
  openTerminal,
  replaceFile,
  speak,
} from "./lessonActions";

export const temperaturesRepeated = `morning_c = 10
afternoon_c = 20

print(f"Morning: {morning_c * 9 / 5 + 32:.1f} F")
print(f"Afternoon: {afternoon_c * 9 / 5 + 32:.1f} F")
`;
export const temperaturesRefactored = `def to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32


morning_c = 10
afternoon_c = 20

print(f"Morning: {to_fahrenheit(morning_c):.1f} F")
print(f"Afternoon: {to_fahrenheit(afternoon_c):.1f} F")
`;
export const pythonRefactoring: ICourse = {
  id: "python-extract-function",
  name: "Turn Repeated Code into a Function",
  primaryLanguage: "python",
  description:
    "Extract a temperature-conversion function while preserving the program’s output.",
  lessons: [
    {
      id: "extract-temperature-conversion",
      name: "Refactor without changing behavior",
      description:
        "Name a repeated calculation and verify the result before and after.",
      actions: [
        speak(
          "Both of these lines convert Celsius to Fahrenheit. The program works, but the conversion rule is repeated. Before refactoring, let’s capture the output we want to preserve.",
        ),
        ...createFile("temperatures.py", temperaturesRepeated),
        openTerminal,
        ...command(
          "python3 temperatures.py",
          "Morning: 50.0 F\nAfternoon: 68.0 F",
        ),
        speak(
          "A refactor changes structure without changing behavior. Extract the repeated expression into a function with a descriptive name. Its parameter is the input, and return supplies the converted value.",
        ),
        ...replaceFile(
          "temperatures.py",
          temperaturesRepeated,
          temperaturesRefactored,
        ),
        speak(
          "Now both print statements call the same function. The formatting still belongs at the display boundary: the conversion returns a number, not a preformatted sentence.",
        ),
        ...command(
          "python3 temperatures.py",
          "Morning: 50.0 F\nAfternoon: 68.0 F",
        ),
        speak(
          "The output is unchanged. We now have one place to inspect the conversion rule, and a small function we can test on its own. When extracting a function, compare behavior before and after, not just whether the code looks cleaner.",
        ),
      ],
    },
  ],
};
