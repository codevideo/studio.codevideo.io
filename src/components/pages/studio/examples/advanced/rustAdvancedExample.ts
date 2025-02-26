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
          fileExplorerSnapshot: {
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'main.rs': {
                    type: 'file',
                    language: 'rust',
                    content: '',
                    caretPosition: { row: 0, col: 0 },
                  }
                }
              }
            },
          },
          editorSnapshot: {
            editors: [{
              isActive: true,
              isSaved: true,
              filename: 'src/main.rs',
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
          fileExplorerSnapshot: {
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'main.rs': {
                    type: 'file',
                    language: 'rust',
                    content: '',
                    caretPosition: { row: 0, col: 0 },
                  }
                }
              }
            },
          },
          editorSnapshot: {
            editors: [{
              isActive: true,
              isSaved: true,
              filename: 'src/main.rs',
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
        actions: advancedRustExampleActions
      }
    ]
  };