import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { pythonExampleActions } from "../actionsExamples";

export const pythonPrintExample: ICourse = {
   id: 'python',
   name: 'Python Print Example', 
   description: 'Learn how to use print in Python',
   primaryLanguage: 'python',
   lessons: [
       {
           id: 'python',
           name: 'Python Print Example',
           description: 'Learn how to use print in Python',
           initialSnapshot: {
               fileExplorerSnapshot: {
                   fileStructure: {
                       'src': {
                           type: 'directory',
                           content: '',
                           collapsed: false,
                           children: {
                               'main.py': {
                                   type: 'file',
                                   language: 'python',
                                   content: '# main.py\n',
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
                       filename: 'src/main.py',
                       content: '# main.py\n',
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
                               'main.py': {
                                   type: 'file',
                                   language: 'python',
                                   content: '# main.py\n',
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
                       filename: 'src/main.py',
                       content: '# main.py\n',
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
           actions: pythonExampleActions
       }
   ]
};