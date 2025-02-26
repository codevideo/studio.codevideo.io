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
        actions: javaScriptExampleActions
      }
    ]
  };