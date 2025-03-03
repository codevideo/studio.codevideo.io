import React, { useEffect, useRef, useState } from 'react';
import { MouseOverlay } from './MouseOverlay/MouseOverlay';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { Terminal } from './Terminal/Terminal';
import Monokai from "monaco-themes/themes/Monokai.json";
import { GUIMode, IAction, IEditorPosition, isCourse, isLesson, isValidActions, Project } from '@fullstackcraftllc/codevideo-types';
import { VirtualIDE } from '@fullstackcraftllc/codevideo-virtual-ide';
import { FileExplorer } from './FileExplorer';
import ExternalWebViewer from '../../pages/studio/components/main/ExternalWebViewer';
import { EditorTabs } from './Editor/EditorTabs';
import { SoundToggleButton } from '../../pages/studio/components/main/SoundToggleButton';
import { Box, Flex, Text } from '@radix-ui/themes';
import { sleep } from '../../../utils/sleep';

const STANDARD_PAUSE_MS = 500;
const KEYBOARD_TYPING_PAUSE_MS = 150
const DEFAULT_CARET_POSITION = { row: 0, col: 0 };

interface AdvancedEditorProps {
  project: Project;
  actions: Array<IAction>;
  currentActionIndex: number;
  currentLessonIndex: number | null
  mode: GUIMode;
  defaultLanguage: string;
  isExternalBrowserStepUrl: string | null;
  actionFinishedCallback: () => void;
}

// use local static files
loader.config({ paths: { vs: "/vs" } });

export const extractActionsFromProject = (project: Project, currentLessonIndex: number | null): Array<IAction> => {
  if (isCourse(project) && project.lessons && currentLessonIndex !== null && currentLessonIndex !== -1) {
    return project.lessons[currentLessonIndex]?.actions || []
  }
  if (isLesson(project)) {
    return project.actions
  }
  if (isValidActions(project)) {
    return project;
  }
  return []
}

/**
 * Represents a powerful IDE with file explorer, multiple editors, and terminal
 * @param props 
 * @returns 
 */
