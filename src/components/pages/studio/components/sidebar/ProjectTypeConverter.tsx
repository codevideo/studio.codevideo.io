import * as React from 'react';
import { ICourse, ILesson, IAction, ProjectType, convertProjectType } from '@fullstackcraftllc/codevideo-types';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { setCurrentProjectIndex, setActions, addNewCourseToProjects, addNewLessonToProjects, addNewActionsToProjects } from '../../../../../store/editorSlice';
import { useState } from 'react';
import { ProjectConversionModal } from './ProjectConversionModal';

export function ProjectTypeConverter () {
    const dispatch = useAppDispatch();
    const { currentProject } = useAppSelector(state => state.editor);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetType, setTargetType] = useState<ProjectType>('');
  
    // Determine available conversion options based on current mode
    const getConversionOptions = () => {
      const options: Array<{ value: 'course' | 'lesson' | 'actions', label: string }> = [];
      
      if (currentProject?.projectType !== 'course') {
        options.push({ value: 'course', label: 'Course' });
      }
      
      if (currentProject?.projectType !== 'lesson') {
        options.push({ value: 'lesson', label: 'Lesson' });
      }
      
      if (currentProject?.projectType !== 'actions') {
        options.push({ value: 'actions', label: 'Actions' });
      }
      
      return options;
    };
  
    const handleConversionSelect = (value: string) => {
      if (value === '') return;
      
      setTargetType(value as 'course' | 'lesson' | 'actions');
      setIsModalOpen(true);
    };
  
    const handleConfirmConversion = () => {
      if (!currentProject || !targetType) return;
      
      const convertedProject = convertProjectType(
        currentProject.project, 
        targetType
      );
      
      if (convertedProject) {
        if (targetType === 'course') {
          dispatch(addNewCourseToProjects(convertedProject as ICourse));
        } else if (targetType === 'lesson') {
          dispatch(addNewLessonToProjects(convertedProject as ILesson));
        } else if (targetType === 'actions') {
          dispatch(addNewActionsToProjects(convertedProject as IAction[]));
        }
      }
      
      // Close modal and reset target type
      setIsModalOpen(false);
      setTargetType('');
    };
  
    const options = getConversionOptions();
  
    if (options.length === 0 || !currentProject) {
      return null;
    }
  
    return (
      <>
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm"
            value={targetType}
            onChange={(e) => handleConversionSelect(e.target.value)}
          >
            <option value="">Convert Project To...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
  
        {/* Conversion Confirmation Modal */}
        {isModalOpen && (
          <ProjectConversionModal
            currentType={currentProject.projectType}
            targetType={targetType}
            onCancel={() => {
              setIsModalOpen(false);
              setTargetType('');
            }}
            onConfirm={handleConfirmConversion}
          />
        )}
      </>
    );
  }
