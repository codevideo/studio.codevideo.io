import * as React from 'react';
import { ClockIcon, FileIcon } from '@radix-ui/react-icons';
import { Card, Flex, Box, Code, Text } from '@radix-ui/themes';
import { IAction, ICourse, ILesson, Project, isCourse, isLesson, isValidActions } from '@fullstackcraftllc/codevideo-types';
import { formatDistanceToNow } from 'date-fns';
import { UserProject } from '../../../store/editorSlice';

export interface IProjectRendererProps {
    userProject: UserProject;
    isCurrentProject: boolean;
    onClickProject?: () => void;

}

// Get project name based on type
const getProjectName = (project: Project) => {
    if (isCourse(project)) {
        return project.name || `<Unnamed Course>`;
    }
    if (isLesson(project)) {
        return project.name || `<Unnamed Lesson>`;
    }
    if (isValidActions(project)) {
        return `Actions Project`;
    }
    return 'Unknown Project';
};

export function ProjectRenderer(props: IProjectRendererProps) {
    const { userProject, onClickProject, isCurrentProject } = props;
    const projectName = getProjectName(userProject.project);
    const modifiedDate = new Date(userProject.modified);
    const timeAgo = formatDistanceToNow(modifiedDate, { addSuffix: true });

    return (
        <Card
            variant={isCurrentProject ? "classic" : "surface"}
            onClick={onClickProject}
            style={{
                cursor: isCurrentProject ? 'default' : 'pointer',
                borderLeft: isCurrentProject ? `4px solid var(--mint-9)` : undefined
            }}
        >
            <Flex gap="3" align="center">
                <Box style={{ flexGrow: 1 }}>
                    <Flex justify="between" align="center">
                        <Text weight={isCurrentProject ? "bold" : "regular"} size="2">
                            {projectName}
                        </Text>

                        <Flex gap="2" align="center">
                            <Code color="mint" variant="soft">
                                {userProject.projectType}
                            </Code>
                        </Flex>
                    </Flex>


                    <Flex align="center" justify="between" mt="2">
                        <Box>
                            <Flex gap="1" align="center">
                            <ClockIcon height="12" width="12" color="var(--gray-8)" />
                            <Text size="1" color="gray">
                                {timeAgo}
                            </Text>
                            </Flex>
                        </Box>
                        <Box>
                        <Flex gap="1" align="center">
                            <FileIcon height="12" width="12" color="var(--gray-8)" />
                            {userProject?.projectType === 'course' && <Text size="1" color="gray">{(userProject?.project as ICourse).lessons.length} lesson{(userProject?.project as ICourse).lessons.length === 1 ? '' : 's'}</Text>}
                            {userProject?.projectType === 'lesson' && <Text size="1" color="gray">{(userProject?.project as ILesson).actions.length} action{(userProject?.project as ILesson).actions.length === 1 ? '' : 's'}</Text>}
                            {userProject?.projectType === 'actions' && <Text size="1" color="gray">{(userProject?.project as Array<IAction>).length} action{(userProject?.project as Array<IAction>).length === 1 ? '' : 's'}</Text>}
                        </Flex>
                        </Box>
                    </Flex>

                </Box>
            </Flex>
        </Card>
    );
}
