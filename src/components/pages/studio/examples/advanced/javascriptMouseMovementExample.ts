import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { mouseMovementExampleActions } from "../actionsExamples";

export const mouseMovementExample: ICourse = {
    id: 'mouse-movement-example',
    name: 'Mouse Movement Example',
    description: 'Learn how to move the mouse in the CodeVideo framework',
    primaryLanguage: 'javascript',
    lessons: [
      {
        id: 'mouse-movement-example',
        name: 'Learn how to move the mouse in the CodeVideo framework',
        description: 'Learn how to move the mouse in the CodeVideo framework',
        actions: mouseMovementExampleActions
      }
    ]
  };