import * as React from "react";
import Editor, { Monaco, loader } from "@monaco-editor/react";
import Monokai from "monaco-themes/themes/Monokai.json";
import * as monaco from "monaco-editor";
import { useRef } from "react";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { setDraftActionsString } from "../../../../store/editorSlice";
import { Flex } from '@radix-ui/themes';

// use local static files
loader.config({ paths: { vs: "/vs" } });

export function ActionJsonEditor() {
  const { actionsString } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
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
  };

  const editor = (
    <Flex 
      direction="column" style={{ height: "640px"}}>
      <Editor
        path={"json/"}
        height="100%"
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
          wordWrap: "on",
          wrappingIndent: "same",
          wrappingStrategy: "advanced",
        }}
        onMount={handleOnMount}
        onChange={(newValue) => {
          // Always update the editor value, but validation happens in the effect
          dispatch(setDraftActionsString(newValue));
        }}
      />
    </Flex>
  );

  return editor;
}