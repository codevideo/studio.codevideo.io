import { IEditorProject } from '../../../../interfaces/IEditorProject';
import { javaScriptExampleSteps, pythonExampleSteps, cSharpExampleSteps, goLangExampleSteps, blankJavaScriptExampleSteps, javascriptCreateRenameDeleteFileExampleSteps } from './stepsExamples';

// Blank Example
const blankJavaScriptExample: IEditorProject = {
  id: 'blank-javascript',
  name: 'Blank JavaScript Project',
  description: 'Start with a blank JavaScript project',
  language: 'javascript',
  steps: blankJavaScriptExampleSteps,
  fileStructure: {
    'index.js': {
      type: 'file',
      content: '',
      language: 'javascript'
    }
  },
  selectedFile: 'index.js',
  openFiles: ['index.js']
};

// JavaScript Example
const javascriptExampleProject: IEditorProject = {
  id: 'javascript',
  name: 'JavaScript Console.log Example',
  description: 'Learn how to use console.log in JavaScript',
  language: 'javascript',
  steps: javaScriptExampleSteps,
  fileStructure: {
    'src': {
      type: 'directory',
      content: '',
      children: {
        'index.js': {
          type: 'file',
          content: '// index.js\n',
          language: 'javascript'
        },
      }
    },
  },
  selectedFile: 'src/index.js',
  openFiles: ['src/index.js']
};

// JavaScript Create, Rename, and Delete File Example
const javascriptCreateRenameDeleteFileExample: IEditorProject = {
  id: 'javascript-create-rename-delete-file',
  name: 'JavaScript Create, Rename, and Delete File Example',
  description: 'Learn how to create, rename, and delete files in JavaScript',
  language: 'javascript',
  steps: javascriptCreateRenameDeleteFileExampleSteps,
  fileStructure: {
    'src': {
      type: 'directory',
      content: '',
      children: {
        'index.js': {
          type: 'file',
          content: '// index.js\n',
          language: 'javascript'
        },
      }
    },
  },
  selectedFile: 'src/index.js',
  openFiles: ['src/index.js']
};

// Python Example
const pythonExample: IEditorProject = {
  id: 'python',
  name: 'Python Print Example',
  description: 'Learn how to use print in Python',
  language: 'python',
  steps: pythonExampleSteps,
  fileStructure: {
    'src': {
      type: 'directory',
      content: '',
      children: {
        'main.py': {
          type: 'file',
          content: '# main.py\n',
          language: 'python'
        },
      }
    },
  },
  selectedFile: 'src/main.py',
  openFiles: ['src/main.py']
};

// C# Example
const csharpExample: IEditorProject = {
  id: 'csharp',
  name: 'C# Console.WriteLine Example',
  description: 'Learn how to use Console.WriteLine in C#',
  language: 'csharp',
  steps: cSharpExampleSteps,
  fileStructure: {
    'src': {
      type: 'directory',
      content: '',
      children: {
        'Program.cs': {
          type: 'file',
          content: '// Program.cs\n',
          language: 'csharp'
        },
      }
    },
  },
  selectedFile: 'src/Program.cs',
  openFiles: ['src/Program.cs']
};

// Go Example
const goExample: IEditorProject = {
  id: 'go',
  name: 'Go fmt.Println Example',
  description: 'Learn how to use fmt.Println in Go',
  language: 'go',
  steps: goLangExampleSteps,
  fileStructure: {
    'src': {
      type: 'directory',
      content: '',
      children: {
        'main.go': {
          type: 'file',
          content: '// main.go\n',
          language: 'go'
        },
      }
    },
  },
  selectedFile: 'src/main.go',
  openFiles: ['src/main.go']
};

// Export all examples
export const projectExamples: IEditorProject[] = [
  blankJavaScriptExample,
  javascriptExampleProject,
  javascriptCreateRenameDeleteFileExample,
  pythonExample,
  csharpExample,
  goExample
];

// Default example
export const defaultExampleProject = javascriptExampleProject;