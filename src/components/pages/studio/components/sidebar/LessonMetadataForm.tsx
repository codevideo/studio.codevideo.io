import React, { act } from 'react';
import { ILesson } from '@fullstackcraftllc/codevideo-types';
import { useEffect, useState } from "react";
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { addLessonToCourse, addNewLessonToProjects } from '../../../../../store/editorSlice';
import { formatNameToSafeId } from '../../../../../utils/formatNameToSafeId';
import { InputField } from '../../../../utils/InputField';
import { openModal } from '../../../../../store/modalSlice';
import { ModalTypes } from '../../../../../types/modal';

interface ILessonMetadataFormProps {
  forCourse: boolean;
  onClickCancel: () => void;
}

export const LessonMetadataForm = (props: ILessonMetadataFormProps) => {
  const { forCourse, onClickCancel } = props;
  const dispatch = useAppDispatch();
  const { projects, currentProjectIndex, currentLessonIndex } = useAppSelector(state => state.editor);
  const lesson = projects[currentProjectIndex]?.project as ILesson;

  // Create local state initialized with Redux values
  const [localLesson, setLocalLesson] = useState<ILesson>({
    id: '',
    name: '',
    description: '',
    actions: []
  });

  // Update local state when Redux state changes
  useEffect(() => {
    if (lesson) {
      setLocalLesson({
        id: `${currentLessonIndex+1}-${formatNameToSafeId(lesson.name)}`,
        name: lesson.name || '',
        description: lesson.description || '',
        actions: lesson.actions || []
      });
    }
  }, [lesson]);

  const handleChange = (field: keyof ILesson, value: string) => {
    setLocalLesson(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!localLesson.name) {
      dispatch(openModal({
        type: ModalTypes.ALERT,
        props: {
          message: 'Please fill in all required fields'
        }
      }))
      return;
    }

    if (forCourse) {
      // add lesson to course lessons
      dispatch(addLessonToCourse(localLesson));
      return;
    }


    // Persist changes to Redux
    dispatch(addNewLessonToProjects({
      id: localLesson.id,
      name: localLesson.name,
      description: localLesson.description,
      actions: localLesson.actions
    }));
  };

  return (
    <div className='flex flex-row justify-center items-center gap-4 p-4 text-white'>
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
          Lesson Info
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>

          <InputField
            label="Lesson Name"
            id="lesson-name"
            value={localLesson.name}
            onChange={(value) => handleChange('name', value)}
            placeholder="Introduction to React Hooks"
            required
          />

          <InputField
            label="Description"
            id="lesson-description"
            value={localLesson.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="A comprehensive overview of React Hooks and their usage..."
            isTextarea
          />

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClickCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {forCourse ? "Add to Course" : "Save Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};