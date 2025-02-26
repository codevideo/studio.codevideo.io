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
          fileExplorerSnapshot: {
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'index.js': {
                    type: 'file',
                    language: 'javascript',
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
              filename: 'src/index.js',
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
                  'index.js': {
                    type: 'file',
                    language: 'javascript',
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
              filename: 'src/index.js',
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
        actions: blankJavaScriptExampleActions
      }
    ]
  };