import { ICourse } from "@fullstackcraftllc/codevideo-types";

export const blankPythonExample: ICourse = {
    id: 'blank-python',
    name: 'Blank Python Project',
    description: 'Start with a blank Python project',
    primaryLanguage: 'python',
    lessons: [
        {
            id: 'blank-python',
            name: 'Blank Python Project',
            description: 'Start with a blank Python project',
            initialSnapshot: {
                editorSnapshot: {
                    fileStructure: {
                        'main.py': {
                            type: 'file',
                            language: 'python',
                            content: '',
                            caretPosition: { row: 0, col: 0 },
                            cursorPosition: { x: 0, y: 0 }
                        }
                    },
                    currentFile: 'main.py',
                    openFiles: ['main.py'],
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
                        'main.py': {
                            type: 'file',
                            language: 'python',
                            content: '',
                            caretPosition: { row: 0, col: 0 },
                            cursorPosition: { x: 0, y: 0 }
                        }
                    },
                    currentFile: 'main.py',
                    openFiles: ['main.py'],
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