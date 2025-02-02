import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { goLangExampleActions } from "../actionsExamples";

export const goPrintlnExample: ICourse = {
    id: 'go',
    name: 'Go fmt.Println Example',
    description: 'Learn how to use fmt.Println in Go',
    primaryLanguage: 'go',
    lessons: [
      {
        id: 'go',
        name: 'Go fmt.Println Example',
        description: 'Learn how to use fmt.Println in Go',
        initialSnapshot: {
          editorSnapshot: {
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'main.go': {
                    type: 'file',
                    language: 'go',
                    content: '// main.go\n',
                    caretPosition: { row: 0, col: 0 },
                    cursorPosition: { x: 0, y: 0 }
                  }
                }
              }
            },
            currentFile: 'src/main.go',
            openFiles: ['src/main.go'],
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
                  'main.go': {
                    type: 'file',
                    language: 'go',
                    content: '// main.go\n',
                    caretPosition: { row: 0, col: 0 },
                    cursorPosition: { x: 0, y: 0 }
                  }
                }
              }
            },
            currentFile: 'src/main.go',
            openFiles: ['src/main.go'],
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
        actions: goLangExampleActions
      }
    ]
  };