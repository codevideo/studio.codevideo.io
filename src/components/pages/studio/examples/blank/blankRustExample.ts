import { ICourse } from "@fullstackcraftllc/codevideo-types";

export const blankRustExample: ICourse = {
    id: 'blank-rust',
    name: 'Blank Rust Project',
    description: 'Start with a blank Rust project',
    primaryLanguage: 'rust',
    lessons: [
      {
        id: 'blank-rust',
        name: 'Blank Rust Project',
        description: 'Start with a blank Rust project',
        initialSnapshot: {
          editorSnapshot: {
            fileStructure: {
              'main.rs': {
                type: 'file',
                language: 'rust',
                content: '',
                caretPosition: { row: 0, col: 0 },
                cursorPosition: { x: 0, y: 0 }
              }
            },
            currentFile: 'main.rs',
            openFiles: ['main.rs'],
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
              'main.rs': {
                type: 'file',
                language: 'rust',
                content: '',
                caretPosition: { row: 0, col: 0 },
                cursorPosition: { x: 0, y: 0 }
              }
            },
            currentFile: 'main.rs',
            openFiles: ['main.rs'],
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