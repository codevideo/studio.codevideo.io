import { ICourse } from "@fullstackcraftllc/codevideo-types";
import { typingUnitTestExampleActions } from "../actionsExamples";

export const typingUnitTestExample: ICourse = {
   id: 'typingUnitTest',
   name: 'Typing Unit Test Example', 
   description: 'Writes all the letters of the alphabet and deletes them all 3 times in a row',
   primaryLanguage: 'txt',
   lessons: [
       {
           id: 'typingUnitTest',
           name: 'Typing Unit Test Example',
           description: 'Writes all the letters of the alphabet and deletes them all 3 times in a row',
           actions: typingUnitTestExampleActions
       }
   ]
};