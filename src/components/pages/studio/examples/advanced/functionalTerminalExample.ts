import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { functionalTerminalActions } from "../actionsExamples";

export const functionalTerminalExample: ICourse = {
    id: 'functional-terminal-example',
    name: 'Functional Terminal Example',
    description: 'Learn how to use the terminal in the CodeVideo framework',
    primaryLanguage: 'javascript',
    lessons: [
      {
        id: 'functional-terminal-example',
        name: 'Learn how to use the terminal in the CodeVideo framework',
        description: 'Learn how to use the terminal in the CodeVideo framework',
        actions: functionalTerminalActions
      }
    ]
  };