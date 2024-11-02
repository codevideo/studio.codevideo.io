import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { IEditorProject } from '../../../interfaces/IEditorProject';
import { setCurrentProject, setActions, setCodeIndex, setActionsString } from '../../../store/editorSlice';

export interface IExampleSelectorProps {
}

export function ExampleSelector(props: IExampleSelectorProps) {
    const { currentProject, allProjects } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();

    const handleExampleChange = (exampleId: string) => {
        const matchingProject = allProjects?.find((ex: IEditorProject) => ex.id === exampleId);
        if (matchingProject) {
            dispatch(setCurrentProject(matchingProject));
            // set the actions from the example's steps
            try {
                dispatch(setActions(matchingProject.steps));
                dispatch(setActionsString(JSON.stringify(matchingProject.steps, null, 2)));
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
                        {allProjects.map((example: IEditorProject) => (
                            <option key={example.id} value={example.id}>
                                {example.name}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-slate-500">{currentProject?.description}</span>
                </div>
            </div>
        </header>
    );
}
