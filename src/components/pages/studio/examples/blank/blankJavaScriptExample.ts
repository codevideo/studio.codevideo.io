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
        isUnsavedChangesDialogOpen: false,
        unsavedFileName: '',
        fileExplorerSnapshot: {
          isFileExplorerContextMenuOpen: false,
          isFileContextMenuOpen: false,
          isFolderContextMenuOpen: false,
          isNewFileInputVisible: false,
          isNewFolderInputVisible: false,
          isRenameFileInputVisible: false,
          isRenameFolderInputVisible: false,
          newFileInputValue: '',
          newFolderInputValue: '',
          renameFileInputValue: '',
          renameFolderInputValue: '',
          originalFileBeingRenamed: '',
          originalFolderBeingRenamed: '',
          newFileParentPath: '',
          newFolderParentPath: '',
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
          isEditorContextMenuOpen: false,
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
          location: 'editor',
          currentHoveredFileName: '',
          currentHoveredFolderName: '',
          currentHoveredEditorTabFileName: '',
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
            { currentSpeechCaption: '' }
          ]
        }
      },
      finalSnapshot: {
        isUnsavedChangesDialogOpen: false,
        unsavedFileName: '',
        fileExplorerSnapshot: {
          isFileExplorerContextMenuOpen: false,
          isFileContextMenuOpen: false,
          isFolderContextMenuOpen: false,
          isNewFileInputVisible: false,
          isNewFolderInputVisible: false,
          isRenameFileInputVisible: false,
          isRenameFolderInputVisible: false,
          newFileInputValue: '',
          newFolderInputValue: '',
          renameFileInputValue: '',
          renameFolderInputValue: '',
          originalFileBeingRenamed: '',
          originalFolderBeingRenamed: '',
          newFileParentPath: '',
          newFolderParentPath: '',
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
          isEditorContextMenuOpen: false,
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
          location: 'editor',
          currentHoveredFileName: '',
          currentHoveredFolderName: '',
          currentHoveredEditorTabFileName: '',
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
            { currentSpeechCaption: '' }
          ]
        }
      },
      actions: blankJavaScriptExampleActions
    }
  ]
};