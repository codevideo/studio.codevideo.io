import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { cSharpExampleActions } from "../actionsExamples";

export const csharpConsoleWriteLineExample: ICourse = {
    id: 'csharp',
    name: 'C# Console.WriteLine Example',
    description: 'Learn how to use Console.WriteLine in C#',
    primaryLanguage: 'csharp',
    lessons: [
      {
        id: 'csharp',
        name: 'C# Console.WriteLine Example',
        description: 'Learn how to use Console.WriteLine in C#',
        initialSnapshot: {
          fileExplorerSnapshot: {
            fileStructure: {
              'src': {
                type: 'directory',
                content: '',
                collapsed: false,
                children: {
                  'Program.cs': {
                    type: 'file',
                    language: 'csharp',
                    content: '// Program.cs\n',
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
              filename: 'src/Program.cs',
              content: '// Program.cs\n',
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
                  'Program.cs': {
                    type: 'file',
                    language: 'csharp',
                    content: '// Program.cs\n',
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
              filename: 'src/Program.cs',
              content: '// Program.cs\n',
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
        actions: cSharpExampleActions
      }
    ]
  };