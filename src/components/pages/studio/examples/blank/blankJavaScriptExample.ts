import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { blankJavaScriptExampleActions } from "../actionsExamples";

// Blank JavaScript Example
export const blankJavaScriptExample: ICourse = {
    id: 'blank-javascript',
    name: 'Blank JavaScript Project',
    description: 'Start with a blank JavaScript project',
    primaryLanguage: 'javascript',
    lessons: [
      {
        id: 'blank-javascript',
        name: 'Blank JavaScript Project',
        description: 'Start with a blank JavaScript project',
        initialSnapshot: {
          editorSnapshot: {
            fileStructure: {
              'index.js': {
                type: 'file',
                language: 'javascript',
                content: '',
                caretPosition: { row: 0, col: 0 },
                cursorPosition: { x: 0, y: 0 }
              }
            },
            currentFile: 'index.js',
            openFiles: ['index.js'],
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
              'index.js': {
                type: 'file',
                language: 'javascript',
                content: '',
                caretPosition: { row: 0, col: 0 },
                cursorPosition: { x: 0, y: 0 }
              }
            },
            currentFile: 'index.js',
            openFiles: ['index.js'],
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
        actions: blankJavaScriptExampleActions
      }
    ]
  };