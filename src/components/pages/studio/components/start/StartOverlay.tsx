import * as React from 'react';
import { ExampleSelector } from '../../ExampleSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { addNewActionsToProjects, addNewCourseToProjects, addNewLessonToProjects, toggleSidebar } from '../../../../../store/editorSlice';
import { JSONPaster } from './JSONPaster';
import { ProjectType } from '@fullstackcraftllc/codevideo-types';
import { openModal } from '../../../../../store/modalSlice';
import { ModalTypes } from '../../../../../types/modal';
import { useEffect } from 'react';

export interface IStartOverlayProps {
  setSelectedProjectType: (projectType: ProjectType) => void;
}

export function StartOverlay(props: IStartOverlayProps) {
  const { setSelectedProjectType } = props;
  const dispatch = useAppDispatch();

  // on mount, show the super-beta modal
  useEffect(() => {
    dispatch(openModal(
      {
        type: ModalTypes.ALERT,
        props: {
          message: "Welcome to the CodeVideo Studio! This is a SUPER BETA version of the studio, but we're excited to have you here. Please be patient with us as we continue to improve the studio - we're hoping to release fully by April 1st at the latest. If you have any feedback or are interested in the CodeVideo framework in anyway, please let us know in the chat or via email at hi@fullstackcraft.com. Thanks for being here!",
        }
      }
    ));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 max-w-md w-full relative">
        <h2 className="text-2xl font-semibold text-center text-slate-900 dark:text-white">
          What do you want to create?
        </h2>

        <div className="flex flex-col gap-4 mb-6">
          <button
            disabled={true}
            onClick={() => {
              dispatch(addNewCourseToProjects({
                id: '',
                name: '',
                description: '',
                primaryLanguage: '',
                lessons: []
              }))
              setSelectedProjectType('course');
            }
            }
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 py-4 px-6 rounded-md font-medium text-lg transition-colors duration-200 shadow-sm"
          >
            Create a New Course
            <span className="text-sm text-slate-500">(coming soon)</span>
          </button>

          <button
            disabled={true}
            onClick={() => {
              dispatch(addNewLessonToProjects({
                id: '',
                name: '',
                description: '',
                actions: []
              }))
              setSelectedProjectType('lesson');
            }
            }
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 py-4 px-6 rounded-md font-medium text-lg transition-colors duration-200 shadow-sm"
          >
            Create a New Lesson
            <span className="text-sm text-slate-500">(coming soon)</span>
          </button>

          <button
            onClick={() => dispatch(addNewActionsToProjects([]))}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 py-4 px-6 rounded-md font-medium text-lg transition-colors duration-200 shadow-sm flex flex-col items-center justify-center"
          >
            <span>Create Actions Only</span>
            <span className="text-sm text-slate-500">(simplest)</span>
          </button>

          <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
            Or, start from an example course:
          </div>
          <ExampleSelector />

          <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
            Advanced: paste in any course, lesson, or actions JSON to start from an existing project:
          </div>
          <JSONPaster />
        </div>

        <p className="text-center text-slate-500 dark:text-slate-400 text-sm">
          If you don't know which to select, don't worry - all these options are interchangeable at any time in the editor.
        </p>
      </div>
    </div>

  );
}
