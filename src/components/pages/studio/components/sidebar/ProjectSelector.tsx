import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { setCurrentProjectIndex } from '../../../../../store/editorSlice';
import { isCourse, isLesson, isActions, Project } from '@fullstackcraftllc/codevideo-types';
import { 
  Flex, 
  Card, 
  Box, 
  Avatar, 
  Badge, 
  Text, 
  Separator, 
  ScrollArea, 
  Heading,
  Tooltip,
  IconButton
} from '@radix-ui/themes';
import { PlayIcon, FilePlusIcon, ClockIcon } from '@radix-ui/react-icons';
import { formatDistanceToNow } from 'date-fns';

export function ProjectSelector() {
  const dispatch = useAppDispatch();
  const { projects, currentProjectIndex } = useAppSelector(state => state.editor);

  const handleProjectChange = (index: number) => {
    dispatch(setCurrentProjectIndex(index));
  };

  // Get project name based on type
  const getProjectName = (project: Project, index: number) => {
    if (isCourse(project)) {
      return project.name || `Course ${index + 1}`;
    }
    if (isLesson(project)) {
      return project.name || `Lesson ${index + 1}`;
    }
    if (isActions(project)) {
      return `Actions Set ${index + 1}`;
    }
    return 'Unknown Project';
  };

  // Get project icon based on type
  const getProjectIcon = (projectType: string) => {
    switch (projectType) {
      case 'course':
        return 'C';
      case 'lesson':
        return 'L';
      case 'actions':
        return 'A';
      default:
        return '?';
    }
  };

  // Get appropriate color based on project type
  const getProjectColor = (projectType: string) => {
    switch (projectType) {
      case 'course':
        return 'blue';
      case 'lesson':
        return 'green';
      case 'actions':
        return 'amber';
      default:
        return 'gray';
    }
  };

  if (projects.length === 0) {
    return (
      <Card size="1" variant="surface">
        <Flex align="center" justify="center" p="3">
          <Text size="2" color="gray">No projects available</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <ScrollArea style={{ maxHeight: '400px' }}>
      <Flex direction="column" gap="2">
        {projects.map((userProject, index) => {
          const isCurrentProject = currentProjectIndex === index;
          const projectColor = getProjectColor(userProject.projectType);
          const projectIcon = getProjectIcon(userProject.projectType);
          const projectName = getProjectName(userProject.project, index);
          const createdDate = new Date(userProject.created);
          const modifiedDate = new Date(userProject.modified);
          const timeAgo = formatDistanceToNow(modifiedDate, { addSuffix: true });
          
          return (
            <Card 
              key={index} 
              variant={isCurrentProject ? "classic" : "surface"}
              onClick={() => handleProjectChange(index)} 
              style={{ 
                cursor: isCurrentProject ? 'default' : 'pointer',
                borderLeft: isCurrentProject ? `4px solid var(--${projectColor}-9)` : undefined
              }}
            >
              <Flex gap="3" align="center">
                <Avatar
                  radius="full"
                  fallback={projectIcon}
                  color={projectColor}
                  variant={isCurrentProject ? "solid" : "soft"}
                  size="2"
                />
                
                <Box style={{ flexGrow: 1 }}>
                  <Flex justify="between" align="center">
                    <Text weight={isCurrentProject ? "bold" : "regular"} size="2">
                      {projectName}
                    </Text>
                    
                    <Flex gap="2" align="center">
                      <Badge color={projectColor} variant="soft" radius="full">
                        {userProject.projectType}
                      </Badge>
                      
                      {!isCurrentProject && (
                        <Tooltip content="Select this project">
                          <IconButton size="1" variant="ghost" color="mint">
                            <PlayIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Flex>
                  </Flex>
                  
                  <Flex align="center" gap="3" mt="1">
                    <Flex align="center" gap="1">
                      <ClockIcon height="12" width="12" color="var(--gray-8)" />
                      <Text size="1" color="gray">
                        {timeAgo}
                      </Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </ScrollArea>
  );
}