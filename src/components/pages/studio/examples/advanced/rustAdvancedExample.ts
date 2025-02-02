import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { advancedRustExampleActions } from "../actionsExamples";

export const rustAdvancedExample: ICourse = {
    id: 'advanced-rust',
    name: 'Advanced Rust Lesson',
    description: 'Explore an advanced Rust lesson',
    primaryLanguage: 'rust',
    lessons: [
      {
        id: 'advanced-rust',
        name: 'Advanced Rust Lesson',
        description: 'Explore an advanced Rust lesson',
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
        actions: advancedRustExampleActions
      }
    ]
  };