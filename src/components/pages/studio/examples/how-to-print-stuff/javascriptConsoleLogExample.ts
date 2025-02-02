import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { javaScriptExampleActions } from "../actionsExamples";

export const javascriptConsoleLogExample: ICourse = {
    id: 'javascript',
    name: 'JavaScript Console.log Example',
    description: 'Learn how to use console.log in JavaScript',
    primaryLanguage: 'javascript',
    lessons: [
      {
        id: 'javascript',
        name: 'JavaScript Console.log Example',
        description: 'Learn how to use console.log in JavaScript',
        initialSnapshot: {
          editorSnapshot: {
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'index.js': {
                    type: 'file',
                    language: 'javascript',
                    content: '// index.js\n',
                    caretPosition: { row: 0, col: 0 },
                    cursorPosition: { x: 0, y: 0 }
                  }
                }
              }
            },
            currentFile: 'src/index.js',
            openFiles: ['src/index.js'],
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
                  'index.js': {
                    type: 'file',
                    language: 'javascript',
                    content: '// index.js\n',
                    caretPosition: { row: 0, col: 0 },
                    cursorPosition: { x: 0, y: 0 }
                  }
                }
              }
            },
            currentFile: 'src/index.js',
            openFiles: ['src/index.js'],
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
        actions: javaScriptExampleActions
      }
    ]
  };