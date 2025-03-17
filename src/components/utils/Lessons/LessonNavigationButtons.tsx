import * as React from 'react';
import { Badge, Flex } from '@radix-ui/themes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setCurrentLessonIndex } from '../../../store/editorSlice';
import { isCourse } from '@fullstackcraftllc/codevideo-types';


export function LessonNavigationButtons() {
    const { currentProject, currentLessonIndex } = useAppSelector((state) => state.editor);
    const dispatch = useAppDispatch();
    if (currentProject?.projectType !== 'course') {
        return <></>
    }
    if (currentProject && currentProject.project && (isCourse(currentProject.project) && currentProject.project.lessons.length === 0) ||
        (currentProject && currentProject.project && isCourse(currentProject.project) && currentProject.project.lessons.length === 1)) {
        return <></>
    }

    const handlePreviousLesson = () => {
        const previousLessonIndex = currentLessonIndex - 1;
        if (previousLessonIndex >= 0) {
            dispatch(setCurrentLessonIndex(previousLessonIndex));
        }
    }

    const handleNextLesson = () => {
        const nextLessonIndex = currentLessonIndex + 1;
        if (isCourse(currentProject.project) && nextLessonIndex < currentProject.project.lessons.length) {
            dispatch(setCurrentLessonIndex(nextLessonIndex));
        }
    }

    return (
        <Flex gap="2" align="center" justify="between" mt="2">
            <Badge size="1" style={{ cursor: currentLessonIndex === 0 ? 'not-allowed' : 'pointer' }} color="mint" onClick={handlePreviousLesson} variant='soft'>
                {'<'} Previous
            </Badge>
            <Badge size="1" style={{ cursor: currentProject && currentProject.project && isCourse(currentProject.project) && currentLessonIndex === currentProject.project.lessons.length - 1 ? 'not-allowed' : 'pointer' }} color="mint" onClick={handleNextLesson} variant="soft">
                Next {'>'}
            </Badge>
        </Flex>
    );
}
