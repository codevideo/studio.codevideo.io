import * as React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useRef } from "react";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { setDraftActionsString } from "../../../../store/editorSlice";
import { Flex } from '@radix-ui/themes';
import { useClerk } from "@clerk/clerk-react";

export function ActionJsonEditor() {
  const { actionsString } = useAppSelector((state) => state.editor);
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  // can't render the monaco editor until clerk is loaded - see https://github.com/clerk/javascript/issues/1643
  const clerk = useClerk();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(undefined);
  const handleOnMount = (
    _editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = _editor;

    // monaco.editor.defineTheme(
    //   "Monokai",
    //   Monokai as monaco.editor.IStandaloneThemeData
    // );
    // setTimeout(() => {
    //   monaco.editor.setTheme('Monokai');
    // }, 1);
  };

  const editor = (
    <Flex 
      direction="column" style={{ height: "600px"}}>
      {clerk.loaded && <Editor
        theme={theme === "light" ? "vs" : "vs-dark"}
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
      />}
    </Flex>
  );

  return editor;
}