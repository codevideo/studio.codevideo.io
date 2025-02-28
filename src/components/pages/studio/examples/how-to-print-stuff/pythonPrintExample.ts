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
           actions: pythonExampleActions
       }
   ]
};