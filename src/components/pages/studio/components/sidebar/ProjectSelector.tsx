import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { setCurrentProjectIndex } from '../../../../../store/editorSlice';
import { isCourse, isLesson, isActions, Project } from '@fullstackcraftllc/codevideo-types';

export function ProjectSelector() {
  const dispatch = useAppDispatch();
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);

  const handleProjectChange = (index: number) => {
    dispatch(setCurrentProjectIndex(index));
  };

  // Get project name based on type
  const getProjectName = (project: Project, index: number) => {
    if (isCourse(project)) {
      return project.name;
    }
    if (isLesson(project)) {
      return project.name;
    }
    if (isActions(project)) {
      return `Actions Set ${index + 1}`;
    }
    return 'Unknown Project';
  };

  if (projects.length === 0) {
    return (
      <div className="text-slate-400 text-sm italic">
        No other projects
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((userProject, index) => (
        <button
          disabled={currentProjectIndex === index}
          key={index}
          onClick={() => handleProjectChange(index)}
          className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
            currentProjectIndex === index
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
          }`}
        >
          <div className="font-medium">
            {getProjectName(userProject.project, index)}
          </div>
          <div className="text-sm opacity-75">
            <code>{userProject.projectType}</code>
          </div>
          <div className="text-xs text-stone-300 opacity-75">
            Created {new Date(userProject.created).toLocaleDateString()} {new Date(userProject.created).toLocaleTimeString()}
          </div>
          <div className="text-xs text-stone-300 opacity-75">
            Last Modified {new Date(userProject.modified).toLocaleDateString()} {new Date(userProject.modified).toLocaleTimeString()}
          </div>
        </button>
      ))}
    </div>
  );
}