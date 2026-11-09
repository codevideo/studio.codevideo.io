import { ICourse } from "@fullstackcraftllc/codevideo-types";
import {
  command,
  createFile,
  openTerminal,
  replaceFile,
  speak,
  startingFile,
} from "./lessonActions";

export const greetArgument = String.raw`package main

import (
    "fmt"
    "os"
)

func main() {
    name := os.Args[1]
    fmt.Printf("Hello, %s!\n", name)
}
`;
export const greetGuarded = String.raw`package main

import (
    "fmt"
    "os"
)

func main() {
    if len(os.Args) != 2 {
        fmt.Fprintln(os.Stderr, "Usage: greet NAME")
        os.Exit(1)
    }
    name := os.Args[1]
    fmt.Printf("Hello, %s!\n", name)
}
`;
export const greetValidated = String.raw`package main

import (
    "fmt"
    "os"
    "strings"
)

func main() {
    if len(os.Args) != 2 {
        fmt.Fprintln(os.Stderr, "Usage: greet NAME")
        os.Exit(1)
    }
    name := strings.TrimSpace(os.Args[1])
    if name == "" {
        fmt.Fprintln(os.Stderr, "Name must not be blank")
        os.Exit(1)
    }
    fmt.Printf("Hello, %s!\n", name)
}
`;
export const goCli: ICourse = {
  id: "go-small-cli",
  name: "Build a Small Go CLI",
  primaryLanguage: "go",
  description:
    "Build a greeting command in three lessons: arguments, usage errors, and input validation. Requires Go.",
  lessons: [
    {
      id: "go-cli-arguments",
      name: "1. Read a command-line argument",
      description:
        "Build a standalone greeting program and read its first argument.",
      actions: [
        speak(
          "Let’s make a small command named greet. Its first version accepts one name and prints a greeting. In Go, the os package gives us the command-line arguments.",
        ),
        ...createFile("main.go", greetArgument),
        openTerminal,
        speak(
          "Argument zero is the program name, so the first user-supplied value is at index one. Build this file into an executable, then pass Ada as the name.",
        ),
        ...command("go build -o greet main.go"),
        ...command("./greet Ada", "Hello, Ada!"),
        speak(
          "The argument travels into name, then into the formatted greeting. This version assumes a name exists. In the next lesson, we will replace that assumption with a helpful usage check.",
        ),
      ],
    },
    {
      id: "go-cli-usage",
      name: "2. Handle missing arguments",
      description:
        "Check the argument count before indexing, and report usage errors on stderr.",
      actions: [
        ...startingFile("main.go", greetArgument),
        speak(
          "We are starting with the previous greeting program. Accessing argument one without checking the length can panic. A command-line tool should tell the user how to fix their input instead.",
        ),
        ...replaceFile("main.go", greetArgument, greetGuarded),
        openTerminal,
        speak(
          "Require exactly two entries: the executable name and one supplied name. Otherwise write usage to standard error and exit with a nonzero status. Only valid input reaches the array access.",
        ),
        ...command("go build -o greet main.go"),
        ...command("./greet", "Usage: greet NAME"),
        ...command("./greet Ada", "Hello, Ada!"),
        speak(
          "Missing input now produces a useful message, while the valid case still works. Exit status matters too: scripts can distinguish success from an input error without having to parse the greeting.",
        ),
      ],
    },
    {
      id: "go-cli-validation",
      name: "3. Validate the name",
      description:
        "Normalize whitespace, reject blank names, and preserve valid names with spaces.",
      actions: [
        ...startingFile("main.go", greetGuarded),
        speak(
          "Counting arguments is necessary, but it is not enough. A quoted string of spaces is still one argument. Let’s distinguish having an argument from having a usable name.",
        ),
        ...replaceFile("main.go", greetGuarded, greetValidated),
        openTerminal,
        speak(
          "TrimSpace removes surrounding whitespace. If nothing remains, report an error. We keep spaces inside the name, so a quoted full name is still valid.",
        ),
        ...command("go build -o greet main.go"),
        ...command('./greet "   "', "Name must not be blank"),
        ...command('./greet "  Ada Lovelace  "', "Hello, Ada Lovelace!"),
        speak(
          "We now have a small, usable command: it checks argument count, validates content, writes errors to standard error, and returns a failure status for invalid input. Small tools benefit from clear input rules just as much as large applications.",
        ),
      ],
    },
  ],
};
