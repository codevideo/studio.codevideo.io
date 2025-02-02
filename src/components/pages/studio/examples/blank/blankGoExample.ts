import { ICourse } from "@fullstackcraftllc/codevideo-types";

export const blankGoExample: ICourse = {
    id: 'blank-go',
    name: 'Blank Go Project',
    description: 'Start with a blank Go project',
    primaryLanguage: 'go',
    lessons: [
      {
        id: 'blank-go',
        name: 'Blank Go Project',
        description: 'Start with a blank Go project',
        initialSnapshot: {
          editorSnapshot: {
            fileStructure: {
              'main.go': {
                type: 'file',
                language: 'go',
                content: '',
                caretPosition: { row: 0, col: 0 },
                cursorPosition: { x: 0, y: 0 }
              }
            },
            currentFile: 'main.go',
            openFiles: ['main.go'],
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
              'main.go': {
                type: 'file',
                language: 'go',
                content: '',
                caretPosition: { row: 0, col: 0 },
                cursorPosition: { x: 0, y: 0 }
              }
            },
            currentFile: 'main.go',
            openFiles: ['main.go'],
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