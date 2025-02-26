import React from 'react';
import { ICourse, ILesson } from "@fullstackcraftllc/codevideo-types";
import { useAppDispatch } from "../../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useEffect, useState } from "react";
import { addNewCourseToProjects } from "../../../../../store/editorSlice";
import { InputField } from "../../../../utils/InputField";
import { LessonMetadataForm } from './LessonMetadataForm';
import { formatNameToSafeId } from '../../../../../utils/formatNameToSafeId';
import { openModal } from '../../../../../store/modalSlice';
import { ModalTypes } from '../../../../../types/modal';

export interface ICourseMetadataFormProps {
  onClickCancel: () => void;
}

export const CourseMetadataForm = (props: ICourseMetadataFormProps) => {
  const { onClickCancel } = props;
  const dispatch = useAppDispatch();
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);
  const course = projects[currentProjectIndex]?.project as ICourse;

  // State for managing the lesson addition UI
  const [isAddingLesson, setIsAddingLesson] = useState(false);

  // Language options for dropdown
  const languageOptions = [
    { value: '', label: 'Select a language' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'other', label: 'Other' }
  ];

  // Create local state initialized with Redux values
  const [localCourse, setLocalCourse] = useState<ICourse>({
    id: '',
    name: '',
    description: '',
    primaryLanguage: '',
    lessons: []
  });



  // Update local state when Redux state changes
  useEffect(() => {
    if (course) {
      setLocalCourse({
        id: formatNameToSafeId(course.name),
        name: course.name || '',
        description: course.description || '',
        primaryLanguage: course.primaryLanguage || '',
        lessons: course.lessons || []
      });
    }
  }, [course]);

  // Listen for changes in the course's lessons array
  useEffect(() => {
    if (course && course.lessons && course.lessons.length > localCourse.lessons.length) {
      // A new lesson was added to the course
      setLocalCourse(prev => ({
        ...prev,
        lessons: course.lessons || []
      }));

      // Close the lesson form
      setIsAddingLesson(false);
    }
  }, [course?.lessons?.length]);

  const handleChange = (field: keyof ICourse, value: string) => {
    setLocalCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!localCourse.name) {
      dispatch(openModal({
        type: ModalTypes.ALERT,
        props: {
          message: 'Please fill in all required fields'
        }
      }))
      return;
    }

    // Persist changes to Redux
    dispatch(addNewCourseToProjects({
      id: localCourse.id,
      name: localCourse.name,
      description: localCourse.description,
      primaryLanguage: localCourse.primaryLanguage
    }));
  };

  const handleAddLesson = () => {
    setIsAddingLesson(true);
  };

  return (
    <div className='flex flex-row justify-center items-center gap-4 p-4 text-white'>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
          Course Info
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <InputField
            label="Course Name"
            id="course-name"
            value={localCourse.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Mastering React Development"
            required
          />

          <InputField
            label="Description"
            id="course-description"
            value={localCourse.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="A comprehensive course on modern React development techniques..."
            isTextarea
          />

          <div className="mb-4">
            <label htmlFor="primary-language" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Primary Language
            </label>
            <select
              id="primary-language"
              value={localCourse.primaryLanguage}
              onChange={(e) => handleChange('primaryLanguage', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {languageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                Course Lessons ({localCourse.lessons?.length || 0})
              </h3>

              {!isAddingLesson && (
                <button
                  type="button"
                  onClick={handleAddLesson}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Add lesson"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* Display existing lessons */}
            {localCourse.lessons && localCourse.lessons.length > 0 && (
              <div className="space-y-3 mb-4">
                {localCourse.lessons.map((lesson, index) => (
                  <div key={lesson.id || index} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{lesson.name || `Lesson ${index + 1}`}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {lesson.actions?.length || 0} Actions
                      </span>
                    </div>
                    {lesson.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{lesson.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add Lesson Form */}
            {isAddingLesson && (
              <LessonMetadataForm forCourse={true} onClickCancel={() => setIsAddingLesson(false)} />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClickCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};