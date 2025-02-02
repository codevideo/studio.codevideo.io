import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setCurrentProject, setActions, setCodeIndex, setActionsString } from '../../../store/editorSlice';
import { ICourse } from '@fullstackcraftllc/codevideo-types';

export interface IExampleSelectorProps {
}

export function ExampleSelector(props: IExampleSelectorProps) {
    const { currentProject, allProjects } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();

    const handleExampleChange = (exampleId: string) => {
        const matchingProject = allProjects?.find((ex: ICourse) => ex.id === exampleId);
        if (matchingProject) {
            dispatch(setCurrentProject(matchingProject));
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
                dispatch(setActions(matchingProject.lessons[0].actions));
                dispatch(setActionsString(JSON.stringify(matchingProject.lessons[0].actions, null, 2)));
                dispatch(setCodeIndex(0));
            } catch (error) {
                console.error('Failed to parse example steps:', error);
            }
        }
    };

    return (
        <header className="max-w-[1800px] mx-auto mb-6 bg-slate-100 p-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <label className="text-slate-600">Choose an example:</label>
                    <select
                        className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700"
                        value={currentProject?.id}
                        onChange={(e) => handleExampleChange(e.target.value)}
                    >
                        {allProjects.map((project: ICourse) => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-slate-500">{currentProject?.description}</span>
                </div>
            </div>
        </header>
    );
}
