import * as React from 'react';
import ComponentEmbedder from './components/ComponentEmbedder';
import { useAppSelector } from '../../../hooks/useAppSelector';

export function Embed() {
    const { currentProject, currentActionIndex, currentLessonIndex } = useAppSelector((state) => state.editor);
    const { theme } = useAppSelector(state => state.theme);

    const project = currentProject?.project;

    if (!project) {
        return <></>;
    }

    return (
        <ComponentEmbedder
            project={project}
            currentActionIndex={currentActionIndex}
            currentLessonIndex={currentLessonIndex}
            theme={theme}
            mode="step"
        />
    );
}
