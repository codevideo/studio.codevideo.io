import * as React from 'react';
import { Card, Flex, Code, Text } from '@radix-ui/themes';
import { TutorialCSSClassConstants } from '../../../../layout/sidebar/StudioTutorial';
import { LessonAdder } from '../../../../utils/Lessons/LessonAdder';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { isCourse, ICourse, isLesson, ILesson } from '@fullstackcraftllc/codevideo-types';
import { LessonNavigationButtons } from '../../../../utils/Lessons/LessonNavigationButtons';
import { LessonCounter } from '../../../../utils/Lessons/LessonCounter';

export function ProjectInfoCard() {
    const { currentProject } = useAppSelector((state) => state.editor);

    const resolveProjectName = () => {
        if (currentProject?.project) {
            if (isCourse(currentProject.project)) {
                return (currentProject.project as ICourse).name;
            }
            if (isLesson(currentProject.project)) {
                return (currentProject.project as ILesson).name;
            }
            return 'Actions Project'
        }
    }

    return (
        <Card mb="3" className={TutorialCSSClassConstants.PROJECT_INFO_BOX} style={{ width: '100%' }}>
            <Flex gap="2" align="center" justify="between">
                <Flex direction="column">
                    <Text size="1" mb="1">{resolveProjectName()}</Text>
                    <Flex align="center" gap="2">
                        <Code size="1" className={TutorialCSSClassConstants.PROJECT_INFO_PROJECT_TYPE}>{currentProject?.projectType}</Code>
                        <LessonCounter />
                        <LessonAdder />
                    </Flex>
                    <LessonNavigationButtons />
                </Flex>
            </Flex>
        </Card>
    );
}
