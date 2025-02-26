import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { addNewCourseToProjects } from '../../../store/editorSlice';
import { ICourse, isCourse } from '@fullstackcraftllc/codevideo-types';
import { useEffect, useState } from 'react';
import { allProjects } from './examples/allProjects';

export function ExampleSelector() {
    const { currentProject } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();
    const [selectedId, setSelectedId] = useState<string>('');
    const DEFAULT_VALUE = 'default';

    useEffect(() => {
        // Initialize with current project ID if available
        if (currentProject?.project && isCourse(currentProject.project)) {
            setSelectedId(currentProject.project.id);
        }
    }, [currentProject]);

    const handleExampleChange = (exampleId: string) => {
        setSelectedId(exampleId);
    };

    const loadSelectedExample = () => {
        if (selectedId === DEFAULT_VALUE || selectedId === '') return;

        const matchingProject = allProjects.find((ex: ICourse) => ex.id === selectedId);
        if (matchingProject) {
            
            // set the actions from the example's steps - for now, use the first lesson's actions
            if (!matchingProject.lessons) {
                console.error('No lessons found in example:', matchingProject);
                return;
            }
            if (!matchingProject.lessons[0]) {
                console.error('No actions found in example lesson:', matchingProject.lessons[0]);
                return;
            }
            try {
                dispatch(addNewCourseToProjects(matchingProject));
            } catch (error) {
                console.error('Failed to parse example steps:', error);
            }
        }
    };

    const selectedProject = selectedId !== DEFAULT_VALUE 
        ? allProjects?.find((ex: ICourse) => ex.id === selectedId) 
        : null;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <select
                    className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                    value={selectedId || DEFAULT_VALUE}
                    onChange={(e) => handleExampleChange(e.target.value)}
                >
                    <option value={DEFAULT_VALUE} disabled>Select an example...</option>
                    {allProjects.map((project: ICourse) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
                
                {selectedId !== DEFAULT_VALUE && selectedId !== '' && (
                    <button 
                        onClick={loadSelectedExample}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors text-white"
                    >
                        Go!
                    </button>
                )}
            </div>
            
            {selectedProject?.description && (
                <span className="text-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {selectedProject.description}
                </span>
            )}
        </div>
    );
}