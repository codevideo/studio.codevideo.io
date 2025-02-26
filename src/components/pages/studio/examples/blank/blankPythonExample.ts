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
                        filename: 'src/main.py',
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
                                'main.py': {
                                    type: 'file',
                                    language: 'python',
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
                        filename: 'src/main.py',
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
            actions: []
        }
    ]
};