export function AdvancedEditor(props: AdvancedEditorProps) {
  const { project, actions, mode, defaultLanguage, isExternalBrowserStepUrl, currentActionIndex, currentLessonIndex, actionFinishedCallback } = props;
  const isRecording = mode === 'record'
  const [virtualIDE, setVirtualIDE] = useState<VirtualIDE>(new VirtualIDE(project));
  const [currentCode, setCurrentCode] = useState<string>('');
  const [currentCaretPosition, setCurrentCaretPosition] = useState<IEditorPosition>(DEFAULT_CARET_POSITION);
  const containerRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | undefined>();

  const applyAnimation = async () => {
    if (monacoEditorRef.current && actions[currentActionIndex]) {
      await executeActionAnimationForMonacoInstance(monacoEditorRef.current, actions[currentActionIndex]);
    }
    updateState();
    actionFinishedCallback();
  }

  const updateState = () => {
    const actions = extractActionsFromProject(project, currentLessonIndex)
    const actionsToApply = actions.slice(0, currentActionIndex + 1)
    const virtualIDE = new VirtualIDE(project);
    virtualIDE.applyActions(actionsToApply);
    const courseSnapshot = virtualIDE.getCourseSnapshot();
    const editors = courseSnapshot.editorSnapshot.editors;
    const currentFile = editors?.find(editor => editor.isActive) || editors?.[0] || {
      filename: '',
      content: '',
      caretPosition: DEFAULT_CARET_POSITION,
      highlightCoordinates: null,
      isActive: false,
      isSaved: false
    };
    const currentCode = currentFile ? currentFile.content : '';
    const currentCaretPosition = virtualIDE.virtualEditors && virtualIDE.virtualEditors.length > 0 ? virtualIDE.virtualEditors[0]?.virtualEditor.getCurrentCaretPosition() || DEFAULT_CARET_POSITION : DEFAULT_CARET_POSITION;
    setVirtualIDE(virtualIDE);
    setCurrentCode(currentCode);
    setCurrentCaretPosition(currentCaretPosition);
  }

  // update virtual when current action index changes
  useEffect(() => {
    console.log('animation effect', mode, currentActionIndex);
    // normal step by step mode OR initial replay state - can update state immediately
    if (mode === 'step') {
      updateState();
      return;
    }
    // if playback mode, we need to animate the typing on the editor, then we can apply the action to maintain state, then we call the actionFinishedCallback
    if (mode === 'replay') {

      // need to handle the first reset
      if (currentActionIndex === 0) {
        console.log('updating state for first action');
        updateState();
        console.log('updated')
      }
      // this in turn calls updateState once the animation is complete, and then calls actionFinishedCallback
      applyAnimation();
    }
  }, [mode, currentActionIndex, actions]);


  // get the course snapshot
  const courseSnapshot = virtualIDE.getCourseSnapshot();

  // for the file explorer
  const fileStructure = courseSnapshot.fileExplorerSnapshot.fileStructure;

  // for the editors
  const editors = courseSnapshot.editorSnapshot.editors;
  const currentFile = editors?.find(editor => editor.isActive) || editors?.[0] || {
    filename: '',
    content: '',
    caretPosition: DEFAULT_CARET_POSITION,
    highlightCoordinates: null,
    isActive: false,
    isSaved: false
  };

  // TODO: figure out highlights! (breaks due to SSR)
  // const currentHighlightCoordinates = currentFile ? currentFile.highlightCoordinates : null;

  // for the caption overlay
  const captionText = courseSnapshot.authorSnapshot.authors[0]?.currentSpeechCaption;

  const handleEditorDidMount = (
    monacoEditor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoEditorRef.current = monacoEditor;

    // Set the model with the current code and language
    // TODO could probably be looped for all files?
    const model = monaco.editor.createModel(
      currentCode,
      defaultLanguage
    );
    monacoEditor.setModel(model);

    // Ensure theme is applied after a short delay
    monaco.editor.defineTheme(
      "Monokai",
      Monokai as monaco.editor.IStandaloneThemeData
    );
    setTimeout(() => {
      monaco.editor.setTheme('Monokai');
    }, 1);
  };

  // TODO: also fix this, if typing in the GUI editor this pulls focus away... garbage...
  // for now seems to work fine in replay mode
  // caret position effect (only when not recording)
  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.setPosition({
        lineNumber: currentCaretPosition.row,
        column: currentCaretPosition.col
      });

      monacoEditorRef.current.revealPositionInCenter({
        lineNumber: currentCaretPosition.row,
        column: currentCaretPosition.col
      });

      // trigger a focus to actually highlight where the caret is
      monacoEditorRef.current.focus();
    }
  }, [currentCaretPosition]);

  // // highlight effect (only when not recording)
  // useEffect(() => {
  //   // if (typeof window !== "undefined" && !isRecording && monacoEditorRef.current && currentHighlightCoordinates) {
  //   // TODO: this line breaks SSR:
  //   // maybe we can hack our own highlight functionality...
  //   //   monacoEditorRef.current.createDecorationsCollection([
  //   //     {
  //   //       range: new monaco.Range(
  //   //         currentHighlightCoordinates.start.row,
  //   //         currentHighlightCoordinates.start.col,
  //   //         currentHighlightCoordinates.end.row,
  //   //         currentHighlightCoordinates.end.col
  //   //       ),
  //   //       options: { inlineClassName: 'highlighted-code' }
  //   //     }
  //   //   ]);

  //   //   // log out decorations for debugging
  //   //   // console.log(monacoEditorRef.current.getVisibleRanges());

  //   //   // trigger a focus to actually highlight where the highlight is
  //   //   // monacoEditorRef.current.focus();
  //   // }
  // }, [currentHighlightCoordinates]);

  return (
    <Flex direction="column" style={{ height: '100%', width: '100%' }}>
      <Flex direction="row"
        style={{
          height: '100%',
          borderTopLeftRadius: 'var(--radius-3)',
          borderTopRightRadius: 'var(--radius-3)',
          overflow: 'hidden',
          // necessary so mouse overlay can be positioned absolutely
          position: 'relative',
        }}
        ref={containerRef}
      >
        {isExternalBrowserStepUrl !== null ? (
          <Flex direction="row"
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 'var(--radius-3)',
              position: 'relative'
            }}
            ref={containerRef}
          >
            <ExternalWebViewer url={isExternalBrowserStepUrl} />
          </Flex>
        ) : (
          <>
            <FileExplorer currentFileName={currentFile?.filename} fileStructure={fileStructure} />
            {/* Editor Tabs, Main Editor, and Terminal stack on top of eachother */}
            <Flex direction="column" width="100%">
              <EditorTabs currentFile={currentFile} editors={editors} />
              {/* Editor */}
              <Box
                data-codevideo-id="editor"
                style={{
                  flex: 1,
                  position: 'relative',
                  userSelect: isRecording ? 'auto' : 'none'
                }}
              >
                <Box style={{
                  display: editors.length === 0 ? 'block' : 'none',
                  backgroundColor: '#272822',
                  height: '100%',
                  width: '100%'
                }} />
                <Editor
                  className={`no-mouse ${editors.length === 0 ? 'display-none' : 'display-block'}`}
                  value={isRecording || mode === 'replay' ? undefined : currentCode}
                  defaultValue={isRecording ? currentCode : undefined}
                  defaultLanguage={defaultLanguage}
                  options={{
                    automaticLayout: true,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: true,
                    fontSize: 14,
                    fontFamily: 'Fira Code, monospace',
                    fontLigatures: true,
                    readOnly: mode === 'step',
                    lineNumbers: 'on',
                    renderWhitespace: 'selection',
                    bracketPairColorization: { enabled: true },
                    matchBrackets: 'never',
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                  onMount={handleEditorDidMount}
                />
              </Box>
              {/* Terminal */}
              {virtualIDE.virtualTerminals.length > 0 ? (
                <>
                  {virtualIDE.virtualTerminals.map((virtualTerminal, i) => (
                    <Terminal
                      key={i}
                      actions={actions}
                      currentActionIndex={currentActionIndex}
                      virtualTerminal={virtualTerminal}
                      actionFinishedCallback={actionFinishedCallback} mode={'step'} />
                  ))}
                </>
              ) : (
                /* Empty terminal - colored background */
                <Box style={{ backgroundColor: '#272822', height: '150px', borderTop: '1px solid var(--gray-7)' }} />
              )}
            </Flex>
          </>
        )}
        {/* Mouse Overlay */}
        <MouseOverlay
          mode={mode}
          actions={actions}
          actionIndex={currentActionIndex}
          mouseVisible={true}
          containerRef={containerRef}
          actionFinishedCallback={actionFinishedCallback} />
      </Flex>
      <Flex>
        {/* Caption Overlay */}
        {captionText && (
          <Box
            style={{
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              borderBottomLeftRadius: 'var(--radius-3)',
              borderBottomRightRadius: 'var(--radius-3)',
              position: 'relative'
            }}
          >
            <Flex justify="center" align="center" style={{margin: '50px'}}>
              <Text>{captionText}</Text>
            </Flex>
            {/* Sound Toggle Button */}
            <Box style={{ zIndex: 50, position: 'absolute', bottom: 10, left: 10 }}>
              <SoundToggleButton />
            </Box>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}

// define the human typing here in the puppeteer environment
const simulateHumanTyping = (
  editor: monaco.editor.IStandaloneCodeEditor,
  code: string
) => {
  return new Promise<void>((resolve) => {
    const characters: string[] = code.split("");
    let index: number = 0;

    function typeNextCharacter(): void {
      if (index < characters.length) {
        const char = characters[index];
        const selection = editor.getSelection();
        editor.executeEdits("simulateTyping", [
          {
            range: {
              startLineNumber: selection?.selectionStartLineNumber || 1,
              startColumn: selection?.selectionStartColumn || 1,
              endLineNumber: selection?.endLineNumber || 1,
              endColumn: selection?.endColumn || 1,
            },
            text: char || "",
            forceMoveMarkers: true,
          },
        ]);
        index++;
        setTimeout(typeNextCharacter, KEYBOARD_TYPING_PAUSE_MS);
      } else {
        resolve();
      }
    }

    typeNextCharacter();
  });
};

const simulateKeyboardPause = async () => {
  await new Promise((resolve) =>
    setTimeout(resolve, KEYBOARD_TYPING_PAUSE_MS)
  );
}

// TODO: copied mostly from the backend single editor endpoint from codevideo-backend-engine... can we generalize this?
export const executeActionAnimationForMonacoInstance = async (
  editor: monaco.editor.IStandaloneCodeEditor,
  action: IAction
) => {
  let startTime = -1;
  editor.getSupportedActions().forEach((value) => {
    console.log(value);
  });

  // const highlightText = (
  //   editor: monaco.editor.IStandaloneCodeEditor,
  //   searchText: string
  // ) => {
  //   const model = editor.getModel();

  // findNextMatch BREAKS SSR
  // Find the position of the searchText in the model
  // @ts-ignore
  // const searchTextPosition = model.findNextMatch(
  //   searchText,
  //   // @ts-ignore
  //   new monaco.Position(1, 1)
  // );


  // this ALSO BREAKS SSR
  // const searchTextPosition: monaco.editor.FindMatch = {
  //   range: new monaco.Range(1, 1, 1, 1),
  // }

  // If searchText is found
  // if (searchTextPosition) {
  //   const line = searchTextPosition.range.startLineNumber;
  //   const column = searchTextPosition.range.startColumn;

  //   // Move the cursor to the beginning of the searchText
  //   editor.setPosition({ lineNumber: line, column });

  //   // Reveal the line in the center
  //   editor.revealLineInCenter(line);

  //   // Calculate the range of the searchText
  //   const searchTextLength = searchText.length;
  //   // @ts-ignore
  //   const range = new monaco.Range(
  //     line,
  //     column,
  //     line,
  //     column + searchTextLength
  //   );

  //   // Set the selection to highlight the searchText
  //   editor.setSelection(range);

  //   // Reveal the range in the center
  //   editor.revealRangeInCenter(range);
  // }
  // };

  // try to parse the 'times' value as an integer, if it fails, default to 1
  // the times doesn't always apply to some actions, so we do that action just once
  const times = parseInt(action.value) || 1;
  console.log("times", times);
  const pos = editor.getPosition();
  console.log("pos", pos);
  // const lineNumber = pos?.lineNumber;
  for (let i = 0; i < times; i++) {
    // actual logic
    switch (true) {
      // case "speak-before":
      //   await playAudioInPuppeteer(
      //     id,
      //     `./audio/${action.value}.mp3`
      //   );
      //   break;
      case action.name === "editor-arrow-down" && pos !== null:
        // @ts-ignore
        pos.lineNumber = pos.lineNumber + 1;
        console.log("moving pos to", pos);
        editor.setPosition(pos);
        await simulateKeyboardPause();
        break;
      case action.name === "editor-arrow-up" && pos !== null:
        // @ts-ignore
        pos.lineNumber = pos.lineNumber - 1;
        console.log("moving pos to", pos);
        editor.setPosition(pos);
        await simulateKeyboardPause();
        break;
      case action.name === "editor-tab" && pos !== null:
        // @ts-ignore
        pos.lineNumber = pos.lineNumber + 2;
        console.log("moving pos to", pos);
        editor.setPosition(pos);
        await simulateKeyboardPause();
        break;
      case action.name === "editor-arrow-left" && pos !== null:
        // @ts-ignore
        pos.column = pos.column - 1;
        console.log("moving pos to", pos);
        editor.setPosition(pos);
        await simulateKeyboardPause();
        break;
      case action.name === "editor-arrow-right" && pos !== null:
        // @ts-ignore
        pos.column = pos.column + 1;
        console.log("moving pos to", pos);
        editor.setPosition(pos);
        await simulateKeyboardPause();
        break;
      case action.name === "editor-enter":
        await simulateHumanTyping(editor, "\n");
        break;
      // case action.name === "editor-delete-line" && lineNumber !== null:
      //   console.log("deleting line");
      //   // @ts-ignore - this also breaks SSR
      //   editor.executeEdits("", [
      //     // @ts-ignore
      //     { range: new monaco.Range(lineNumber, 1, lineNumber + 1, 1), text: null },
      //   ]);
      //   await simulateKeyboardPause();
      //   break;
      case action.name === "editor-command-right" && pos !== null:
        // simulate moving to the end of the current line
        // @ts-ignore
        pos.column = 100000;
        editor.setPosition(pos);
        await simulateKeyboardPause();
        break;
      //   // highlight breaks SSR
      // // case action.name === "editor-highlight-code":
      // //   highlightText(editor, action.value);
      // //   break;
      case action.name === "editor-space":
        await simulateHumanTyping(editor, " ");
        break;
      case action.name === "editor-backspace":
        // @ts-ignore - this also breaks SSR
        typeof window !== "undefined" && editor.trigger(1, "deleteLeft");
        await simulateKeyboardPause();
        break;
      case action.name === "editor-type":
        await simulateHumanTyping(editor, action.value);
        break;
      default:
        // no op - but still do default delay
        await sleep(STANDARD_PAUSE_MS);
        console.warn("Unable to apply action", action);
        break;
    }
  }
  return startTime;
};
