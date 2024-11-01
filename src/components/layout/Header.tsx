import * as React from 'react';
import { Link } from 'gatsby';
import { useAppSelector } from '../../hooks/useAppSelector';
import { IEditorProject } from '../../interfaces/IEditorProject';
import { setActions, setCodeIndex, setCurrentProject } from '../../store/editorSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';


export interface IHeaderProps {
}

export function Header(props: IHeaderProps) {
    const { currentProject, allProjects } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();

    const handleExampleChange = (exampleId: string) => {
        const matchingProject = allProjects?.find((ex: IEditorProject) => ex.id === exampleId);
        if (matchingProject) {
            dispatch(setCurrentProject(matchingProject));
            // set the actions from the example's steps
            try {
                dispatch(setActions(matchingProject.steps));
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
                    <p>CodeVideo™ Studio</p>
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
                <Link
                    to="/purchase-credits"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Purchase Credits
                </Link>
            </div>
        </header>
    );
}
