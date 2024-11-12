import React, { useState, useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';
import { Resizable } from 're-resizable';
import * as monaco from 'monaco-editor';
import { IEditorProject } from '../../../interfaces/IEditorProject';
import { IFileStructure } from '../../../interfaces/IFileStructure';
import { getFileIcon } from './FileIcons/FileIcons';
import { Terminal } from './Terminal/Terminal';
import Monokai from "monaco-themes/themes/Monokai.json";

interface AdvancedEditorProps {
  currentProject: IEditorProject;
  currentCode: string;
  caretPosition: { row: number; col: number };
  readOnly?: boolean;
  captionText?: string;
  currentTerminalCommand?: string;
  openFiles: string[];
  selectedFile: string;
}

// use local static files
loader.config({ paths: { vs: "/vs" } });
export function AdvancedEditor({
  currentProject,
  currentCode,
  caretPosition,
  readOnly = true,
  captionText,
  currentTerminalCommand,
  openFiles,
  selectedFile,
}: AdvancedEditorProps) {
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoEditorRef.current = editor;

    // Set the model with the current code and language
    const model = monaco.editor.createModel(
      currentCode,
      currentProject.language
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

  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.setPosition({
        lineNumber: caretPosition.row + 1,
        column: caretPosition.col + 1
      });

      monacoEditorRef.current.revealPositionInCenter({
        lineNumber: caretPosition.row + 1,
        column: caretPosition.col + 1
      });
    }
  }, [caretPosition]);


  const renderFileTree = (structure: IFileStructure, path: string = ''): JSX.Element[] => {
    return Object.entries(structure).map(([name, item]) => {
      const fullPath = path ? `${path}/${name}` : name;
      const isDirectory = item.type === 'directory';

      return (
        <div key={fullPath} className="ml-4">
          <div
            className={`flex items-center gap-2 p-1 rounded hover:bg-slate-700 cursor-pointer ${selectedFile === fullPath ? 'bg-slate-700' : ''
              }`}
          >
            <span className="text-slate-400">
              {isDirectory ? '📁' : getFileIcon(name)}
            </span>
            <span className="text-slate-200">{name}</span>
          </div>
          {isDirectory && item.children && renderFileTree(item.children, fullPath)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-900">
        {openFiles.map(file => (
          <div
            key={file}
            className={`flex items-center px-4 py-2 border-r border-slate-700 cursor-pointer ${selectedFile === file ? 'bg-slate-800' : 'bg-slate-900'
              }`}

          >
            <span className="text-slate-300">{file.split('/').pop()}</span>
            <button
              className="ml-2 text-slate-500 hover:text-slate-300"

            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col">
        <div className='flex flex-1'>
          {/* File Tree Sidebar */}
          <div>
            <Resizable
              size={{ width: sidebarWidth, height: '100%' }}
              onResizeStop={(e, direction, ref, d) => {
                setSidebarWidth(sidebarWidth + d.width);
              }}
              minWidth={200}
              maxWidth={400}
              enable={{ right: true }}
            >
              <div className="h-full border-r border-slate-600">
                <div className="p-4 border-b border-slate-600">
                  <h3 className="text-slate-200 font-semibold">Explorer</h3>
                </div>
                <div className="p-2">{renderFileTree(currentProject.fileStructure)}</div>
              </div>
            </Resizable>
          </div>

          {/* Editor */}
          <div className="flex-1 relative">
            <Editor
              value={readOnly ? currentCode : undefined}
              defaultLanguage={currentProject.language}
              options={{
                automaticLayout: true,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                fontLigatures: true,
                readOnly,
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
                matchBrackets: 'never',
                formatOnPaste: true,
                formatOnType: true
              }}
              onMount={handleEditorDidMount}
            />

            {/* Caption Overlay */}
            {captionText && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-75 text-white">
                <div className="container mx-auto max-w-4xl">
                  <p className="text-lg leading-relaxed">{captionText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-[#1e1e1e] border-t border-gray-700 h-[150px]">
        <div className="flex items-center justify-between p-1 bg-[#252526] border-b border-gray-700">
          <span className="text-gray-300 text-sm px-2">Terminal</span>
        </div>
        <Terminal
          className="h-full"
          currentTerminalCommand={currentTerminalCommand}
        />
      </div>
    </div>
  );
}

export default AdvancedEditor;