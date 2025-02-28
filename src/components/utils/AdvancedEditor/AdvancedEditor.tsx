import React, { useRef, useEffect } from 'react';
import { MouseOverlay } from './MouseOverlay/MouseOverlay';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { Terminal } from './Terminal/Terminal';
import Monokai from "monaco-themes/themes/Monokai.json";
import { GUIMode, isCourse } from '@fullstackcraftllc/codevideo-types';
import { VirtualIDE } from '@fullstackcraftllc/codevideo-virtual-ide';
import { FileExplorer } from './FileExplorer';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setIsEditorFocused, setIsTerminalFocused } from '../../../store/recordingSlice';
import ExternalWebViewer from '../../pages/studio/components/main/ExternalWebViewer';
import { EditorTabs } from './Editor/EditorTabs';
import { SoundToggleButton } from '../../pages/studio/components/main/SoundToggleButton';
import { Box, Flex, Text } from '@radix-ui/themes';

interface AdvancedEditorProps {
  mode: GUIMode;
}

// use local static files
loader.config({ paths: { vs: "/vs" } });

export function AdvancedEditor(props: AdvancedEditorProps) {
  const { mode } = props;
  const { currentProject, currentActions, currentActionIndex } = useAppSelector(state => state.editor);
  const { isRecording } = useAppSelector(state => state.recording);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const primaryLanguage = currentProject && isCourse(currentProject.project) ? currentProject.project.primaryLanguage : 'javascript';
  const actionsToApply = currentActions.slice(0, currentActionIndex + 1)
  // codevideo-virtual-ide can get us the current code from the project - regardless of if it is a course, lesson or just actions
  const virtualIDE = new VirtualIDE(currentProject?.project);
  virtualIDE.applyActions(actionsToApply);
  const courseSnapshot = virtualIDE.getCourseSnapshot();

  // for the file explorer
  const fileStructure = courseSnapshot.fileExplorerSnapshot.fileStructure;

  // for the editors
  const editors = courseSnapshot.editorSnapshot.editors;
  const currentFile = editors?.find(editor => editor.isActive) || editors?.[0] || {
    filename: '',
    content: '',
    caretPosition: { row: 0, col: 0 },
    highlightCoordinates: null,
    isActive: false,
    isSaved: false
  };
  const currentCode = currentFile ? currentFile.content : '';
  const currentCaretPosition = currentFile ? currentFile.caretPosition : { row: 0, col: 0 };

  //TODO: highlights!
  const currentHighlightCoordinates = currentFile ? currentFile.highlightCoordinates : null;

  // for the terminals
  const terminals = courseSnapshot.terminalSnapshot.terminals;

  // for the caption overlay
  const captionText = courseSnapshot.authorSnapshot.authors[0]?.currentSpeechCaption;

  // for external browser
  const isExternalBrowserStepUrl = currentActions[currentActionIndex] && currentActions[currentActionIndex].name === 'external-browser' ?
    currentActions[currentActionIndex].value : null;

  const handleEditorDidMount = (
    monacoEditor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoEditorRef.current = monacoEditor;

    // Set the model with the current code and language
    const model = monaco.editor.createModel(
      currentCode,
      primaryLanguage
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
  // caret position effect (only when not recording)
  // useEffect(() => {
  //   if (!isRecording && monacoEditorRef.current) {
  //     monacoEditorRef.current.setPosition({
  //       lineNumber: currentCaretPosition.row,
  //       column: currentCaretPosition.col
  //     });

  //     monacoEditorRef.current.revealPositionInCenter({
  //       lineNumber: currentCaretPosition.row,
  //       column: currentCaretPosition.col
  //     });

  //     // trigger a focus to actually highlight where the caret is
  //     monacoEditorRef.current.focus();
  //   }
  // }, [currentCaretPosition]);

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
                onClick={() => dispatch(setIsEditorFocused(true))}
              >
                {editors.length > 0 ? (
                  <Editor
                    value={isRecording ? undefined : currentCode}
                    defaultValue={isRecording ? currentCode : undefined}
                    defaultLanguage={primaryLanguage}
                    options={{
                      automaticLayout: true,
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      fontFamily: 'Fira Code, monospace',
                      fontLigatures: true,
                      readOnly: !isRecording,
                      lineNumbers: 'on',
                      renderWhitespace: 'selection',
                      bracketPairColorization: { enabled: true },
                      matchBrackets: 'never',
                      formatOnPaste: true,
                      formatOnType: true,
                    }}
                    onMount={handleEditorDidMount}
                  />
                ) : (
                  /* Empty editor - colored background */
                  <Box style={{ backgroundColor: '#272822', height: '100%', width: '100%' }} />
                )}
              </Box>
              {/* Terminal */}
              {terminals.length > 0 ? (
                <Terminal
                  actions={currentActions}
                  actionIndex={currentActionIndex}
                />
              ) : (
                /* Empty terminal - colored background */
                <Box style={{ backgroundColor: '#272822', height: '30px', borderTop: '1px solid var(--gray-7)' }} />
              )}
            </Flex>
          </>
        )}
        {/* Mouse Overlay */}
        <MouseOverlay containerRef={containerRef} />
      </Flex>
      <Flex>
        {/* Caption Overlay */}
        {captionText && (
          <Box
            style={{
              width: '100%',
              padding: '40px',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              color: 'white',
              borderBottomLeftRadius: 'var(--radius-3)',
              borderBottomRightRadius: 'var(--radius-3)',
            }}
          >
            <Box style={{ margin: '0 auto', maxWidth: '64rem' }}>
              <Text>{captionText}</Text>
            </Box>
          </Box>
        )}

        {/* Sound Toggle Button */}
        <Box style={{ zIndex: 50, position: 'absolute', bottom: 10, left: 10 }}>
          <SoundToggleButton />
        </Box>
      </Flex>
    </Flex>
  );
}