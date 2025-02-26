import * as React from 'react';
import { useState } from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { ProjectTypeConverter } from './ProjectTypeConverter';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { createNewProject, setIsSidebarOpen } from '../../../../../store/editorSlice';
import { isActions, isCourse, isLesson } from '@fullstackcraftllc/codevideo-types';
import { ProjectSelector } from './ProjectSelector';
import { MetadataEditor } from './MetadataEditor';
import { ExportDropdown } from './ExportDropdown';
import { firstCharacterUppercase } from '../../../../../utils/firstCharacterUppercase';

export function SidebarMenu() {
    const { currentProject, isSidebarOpen } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();
    const onCreateNewProject = () => {
        dispatch(createNewProject());
        dispatch(setIsSidebarOpen(false));
    }

    if (!currentProject) {
        return <></>
    }

    let currentProjectTitle = ''
    if (isCourse(currentProject?.project)) {
        currentProjectTitle = currentProject.project.name;
    }
    if (isLesson(currentProject?.project)) {
        currentProjectTitle = currentProject.project.name
    }
    if (isActions(currentProject?.project)) {
        currentProjectTitle = '<no name>'
    }

    return (
        <div className="relative">

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-96 bg-slate-900 transform transition-transform duration-200 ease-in-out z-40 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6 pt-20 space-y-6">
                    {/* Project Type Section */}
                    <div className="space-y-2">
                        <h3 className="text-white text-lg font-semibold mb-3">Project Info</h3>
                        <div className="text-slate-300 mb-2">Current Project: <code>{currentProjectTitle}</code></div>
                        <div className="text-slate-300 mb-2">Project type: <code>{currentProject?.projectType}</code></div>
                    </div>

                    {/* Metadata Section */}
                    {currentProject.projectType !== 'actions' &&
                    <div className="space-y-2">
                        <h3 className="text-white text-lg font-semibold mb-3">Edit {firstCharacterUppercase(currentProject.projectType)} Metadata</h3>
                        <MetadataEditor />
                    </div>}

                    {/* Export Section */}
                    <div className="space-y-2">
                        <h3 className="text-white text-lg font-semibold mb-3">Export Project</h3>
                        <ExportDropdown />
                    </div>

                    {/* Convert Section */}
                    <div className="space-y-2">
                        <h3 className="text-white text-lg font-semibold mb-3">Convert Project</h3>
                        <ProjectTypeConverter />
                    </div>

                    {/* Select Other Project */}
                    <div className="space-y-2">
                        <h3 className="text-white text-lg font-semibold mb-3">Your Projects</h3>
                        <ProjectSelector />
                    </div>

                    {/* Other Actions */}
                    <div className="space-y-2">
                        <button
                            onClick={onCreateNewProject}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Create New Project
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => dispatch(setIsSidebarOpen(false))}
                />
            )}
        </div>
    );
}
