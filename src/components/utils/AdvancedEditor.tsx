import React, { useState, useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { Resizable } from 're-resizable';
import { IFileStructure } from '../../interfaces/IFileStructure';
import { IEditorProject } from '../../interfaces/IEditorProject';

loader.config({
  paths: {
    vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs'
  }
});

interface AdvancedEditorProps {
  currentProject: IEditorProject;
  currentCode: string;
  readOnly?: boolean;
  onFileSelect?: (filePath: string) => void;
  captionText?: string;
}

export function AdvancedEditor({
  currentProject,
  currentCode,
  readOnly = true,
  onFileSelect,
  captionText
}: AdvancedEditorProps) {
  const monacoEl = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>(currentProject.mainFile);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [openFiles, setOpenFiles] = useState<string[]>([currentProject.mainFile]);

  // Clean up function to properly dispose of the editor
  const disposeEditor = () => {
    if (editorRef.current) {
      // Dispose of the model first
      const model = editorRef.current.getModel();
      if (model) {
        model.dispose();
      }
      // Then dispose of the editor
      editorRef.current.dispose();
      editorRef.current = null;
    }
  };

  // Handle example changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        // Update the model's value and language
        model.setValue(currentCode);
        monaco.editor.setModelLanguage(model, currentProject.language);
      } else {
        // Create a new model and set it to the editor
        const newModel = monaco.editor.createModel(
          currentCode,
          currentProject.language
        );
        editorRef.current.setModel(newModel);
      }

      setSelectedFile(currentProject.mainFile);
      setOpenFiles([currentProject.mainFile]);
    }
  }, [currentProject]);

  // Update editor content when code changes
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        // Use setValue instead of directly creating a new model
        model.setValue(currentCode);
      }
    }
  }, [currentCode]);

  // initialize / dispose editor on mount
  useEffect(() => {
    let editorInstance: any;
  
    loader.init().then(monaco => {
      if (monacoEl.current && !editorRef.current) {
        const model = monaco.editor.createModel(
          currentCode,
          currentProject.language
        );
  
        const features = {
          model,
          theme: 'vs-dark',
          automaticLayout: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'Fira Code, monospace',
          fontLigatures: true,
          readOnly,
          lineNumbers: 'on' as monaco.editor.LineNumbersType,
          renderWhitespace: 'selection' as 'selection',
          bracketPairColorization: { enabled: true },
          formatOnPaste: true,
          formatOnType: true
        };
  
        try {
          editorRef.current = monaco.editor.create(monacoEl.current, features);
          editorInstance = editorRef.current;
        } catch (error) {
          console.error('Failed to create editor:', error);
          // Clean up if initialization fails
          model.dispose();
        }
      }
    }).catch(error => {
      console.error('An error occurred during initialization of Monaco:', error);
    });
  
    return () => {
      // Dispose of the editor when the component unmounts
      if (editorInstance) {
        const model = editorInstance.getModel();
        if (model) {
          model.dispose();
        }
        editorInstance.dispose();
      }
    };
  }, []); // Empty dependency array to run only once on mount


  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    if (!openFiles.includes(filePath)) {
      setOpenFiles([...openFiles, filePath]);
    }
    onFileSelect?.(filePath);
  };

  const handleCloseFile = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(f => f !== filePath);
    setOpenFiles(newOpenFiles);
    if (selectedFile === filePath) {
      setSelectedFile(newOpenFiles[0] || currentProject.mainFile);
    }
  };

  const renderFileTree = (structure: IFileStructure, path: string = ''): JSX.Element[] => {
    return Object.entries(structure).map(([name, item]) => {
      const fullPath = path ? `${path}/${name}` : name;
      const isDirectory = item.type === 'directory';

      return (
        <div key={fullPath} className="ml-4">
          <div
            className={`flex items-center gap-2 p-1 rounded hover:bg-slate-700 cursor-pointer ${selectedFile === fullPath ? 'bg-slate-700' : ''
              }`}
            onClick={() => !isDirectory && handleFileSelect(fullPath)}
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
            onClick={() => handleFileSelect(file)}
          >
            <span className="text-slate-300">{file.split('/').pop()}</span>
            <button
              className="ml-2 text-slate-500 hover:text-slate-300"
              onClick={(e) => handleCloseFile(file, e)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-1">
        {/* File Tree Sidebar */}
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

        {/* Editor */}
        <div className="flex-1 relative">
          <div ref={monacoEl} className="h-full w-full" />

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
  );
}

// Helper function to get file icon based on extension
function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
      return '📄 JS';
    case 'py':
      return '📄 PY';
    case 'cs':
      return '📄 C#';
    case 'go':
      return '📄 GO';
    case 'json':
      return '📄 JSON';
    default:
      return '📄';
  }
}

export default AdvancedEditor;