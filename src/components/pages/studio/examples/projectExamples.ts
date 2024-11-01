import { IEditorProject } from '../../../../interfaces/IEditorProject';
import { javaScriptExampleSteps, pythonExampleSteps, cSharpExampleSteps, goLangExampleSteps } from './stepsExamples';

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
  mainFile: 'src/index.js'
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
  mainFile: 'src/main.py'
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
  mainFile: 'src/Program.cs'
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
  mainFile: 'src/main.go'
};

// Export all examples
export const projectExamples: IEditorProject[] = [
  javascriptExampleProject,
  pythonExample,
  csharpExample,
  goExample
];

// Default example
export const defaultExampleProject = javascriptExampleProject;