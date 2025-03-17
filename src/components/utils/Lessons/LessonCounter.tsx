import * as React from 'react';
import { Code, Text } from '@radix-ui/themes';
import { isCourse } from '@fullstackcraftllc/codevideo-types';
import { useAppSelector } from '../../../hooks/useAppSelector';

export function LessonCounter() {
    const { currentProject, currentLessonIndex } = useAppSelector((state) => state.editor);

    if (currentProject && currentProject.project && isCourse(currentProject.project)) {
        return (
            <Code
                size="1"
                ml="1"
                color="gray"
            >
                Lesson <Text color="mint" weight="bold">{currentLessonIndex + 1}</Text> of <Text color="mint" weight="bold">{currentProject.project.lessons.length}</Text>
            </Code>
        );
    }

    return <></>
}

