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
                editorSnapshot: {
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
                                    cursorPosition: { x: 0, y: 0 }
                                }
                            }
                        }
                    },
                    currentFile: 'src/main.py',
                    openFiles: ['src/main.py'],
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
                                'main.py': {
                                    type: 'file',
                                    language: 'python',
                                    content: '# main.py\n',
                                    caretPosition: { row: 0, col: 0 },
                                    cursorPosition: { x: 0, y: 0 }
                                }
                            }
                        }
                    },
                    currentFile: 'src/main.py',
                    openFiles: ['src/main.py'],
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
            actions: pythonExampleActions
        }
    ]
};