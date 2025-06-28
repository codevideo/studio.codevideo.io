import * as React from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { useRef } from "react";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { setDraftProjectString } from "../../../../store/editorSlice";
import { Button, Flex } from '@radix-ui/themes';
import { useClerk } from "@clerk/clerk-react";
import jsesc from "jsesc";

export function ActionJsonEditor() {
  const { projectString } = useAppSelector((state) => state.editor);
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

  const onClickCopy = (mode: 'escaped' | 'normal' = 'normal') => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }
    if (mode === 'escaped') {
      const escaped = jsesc(projectString, {
        // quotes: 'double',
        // wrap: true  // This wraps the output in double quotes.
      });
      console.log(escaped);
      navigator.clipboard.writeText(JSON.stringify(escaped));
    } else {
      navigator.clipboard.writeText(projectString);
    }
  };

  const editor = (
    <Flex
      direction="column" style={{ height: "600px" }}>
      <Flex direction="row" gap="2" mb="2">
        <Button
          color="mint"
          variant="soft"
          onClick={() => onClickCopy('normal')}
          size="1"
        >
          Copy
        </Button>
        <Button
          color="mint"
          variant="soft"
          onClick={() => onClickCopy('escaped')}
          size="1"
        >
          Copy Escaped for CLI
        </Button>
      </Flex>
      {clerk.loaded && <Editor
        theme={theme === "light" ? "vs" : "vs-dark"}
        path={"json/"}
        height="100%"
        defaultLanguage={"json"}
        language={"json"}
        value={projectString}
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
          dispatch(setDraftProjectString(newValue));
        }}
      />}
    </Flex>
  );

  return editor;
}