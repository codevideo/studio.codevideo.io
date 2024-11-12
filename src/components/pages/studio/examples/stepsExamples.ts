import { IAction } from "@fullstackcraftllc/codevideo-types";

export const blankJavaScriptExampleSteps: Array<IAction> = [
];

export const javaScriptExampleSteps: Array<IAction> = [
    {
      "name": "speak-before",
      "value": "Let's learn how to use the console.log function in JavaScript!"
    },
    {
      "name": "speak-before",
      "value": "First, to make it clear that this is a JavaScript file, I'll just put a comment here"
    },
    {
      "name": "type-editor",
      "value": "// index.js"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "speak-before",
      "value": "For starters, let's just print 'Hello world!' to the console."
    },
    {
      "name": "type-editor",
      "value": "console.log('Hello, world!');"
    },
    {
      "name": "speak-before",
      "value": "and if I wanted to write the value of some variable to the console, I could do that like so:"
    },
    {
      "name": "backspace",
      "value": "29"
    },
    {
      "name": "type-editor",
      "value": "const myVariable = 5;"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "console.log(myVariable);"
    },
    {
      "name": "speak-before",
      "value": "Now, when I run this code, I would expect the value of 'myVariable' to be printed to the console. Something like:"
    },
    {
      "name": "type-editor",
      "value": " // should log out '5'"
    },
    {
      "name": "speak-before",
      "value": "Console logging is simple, yet powerful and very useful!"
    }
];

export const javascriptCreateRenameDeleteFileExampleSteps: Array<IAction> = [
  {
    "name": "speak-before",
    "value": "Let's test CodeVideo's ability to create, rename, and delete files in JavaScript!"
  },
  {
    "name": "create-file",
    "value": "src/my-new-file.js"
  },
  {
    "name": "open-file",
    "value": "src/my-new-file.js"
  },
  {
    "name": "delete-file",
    "value": "src/my-new-file.js"
  }
];

export const pythonExampleSteps: Array<IAction> = [
    {
      "name": "speak-before",
      "value": "Let's learn how to use the print function in Python!"
    },
    {
      "name": "speak-before",
      "value": "First, to make it clear that this is a Python file, I'll just put a comment here"
    },
    {
      "name": "type-editor",
      "value": "# main.py"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "speak-before",
      "value": "and let's print 'Hello world!' to the console."
    },
    {
      "name": "type-editor",
      "value": "print('Hello, world!')"
    },
    {
      "name": "speak-before",
      "value": "and if I wanted to write the value of some variable to the console, I could do that like so:"
    },
    {
      "name": "backspace",
      "value": "22"
    },
    {
      "name": "type-editor",
      "value": "my_variable = 5"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "print(my_variable)"
    },
    {
      "name": "speak-before",
      "value": "Now, when I run this code, I would expect the value of 'my_variable' to be printed to the console. Something like:"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "# 5"
    },
    {
      "name": "speak-before",
      "value": "Console logging is simple, yet powerful and very useful!"
    }
];

export const cSharpExampleSteps: Array<IAction> = [
    {
      "name": "speak-before",
      "value": "Let's learn how to use the Console.WriteLine function in C sharp!"
    },
    {
      "name": "speak-before",
      "value": "First, to make it clear that this is a C sharp file, I'll just put a comment here"
    },
    {
      "name": "type-editor",
      "value": "// MyClass.cs"
    },
    {
      "name": "enter",
      "value": "2"
    },
    {
      "name": "speak-before",
      "value": "Then, we'll need to use System, so let's add that to the top of the file."
    },
    {
      "name": "type-editor",
      "value": "using System;"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "speak-before",
      "value": "Next, we'll need to create a name space and class declaration. Let's just use 'MyNamespace' and 'MyClass' for now."
    },
    {
      "name": "type-editor",
      "value": "namespace MyNamespace"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "{"
    },
    {
      "name": "enter",
      "value": "2"
    },
    {
      "name": "arrow-up",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "    class MyClass"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "    {"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "speak-before",
      "value": "We'll need a main method to run our code, so let's add that as well."
    },
    {
      "name": "type-editor",
      "value": "        public static void Main(string[] args)"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "        {"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "speak-before",
      "value": "Now let's print 'Hello world!' to the console."
    },
    {
      "name": "type-editor",
      "value": '            Console.WriteLine("Hello, world!");'
    },
    {
        "name": "enter",
        "value": "1"
    },
    {
        "name": "type-editor",
        "value": "        }"
    },
    {
        "name": "enter",
        "value": "1"
    },
    {
        "name": "type-editor",
        "value": "    }"
    },
    {
        "name": "enter",
        "value": "1"
    },
    {
        "name": "type-editor",
        "value": "}"
    },
    {
        "name": "arrow-up",
        "value": "3"
    },
    {
      "name": "speak-before",
      "value": "and if I wanted to write the value of some variable to the console, I could do that like so:"
    },
    {
      "name": "backspace",
      "value": "37"
    },
    {
      "name": "type-editor",
      "value": "            int myVariable = 5;"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "            Console.WriteLine(myVariable);"
    },
    {
      "name": "speak-before",
      "value": "Now, when I run this code, I would expect the value of 'myVariable' to be printed to the console. Something like:"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "// 5"
    },
    {
      "name": "speak-before",
      "value": "Console logging is simple, yet powerful and very useful!"
    }
];

export const goLangExampleSteps: Array<IAction> = [
    {
      "name": "speak-before",
      "value": "Let's learn how to use the fmt.Println function in Go!"
    },
    {
      "name": "speak-before",
      "value": "First, to make it clear that this is a Go file, I'll just put a comment here"
    },
    {
      "name": "type-editor",
      "value": "// main.go"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "speak-before",
      "value": "First, we'll need to declare the main package, and then the main function."
    },
    {
      "name": "type-editor",
      "value": "package main"
    },
    {
      "name": "enter",
      "value": "2"
    },
    {
        "name": "speak-before",
        "value": "And we'll need the fmt package to use the Println function."
    },
    {
      "name": "type-editor",
      "value": 'import "fmt"'
    },
    {
      "name": "enter",
      "value": "10"
    },
    {
      "name": "type-editor",
      "value": "func main() {"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "speak-before",
      "value": "and let's just print 'Hello world!' to the console."
    },
    {
      "name": "type-editor",
      "value": '    fmt.Println("Hello, world!")'
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "}"
    },
    {
        "name": "arrow-up",
        "value": "1"
    },
    {
        "name": "command-right",
        "value": "1"
    },
    {
      "name": "speak-before",
      "value": "and if I wanted to write the value of some variable to the console, I could do that like so:"
    },
    {
      "name": "backspace",
      "value": "32"
    },
    {
      "name": "type-editor",
      "value": "    myVariable := 5"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "    fmt.Println(myVariable)"
    },
    {
      "name": "speak-before",
      "value": "Now, when I run this code, I would expect the value of 'myVariable' to be printed to the console. Something like:"
    },
    {
      "name": "enter",
      "value": "1"
    },
    {
      "name": "type-editor",
      "value": "    // 5"
    },
    {
      "name": "speak-before",
      "value": "Console logging is simple, yet powerful and very useful!"
    }
];