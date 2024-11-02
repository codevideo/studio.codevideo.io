import * as React from "react";
import Editor, { Monaco, loader } from "@monaco-editor/react";
import Monokai from "monaco-themes/themes/Monokai.json";
import * as monaco from "monaco-editor";
import { useEffect, useRef } from "react";
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { speakText } from "../../utils/speakText";

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
      case "type-editor":
        const text = action.value;
        for (let i = 0; i < text.length; i++) {
          editorInstance.trigger("keyboard", "type", { text: text[i] });
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        break;
      case "backspace":
        const count = parseInt(action.value);
        for (let i = 0; i < count; i++) {
          editorInstance.trigger("1", "deleteLeft", null);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        break;
      case "speak-before":
        await speakText(action.value);
        break;
      case "speak-after":
        await speakText(action.value);
        break;
      case "speak-during":
        await speakText(action.value);
        break;
      case "arrow-up":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(38),
        });
        break;
      case "arrow-down":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(40),
        });
        break;
      case "arrow-left":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(37),
        });
        break;
      case "arrow-right":
        editorInstance.trigger("keyboard", "type", {
          text: String.fromCharCode(39),
        });
        break;
      case "enter":
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

export interface ISimpleEditorProps {
  path: string;
  language: string;
  tokenizerCode: string;
  focus: boolean;
  onChangeCode?: (code: string | undefined) => void;
  value?: string;
  withCard?: boolean;
}

// use local static files
loader.config({ paths: { vs: "/vs" } });
export function SimpleEditor(props: ISimpleEditorProps) {
  const { path, language, value, tokenizerCode, focus, onChangeCode, withCard } =
    props;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();

  useEffect(() => {
    if (focus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [focus]);

  const handleOnMount = (
    _editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = _editor;

    monaco.editor.defineTheme(
      "Monokai",
      Monokai as monaco.editor.IStandaloneThemeData
    );
    monaco.editor.setTheme("Monokai");

    if (typeof window !== "undefined") {
      setTimeout(() => {
        (window as any).monaco.editor.tokenize(tokenizerCode, language);
      }, 1000);
    }
  };

  const editor = (
    <Editor
      path={path}
      height="500px"
      defaultLanguage={language}
      language={language}
      value={value}
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
      onChange={onChangeCode}
    />
  );

  if (withCard) {
    return (
      <div className="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
        {editor}
      </div>
    );
  }

  return editor;
}