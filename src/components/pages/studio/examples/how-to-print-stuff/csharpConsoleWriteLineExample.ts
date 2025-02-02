import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { cSharpExampleActions } from "../actionsExamples";

export const csharpConsoleWriteLineExample: ICourse = {
    id: 'csharp',
    name: 'C# Console.WriteLine Example',
    description: 'Learn how to use Console.WriteLine in C#',
    primaryLanguage: 'csharp',
    lessons: [
      {
        id: 'csharp',
        name: 'C# Console.WriteLine Example',
        description: 'Learn how to use Console.WriteLine in C#',
        initialSnapshot: {
          editorSnapshot: {
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'Program.cs': {
                    type: 'file',
                    language: 'csharp',
                    content: '// Program.cs\n',
                    caretPosition: { row: 0, col: 0 },
                    cursorPosition: { x: 0, y: 0 }
                  }
                }
              }
            },
            currentFile: 'src/Program.cs',
            openFiles: ['src/Program.cs'],
            terminalContents: null,
            currentCaretPosition: { row: 0, col: 0 },
            currentHighlightCoordinates: null
          },
          mouseSnapshot: {
            x: 0,
            y: 0,
            timestamp: 0,
            type: 'move',
            buttonStates: {
              left: false,
              right: false,
              middle: false,
            },
            scrollPosition: {
              x: 0,
              y: 0
            },
          },
          authorSnapshot: {
            currentSpeechCaption: ''
          }
        },
        finalSnapshot: {
          editorSnapshot: {
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'Program.cs': {
                    type: 'file',
                    language: 'csharp',
                    content: '// Program.cs\n',
                    caretPosition: { row: 0, col: 0 },
                    cursorPosition: { x: 0, y: 0 }
                  }
                }
              }
            },
            currentFile: 'src/Program.cs',
            openFiles: ['src/Program.cs'],
            terminalContents: null,
            currentCaretPosition: { row: 0, col: 0 },
            currentHighlightCoordinates: null
          },
          mouseSnapshot: {
            x: 0,
            y: 0,
            timestamp: 0,
            type: 'move',
            buttonStates: {
              left: false,
              right: false,
              middle: false,
            },
            scrollPosition: {
              x: 0,
              y: 0
            },
          },
          authorSnapshot: {
            currentSpeechCaption: ''
          }
        },
        actions: cSharpExampleActions
      }
    ]
  };