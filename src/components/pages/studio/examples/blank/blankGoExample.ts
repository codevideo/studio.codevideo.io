import { ICourse, getBlankInitialSnapshot } from "@fullstackcraftllc/codevideo-types";

const blankSnap = getBlankInitialSnapshot();

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
                ...blankSnap,
          fileExplorerSnapshot: {
                    ...blankSnap.fileExplorerSnapshot,
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'main.go': {
                    type: 'file',
                    language: 'go',
                    content: '',
                    caretPosition: { row: 0, col: 0 },
                  }
                }
              }
            },
          },
          editorSnapshot: {
                    ...blankSnap.editorSnapshot,
            editors: [{
              isActive: true,
              isSaved: true,
              filename: 'src/main.go',
              content: '',
              caretPosition: { row: 0, col: 0 },
              highlightCoordinates: null
            }]
          },
          terminalSnapshot: {
            terminals: [
              {
                content: ''
              }
            ]
          },
          mouseSnapshot: {
                    ...blankSnap.mouseSnapshot,
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
            authors: [
              {currentSpeechCaption: ''}
            ]
          }
        },
        finalSnapshot: {
                ...blankSnap,
          fileExplorerSnapshot: {
                    ...blankSnap.fileExplorerSnapshot,
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'main.go': {
                    type: 'file',
                    language: 'go',
                    content: '',
                    caretPosition: { row: 0, col: 0 },
                  }
                }
              }
            },
          },
          editorSnapshot: {
                    ...blankSnap.editorSnapshot,
            editors: [{
              isActive: true,
              isSaved: true,
              filename: 'src/main.go',
              content: '',
              caretPosition: { row: 0, col: 0 },
              highlightCoordinates: null
            }]
          },
          terminalSnapshot: {
            terminals: [
              {
                content: ''
              }
            ]
          },
          mouseSnapshot: {
                    ...blankSnap.mouseSnapshot,
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
            authors: [
              {currentSpeechCaption: ''}
            ]
          }
        },
        actions: []
      }
    ]
  };