import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { javascriptCreateRenameDeleteFileExampleActions } from "../actionsExamples";

export const javascriptCreateRenameDeleteFileExample: ICourse = {
    id: 'javascript-create-rename-delete-file',
    name: 'JavaScript File Operations Example',
    description: 'Learn how to create, rename, and delete files in JavaScript',
    primaryLanguage: 'javascript',
    lessons: [
      {
        id: 'javascript-create-rename-delete-file',
        name: 'JavaScript Create, Rename, and Delete File Example',
        description: 'Learn how to create, rename, and delete files in JavaScript',
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
                    content: '// index.js\n',
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
              content: '// index.js\n',
              caretPosition: { row: 0, col: 0 },
              highlightCoordinates: null
          }]
          },
          terminalSnapshot: {
            terminals: [
              {
                content: ''}
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
        actions: javascriptCreateRenameDeleteFileExampleActions
      }
    ]
  };