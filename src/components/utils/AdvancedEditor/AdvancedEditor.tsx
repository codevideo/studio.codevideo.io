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
  const currentHighlightCoordinates = currentFile ? currentFile.highlightCoordinates : null;

  // for the caption overlay
  const captionText = courseSnapshot.authorSnapshot.authors[0]?.currentSpeechCaption;

  // for external browser
  const isExternalBrowserStepUrl = currentActions[currentActionIndex] && currentActions[currentActionIndex].name === 'external-browser' ?
    currentActions[currentActionIndex].value : null;

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoEditorRef.current = editor;

    // Set the model with the current code and language
    const model = monaco.editor.createModel(
      currentCode,
      primaryLanguage
    );
    editor.setModel(model);

    // Ensure theme is applied after a short delay
    monaco.editor.defineTheme(
      "Monokai",
      Monokai as monaco.editor.IStandaloneThemeData
    );
    setTimeout(() => {
      monaco.editor.setTheme('Monokai');
    }, 1);
  };

  // caret position effect (only when not recording)
  useEffect(() => {
    if (!isRecording && monacoEditorRef.current) {
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

  // highlight effect (only when not recording)
  useEffect(() => {
    if (!isRecording && monacoEditorRef.current && currentHighlightCoordinates) {
      monacoEditorRef.current.createDecorationsCollection([
        {
          range: new monaco.Range(
            currentHighlightCoordinates.start.row,
            currentHighlightCoordinates.start.col,
            currentHighlightCoordinates.end.row,
            currentHighlightCoordinates.end.col
          ),
          options: { inlineClassName: 'highlighted-code' }
        }
      ]);

      // log out decorations for debugging
      // console.log(monacoEditorRef.current.getVisibleRanges());

      // trigger a focus to actually highlight where the highlight is
      // monacoEditorRef.current.focus();
    }
  }, [currentHighlightCoordinates]);

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg overflow-hidden relative" ref={containerRef}>
      <MouseOverlay mouseVisible={true} actions={currentActions} actionIndex={currentActionIndex} containerRef={containerRef} />
      <EditorTabs currentFile={currentFile} editors={editors} />

      <div className="flex flex-1 flex-col">
        <div className='flex flex-1'>
          {/* File Explorer */}
          <FileExplorer currentFileName={currentFile?.filename} fileStructure={fileStructure} />

          {/* Editor */}
          <div className="flex-1 relative" onClick={() => dispatch(setIsEditorFocused(true))}
            style={{ userSelect: isRecording ? 'auto' : 'none' }}
          >
            {isExternalBrowserStepUrl !== null ? (
              <ExternalWebViewer url={isExternalBrowserStepUrl} />
            ) : (
              <Editor
                data-codevideo-id={isRecording ? "recording-editor" : "replaying-editor"}
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
            )}

          </div>

        </div>
      </div>
      {/* Terminal */}
      <div className="bg-[#1e1e1e] border-t border-gray-700 h-[200px]" onClick={() => dispatch(setIsTerminalFocused(false))}>
        <div className="flex items-center justify-between p-1 bg-[#252526] border-b border-gray-700">
          <span className="text-gray-300 text-sm px-2">Terminal</span>
        </div>
        <Terminal
          className="h-full" actions={currentActions} actionIndex={currentActionIndex} />
      </div>
      {/* Caption Overlay */}
      {captionText && (
        <div className="z-50 absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-75 text-white">
          <div className="container mx-auto max-w-4xl">
            <p className="text-lg leading-relaxed">{captionText}</p>
          </div>
        </div>
      )}
    </div>
  );
}