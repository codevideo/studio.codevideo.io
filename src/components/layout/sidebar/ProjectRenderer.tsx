import * as React from 'react';
import { ClockIcon, FileIcon } from '@radix-ui/react-icons';
import { Card, Flex, Box, Code, Text } from '@radix-ui/themes';
import { Project, isCourse, isLesson, isValidActions } from '@fullstackcraftllc/codevideo-types';
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

// Helper function to safely get item count with type checking
const getItemCount = (userProject: UserProject): { count: number, itemName: string } => {
    if (!userProject?.project) {
        return { count: 0, itemName: 'items' };
    }

    const { project, projectType } = userProject;

    if (projectType === 'course' && isCourse(project)) {
        const lessons = project.lessons || [];
        return {
            count: lessons.length,
            itemName: lessons.length === 1 ? 'lesson' : 'lessons'
        };
    }

    if (projectType === 'lesson' && isLesson(project)) {
        const actions = project.actions || [];
        return {
            count: actions.length,
            itemName: actions.length === 1 ? 'action' : 'actions'
        };
    }

    if (projectType === 'actions' && Array.isArray(project)) {
        return {
            count: project.length,
            itemName: project.length === 1 ? 'action' : 'actions'
        };
    }

    return { count: 0, itemName: 'items' };
};

export function ProjectRenderer(props: IProjectRendererProps) {
    const { userProject, onClickProject, isCurrentProject } = props;
    const projectName = userProject && userProject.project ? getProjectName(userProject.project) : 'Unknown Project';
    const modifiedDate = new Date(userProject?.modified || Date.now());
    const timeAgo = formatDistanceToNow(modifiedDate, { addSuffix: true });
    const { count, itemName } = getItemCount(userProject);

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
                                {userProject?.projectType || 'unknown'}
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
                                {count !== 0 && <FileIcon height="12" width="12" color="var(--gray-8)" />}
                                <Text size="1" color="gray">
                                    {count !== 0 ? count : <></>} {count !== 0 ? itemName : <></>}
                                </Text>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            </Flex>
        </Card>
    );
}