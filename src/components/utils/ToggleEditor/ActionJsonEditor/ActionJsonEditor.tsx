import * as React from "react";
import Editor, { Monaco, loader } from "@monaco-editor/react";
import Monokai from "monaco-themes/themes/Monokai.json";
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { speakText } from "../../../../utils/speakText";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { ActionValidationStats } from "../ActionValidationStats";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { setDraftActionsString } from "../../../../store/editorSlice";

export const executeActionsWithMonacoEditor = async (
  editor: React.MutableRefObject<
    monaco.editor.IStandaloneCodeEditor | undefined
  >,
  actions: Array<IAction>
) => {
  if (!editor) {
    return;
  }
  const editorInstance = editor.current;
  if (!editorInstance) {
    return;
  }

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (!action) {
      continue;
    }
    switch (action.name) {
      case "editor-type":
        const text = action.value;
        for (let i = 0; i < text.length; i++) {
          editorInstance.trigger("keyboard", "type", { text: text[i] });
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        break;
      case "editor-backspace":
        const count = parseInt(action.value);
        for (let i = 0; i < count; i++) {
          editorInstance.trigger("1", "deleteLeft", null);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        break;
      case "author-speak-before":
        await speakText(action.value);
        break;
      case "author-speak-after":
        await speakText(action.value);
        break;
      case "author-speak-during":
        await speakText(action.value);
        break;
      case "editor-arrow-up":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(38),
        });
        break;
      case "editor-arrow-down":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(40),
        });
        break;
      case "editor-arrow-left":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(37),
        });
        break;
      case "editor-arrow-right":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(39),
        });
        break;
      case "editor-enter":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(13),
        });
        break;
      default:
        console.log("action not found");
        break;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};

// use local static files
loader.config({ paths: { vs: "/vs" } });


// to get proper tokenizing, we need to feed monaco an initial code snippet - we do this based on the language and throw if we don't support that language
const resolveTokenizerCodeSnippet = (language: string) => {
  switch (language) {
    case "javascript":
      return "const code = 'Hello, World!';";
    case "typescript":
      return "const code: string = 'Hello, World!';";
    case "json":
      return `{
  "code": "Hello, World!"
}`;
    case "rust":
      return `fn main() {
    println!("Hello, World!");

}`;
    case "python":
      return `print("Hello, World!")`;

    case "go":
      return `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`;
    case "java":
      return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
    default:
      throw new Error(`Language ${language} not supported`);
  }
}

export function ActionJsonEditor() {
  const { actionsString } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  // const tokenizerCode = resolveTokenizerCodeSnippet("json");

  const handleOnMount = (
    _editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = _editor;

    monaco.editor.defineTheme(
      "Monokai",
      Monokai as monaco.editor.IStandaloneThemeData
    );
    setTimeout(() => {
      monaco.editor.setTheme('Monokai');
    }, 1);

    // if (typeof window !== "undefined") {
    //   setTimeout(() => {
    //     (window as any).monaco.editor.tokenize(tokenizerCode, "json");
    //   }, 1000);
    // }
  };

  const editor = (
    <div className="flex flex-col">
      <Editor
        path={"json/"}
        height="500px"
        defaultLanguage={"json"}
        language={"json"}
        value={actionsString}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontFamily: "Fira Code",
          fontSize: 13,
          fontLigatures: true,
          lineNumbers: "off",
          folding: true,
          automaticLayout: true,
          autoIndent: "full",
        }}
        onMount={handleOnMount}
        onChange={(newValue) => {
          // Always update the editor value, but validation happens in the effect
          dispatch(setDraftActionsString(newValue));
        }}
      />
    </div>
  );

  return editor;
}