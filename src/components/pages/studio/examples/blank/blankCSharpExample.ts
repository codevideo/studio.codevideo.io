import { ICourse } from "@fullstackcraftllc/codevideo-types";

export const blankCSharpExample: ICourse = {
    id: 'blank-csharp',
    name: 'Blank C# Project',
    description: 'Start with a blank C# project',
    primaryLanguage: 'csharp',
    lessons: [
      {
        id: 'blank-csharp',
        name: 'Blank C# Project',
        description: 'Start with a blank C# project',
        initialSnapshot: {
          editorSnapshot: {
            fileStructure: {
              'Program.cs': {
                type: 'file',
                language: 'csharp',
                content: '',
                caretPosition: { row: 0, col: 0 },
                cursorPosition: { x: 0, y: 0 }
              }
            },
            currentFile: 'Program.cs',
            openFiles: ['Program.cs'],
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
              'Program.cs': {
                type: 'file',
                language: 'csharp',
                content: '',
                caretPosition: { row: 0, col: 0 },
                cursorPosition: { x: 0, y: 0 }
              }
            },
            currentFile: 'Program.cs',
            openFiles: ['Program.cs'],
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
        actions: []
      }
    ]
  };